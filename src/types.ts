export type ProductCategory = 'all' | 'keychains' | 'organizers' | 'desk' | 'home' | 'custom';

export type MaterialType = 'PLA' | 'PETG' | 'TPU';

export interface ColorOption {
  name: string;
  hex: string;
  bgClass?: string;
  imageUrl?: string;
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
  customPrintDetails?: {
    fileName: string;
    designTitle?: string;
    volumeCm3: number;
    infillPercent: number;
    layerHeight: string;
    estimatedTimeHours: number;
  };
}

export interface ChiliDrawing {
  id: string;
  title: string;
  creatorName: string;
  imageData: string; // Base64 png data URL
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

export type OrderStatus = 'Pending' | 'Slicing' | 'Printing' | 'Printed' | 'Shipped' | 'Delivered';

export interface OrderItem {
  name: string;
  color: string;
  material: string;
  quantity: number;
  price: number;
  isCustomPrint?: boolean;
  customDetails?: string;
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
  date: string; // ISO or formatted date
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: 'fpx' | 'credit_card' | 'ewallet';
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

export type ViewMode = 
  | 'home'
  | 'shop'
  | 'product_detail'
  | 'custom_print'
  | 'checkout'
  | 'order_tracking'
  | 'boss_admin'
  | 'about'
  | 'contact';
