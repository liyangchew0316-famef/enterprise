import { Product, MaterialSpool, Order, ColorOption, HallOfGloryMember } from '../types';
import { imageConfig } from '../config/assets';

export const STUDIO_INFO = {
  name: 'CABAI ENTERPRISE™',
  location: 'Inside your computer',
  phone: '+60 12-905 8515',
  whatsappNumber: '60129058515',
  whatsappUrl: 'https://wa.me/60129058515',
  email: 'enterprise.cabai@gmail.com',
  businessRegistration: '202603019821',
  operatingHours: 'Digital Studio 24/7 (Courier Dispatch: Mon - Fri 9:00 AM - 6:00 PM)',
  slogan: 'From Cabai to Something Real. 🌶️'
};

export const HALL_OF_GLORY_MEMBERS: HallOfGloryMember[] = [
  {
    id: 'hall-01',
    name: 'Kong Zi Teng',
    role: 'CEO (Chief Executive Officer)',
    avatarEmoji: '👑',
    badge: 'Enterprise Leader',
    specialty: 'Executive Leadership, Strategic Vision & Brand Expansion',
    bio: 'Chief Executive Officer steering CABAI ENTERPRISE™ from a digital maker concept into a powerhouse 3D manufacturing brand. Spearheads corporate partnerships, production scalability, and long-term vision.',
    quote: '“We lead with precision and deliver with passion. CABAI is here to reshape personal 3D manufacturing in Malaysia.”',
    achievements: [
      'Strategic architect behind CABAI ENTERPRISE™ corporate growth',
      'Orchestrated multi-channel 3D manufacturing expansion',
      'Established high-standard quality assurance protocols across all product lines'
    ],
    signatureItem: 'CABAI Enterprise Vision'
  },
  {
    id: 'hall-02',
    name: 'Lim Ee Fun',
    role: 'CFO (Chief Financial Officer)',
    avatarEmoji: '💎',
    badge: 'Finance & Treasury Lead',
    specialty: 'Financial Strategy, Unit Economics & Pricing Models',
    bio: 'Chief Financial Officer overseeing financial health, material cost optimization, and transparent quotation formulas. Ensures fair, accessible pricing for makers, students, and businesses alike.',
    quote: '“Sustainable growth comes from meticulous numbers and giving customers maximum value for every ringgit.”',
    achievements: [
      'Engineered dynamic weight-and-volume algorithmic pricing models',
      'Maintains transparent Touch \'n Go & digital payment reconciliation',
      'Secured high-volume bulk filament procurement pipelines'
    ],
    signatureItem: 'Dynamic Pricing Engine'
  },
  {
    id: 'hall-03',
    name: 'H\'ng Kai Yii',
    role: 'Manager (Operations & Studio Logistics)',
    avatarEmoji: '⚡',
    badge: 'Operations Commander',
    specialty: 'Studio Operations, Dispatch Logistics & Customer Care',
    bio: 'Operational Commander managing daily print queue workflows, fleet synchronization, and rapid courier fulfillment. Guarantees every physical print meets strict quality standards before shipping.',
    quote: '“Every print job has a timeline. We execute without delay, ensuring orders move from slice to delivery seamlessly.”',
    achievements: [
      'Maintains the 24–48 hour rapid dispatch turnaround benchmark',
      'Oversees multi-station CoreXY printing fleet and calibration queues',
      'Pioneered 100% order verification tracking system'
    ],
    signatureItem: 'Fleet Operations & Rapid Dispatch'
  },
  {
    id: 'hall-04',
    name: 'Li Yang',
    role: 'Lead 3D Print Specialist & CAD Artisan',
    avatarEmoji: '🌶️',
    badge: 'Master Maker & Slicer',
    specialty: '3D Printer Tuning, Slicing Optimization & CAD Crafting',
    bio: 'Dedicated 3D printing craftsman and creator of the signature Cabai Keychain 🌶️. Works under studio operations management to calibrate nozzles, slice models with 0.12mm precision, and ensure physical print perfection.',
    quote: '“Every print bed needs care and precision. I turn digital files into clean, tangible objects layer by layer.”',
    achievements: [
      'Original creator and sculptor of the iconic Cabai Keychain 🌶️',
      'Over 10,000+ flawless print hours logged across studio machines',
      'Specialist in fine-detail 0.12mm slicing calibration and surface finish'
    ],
    signatureItem: 'Cabai Keychain 🌶️'
  }
];


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
    id: 'prod-keyboard-clicker',
    name: 'Keyboard Clicker',
    subtitle: '1 Key RM5 (Max 5 Keys) • Custom Switches',
    price: 5.00,
    originalPrice: 7.00,
    rating: 4.95,
    reviewsCount: 184,
    category: 'custom',
    tags: ['Customizable', 'Mechanical Key', 'Fidget Toy', 'Best Seller'],
    description: '3D printed mechanical keyboard switch clicker fidget toy. Custom-configured with 1 to 5 clicky keys (RM5.00 per key switch). Satisfying mechanical tactile click sound and durable compact casing.',
    images: [
      imageConfig.products.keyboardClicker
    ],
    specifications: {
      material: 'Premium PLA+',
      weight: '18g (per key)',
      dimensions: '25mm x 25mm x 32mm (1-Key Base)',
      printTime: '35 mins',
      layerHeight: '0.16mm (Fine)',
      madeToOrder: true
    },
    colors: DEFAULT_COLORS,
    materials: ['PLA', 'PETG'],
    isBestSeller: true,
    isNew: true,
    inStock: true,
    stockQuantity: 95
  },
  {
    id: 'prod-cabai-keychain-drawable',
    name: 'Cabai Keychain (Drawable)',
    subtitle: 'DIY Colorable Chili Keyring • Max RM5',
    price: 5.00,
    originalPrice: 6.50,
    rating: 4.92,
    reviewsCount: 146,
    category: 'keychains',
    tags: ['Drawable', 'DIY Art', 'Chili Signature', 'Popular'],
    description: 'Customizable 3D printed chili pepper keychain with smooth white matte drawing canvas. Color your own expressions, facial details, or personalized patterns with markers.',
    images: [
      imageConfig.products.cabaiKeychainDrawable
    ],
    specifications: {
      material: 'Matte White PLA+',
      weight: '14g',
      dimensions: '58mm x 22mm x 18mm',
      printTime: '35 mins',
      layerHeight: '0.16mm (High Detail)',
      madeToOrder: true
    },
    colors: DEFAULT_COLORS,
    materials: ['PLA'],
    isBestSeller: true,
    isNew: true,
    inStock: true,
    stockQuantity: 110
  },
  {
    id: 'prod-cabai-keychain',
    name: 'Cabai Keychain',
    subtitle: 'Signature Red Chili Keyring • RM3',
    price: 3.00,
    originalPrice: 4.50,
    rating: 4.98,
    reviewsCount: 320,
    category: 'keychains',
    tags: ['RM3 Classic', 'Studio Signature', 'Best Seller', 'Pocket Size'],
    description: 'Our studio signature classic 3D printed Malaysian chili pepper keychain. Vibrant red finish with green stem, sleek surface, and durable split ring.',
    images: [
      imageConfig.products.cabaiKeychain
    ],
    specifications: {
      material: 'Chili Red PLA+',
      weight: '12g',
      dimensions: '56mm x 18mm x 15mm',
      printTime: '25 mins',
      layerHeight: '0.16mm',
      madeToOrder: true
    },
    colors: DEFAULT_COLORS,
    materials: ['PLA', 'PETG'],
    isBestSeller: true,
    isNew: false,
    inStock: true,
    stockQuantity: 250
  },
  {
    id: 'prod-name-tag',
    name: 'Name Tag (Customize)',
    subtitle: '1 Letter RM0.50 • Min 5 Letters',
    price: 2.50,
    originalPrice: 3.50,
    rating: 4.96,
    reviewsCount: 278,
    category: 'custom',
    tags: ['Custom Text', 'Name Keyring', 'Embossed 3D', 'Personalized'],
    description: 'Personalized 3D printed embossed name tag keyring. RM0.50 per letter (minimum 5 letters = RM2.50 base). High-contrast dual-tone raised lettering tailored to your custom name.',
    images: [
      imageConfig.products.nameTag
    ],
    specifications: {
      material: 'Dual-Tone PLA+',
      weight: '15g',
      dimensions: 'Length scales with letters x 20mm x 5mm',
      printTime: '30 mins',
      layerHeight: '0.12mm (Ultra Fine)',
      madeToOrder: true
    },
    colors: DEFAULT_COLORS,
    materials: ['PLA', 'PETG'],
    isBestSeller: true,
    isNew: false,
    inStock: true,
    stockQuantity: 180
  },
  {
    id: 'prod-cabai-fridge-magnet',
    name: 'Cabai Fridge Magnet (Drawable)',
    subtitle: 'DIY Colorable • Max RM3',
    price: 3.00,
    originalPrice: 4.00,
    rating: 4.89,
    reviewsCount: 112,
    category: 'home',
    tags: ['Fridge Magnet', 'Drawable Canvas', 'Home Decor', 'Budget Pick'],
    description: 'Cute 3D printed chili pepper fridge magnet with embedded strong neodymium magnet and smooth drawable front face. Sticks firmly to refrigerators, whiteboards, and magnetic boards.',
    images: [
      imageConfig.products.cabaiFridgeMagnet
    ],
    specifications: {
      material: 'Tough PLA+ with N52 Magnet',
      weight: '16g',
      dimensions: '50mm x 30mm x 12mm',
      printTime: '28 mins',
      layerHeight: '0.16mm',
      madeToOrder: true
    },
    colors: DEFAULT_COLORS,
    materials: ['PLA'],
    isBestSeller: false,
    isNew: true,
    inStock: true,
    stockQuantity: 140
  },
  {
    id: 'prod-cabai-phone-holder',
    name: 'Cabai Phone Holder',
    subtitle: 'Ergonomic Desktop Phone Stand • RM5',
    price: 5.00,
    originalPrice: 7.50,
    rating: 4.91,
    reviewsCount: 165,
    category: 'organizers',
    tags: ['Phone Stand', 'Desk Setup', 'Ergonomic', 'Durable'],
    description: 'Ergonomic 3D printed chili-inspired desktop smartphone holder. Holds smartphones securely in portrait or landscape orientation with angled viewing and cable routing notch.',
    images: [
      imageConfig.products.cabaiPhoneHolder
    ],
    specifications: {
      material: 'Reinforced PETG / PLA+',
      weight: '48g',
      dimensions: '75mm x 68mm x 60mm',
      printTime: '1 hr 10 mins',
      layerHeight: '0.20mm',
      madeToOrder: true
    },
    colors: DEFAULT_COLORS,
    materials: ['PLA', 'PETG'],
    isBestSeller: true,
    isNew: false,
    inStock: true,
    stockQuantity: 90
  },
  {
    id: 'prod-cabai-pen',
    name: 'Cabai Pen',
    subtitle: '3D Printed Chili Ballpoint Pen • RM3',
    price: 3.00,
    originalPrice: 4.50,
    rating: 4.88,
    reviewsCount: 98,
    category: 'organizers',
    tags: ['Novelty Pen', 'Chili Design', 'Stationery', 'Refillable'],
    description: 'Fun novelty 3D printed chili pepper casing ballpoint pen. Includes removable green stem cap and smooth 0.5mm replaceable black gel/ballpoint ink core.',
    images: [
      imageConfig.products.cabaiPen
    ],
    specifications: {
      material: 'Lightweight PLA',
      weight: '22g',
      dimensions: '140mm x 16mm x 16mm',
      printTime: '45 mins',
      layerHeight: '0.16mm',
      madeToOrder: true
    },
    colors: DEFAULT_COLORS,
    materials: ['PLA'],
    isBestSeller: false,
    isNew: true,
    inStock: true,
    stockQuantity: 130
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
