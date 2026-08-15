import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Converts a base64 Data URL string to a native Blob
 */
export async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl);
  return await res.blob();
}

/**
 * Uploads a customer's custom 3D drawing or artwork to Firebase Storage
 * in bucket `cabai-fdceb.firebasestorage.app` under `custom-designs/`.
 * 
 * Generates a unique, collision-resistant path associated with the design/order.
 * Returns the public Firebase Storage download URL.
 */
export async function uploadCustomDesignToStorage(
  imageDataUrlOrBlob: string | Blob,
  prefix: string = 'custom_chili'
): Promise<string> {
  try {
    // If it's already a hosted URL (e.g. https://firebasestorage.googleapis.com/...), return it directly
    if (typeof imageDataUrlOrBlob === 'string' && (imageDataUrlOrBlob.startsWith('http://') || imageDataUrlOrBlob.startsWith('https://'))) {
      return imageDataUrlOrBlob;
    }

    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 9);
    const fileName = `custom-designs/${prefix}_${timestamp}_${randomSuffix}.png`;
    const storageRef = ref(storage, fileName);

    let blob: Blob;
    if (typeof imageDataUrlOrBlob === 'string') {
      blob = await dataUrlToBlob(imageDataUrlOrBlob);
    } else {
      blob = imageDataUrlOrBlob;
    }

    console.log(`[Firebase Storage] Uploading custom design (${blob.size} bytes) to ${fileName}...`);
    
    const snapshot = await uploadBytes(storageRef, blob, {
      contentType: 'image/png',
      customMetadata: {
        uploadedAt: new Date().toISOString(),
        source: 'cabai_custom_drawing_canvas'
      }
    });

    const downloadUrl = await getDownloadURL(snapshot.ref);
    console.log(`[Firebase Storage] ✅ Upload successful! Download URL:`, downloadUrl);
    return downloadUrl;
  } catch (error) {
    console.error('[Firebase Storage] ❌ Failed to upload custom drawing:', error);
    throw error;
  }
}
