/**
 * Centralized Asset & Image Configuration
 * Dynamically resolves asset URLs across development, production, and custom deployment environments.
 */

// Bundled image imports via Vite
import imgCabaiKeychain from '../assets/images/regenerated_image_1786627928894.png';
import imgFlexiBuddy from '../assets/images/regenerated_image_1786532910610.png';
import imgDeskDock from '../assets/images/regenerated_image_1786532916408.png';
import imgCableClip from '../assets/images/regenerated_image_1786532913898.png';
import imgNameTag from '../assets/images/regenerated_image_1786532918112.png';
import logoHeader from '../assets/images/regenerated_image_1786627761972.png';
import logoFooter from '../assets/images/regenerated_image_1786627764275.png';
import logoOfficial from '../assets/images/cabai_official_logo_1786624077846.jpg';

// Environment-aware Base URL resolver
const BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) 
  ? import.meta.env.BASE_URL.replace(/\/+$/, '') 
  : '';

/**
 * Standard inline SVG fallback data URI (Chili themed)
 */
export const FALLBACK_IMAGE_DATA_URI = 
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%231a1c1c'/%3E%3Cpath d='M200 120 C220 140 240 180 230 240 C220 280 180 300 170 280 C160 260 170 220 180 180 Z' fill='%23af101a'/%3E%3Cpath d='M200 120 C195 100 180 90 170 85' stroke='%2316a34a' stroke-width='8' fill='none' stroke-linecap='round'/%3E%3Ctext x='200' y='340' font-family='sans-serif' font-size='20' font-weight='bold' fill='%23ffffff' text-anchor='middle'%3ECABAI 3D STUDIO%3C/text%3E%3C/svg%3E";

/**
 * Centralized Image Configuration Object
 */
export const imageConfig = {
  // Brand & Navigation Logos
  logos: {
    header: logoHeader,
    footer: logoFooter,
    official: logoOfficial,
    favicon: `${BASE_URL}/favicon.png`,
    fallback: FALLBACK_IMAGE_DATA_URI
  },
  
  // Product Catalog Assets
  products: {
    cabaiKeychain: imgCabaiKeychain,
    flexiBuddy: imgFlexiBuddy,
    deskDock: imgDeskDock,
    cableClip: imgCableClip,
    nameTag: imgNameTag
  },

  // Direct Product ID to Asset mapping
  productMap: {
    'prod-01': imgCabaiKeychain,
    'prod-03': imgFlexiBuddy,
    'prod-04': imgDeskDock,
    'prod-05': imgCableClip,
    'prod-06': imgNameTag
  } as Record<string, string>,

  // Metadata
  meta: {
    baseUrl: BASE_URL,
    defaultFallback: FALLBACK_IMAGE_DATA_URI
  }
} as const;

/**
 * Dynamically resolves any image path, key, or product ID to an environment-safe URL.
 */
export function resolveAssetUrl(
  source?: string | null,
  options?: {
    productId?: string;
    fallbackKey?: keyof typeof imageConfig.products | 'header' | 'footer' | 'fallback';
  }
): string {
  const { productId, fallbackKey } = options || {};

  // 1. Direct Product ID resolution if provided
  if (productId && imageConfig.productMap[productId]) {
    if (!source || source.includes('/src/assets/') || source.includes('undefined') || source.includes('null')) {
      return imageConfig.productMap[productId];
    }
  }

  // 2. Empty source handling
  if (!source) {
    if (productId && imageConfig.productMap[productId]) {
      return imageConfig.productMap[productId];
    }
    if (fallbackKey) {
      if (fallbackKey === 'header') return imageConfig.logos.header;
      if (fallbackKey === 'footer') return imageConfig.logos.footer;
      if (fallbackKey === 'fallback') return imageConfig.logos.fallback;
      if (imageConfig.products[fallbackKey]) return imageConfig.products[fallbackKey];
    }
    return imageConfig.products.cabaiKeychain;
  }

  // 3. Already valid data URI or blob URI
  if (source.startsWith('data:') || source.startsWith('blob:')) {
    return source;
  }

  // 4. Match against known hashed assets or keywords
  const lowerSource = source.toLowerCase();
  if (source.includes('1786627928894') || source.includes('1786532907101') || lowerSource.includes('keychain') || lowerSource.includes('cabai')) {
    return imageConfig.products.cabaiKeychain;
  }
  if (source.includes('1786532910610') || lowerSource.includes('flexi')) {
    return imageConfig.products.flexiBuddy;
  }
  if (source.includes('1786532916408') || lowerSource.includes('dock')) {
    return imageConfig.products.deskDock;
  }
  if (source.includes('1786532913898') || lowerSource.includes('cable')) {
    return imageConfig.products.cableClip;
  }
  if (source.includes('1786532918112') || lowerSource.includes('tag') || lowerSource.includes('name')) {
    return imageConfig.products.nameTag;
  }
  if (source.includes('1786627761972') || lowerSource.includes('cabai_official_logo') || lowerSource.includes('cabai_logo')) {
    return imageConfig.logos.header;
  }
  if (source.includes('1786627764275')) {
    return imageConfig.logos.footer;
  }

  // 5. Unbundled /src/assets paths -> fallback to mapped product asset
  if (source.startsWith('/src/assets/') || source.startsWith('src/assets/')) {
    if (productId && imageConfig.productMap[productId]) {
      return imageConfig.productMap[productId];
    }
    return imageConfig.products.cabaiKeychain;
  }

  // 6. Absolute public path resolution with base URL support
  if (source.startsWith('/')) {
    return BASE_URL ? `${BASE_URL}${source}` : source;
  }

  return source;
}

export default imageConfig;
