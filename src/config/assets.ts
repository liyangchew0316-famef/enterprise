/**
 * Centralized Asset & Image Configuration
 * Dynamically resolves asset URLs across development, production, and custom deployment environments.
 */

// Bundled image imports via Vite
import imgKeyboardClicker from '../assets/images/keyboard_clicker_1787053198865.jpg';
import imgCabaiKeychainDrawable from '../assets/images/cabai_keychain_draw_1787053219076.jpg';
import imgCabaiKeychain from '../assets/images/cabai_keychain_red_1787053235901.jpg';
import imgNameTag from '../assets/images/custom_name_tag_1787053248265.jpg';
import imgCabaiFridgeMagnet from '../assets/images/cabai_magnet_1787053265638.jpg';
import imgCabaiPhoneHolder from '../assets/images/cabai_phone_stand_1787053279991.jpg';
import imgCabaiPen from '../assets/images/cabai_pen_1787053295709.jpg';
import logoHeader from '../assets/images/regenerated_image_1786627761972.png';
import logoFooter from '../assets/images/regenerated_image_1786627764275.png';
import logoOfficial from '../assets/images/cabai_official_logo_1786624077846.jpg';

// Bundled Transparent Cutout PNGs (Zero background, pure floating product)
import cutoutKeyboardClicker from '../assets/images/keyboard_clicker_cutout.png';
import cutoutCabaiKeychainDrawable from '../assets/images/cabai_keychain_draw_cutout.png';
import cutoutCabaiKeychain from '../assets/images/cabai_keychain_cutout.png';
import cutoutNameTag from '../assets/images/custom_name_tag_cutout.png';
import cutoutCabaiFridgeMagnet from '../assets/images/cabai_magnet_cutout.png';
import cutoutCabaiPhoneHolder from '../assets/images/cabai_phone_stand_cutout.png';
import cutoutCabaiPen from '../assets/images/cabai_pen_cutout.png';

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
  
  // Product Catalog Assets (Exact 7 Studio Products)
  products: {
    keyboardClicker: imgKeyboardClicker,
    cabaiKeychainDrawable: imgCabaiKeychainDrawable,
    cabaiKeychain: imgCabaiKeychain,
    nameTag: imgNameTag,
    cabaiFridgeMagnet: imgCabaiFridgeMagnet,
    cabaiPhoneHolder: imgCabaiPhoneHolder,
    cabaiPen: imgCabaiPen,
    // Aliases for backward compatibility
    flexiBuddy: imgKeyboardClicker,
    deskDock: imgCabaiPhoneHolder,
    cableClip: imgCabaiFridgeMagnet
  },

  // Isolated Cutouts for Hero Carousel (Transparent Background PNGs)
  heroCutouts: {
    keyboardClicker: cutoutKeyboardClicker,
    cabaiKeychainDrawable: cutoutCabaiKeychainDrawable,
    cabaiKeychain: cutoutCabaiKeychain,
    nameTag: cutoutNameTag,
    cabaiFridgeMagnet: cutoutCabaiFridgeMagnet,
    cabaiPhoneHolder: cutoutCabaiPhoneHolder,
    cabaiPen: cutoutCabaiPen,
    flexiBuddy: cutoutKeyboardClicker,
    deskDock: cutoutCabaiPhoneHolder,
    cableClip: cutoutCabaiFridgeMagnet
  },

  // Direct Product ID to Cutout mapping
  heroCutoutMap: {
    'prod-keyboard-clicker': cutoutKeyboardClicker,
    'prod-cabai-keychain-drawable': cutoutCabaiKeychainDrawable,
    'prod-cabai-keychain': cutoutCabaiKeychain,
    'prod-name-tag': cutoutNameTag,
    'prod-cabai-fridge-magnet': cutoutCabaiFridgeMagnet,
    'prod-cabai-phone-holder': cutoutCabaiPhoneHolder,
    'prod-cabai-pen': cutoutCabaiPen,
    'prod-01': cutoutCabaiKeychain,
    'prod-02': cutoutCabaiKeychainDrawable,
    'prod-03': cutoutKeyboardClicker,
    'prod-04': cutoutCabaiPhoneHolder,
    'prod-05': cutoutCabaiFridgeMagnet,
    'prod-06': cutoutNameTag,
    'prod-07': cutoutCabaiPen
  } as Record<string, string>,

  // Direct Product ID to Asset mapping
  productMap: {
    'prod-keyboard-clicker': imgKeyboardClicker,
    'prod-cabai-keychain-drawable': imgCabaiKeychainDrawable,
    'prod-cabai-keychain': imgCabaiKeychain,
    'prod-name-tag': imgNameTag,
    'prod-cabai-fridge-magnet': imgCabaiFridgeMagnet,
    'prod-cabai-phone-holder': imgCabaiPhoneHolder,
    'prod-cabai-pen': imgCabaiPen,
    // Legacy ID aliases
    'prod-01': imgCabaiKeychain,
    'prod-02': imgCabaiKeychainDrawable,
    'prod-03': imgKeyboardClicker,
    'prod-04': imgCabaiPhoneHolder,
    'prod-05': imgCabaiFridgeMagnet,
    'prod-06': imgNameTag,
    'prod-07': imgCabaiPen
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

/**
 * Resolves the isolated transparent product cutout for Hero Presentation.
 * Falls back gracefully to standard product asset if not present.
 */
export function resolveHeroCutoutUrl(
  productOrId?: { id?: string; heroImage?: string; images?: string[]; image?: string } | string | null
): string {
  if (!productOrId) {
    return imageConfig.heroCutouts.cabaiKeychain;
  }

  // If string ID was passed
  if (typeof productOrId === 'string') {
    if (imageConfig.heroCutoutMap[productOrId]) {
      return imageConfig.heroCutoutMap[productOrId];
    }
    return resolveAssetUrl(productOrId);
  }

  // If explicit heroImage exists and is non-empty
  if (productOrId.heroImage) {
    if (productOrId.heroImage.startsWith('data:') || productOrId.heroImage.startsWith('blob:') || productOrId.heroImage.startsWith('http')) {
      return productOrId.heroImage;
    }
    // Check if it matches heroCutoutMap key
    if (productOrId.id && imageConfig.heroCutoutMap[productOrId.id]) {
      return imageConfig.heroCutoutMap[productOrId.id];
    }
    return productOrId.heroImage;
  }

  // If product id is mapped to a cutout
  if (productOrId.id && imageConfig.heroCutoutMap[productOrId.id]) {
    return imageConfig.heroCutoutMap[productOrId.id];
  }

  // Fallback to standard product image resolution
  const fallbackSrc = (productOrId.images && productOrId.images[0]) || productOrId.image;
  return resolveAssetUrl(fallbackSrc, { productId: productOrId.id });
}

export default imageConfig;
