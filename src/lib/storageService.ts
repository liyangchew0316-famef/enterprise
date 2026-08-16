import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

// In-memory cache to prevent uploading the exact same design multiple times if user clicks Pay again
const uploadCache = new Map<string, string>();

/**
 * Optimizes an image (DataURL, Canvas, or Blob) into a lightweight WebP or JPEG Blob.
 * Scales down to maxDimension (default 800px) and applies 85% compression.
 * This reduces 2-4MB raw canvas PNG dataURLs down to ~30-60KB without visible loss for 3D references.
 */
export async function optimizeImageToBlob(
  imageSource: string | HTMLCanvasElement | Blob,
  maxDimension: number = 800,
  quality: number = 0.85
): Promise<{ blob: Blob; format: 'webp' | 'jpeg' }> {
  // If it's already a small blob under 100KB with standard mime, return as is
  if (imageSource instanceof Blob && imageSource.size < 100 * 1024) {
    const isWebp = imageSource.type.includes('webp');
    return { blob: imageSource, format: isWebp ? 'webp' : 'jpeg' };
  }

  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: false });

      if (!ctx) {
        throw new Error('Canvas 2D context unavailable');
      }

      const processImage = (img: HTMLImageElement | HTMLCanvasElement) => {
        let width = img.width || 800;
        let height = img.height || 800;

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

        canvas.width = width;
        canvas.height = height;

        // Fill background with dark theme color for crisp transparency handling
        ctx.fillStyle = '#181a1b';
        ctx.fillRect(0, 0, width, height);

        // Draw and smoothly scale
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first for maximum compression efficiency
        canvas.toBlob(
          (webpBlob) => {
            if (webpBlob && webpBlob.size > 0) {
              resolve({ blob: webpBlob, format: 'webp' });
            } else {
              // Fallback to JPEG if WebP export is unsupported
              canvas.toBlob(
                (jpegBlob) => {
                  if (jpegBlob && jpegBlob.size > 0) {
                    resolve({ blob: jpegBlob, format: 'jpeg' });
                  } else {
                    reject(new Error('Failed to create image Blob from canvas'));
                  }
                },
                'image/jpeg',
                quality
              );
            }
          },
          'image/webp',
          quality
        );
      };

      if (typeof imageSource === 'string') {
        if (imageSource.startsWith('http://') || imageSource.startsWith('https://')) {
          // It's already a hosted URL
          fetch(imageSource)
            .then((r) => r.blob())
            .then((b) => resolve({ blob: b, format: 'webp' }))
            .catch(reject);
          return;
        }

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => processImage(img);
        img.onerror = () => reject(new Error('Failed to load image for optimization'));
        img.src = imageSource;
      } else if (imageSource instanceof HTMLCanvasElement) {
        processImage(imageSource);
      } else if (imageSource instanceof Blob) {
        const url = URL.createObjectURL(imageSource);
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          URL.revokeObjectURL(url);
          processImage(img);
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error('Failed to load blob image for optimization'));
        };
        img.src = url;
      } else {
        reject(new Error('Unsupported image source type'));
      }
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Uploads a customer's custom 3D drawing or artwork to Firebase Storage
 * with automatic optimization (WebP/JPEG conversion and dimension scaling).
 * 
 * Features:
 * - Direct Blob upload (avoids huge base64 transfers)
 * - Compression reduces payload by ~95% (~40KB instead of 2MB+)
 * - Deduplication cache to prevent re-uploading if payment is clicked twice
 * - 15-second timeout guard to prevent hanging checkout
 * 
 * Returns the public Firebase Storage download URL.
 */
export async function uploadCustomDesignToStorage(
  imageDataUrlOrBlob: string | Blob,
  prefix: string = 'custom_chili',
  cacheKey?: string
): Promise<string> {
  // If it's already a hosted URL (e.g. https://firebasestorage.googleapis.com/...), return it directly
  if (typeof imageDataUrlOrBlob === 'string' && (imageDataUrlOrBlob.startsWith('http://') || imageDataUrlOrBlob.startsWith('https://'))) {
    return imageDataUrlOrBlob;
  }

  // Check deduplication cache
  const dedupeKey = cacheKey || (typeof imageDataUrlOrBlob === 'string' ? imageDataUrlOrBlob.slice(0, 100) + imageDataUrlOrBlob.length : undefined);
  if (dedupeKey && uploadCache.has(dedupeKey)) {
    const cachedUrl = uploadCache.get(dedupeKey)!;
    console.log('[Firebase Storage] Reusing cached upload URL:', cachedUrl);
    return cachedUrl;
  }

  const timeoutMs = 15000; // 15-second safeguard timeout

  return new Promise(async (resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Firebase Storage upload timed out after 15 seconds. Please try again.'));
    }, timeoutMs);

    try {
      // 1. Optimize image into a lightweight WebP/JPEG Blob (<60KB)
      const { blob, format } = await optimizeImageToBlob(imageDataUrlOrBlob, 800, 0.85);

      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 9);
      const extension = format === 'webp' ? 'webp' : 'jpg';
      const contentType = format === 'webp' ? 'image/webp' : 'image/jpeg';
      const fileName = `custom-designs/${prefix}_${timestamp}_${randomSuffix}.${extension}`;
      const storageRef = ref(storage, fileName);

      console.log(`[Firebase Storage] Uploading optimized design (${(blob.size / 1024).toFixed(1)} KB, ${contentType}) to ${fileName}...`);

      const snapshot = await uploadBytes(storageRef, blob, {
        contentType,
        customMetadata: {
          uploadedAt: new Date().toISOString(),
          source: 'cabai_custom_drawing_canvas',
          optimized: 'true'
        }
      });

      const downloadUrl = await getDownloadURL(snapshot.ref);
      clearTimeout(timer);

      if (dedupeKey) {
        uploadCache.set(dedupeKey, downloadUrl);
      }

      console.log(`[Firebase Storage] ✅ Upload successful in ${Date.now() - timestamp}ms! Download URL:`, downloadUrl);
      resolve(downloadUrl);
    } catch (error) {
      clearTimeout(timer);
      console.error('[Firebase Storage] ❌ Failed to upload custom drawing:', error);
      reject(error);
    }
  });
}
