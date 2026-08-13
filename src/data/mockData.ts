import { Product, MaterialSpool, Order, ColorOption } from '../types';
import imgCabaiKeychain from '../assets/images/regenerated_image_1786627928894.png';
import imgFlexiBuddy from '../assets/images/regenerated_image_1786532910610.png';
import imgDeskDock from '../assets/images/regenerated_image_1786532916408.png';
import imgCableClip from '../assets/images/regenerated_image_1786532913898.png';
import imgNameTag from '../assets/images/regenerated_image_1786532918112.png';

export const DEFAULT_COLORS: ColorOption[] = [
  { name: 'Chili Red', hex: '#af101a', bgClass: 'bg-[#af101a]' },
  { name: 'Matte Black', hex: '#1a1c1c', bgClass: 'bg-[#1a1c1c]' },
  { name: 'Chalk White', hex: '#f3f4f6', bgClass: 'bg-gray-100' },
  { name: 'Signal Yellow', hex: '#eab308', bgClass: 'bg-yellow-500' },
  { name: 'Emerald Green', hex: '#059669', bgClass: 'bg-emerald-600' },
  { name: 'Silk Gold', hex: '#d97706', bgClass: 'bg-amber-600' }
];

export const INITIAL_PRODUCTS: Product[] = [
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
      imgCabaiKeychain
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
      imgFlexiBuddy
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
      imgDeskDock
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
      imgCableClip
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
      imgNameTag
    ],
    specifications: {
      material: 'Tough PLA',
      weight: '12g',
      dimensions: '70mm x 20mm x 6mm',
      printTime: '25 mins',
      layerHeight: '0.12mm Ultra Fine',
      madeToOrder: true
    },
    colors: [
      { name: 'Chili Red', hex: '#af101a', bgClass: 'bg-[#af101a]' },
      { name: 'Matte Black', hex: '#1a1c1c', bgClass: 'bg-[#1a1c1c]' },
      { name: 'Chalk White', hex: '#f3f4f6', bgClass: 'bg-gray-100' },
      { name: 'Signal Yellow', hex: '#eab308', bgClass: 'bg-yellow-500' }
    ],
    materials: ['PLA', 'PETG'],
    isBestSeller: true,
    isNew: true,
    inStock: true,
    stockQuantity: 150
  }
];

export const INITIAL_ORDERS: Order[] = [];

export const INITIAL_SPOOLS: MaterialSpool[] = [
  { id: 'spool-01', name: 'PLA+ Chili Red', material: 'PLA', colorName: 'Chili Red', colorHex: '#af101a', stockKg: 14.5, maxCapacityKg: 25.0, pricePerKg: 65, isLow: false },
  { id: 'spool-02', name: 'PLA Matte Black', material: 'PLA', colorName: 'Matte Black', colorHex: '#1a1c1c', stockKg: 8.2, maxCapacityKg: 20.0, pricePerKg: 65, isLow: false },
  { id: 'spool-03', name: 'PETG Industrial Black', material: 'PETG', colorName: 'Matte Black', colorHex: '#1a1c1c', stockKg: 2.1, maxCapacityKg: 15.0, pricePerKg: 85, isLow: true },
  { id: 'spool-04', name: 'PLA Chalk White', material: 'PLA', colorName: 'Chalk White', colorHex: '#f3f4f6', stockKg: 11.0, maxCapacityKg: 20.0, pricePerKg: 65, isLow: false },
  { id: 'spool-05', name: 'TPU Flexible 95A Red', material: 'TPU', colorName: 'Chili Red', colorHex: '#af101a', stockKg: 3.8, maxCapacityKg: 10.0, pricePerKg: 110, isLow: false },
  { id: 'spool-06', name: 'PLA Silk Gold', material: 'PLA', colorName: 'Silk Gold', colorHex: '#d97706', stockKg: 1.5, maxCapacityKg: 10.0, pricePerKg: 80, isLow: true }
];

export const MALAYSIAN_BANKS = [
  { id: 'mbb', name: 'Maybank2u', logo: '🏦' },
  { id: 'cimb', name: 'CIMB Clicks', logo: '🏦' },
  { id: 'pbe', name: 'Public Bank Online', logo: '🏦' },
  { id: 'rhb', name: 'RHB Now', logo: '🏦' },
  { id: 'hlb', name: 'Hong Leong Connect', logo: '🏦' },
  { id: 'amb', name: 'AmOnline', logo: '🏦' },
  { id: 'bi', name: 'Bank Islam', logo: '🏦' }
];

export const MALAYSIAN_STATES = [
  'Johor',
  'Kedah',
  'Kelantan',
  'Kuala Lumpur',
  'Labuan',
  'Melaka',
  'Negeri Sembilan',
  'Pahang',
  'Penang',
  'Perak',
  'Perlis',
  'Putrajaya',
  'Sabah',
  'Sarawak',
  'Selangor',
  'Terengganu'
];

export const SAMPLE_STL_FILES = [
  { name: 'Cabai_Mascot_Keyring_v2.stl', sizeMb: 4.2, volumeCm3: 16.5, defaultTimeHours: 0.75, defaultPrice: 8.90 },
  { name: 'Custom_Drone_Arm_Mount.stl', sizeMb: 12.8, volumeCm3: 48.0, defaultTimeHours: 3.2, defaultPrice: 38.00 },
  { name: 'Mechanical_Keyboard_Wrist_Rest.stl', sizeMb: 18.5, volumeCm3: 110.0, defaultTimeHours: 6.5, defaultPrice: 65.00 },
  { name: 'Phone_Stand_Foldable_V3.3mf', sizeMb: 8.1, volumeCm3: 32.0, defaultTimeHours: 2.1, defaultPrice: 22.00 }
];

export const FAQ_LIST = [
  {
    q: 'How fast will my 3D printed order arrive?',
    a: 'Most in-stock & standard custom prints are produced within 24-48 hours in our studio and delivered via express courier (Pos Laju / J&T) within 1-3 business days across Malaysia.'
  },
  {
    q: 'What 3D file formats do you accept for custom printing?',
    a: 'We accept .STL, .OBJ, and .3MF files up to 50MB. If you have a CAD design in .STEP or .F3D format, you can also send it to us directly.'
  },
  {
    q: 'What is the difference between PLA, PETG, and TPU materials?',
    a: 'PLA+ is rigid, crisp, and eco-friendly (great for keychains and desk decor). PETG is tough, weather & heat resistant (ideal for functional or automotive parts). TPU is flexible and rubber-like (great for bumpers, grips, and phone cases).'
  },
  {
    q: 'Are layer lines normal on 3D printed products?',
    a: 'Yes! FDM 3D printing creates items layer-by-layer (we print at fine 0.12mm to 0.20mm resolutions). This unique micro-textured finish is the hallmark of genuine 3D printed maker crafts.'
  }
];
