import { Product } from '../types';
import { imageConfig, resolveAssetUrl, FALLBACK_IMAGE_DATA_URI } from '../config/assets';

export { imageConfig, resolveAssetUrl, FALLBACK_IMAGE_DATA_URI };

export const IMAGES = imageConfig.products;
export const PRODUCT_IMAGE_BY_ID = imageConfig.productMap;

/**
 * Resolves any image path or product ID to a guaranteed-valid bundled image URL.
 */
export function resolveProductImage(src?: string, productId?: string): string {
  return resolveAssetUrl(src, { productId });
}

/**
 * Normalizes a product object ensuring all images in the array are valid and dynamically resolved.
 */
export function normalizeProduct(product: Product): Product {
  const defaultImage = imageConfig.productMap[product.id] || imageConfig.products.cabaiKeychain;
  
  let validImages: string[] = [];
  if (Array.isArray(product.images) && product.images.length > 0) {
    validImages = product.images.map(img => resolveAssetUrl(img, { productId: product.id }));
  } else {
    validImages = [defaultImage];
  }

  // Ensure primary image is always at index 0
  if (imageConfig.productMap[product.id] && (!validImages[0] || validImages[0].includes('/src/assets/'))) {
    validImages[0] = imageConfig.productMap[product.id];
  }

  return {
    ...product,
    images: validImages
  };
}

export function normalizeProducts(products: Product[]): Product[] {
  return products.map(normalizeProduct);
}
