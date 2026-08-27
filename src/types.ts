export type ProductCategory = 'all' | 'keychains' | 'organizers' | 'desk' | 'home' | 'custom' | 'badges';

export type MaterialType = 'PLA' | 'PETG' | 'TPU';

export interface ColorOption {
  name: string;
  hex: string;
  bgClass?: string;
  imageUrl?: string;
}

export interface BadgeCustomization {
  id?: string;
  shape: 'circle' | 'shield' | 'hexagon' | 'square' | 'chili';
  attachment: 'pin' | 'magnet' | 'keychain';
  topText?: string;
  bottomText?: string;
  centerText?: string;
  imageUrl?: string;
  baseColor: ColorOption;
  rimColor: ColorOption;
  textColor: ColorOption;
  material: MaterialType;
  quantity: number;
}

export interface KeycapCustomConfig {
  keyIndex: number;
  type: 'letter' | 'emoji' | 'image';
  value: string; // letter char, emoji string, or dataUrl
  imageUrl?: string;
}

export interface SpinPrize {
  id: number;
  type: 'discount_10' | 'discount_20' | 'rm5_off' | 'no_prize';
  label: string;
  description: string;
  promoCode?: string;
  discountType?: 'percent' | 'flat';
  discountValue?: number;
  icon: string;
  image?: string; // Image URL / Data URI for the wheel slice picture
  imageUrl?: string; // Optional alias
  isWin: boolean;
  color: string;
  textColor: string;
}

export interface Product {
  id: string;
  name: string;
  subtitle?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  category: ProductCategory;
  tags: string[];
  description: string;
  image?: string;
  heroImage?: string;
  images: string[];
  specifications: {
    material: string;
    weight: string;
    dimensions: string;
    printTime: string;
    layerHeight: string;
    madeToOrder: boolean;
  };
  colors: ColorOption[];
  materials: MaterialType[];
  isBestSeller?: boolean;
  isNew?: boolean;
  inStock: boolean;
  stockQuantity: number;
}

export interface CartItem {
  id: string; // unique ID for item instance
  productId: string;
  product: Product;
  selectedColor: ColorOption;
  selectedMaterial: MaterialType;
  quantity: number;
  unitPrice: number;
  customText?: string;
  isCustomPrint?: boolean;
  drawingImage?: string;
  customDesignUrl?: string; // Firebase Storage public download URL
  customPrintDetails?: {
    fileName: string;
    designTitle?: string;
    volumeCm3: number;
    infillPercent: number;
    layerHeight: string;
    estimatedTimeHours: number;
    customDesignUrl?: string;
  };
}

export interface ChiliDrawing {
  id: string;
  title: string;
  creatorName: string;
  imageData: string; // Base64 png data URL or Firebase Storage URL
  customDesignUrl?: string;
  baseChiliTemplate?: string;
  material: MaterialType;
  colorName: string;
  colorHex: string;
  scalePercent: number;
  infillPercent: number;
  specialInstructions?: string;
  estimatedPrice: number;
  createdAt: string;
  likesCount?: number;
}

export interface CustomPrintQuote {
  fileName: string;
  designTitle?: string;
  drawingImage?: string;
  customDesignUrl?: string; // Firebase Storage download URL
  fileSizeMb?: number;
  material: MaterialType;
  color: ColorOption;
  infillPercent: number;
  layerHeight: '0.12' | '0.20' | '0.28';
  quantity: number;
  scalePercent: number;
  specialInstructions: string;
  // Auto-calculated
  volumeCm3: number;
  weightGrams: number;
  estimatedHours: number;
  calculatedPrice: number;
}

export type OrderStatus = 'Pending' | 'Slicing' | 'Printing' | 'Printed' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'pending' | 'payment_submitted' | 'paid' | 'cancelled';
export type PaymentMethod = 'TNG' | 'fpx' | 'credit_card' | 'ewallet';

export interface OrderItem {
  name: string;
  color: string;
  material: string;
  quantity: number;
  price: number;
  isCustomPrint?: boolean;
  customDetails?: string;
  customDesignUrl?: string; // Firebase Storage download URL for drawing
  customText?: string;
  drawingImage?: string;
  customImageUrl?: string;
  fileUrl?: string;
  fileName?: string;
  infillPercent?: number;
  layerHeight?: string;
  scalePercent?: number;
  specialInstructions?: string;
  customPrintDetails?: {
    fileName?: string;
    designTitle?: string;
    volumeCm3?: number;
    infillPercent?: number;
    layerHeight?: string;
    estimatedTimeHours?: number;
    scalePercent?: number;
    specialInstructions?: string;
    customDesignUrl?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  notes?: string;
}

export interface Order {
  id: string; // e.g. CBI-8892
  orderId?: string; // alias for id
  userId?: string;
  amount?: number; // total amount e.g. 585.01
  createdAt?: string; // ISO string
  date: string; // ISO or formatted date
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus?: PaymentStatus;
  paymentSubmittedAt?: string;
  paymentVerifiedAt?: string;
  fpxBank?: string;
  status: OrderStatus;
  statusHistory: { status: OrderStatus; timestamp: string; note?: string }[];
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export interface MaterialSpool {
  id: string;
  name: string;
  material: MaterialType;
  colorName: string;
  colorHex: string;
  stockKg: number;
  maxCapacityKg: number;
  pricePerKg: number;
  isLow: boolean;
}

export interface HallOfGloryMember {
  id: string;
  name: string;
  role: string;
  avatarEmoji: string;
  badge: string;
  specialty: string;
  bio: string;
  quote: string;
  achievements: string[];
  signatureItem?: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  firstName?: string;
  lastName?: string;
  username?: string;
  displayName: string | null;
  photoURL?: string | null;
  isAnonymous: boolean;
  role?: 'customer' | 'vip' | 'admin';
  createdAt?: string;
}

export type ViewMode = 
  | 'home'
  | 'shop'
  | 'product_detail'
  | 'custom_print'
  | 'badge_custom'
  | 'daily_spin'
  | 'checkout'
  | 'tng_payment'
  | 'order_tracking'
  | 'boss_admin'
  | 'about'
  | 'contact'
  | 'terms'
  | 'register';

