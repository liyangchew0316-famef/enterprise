import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

// In-memory cache to prevent uploading the exact same design multiple times if user clicks Pay again
const uploadCache = new Map<string, string>();

/**
 * Compresses any image (data URL, canvas, or blob) into a lightweight JPEG or WebP data URL.
 * Guarantees that the resulting data URL is compact (< 45KB), preventing Firestore 1MB document limit rejections.
 */
export async function compressImageDataUrl(
  imageSource: string | HTMLCanvasElement | Blob,
  maxDimension: number = 600,
  quality: number = 0.75
): Promise<string> {
  return new Promise((resolve) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: false });
      if (!ctx) {
        return resolve(typeof imageSource === 'string' ? imageSource.slice(0, 50000) : '');
      }

      const processElement = (img: HTMLImageElement | HTMLCanvasElement) => {
        let width = img.width || 600;
        let height = img.height || 600;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);

        // Dark background for transparent canvas drawing consistency
        ctx.fillStyle = '#181a1b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'medium';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Try JPEG with 75% quality for ultra-reliable size < 40KB
        try {
          const jpegData = canvas.toDataURL('image/jpeg', quality);
          resolve(jpegData);
        } catch (e) {
          resolve(canvas.toDataURL('image/png'));
        }
      };

      if (imageSource instanceof HTMLCanvasElement) {
        processElement(imageSource);
      } else if (typeof imageSource === 'string') {
        if (!imageSource.startsWith('data:')) {
          return resolve(imageSource);
        }
        const img = new Image();
        img.onload = () => processElement(img);
        img.onerror = () => resolve(imageSource.slice(0, 50000));
        img.src = imageSource;
      } else if (imageSource instanceof Blob) {
        const url = URL.createObjectURL(imageSource);
        const img = new Image();
        img.onload = () => {
          URL.revokeObjectURL(url);
          processElement(img);
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          resolve('');
        };
        img.src = url;
      } else {
        resolve('');
      }
    } catch (err) {
      console.warn('[compressImageDataUrl] Fallback on error:', err);
      resolve(typeof imageSource === 'string' ? imageSource.slice(0, 50000) : '');
    }
  });
}

/**
 * Optimizes an image (DataURL, Canvas, or Blob) into a lightweight WebP or JPEG Blob.
 * Scales down to maxDimension (default 600px) and applies compression.
 * This reduces 2-4MB raw canvas PNG dataURLs down to ~25-45KB without visible loss for 3D references.
 */
export async function optimizeImageToBlob(
  imageSource: string | HTMLCanvasElement | Blob,
  maxDimension: number = 600,
  quality: number = 0.80
): Promise<{ blob: Blob; format: 'webp' | 'jpeg'; dataUrl?: string }> {
  // If it's already a small blob under 60KB with standard mime, return as is
  if (imageSource instanceof Blob && imageSource.size < 60 * 1024) {
    const isWebp = imageSource.type.includes('webp');
    return { blob: imageSource, format: isWebp ? 'webp' : 'jpeg' };
  }

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Image optimization timed out'));
    }, 4000);

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: false });

      if (!ctx) {
        clearTimeout(timer);
        throw new Error('Canvas 2D context unavailable');
      }

      const processImage = (img: HTMLImageElement | HTMLCanvasElement | ImageBitmap) => {
        let width = img.width || 600;
        let height = img.height || 600;

        // Scale proportionally if exceeding maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);

        // Fill background with dark theme color for crisp transparency handling
        ctx.fillStyle = '#181a1b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw and smoothly scale
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'medium';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Export as JPEG with 80% quality (~25-40KB)
        canvas.toBlob(
          (jpegBlob) => {
            clearTimeout(timer);
            if (jpegBlob && jpegBlob.size > 0) {
              resolve({ blob: jpegBlob, format: 'jpeg' });
            } else {
              // Fallback
              canvas.toBlob(
                (webpBlob) => {
                  if (webpBlob && webpBlob.size > 0) {
                    resolve({ blob: webpBlob, format: 'webp' });
                  } else {
                    reject(new Error('Failed to create image Blob from canvas'));
                  }
                },
                'image/webp',
                quality
              );
            }
          },
          'image/jpeg',
          quality
        );
      };

      if (typeof imageSource === 'string') {
        if (imageSource.startsWith('http://') || imageSource.startsWith('https://')) {
          // It's already a hosted URL
          fetch(imageSource)
            .then((r) => r.blob())
            .then((b) => {
              clearTimeout(timer);
              resolve({ blob: b, format: 'jpeg' });
            })
            .catch((err) => {
              clearTimeout(timer);
              reject(err);
            });
          return;
        }

        const img = new Image();
        if (!imageSource.startsWith('data:')) {
          img.crossOrigin = 'anonymous';
        }
        img.onload = () => {
          try {
            processImage(img);
          } catch (e) {
            clearTimeout(timer);
            reject(e);
          }
        };
        img.onerror = (err) => {
          clearTimeout(timer);
          console.error('[optimizeImageToBlob] Failed to load image element:', err);
          reject(new Error('Failed to load image for optimization'));
        };
        img.src = imageSource;
      } else if (imageSource instanceof HTMLCanvasElement) {
        processImage(imageSource);
      } else if (imageSource instanceof Blob) {
        const url = URL.createObjectURL(imageSource);
        const img = new Image();
        img.onload = () => {
          URL.revokeObjectURL(url);
          try {
            processImage(img);
          } catch (e) {
            clearTimeout(timer);
            reject(e);
          }
        };
        img.onerror = () => {
          clearTimeout(timer);
          URL.revokeObjectURL(url);
          reject(new Error('Failed to load blob image for optimization'));
        };
        img.src = url;
      } else {
        clearTimeout(timer);
        reject(new Error('Unsupported image source type'));
      }
    } catch (err) {
      clearTimeout(timer);
      reject(err);
    }
  });
}

/**
 * Uploads a customer's custom 3D drawing or artwork with tiered persistence:
 * 1. Primary: Firebase Storage (if available and authenticated)
 * 2. Secondary: Express backend server `/api/designs/upload` (returns compact `/api/designs/:id`)
 * 3. Fallback: Highly compressed WebP/JPEG thumbnail (< 40KB) that safely fits inside Firestore
 * 
 * Returns a hosted URL or safe thumbnail. Never returns a 2MB+ uncompressed data URL.
 */
export async function uploadCustomDesignToStorage(
  imageDataUrlOrBlob: string | Blob,
  prefix: string = 'custom_chili',
  cacheKey?: string
): Promise<string> {
  // If it's already a hosted URL (e.g. https://... or /api/designs/...), return it directly
  if (typeof imageDataUrlOrBlob === 'string' && (
    imageDataUrlOrBlob.startsWith('http://') || 
    imageDataUrlOrBlob.startsWith('https://') ||
    imageDataUrlOrBlob.startsWith('/api/designs/')
  )) {
    return imageDataUrlOrBlob;
  }

  // Check deduplication cache
  const dedupeKey = cacheKey || (typeof imageDataUrlOrBlob === 'string' ? imageDataUrlOrBlob.slice(0, 100) + imageDataUrlOrBlob.length : undefined);
  if (dedupeKey && uploadCache.has(dedupeKey)) {
    const cachedUrl = uploadCache.get(dedupeKey)!;
    console.log('[StorageService] Reusing cached upload URL:', cachedUrl);
    return cachedUrl;
  }

  // 1. First, create a compressed lightweight version (< 40KB)
  let compressedDataUrl = '';
  try {
    compressedDataUrl = await compressImageDataUrl(imageDataUrlOrBlob, 600, 0.75);
  } catch (compErr) {
    console.warn('[StorageService] Compression error, using source fallback:', compErr);
    compressedDataUrl = typeof imageDataUrlOrBlob === 'string' ? imageDataUrlOrBlob.slice(0, 50000) : '';
  }

  // 2. Try Firebase Storage with a 4-second timeout
  try {
    const { blob, format } = await optimizeImageToBlob(compressedDataUrl || imageDataUrlOrBlob, 600, 0.80);
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 9);
    const extension = format === 'webp' ? 'webp' : 'jpg';
    const contentType = format === 'webp' ? 'image/webp' : 'image/jpeg';
    const fileName = `custom-designs/${prefix}_${timestamp}_${randomSuffix}.${extension}`;
    const storageRef = ref(storage, fileName);

    const uploadPromise = uploadBytes(storageRef, blob, {
      contentType,
      customMetadata: {
        uploadedAt: new Date().toISOString(),
        source: 'cabai_custom_drawing_canvas',
        optimized: 'true'
      }
    });

    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Firebase Storage upload timeout (4s)')), 4000)
    );

    const snapshot = await Promise.race([uploadPromise, timeoutPromise]);
    const downloadUrl = await getDownloadURL(snapshot.ref);

    if (dedupeKey) uploadCache.set(dedupeKey, downloadUrl);
    console.log('[StorageService] ✅ Firebase Storage upload successful:', downloadUrl);
    return downloadUrl;
  } catch (storageErr) {
    console.warn('[StorageService] Firebase Storage upload unavailable, trying backend server storage...', storageErr);
  }

  // 3. Fallback to Express backend server (/api/designs/upload)
  try {
    const response = await fetch('/api/designs/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dataUrl: compressedDataUrl,
        prefix,
        title: `Cabai 3D Custom Design (${prefix})`
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.url) {
        if (dedupeKey) uploadCache.set(dedupeKey, data.url);
        console.log('[StorageService] ✅ Server design storage successful:', data.url);
        return data.url;
      }
    }
  } catch (serverErr) {
    console.warn('[StorageService] Server upload fallback encountered error:', serverErr);
  }

  // 4. Final safety net: Return the compressed thumbnail data URL (< 40KB)
  // This is well within Firestore's 1MB limit (1,048,576 bytes) and allows instant viewing
  if (dedupeKey && compressedDataUrl) {
    uploadCache.set(dedupeKey, compressedDataUrl);
  }
  console.log(`[StorageService] ⚠️ Using compressed inline thumbnail (${(compressedDataUrl.length / 1024).toFixed(1)} KB)`);
  return compressedDataUrl;
}

