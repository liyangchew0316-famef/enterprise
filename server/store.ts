import fs from 'fs';
import path from 'path';
import { Product, Order, MaterialSpool, OrderStatus } from '../src/types';

export interface DBData {
  products: Product[];
  orders: Order[];
  spools: MaterialSpool[];
  customQuotes: any[];
}

const DB_FILE = path.join(process.cwd(), 'server', 'db.json');

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-draw-custom-chili',
    name: 'Draw Custom Chili 🌶️',
    subtitle: 'Interactive 3D Chili Drawing Canvas • RM5',
    price: 5.00,
    originalPrice: 8.00,
    rating: 5.00,
    reviewsCount: 382,
    category: 'custom',
    tags: ['Drawable', 'Interactive Canvas', 'Custom Art', 'Top Pick', '3D Chili', 'Customizable'],
    description: 'Interactive custom chili drawing & coloring studio! Paint your own pepper artwork, add funny facial expressions, stamps, or embossed lettering directly on the 3D chili canvas, then we 3D print your custom chili in rigid PLA!',
    images: [
      '/regenerated_image_1786627928894.png'
    ],
    specifications: {
      material: 'Pure PLA (Drawing Ready Surface)',
      weight: '16g',
      dimensions: '60mm x 22mm x 18mm',
      printTime: '30 mins',
      layerHeight: '0.16mm (Fine Detail)',
      madeToOrder: true
    },
    colors: [
      { name: 'Chili Red', hex: '#af101a', bgClass: 'bg-[#af101a]' },
      { name: 'Matte Black', hex: '#1a1c1c', bgClass: 'bg-[#1a1c1c]' },
      { name: 'Signal Yellow', hex: '#eab308', bgClass: 'bg-yellow-500' },
      { name: 'Emerald Green', hex: '#059669', bgClass: 'bg-emerald-600' }
    ],
    materials: ['PLA'],
    isBestSeller: true,
    isNew: true,
    inStock: true,
    stockQuantity: 150
  },
  {
    id: 'prod-badge-customize',
    name: 'Custom Circle Safety Namebadge (自定义安全胸章)',
    subtitle: '12+ Templates • Safety Pin Clasp • 100% PLA',
    price: 5.00,
    originalPrice: 8.50,
    rating: 5.00,
    reviewsCount: 142,
    category: 'badges',
    tags: ['Customizable', 'Safety Namebadge', 'Circle Badge', '12+ Templates', 'Safety Pin', 'New Launch'],
    description: 'Design your own circular 3D printed safety namebadge! Select from 12+ pre-designed templates (Student ID, Medical Staff, Barista, Corporate Executive, Cyberpunk, Cute Pets) or upload your custom logo, embossed in 100% rigid PLA with a secure safety pin clasp.',
    images: [
      '/regenerated_image_1786627928894.png'
    ],
    specifications: {
      material: '100% Eco PLA+ (Safety Pin Clasp)',
      weight: '14g',
      dimensions: '52mm Diameter x 5mm Thickness',
      printTime: '40 mins',
      layerHeight: '0.16mm (Precision Relief)',
      madeToOrder: true
    },
    colors: [
      { name: 'Chili Red', hex: '#af101a', bgClass: 'bg-[#af101a]' },
      { name: 'Matte Black', hex: '#1a1c1c', bgClass: 'bg-[#1a1c1c]' },
      { name: 'Signal Yellow', hex: '#eab308', bgClass: 'bg-yellow-500' },
      { name: 'Emerald Green', hex: '#059669', bgClass: 'bg-emerald-600' }
    ],
    materials: ['PLA'],
    isBestSeller: true,
    isNew: true,
    inStock: true,
    stockQuantity: 200
  },
  {
    id: 'prod-01',
    name: 'Cabai Keychain 🌶️',
    subtitle: 'Brand Signature Product',
    price: 6.90,
    originalPrice: 8.90,
    rating: 4.9,
    reviewsCount: 142,
    category: 'keychains',
    tags: ['Signature', 'Best Seller', 'Pocket Friendly'],
    description: 'Our signature CABAI 3D printed chili pepper keychain. Lightweight, vibrant red finish, and sturdy key ring loop.',
    images: [
      '/regenerated_image_1786627928894.png'
    ],
    specifications: {
      material: 'Premium PLA+',
      weight: '12g',
      dimensions: '58mm x 20mm x 16mm',
      printTime: '30 mins',
      layerHeight: '0.16mm (High Detail)',
      madeToOrder: true
    },
    colors: [
      { name: 'Chili Red', hex: '#af101a', bgClass: 'bg-[#af101a]' },
      { name: 'Matte Black', hex: '#1a1c1c', bgClass: 'bg-[#1a1c1c]' },
      { name: 'Signal Yellow', hex: '#eab308', bgClass: 'bg-yellow-500' },
      { name: 'Emerald Green', hex: '#059669', bgClass: 'bg-emerald-600' }
    ],
    materials: ['PLA', 'PETG'],
    isBestSeller: true,
    isNew: false,
    inStock: true,
    stockQuantity: 120
  },
  {
    id: 'prod-03',
    name: 'Flexi Buddy',
    subtitle: 'Articulated Toy & Fidget',
    price: 10.90,
    originalPrice: 15.90,
    rating: 4.88,
    reviewsCount: 110,
    category: 'home',
    tags: ['Articulated', 'Fidget Toy', 'Fun'],
    description: 'Fully articulated print-in-place moving toy figure. Flexible joints, zero assembly needed, irresistible desktop fidget fun.',
    images: [
      '/regenerated_image_1786532910610.png'
    ],
    specifications: {
      material: 'Silk PLA',
      weight: '40g',
      dimensions: '90mm x 50mm x 30mm',
      printTime: '1 hr 15 mins',
      layerHeight: '0.16mm',
      madeToOrder: true
    },
    colors: [
      { name: 'Silk Gold', hex: '#d97706', bgClass: 'bg-amber-600' },
      { name: 'Chili Red', hex: '#af101a', bgClass: 'bg-[#af101a]' },
      { name: 'Emerald Green', hex: '#059669', bgClass: 'bg-emerald-600' }
    ],
    materials: ['PLA'],
    isBestSeller: true,
    isNew: true,
    inStock: true,
    stockQuantity: 65
  },
  {
    id: 'prod-04',
    name: 'DeskDock',
    subtitle: 'Phone & Stationery Organizer',
    price: 9.90,
    originalPrice: 15.90,
    rating: 4.82,
    reviewsCount: 76,
    category: 'organizers',
    tags: ['Workspace', 'Phone Dock', 'Clean Desk'],
    description: 'Compact phone stand combined with pen and card slots. Keeps your essential desk items structured in a small footprint.',
    images: [
      '/regenerated_image_1786532916408.png'
    ],
    specifications: {
      material: 'Tough PETG',
      weight: '55g',
      dimensions: '85mm x 80mm x 65mm',
      printTime: '1 hr 45 mins',
      layerHeight: '0.20mm',
      madeToOrder: true
    },
    colors: [
      { name: 'Matte Black', hex: '#1a1c1c', bgClass: 'bg-[#1a1c1c]' },
      { name: 'Chalk White', hex: '#f3f4f6', bgClass: 'bg-gray-100' },
      { name: 'Chili Red', hex: '#af101a', bgClass: 'bg-[#af101a]' }
    ],
    materials: ['PLA', 'PETG'],
    isBestSeller: false,
    isNew: false,
    inStock: true,
    stockQuantity: 50
  },
  {
    id: 'prod-05',
    name: 'CableClip',
    subtitle: 'Desktop Cable Organizer',
    price: 3.90,
    originalPrice: 8.90,
    rating: 4.9,
    reviewsCount: 205,
    category: 'organizers',
    tags: ['Budget Pick', 'Cable Management', 'Essential'],
    description: 'Sleek desk edge cable clip. Prevents USB-C, Lightning, and charger cables from slipping off your table.',
    images: [
      '/regenerated_image_1786532913898.png'
    ],
    specifications: {
      material: 'Flexible TPU',
      weight: '8g',
      dimensions: '28mm x 14mm x 12mm',
      printTime: '15 mins',
      layerHeight: '0.20mm',
      madeToOrder: true
    },
    colors: [
      { name: 'Matte Black', hex: '#1a1c1c', bgClass: 'bg-[#1a1c1c]' },
      { name: 'Chalk White', hex: '#f3f4f6', bgClass: 'bg-gray-100' }
    ],
    materials: ['TPU', 'PLA'],
    isBestSeller: true,
    isNew: false,
    inStock: true,
    stockQuantity: 200
  },
  {
    id: 'prod-06',
    name: 'NameTag',
    subtitle: 'Custom Name Keychain',
    price: 8.90,
    originalPrice: 10.90,
    rating: 4.96,
    reviewsCount: 310,
    category: 'keychains',
    tags: ['Customized', 'Personalized', 'Gift Idea'],
    description: 'Personalized 3D printed embossed keyring with your custom text or name (up to 12 characters). High contrast dual-color lettering.',
    images: [
      '/regenerated_image_1786532918112.png'
    ],
    specifications: {
      material: 'Eco PLA+',
      weight: '16g',
      dimensions: 'Customized x 20mm x 12mm',
      printTime: '35 mins',
      layerHeight: '0.16mm (Fine)',
      madeToOrder: true
    },
    colors: [
      { name: 'Chili Red', hex: '#af101a', bgClass: 'bg-[#af101a]' },
      { name: 'Matte Black', hex: '#1a1c1c', bgClass: 'bg-[#1a1c1c]' },
      { name: 'Silk Gold', hex: '#d97706', bgClass: 'bg-amber-600' }
    ],
    materials: ['PLA', 'PETG'],
    isBestSeller: true,
    isNew: true,
    inStock: true,
    stockQuantity: 150
  }
];

const DEFAULT_ORDERS: Order[] = [
  {
    id: 'CBI-9012',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    customer: {
      fullName: 'Ahmad Daniel',
      email: 'ahmad.daniel@gmail.com',
      phone: '012-345 6789',
      address: 'B-12-03, Residensi Park, Bukit Jalil',
      city: 'Kuala Lumpur',
      state: 'Wilayah Persekutuan',
      postcode: '57000'
    },
    items: [
      {
        name: 'Cabai Keychain 🌶️',
        color: 'Chili Red',
        material: 'PLA',
        quantity: 2,
        price: 6.90
      },
      {
        name: 'NameTag',
        color: 'Matte Black',
        material: 'PLA',
        quantity: 1,
        price: 8.90,
        customDetails: 'DANIEL-2026'
      }
    ],
    subtotal: 22.70,
    shipping: 8.00,
    discount: 0,
    tax: 1.36,
    total: 32.06,
    paymentMethod: 'fpx',
    fpxBank: 'Maybank2u',
    status: 'Printing',
    statusHistory: [
      { status: 'Pending', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), note: 'Payment verified via FPX Maybank' },
      { status: 'Printing', timestamp: new Date(Date.now() - 86400000 * 1.5).toISOString(), note: 'Slicing & queueing on Bambu Lab P1P printer' }
    ],
    trackingNumber: 'MY-CBI-771890',
    estimatedDelivery: '1-2 Business Days'
  },
  {
    id: 'CBI-8840',
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    customer: {
      fullName: 'Tan Wei Ming',
      email: 'weiming.tan@outlook.com',
      phone: '016-889 1234',
      address: '45, Jalan SS 2/60, Petaling Jaya',
      city: 'Petaling Jaya',
      state: 'Selangor',
      postcode: '47300'
    },
    items: [
      {
        name: 'DeskDock',
        color: 'Matte Black',
        material: 'PETG',
        quantity: 1,
        price: 9.90
      },
      {
        name: 'CableClip',
        color: 'Chalk White',
        material: 'TPU',
        quantity: 2,
        price: 3.90
      }
    ],
    subtotal: 17.70,
    shipping: 8.00,
    discount: 0,
    tax: 1.06,
    total: 26.76,
    paymentMethod: 'credit_card',
    status: 'Shipped',
    statusHistory: [
      { status: 'Pending', timestamp: new Date(Date.now() - 86400000 * 5).toISOString() },
      { status: 'Slicing', timestamp: new Date(Date.now() - 86400000 * 4).toISOString() },
      { status: 'Printed', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
      { status: 'Shipped', timestamp: new Date(Date.now() - 86400000 * 1).toISOString(), note: 'Handed over to J&T Express MY' }
    ],
    trackingNumber: 'MY-CBI-661204',
    estimatedDelivery: 'Delivering Today'
  }
];

const DEFAULT_SPOOLS: MaterialSpool[] = [
  { id: 'sp-01', name: 'eSUN PLA+ Chili Red', material: 'PLA', colorName: 'Chili Red', colorHex: '#af101a', stockKg: 8.5, maxCapacityKg: 10.0, pricePerKg: 55.0, isLow: false },
  { id: 'sp-02', name: 'Bambu Lab PLA Matte Black', material: 'PLA', colorName: 'Matte Black', colorHex: '#1a1c1c', stockKg: 12.0, maxCapacityKg: 15.0, pricePerKg: 65.0, isLow: false },
  { id: 'sp-03', name: 'Creality Silk PLA Gold', material: 'PLA', colorName: 'Silk Gold', colorHex: '#d97706', stockKg: 2.1, maxCapacityKg: 5.0, pricePerKg: 75.0, isLow: true },
  { id: 'sp-04', name: 'eSUN PETG Chalk White', material: 'PETG', colorName: 'Chalk White', colorHex: '#f3f4f6', stockKg: 6.0, maxCapacityKg: 10.0, pricePerKg: 60.0, isLow: false },
  { id: 'sp-05', name: 'Overture TPU Flexible Black', material: 'TPU', colorName: 'Matte Black', colorHex: '#1a1c1c', stockKg: 4.2, maxCapacityKg: 5.0, pricePerKg: 95.0, isLow: false }
];

class Store {
  private data: DBData;

  constructor() {
    this.data = this.loadFromFile();
  }

  private loadFromFile(): DBData {
    try {
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('Error loading DB file, initializing defaults:', err);
    }

    const defaultDb: DBData = {
      products: DEFAULT_PRODUCTS,
      orders: DEFAULT_ORDERS,
      spools: DEFAULT_SPOOLS,
      customQuotes: []
    };
    this.saveToFile(defaultDb);
    return defaultDb;
  }

  private saveToFile(dbData: DBData) {
    try {
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving DB file:', err);
    }
  }

  // Products
  getProducts(): Product[] {
    return this.data.products;
  }

  getProductById(id: string): Product | undefined {
    return this.data.products.find(p => p.id === id);
  }

  addProduct(product: Product): Product {
    this.data.products.unshift(product);
    this.saveToFile(this.data);
    return product;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.data.products[idx] = { ...this.data.products[idx], ...updates };
    this.saveToFile(this.data);
    return this.data.products[idx];
  }

  // Orders
  getOrders(): Order[] {
    return this.data.orders;
  }

  getOrderById(id: string): Order | undefined {
    return this.data.orders.find(o => o.id === id || o.trackingNumber === id);
  }

  addOrder(order: Order): Order {
    this.data.orders.unshift(order);
    this.saveToFile(this.data);
    return order;
  }

  updateOrderStatus(orderId: string, status: OrderStatus, note?: string): Order | null {
    const idx = this.data.orders.findIndex(o => o.id === orderId);
    if (idx === -1) return null;
    const ord = this.data.orders[idx];
    const newHistory = [
      ...ord.statusHistory,
      { status, timestamp: new Date().toISOString(), note }
    ];
    this.data.orders[idx] = {
      ...ord,
      status,
      statusHistory: newHistory
    };
    this.saveToFile(this.data);
    return this.data.orders[idx];
  }

  // Spools
  getSpools(): MaterialSpool[] {
    return this.data.spools;
  }

  updateSpool(spoolId: string, stockKg: number): MaterialSpool | null {
    const idx = this.data.spools.findIndex(s => s.id === spoolId);
    if (idx === -1) return null;
    this.data.spools[idx].stockKg = stockKg;
    this.data.spools[idx].isLow = stockKg <= 3.0;
    this.saveToFile(this.data);
    return this.data.spools[idx];
  }

  addSpool(spool: MaterialSpool): MaterialSpool {
    this.data.spools.unshift(spool);
    this.saveToFile(this.data);
    return spool;
  }

  // Custom Quotes
  saveQuote(quote: any) {
    this.data.customQuotes.unshift(quote);
    this.saveToFile(this.data);
    return quote;
  }
}

export const store = new Store();
