import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ColorOption, MaterialType, CartItem, Product } from '../types';
import { DEFAULT_COLORS } from '../data/mockData';
import { 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Sparkles, 
  ShieldCheck, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Type, 
  Layers, 
  Palette, 
  CheckCircle2,
  Pin,
  Tag,
  Star,
  Award
} from 'lucide-react';

export interface BadgeTemplate {
  id: string;
  name: string;
  category: string;
  icon: string;
  topText: string;
  centerText: string;
  bottomText: string;
  baseColor: ColorOption;
  rimColor: ColorOption;
  textColor: ColorOption;
  previewEmoji: string;
}

export const BADGE_TEMPLATES: BadgeTemplate[] = [
  {
    id: 'tpl-cabai-staff',
    name: '🌶️ Cabai Maker Official',
    category: 'Official Studio',
    icon: '🌶️',
    topText: 'CABAI ENTERPRISE',
    centerText: 'LEAD MAKER',
    bottomText: '3D PRINT SPECIALIST',
    baseColor: DEFAULT_COLORS[0], // Chili Red (#af101a)
    rimColor: DEFAULT_COLORS[5] || { name: 'Silk Gold', hex: '#d97706', bgClass: 'bg-amber-600' },
    textColor: DEFAULT_COLORS[2], // Chalk White (#f3f4f6)
    previewEmoji: '🌶️'
  },
  {
    id: 'tpl-school-student',
    name: '🎓 Student / School Safety',
    category: 'Education',
    icon: '🎓',
    topText: 'STUDENT COUNCIL',
    centerText: 'ALEX TAN',
    bottomText: 'SAFETY CAPTAIN',
    baseColor: { name: 'Deep Navy', hex: '#1e3a8a', bgClass: 'bg-blue-900' },
    rimColor: DEFAULT_COLORS[2], // Chalk White
    textColor: { name: 'Chalk White', hex: '#ffffff', bgClass: 'bg-white' },
    previewEmoji: '🎓'
  },
  {
    id: 'tpl-medical-staff',
    name: '🏥 Doctor & Medical Care',
    category: 'Healthcare',
    icon: '🩺',
    topText: 'MEDICAL CENTER',
    centerText: 'DR. LI YANG',
    bottomText: 'REGISTERED OFFICER',
    baseColor: DEFAULT_COLORS[4], // Emerald Green (#059669)
    rimColor: DEFAULT_COLORS[2], // Chalk White
    textColor: { name: 'Chalk White', hex: '#ffffff', bgClass: 'bg-white' },
    previewEmoji: '🩺'
  },
  {
    id: 'tpl-corporate-vip',
    name: '💼 Corporate Executive VIP',
    category: 'Business',
    icon: '👑',
    topText: 'CABAI ENTERPRISE',
    centerText: 'KONG ZI TENG',
    bottomText: 'CHIEF EXECUTIVE (CEO)',
    baseColor: DEFAULT_COLORS[1], // Matte Black (#1a1c1c)
    rimColor: { name: 'Silk Gold', hex: '#d97706', bgClass: 'bg-amber-600' },
    textColor: { name: 'Silk Gold', hex: '#fbbf24', bgClass: 'bg-amber-400' },
    previewEmoji: '👑'
  },
  {
    id: 'tpl-security-officer',
    name: '🛡️ Safety Inspector / Security',
    category: 'Security',
    icon: '🛡️',
    topText: 'SAFETY INSPECTOR',
    centerText: 'OFFICER #042',
    bottomText: 'AUTHORIZED ENTRY',
    baseColor: DEFAULT_COLORS[3], // Signal Yellow (#eab308)
    rimColor: DEFAULT_COLORS[1], // Matte Black
    textColor: DEFAULT_COLORS[1], // Matte Black
    previewEmoji: '🛡️'
  },
  {
    id: 'tpl-barista-cafe',
    name: '☕ Barista & Specialty Cafe',
    category: 'Hospitality',
    icon: '☕',
    topText: 'SPECIALTY COFFEE',
    centerText: 'HEAD BARISTA',
    bottomText: 'CABAI CAFE CREW',
    baseColor: { name: 'Espresso Brown', hex: '#451a03', bgClass: 'bg-amber-950' },
    rimColor: { name: 'Warm Cream', hex: '#fef3c7', bgClass: 'bg-amber-100' },
    textColor: { name: 'Warm Cream', hex: '#fef3c7', bgClass: 'bg-amber-100' },
    previewEmoji: '☕'
  },
  {
    id: 'tpl-cyber-gamer',
    name: '👾 Cyberpunk & Esports Pro',
    category: 'Gaming',
    icon: '👾',
    topText: 'CYBER MAKER LAB',
    centerText: 'PLAYER ONE',
    bottomText: 'LEVEL 99 CHAMPION',
    baseColor: { name: 'Neon Purple', hex: '#581c87', bgClass: 'bg-purple-900' },
    rimColor: { name: 'Cyan Glow', hex: '#06b6d4', bgClass: 'bg-cyan-500' },
    textColor: { name: 'Cyan Glow', hex: '#67e8f9', bgClass: 'bg-cyan-300' },
    previewEmoji: '👾'
  },
  {
    id: 'tpl-kawaii-pet',
    name: '🐱 Cute Pet & Kawaii Club',
    category: 'Cute & Fun',
    icon: '🐾',
    topText: 'PET RESCUE HERO',
    centerText: 'LUCKY MEOW',
    bottomText: 'OFFICIAL FRIEND',
    baseColor: { name: 'Pastel Pink', hex: '#db2777', bgClass: 'bg-pink-600' },
    rimColor: DEFAULT_COLORS[2], // Chalk White
    textColor: { name: 'Chalk White', hex: '#ffffff', bgClass: 'bg-white' },
    previewEmoji: '🐱'
  },
  {
    id: 'tpl-space-explorer',
    name: '🚀 Space & Rocket Mission',
    category: 'Science',
    icon: '🚀',
    topText: 'MISSION CONTROL',
    centerText: 'COMMANDER',
    bottomText: 'ORBITAL CREW',
    baseColor: { name: 'Midnight Void', hex: '#0f172a', bgClass: 'bg-slate-900' },
    rimColor: { name: 'Solar Gold', hex: '#f59e0b', bgClass: 'bg-amber-500' },
    textColor: { name: 'Star White', hex: '#f8fafc', bgClass: 'bg-slate-50' },
    previewEmoji: '🚀'
  },
  {
    id: 'tpl-eco-botanical',
    name: '🌿 Eco Forest & Volunteer',
    category: 'Nature',
    icon: '🌿',
    topText: 'GREEN EARTH MALAYSIA',
    centerText: 'ECO VOLUNTEER',
    bottomText: 'NATURE PROTECTOR',
    baseColor: { name: 'Forest Green', hex: '#14532d', bgClass: 'bg-green-900' },
    rimColor: { name: 'Lime Sprout', hex: '#84cc16', bgClass: 'bg-lime-500' },
    textColor: { name: 'Chalk White', hex: '#ffffff', bgClass: 'bg-white' },
    previewEmoji: '🌿'
  },
  {
    id: 'tpl-star-vip',
    name: '⭐ Star Ambassador & Host',
    category: 'Events',
    icon: '⭐',
    topText: 'CABAI EVENT 2026',
    centerText: 'SPECIAL GUEST',
    bottomText: 'VIP AMBASSADOR',
    baseColor: { name: 'Royal Crimson', hex: '#881337', bgClass: 'bg-rose-900' },
    rimColor: { name: 'Silk Gold', hex: '#d97706', bgClass: 'bg-amber-600' },
    textColor: { name: 'Silk Gold', hex: '#fde047', bgClass: 'bg-yellow-300' },
    previewEmoji: '⭐'
  },
  {
    id: 'tpl-minimalist-designer',
    name: '🎨 CAD Artisan & 3D Designer',
    category: 'Maker Lab',
    icon: '📐',
    topText: 'CABAI 3D STUDIO',
    centerText: 'CAD ARTISAN',
    bottomText: 'PRECISION SLICER',
    baseColor: DEFAULT_COLORS[1], // Matte Black
    rimColor: DEFAULT_COLORS[0], // Chili Red
    textColor: DEFAULT_COLORS[2], // Chalk White
    previewEmoji: '🌶️'
  }
];

export const BadgeCustomizer: React.FC = () => {
  const { addToCart, showToast, setIsCartOpen, setCurrentView } = useApp();

  // Customization State - Strictly Circle Safety Namebadge
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(BADGE_TEMPLATES[0].id);
  const [topText, setTopText] = useState(BADGE_TEMPLATES[0].topText);
  const [bottomText, setBottomText] = useState(BADGE_TEMPLATES[0].bottomText);
  const [centerText, setCenterText] = useState(BADGE_TEMPLATES[0].centerText);
  const [centerEmoji, setCenterEmoji] = useState(BADGE_TEMPLATES[0].icon);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageScale, setImageScale] = useState<number>(100);
  const [baseColor, setBaseColor] = useState<ColorOption>(BADGE_TEMPLATES[0].baseColor);
  const [rimColor, setRimColor] = useState<ColorOption>(BADGE_TEMPLATES[0].rimColor);
  const [textColor, setTextColor] = useState<ColorOption>(BADGE_TEMPLATES[0].textColor);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'templates' | 'text' | 'colors' | 'image'>('templates');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const unitPrice = 5.00; // Flat RM 5.00 for Custom 3D Circle Safety Namebadge
  const totalPrice = unitPrice * quantity;

  // Apply Template
  const handleSelectTemplate = (tpl: BadgeTemplate) => {
    setSelectedTemplateId(tpl.id);
    setTopText(tpl.topText);
    setCenterText(tpl.centerText);
    setBottomText(tpl.bottomText);
    setCenterEmoji(tpl.icon);
    setBaseColor(tpl.baseColor);
    setRimColor(tpl.rimColor);
    setTextColor(tpl.textColor);
    showToast(`Applied "${tpl.name}" 模板! Customize your name & text below. ✨`, 'success');
  };

  // Handle Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file (PNG, JPG, SVG, WebP).', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setUploadedImage(event.target.result as string);
        showToast('Badge custom photo/logo uploaded! 🌶️', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  // Render Circular 3D Safety Namebadge on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const r = width / 2 - 25;

    ctx.clearRect(0, 0, width, height);

    // Draw Shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 10;

    // 1. Draw 3D Bevel Rim (Circle Only)
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.fillStyle = rimColor.hex;
    ctx.fill();
    ctx.restore();

    // 2. Draw Inner Base Plate (Circle Only)
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r - 12, 0, 2 * Math.PI);
    ctx.fillStyle = baseColor.hex;
    ctx.fill();
    
    // Texture concentric layer lines (simulating 3D print concentric surface finish)
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    for (let i = 24; i < r - 16; i += 12) {
      ctx.beginPath();
      ctx.arc(cx, cy, i, 0, 2 * Math.PI);
      ctx.stroke();
    }
    ctx.restore();

    // 3. Render Uploaded Custom Image or Template Graphic
    if (uploadedImage) {
      const img = new Image();
      img.src = uploadedImage;
      img.onload = () => {
        ctx.save();
        // Clip to inner circular badge
        ctx.beginPath();
        ctx.arc(cx, cy, r - 18, 0, 2 * Math.PI);
        ctx.clip();

        const imgSize = (r * 1.1) * (imageScale / 100);
        ctx.drawImage(img, cx - imgSize / 2, cy - imgSize / 2, imgSize, imgSize);
        ctx.restore();

        renderTextAndGloss();
      };
    } else {
      // Center Badge Icon / Avatar
      ctx.save();
      ctx.font = '48px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(centerEmoji || '🌶️', cx, cy - 8);
      ctx.restore();

      renderTextAndGloss();
    }

    function renderTextAndGloss() {
      // 4. Render Top, Center & Bottom Embossed 3D Text
      ctx.save();
      ctx.fillStyle = textColor.hex;
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      // Top Arc / Header Text
      if (topText.trim()) {
        ctx.font = 'bold 12px system-ui, sans-serif';
        ctx.fillText(topText.toUpperCase(), cx, cy - r + 30);
      }

      // Center Name / Title Text
      if (centerText.trim()) {
        ctx.font = 'bold 15px system-ui, sans-serif';
        ctx.fillText(centerText.toUpperCase(), cx, cy + 24);
      }

      // Bottom Role / Subtitle Text
      if (bottomText.trim()) {
        ctx.font = 'bold 10px system-ui, sans-serif';
        ctx.fillText(bottomText.toUpperCase(), cx, cy + r - 22);
      }
      ctx.restore();

      // 5. Render 3D Specular Highlight / Glass shine
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r - 12, 0, 2 * Math.PI);
      ctx.clip();
      const grad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.32)');
      grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(cx - 20, cy - r / 2, r * 0.8, r * 0.45, -Math.PI / 6, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();

      // 6. Safety Pin Backing Indicator in corner
      ctx.save();
      ctx.beginPath();
      ctx.arc(width - 32, 32, 18, 0, 2 * Math.PI);
      ctx.fillStyle = '#111827';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#af101a';
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🧷', width - 32, 32);
      ctx.restore();
    }

  }, [topText, bottomText, centerText, centerEmoji, uploadedImage, imageScale, baseColor, rimColor, textColor]);

  // Handle Add to Cart
  const handleAddToCart = () => {
    const canvas = canvasRef.current;
    const previewDataUrl = canvas ? canvas.toDataURL('image/png') : '';

    const badgeTitle = `Custom Circle Safety Namebadge (${centerText || 'Namebadge'})`;

    const customBadgeProduct: Product = {
      id: `custom-safety-badge-${Date.now()}`,
      name: badgeTitle,
      category: 'badges' as any,
      price: unitPrice,
      rating: 5.0,
      reviewsCount: 1,
      materials: ['PLA' as MaterialType],
      colors: [baseColor, rimColor],
      inStock: true,
      stockQuantity: 999,
      tags: ['Circle Badge', 'Safety Namebadge', 'PLA 3D Print', 'Customizable'],
      description: `Custom 3D Printed Circle Safety Namebadge with safety pin clasp. Base: ${baseColor.name}, Rim: ${rimColor.name}. Top: "${topText}", Name: "${centerText}", Bottom: "${bottomText}". 100% Rigid PLA.`,
      images: [previewDataUrl],
      specifications: {
        material: '100% Eco PLA+ (Safety Pin Clasp)',
        weight: '14g',
        dimensions: '52mm Diameter x 5mm Thickness',
        printTime: '40 mins',
        layerHeight: '0.16mm (Precision Relief)',
        madeToOrder: true
      }
    };

    addToCart(customBadgeProduct, baseColor, 'PLA', quantity, `Safety Namebadge: "${centerText || topText}" (Circle)`);
    showToast(`Circle Safety Namebadge added to cart! (RM ${totalPrice.toFixed(2)}) 🧷`, 'success');
    setIsCartOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Header Title */}
      <div className="bg-gradient-to-r from-[#1a1c1c] via-[#240e12] to-[#af101a] text-white p-6 sm:p-8 rounded-3xl border border-red-900/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/40 border border-red-400/30 rounded-full text-xs font-black uppercase tracking-wider text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Circle Safety Namebadge Studio • 3D 圆形安全胸章</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-4xl tracking-tight text-white">
            Custom 3D Circle Safety Namebadge 🧷
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            Select from <strong className="text-white">12+ pre-designed templates (模板)</strong> or upload your own company/club logo! Every badge is 3D printed in rigid PLA with a secure <strong className="text-amber-300">Safety Pin Backing</strong>.
          </p>
        </div>

        <div className="p-4 bg-black/50 backdrop-blur-md rounded-2xl border border-white/10 text-center shrink-0 min-w-[180px]">
          <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Fixed Studio Price</div>
          <div className="font-heading font-black text-3xl text-amber-400 mt-0.5">
            RM {unitPrice.toFixed(2)}
          </div>
          <div className="text-[11px] text-gray-300 mt-1">Circle Only • Safety Pin Backing</div>
        </div>
      </div>

      {/* Main Studio Workbench Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: Live 3D Circular Badge Canvas Preview (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-5 sticky top-24">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#af101a]" />
              <h2 className="font-heading font-bold text-base text-gray-900">3D Safety Badge Preview</h2>
            </div>
            <span className="px-2.5 py-1 bg-red-50 text-[#af101a] border border-red-200 text-xs font-extrabold rounded-md flex items-center gap-1">
              <span>🧷 Safety Pin</span>
            </span>
          </div>

          {/* Canvas Wrapper */}
          <div className="relative aspect-square max-w-sm mx-auto bg-radial from-gray-50 to-gray-100 rounded-2xl border border-gray-200 p-4 flex items-center justify-center shadow-inner overflow-hidden">
            <canvas
              ref={canvasRef}
              width={400}
              height={400}
              className="w-full h-full object-contain filter drop-shadow-md transition-transform duration-300 hover:scale-102"
            />
          </div>

          {/* Scale Slider if image is uploaded */}
          {uploadedImage && (
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                <span>Image Scale Size:</span>
                <span className="text-[#af101a]">{imageScale}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="180"
                value={imageScale}
                onChange={(e) => setImageScale(Number(e.target.value))}
                className="w-full accent-[#af101a]"
              />
            </div>
          )}

          {/* Summary Specs */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
              <div className="text-[10px] text-gray-500 font-bold uppercase">Shape</div>
              <div className="font-bold text-gray-900">Circle (圆形)</div>
            </div>
            <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
              <div className="text-[10px] text-gray-500 font-bold uppercase">Backing</div>
              <div className="font-bold text-[#af101a]">Safety Pin 🧷</div>
            </div>
            <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
              <div className="text-[10px] text-gray-500 font-bold uppercase">Material</div>
              <div className="font-bold text-gray-900">100% PLA</div>
            </div>
          </div>

          {/* Add to Cart Actions */}
          <div className="pt-2 border-t border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-600">Quantity:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-bold"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center font-bold text-sm text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full py-3.5 bg-[#af101a] hover:bg-[#8d0a12] text-white font-extrabold text-sm rounded-xl shadow-lg shadow-red-950/20 flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add Custom Safety Namebadge to Cart (RM {totalPrice.toFixed(2)})</span>
            </button>
          </div>

        </div>

        {/* RIGHT: Customization Controls with Rich Templates (7 cols) */}
        <div className="lg:col-span-7 space-y-6">

          {/* Navigation Control Tabs */}
          <div className="flex items-center gap-2 p-1.5 bg-gray-100 rounded-2xl">
            <button
              onClick={() => setActiveTab('templates')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'templates'
                  ? 'bg-white text-[#af101a] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>1. Choose Template (模板)</span>
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'text'
                  ? 'bg-white text-[#af101a] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>2. Name &amp; Text</span>
            </button>
            <button
              onClick={() => setActiveTab('colors')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'colors'
                  ? 'bg-white text-[#af101a] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>3. Colors</span>
            </button>
            <button
              onClick={() => setActiveTab('image')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'image'
                  ? 'bg-white text-[#af101a] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>4. Custom Image</span>
            </button>
          </div>

          {/* TAB 1: Rich Template Gallery (模板) */}
          {activeTab === 'templates' && (
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#af101a]" />
                  <h3 className="font-heading font-extrabold text-lg text-gray-900">
                    Select a Circular Safety Badge Template (精选模板)
                  </h3>
                </div>
                <span className="text-xs font-bold text-gray-400">
                  {BADGE_TEMPLATES.length} Designs
                </span>
              </div>

              <p className="text-xs text-gray-500">
                Click any template to instantly load pre-matched 3D colors, typography hierarchy, and safety icons. You can edit the text and colors anytime!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {BADGE_TEMPLATES.map((tpl) => {
                  const isSelected = selectedTemplateId === tpl.id;
                  return (
                    <div
                      key={tpl.id}
                      onClick={() => handleSelectTemplate(tpl)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left space-y-2 relative overflow-hidden group ${
                        isSelected 
                          ? 'border-[#af101a] bg-red-50/40 ring-2 ring-[#af101a]/30 shadow-sm' 
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-base shadow-xs" style={{ backgroundColor: tpl.baseColor.hex, border: `2px solid ${tpl.rimColor.hex}` }}>
                          <span>{tpl.icon}</span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                          {tpl.category}
                        </span>
                      </div>

                      <div>
                        <div className="font-extrabold text-xs text-gray-900 group-hover:text-[#af101a] transition-colors line-clamp-1">
                          {tpl.name}
                        </div>
                        <div className="text-[11px] text-gray-500 mt-0.5 truncate">
                          "{tpl.centerText}" • {tpl.bottomText}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 pt-1 text-[10px] text-gray-400">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tpl.baseColor.hex }} />
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tpl.rimColor.hex }} />
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tpl.textColor.hex }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setActiveTab('text')}
                  className="px-4 py-2 bg-[#af101a] hover:bg-[#8d0a12] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Next: Edit Name &amp; Details</span>
                  <Type className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Text Customization */}
          {activeTab === 'text' && (
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Type className="w-5 h-5 text-[#af101a]" />
                <h3 className="font-heading font-extrabold text-lg text-gray-900">
                  Custom Badge Names &amp; Text Relief
                </h3>
              </div>

              <p className="text-xs text-gray-500">
                Type the name, staff title, school organization, or role to be embossed onto the 3D print.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Top Header Text (e.g. Organization / Company / School):
                  </label>
                  <input
                    type="text"
                    maxLength={24}
                    value={topText}
                    onChange={(e) => setTopText(e.target.value)}
                    placeholder="CABAI ENTERPRISE"
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-hidden focus:border-[#af101a] font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Center Main Name (e.g. Your Name / Member ID):
                  </label>
                  <input
                    type="text"
                    maxLength={18}
                    value={centerText}
                    onChange={(e) => setCenterText(e.target.value)}
                    placeholder="LEAD MAKER"
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:outline-hidden focus:border-[#af101a] font-extrabold text-[#af101a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Bottom Role / Department (e.g. 3D Print Specialist / Class 5A):
                  </label>
                  <input
                    type="text"
                    maxLength={24}
                    value={bottomText}
                    onChange={(e) => setBottomText(e.target.value)}
                    placeholder="3D PRINT SPECIALIST"
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-hidden focus:border-[#af101a] font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Center Icon Emoji (if not using custom image):
                  </label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {['🌶️', '🎓', '🩺', '👑', '🛡️', '☕', '👾', '🐱', '🚀', '🌿', '⭐', '📐', '🔥', '⚡', '🤖'].map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setCenterEmoji(emoji)}
                        className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center border transition-all ${
                          centerEmoji === emoji 
                            ? 'border-[#af101a] bg-red-50 ring-2 ring-red-300 shadow-xs' 
                            : 'border-gray-200 bg-white hover:bg-gray-50'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  onClick={() => setActiveTab('templates')}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl"
                >
                  ← Back to Templates
                </button>
                <button
                  onClick={() => setActiveTab('colors')}
                  className="px-4 py-2 bg-[#af101a] hover:bg-[#8d0a12] text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
                >
                  <span>Next: Choose Colors</span>
                  <Palette className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Colors */}
          {activeTab === 'colors' && (
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-5">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-[#af101a]" />
                <h3 className="font-heading font-extrabold text-lg text-gray-900">
                  Filament Color Palette (100% PLA)
                </h3>
              </div>

              {/* Base Color */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 block">
                  1. Center Base Plate Color: <span className="text-[#af101a]">{baseColor.name}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {DEFAULT_COLORS.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setBaseColor(c)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        baseColor.name === c.name 
                          ? 'border-[#af101a] bg-red-50 text-[#af101a] ring-2 ring-red-200' 
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-gray-400" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Rim Color */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="text-xs font-bold text-gray-700 block">
                  2. Outer 3D Bevel Rim Color: <span className="text-[#af101a]">{rimColor.name}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {DEFAULT_COLORS.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setRimColor(c)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        rimColor.name === c.name 
                          ? 'border-[#af101a] bg-red-50 text-[#af101a] ring-2 ring-red-200' 
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-gray-400" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Color */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="text-xs font-bold text-gray-700 block">
                  3. Embossed Text Relief Color: <span className="text-[#af101a]">{textColor.name}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {DEFAULT_COLORS.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setTextColor(c)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        textColor.name === c.name 
                          ? 'border-[#af101a] bg-red-50 text-[#af101a] ring-2 ring-red-200' 
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-gray-400" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  onClick={() => setActiveTab('text')}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl"
                >
                  ← Back to Text
                </button>
                <button
                  onClick={() => setActiveTab('image')}
                  className="px-4 py-2 bg-[#af101a] hover:bg-[#8d0a12] text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
                >
                  <span>Next: Upload Photo/Logo</span>
                  <ImageIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: Custom Image Upload */}
          {activeTab === 'image' && (
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#af101a]" />
                  <h3 className="font-heading font-extrabold text-lg text-gray-900">
                    Upload Custom Logo or Avatar (Optional)
                  </h3>
                </div>
                {uploadedImage && (
                  <button
                    onClick={() => setUploadedImage(null)}
                    className="text-xs text-red-600 hover:text-red-800 font-bold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                )}
              </div>

              <p className="text-xs text-gray-500">
                Upload your company logo, club badge, clan emblem, or member portrait to be 3D embedded directly onto the circular safety namebadge face.
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {uploadedImage ? (
                <div className="flex items-center gap-4 p-4 bg-red-50/50 border border-red-200 rounded-2xl">
                  <div className="w-16 h-16 rounded-xl bg-white border border-gray-300 overflow-hidden shrink-0 shadow-xs">
                    <img src={uploadedImage} alt="Uploaded Badge Decal" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Custom image successfully loaded to 3D circular badge!</span>
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-[#af101a] font-bold hover:underline"
                    >
                      Change to another photo
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 hover:border-[#af101a] bg-gray-50 hover:bg-red-50/30 transition-all rounded-2xl p-6 text-center cursor-pointer space-y-2 group"
                >
                  <div className="w-12 h-12 rounded-full bg-white shadow-xs border border-gray-200 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6 text-[#af101a]" />
                  </div>
                  <div className="font-bold text-sm text-gray-800">
                    Click to browse or drag &amp; drop image
                  </div>
                  <div className="text-xs text-gray-400">
                    Supports PNG, JPG, WebP, SVG (Max 15MB)
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-between">
                <button
                  onClick={() => setActiveTab('colors')}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl"
                >
                  ← Back to Colors
                </button>
                <button
                  onClick={handleAddToCart}
                  className="px-5 py-2.5 bg-[#af101a] hover:bg-[#8d0a12] text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Done • Add to Cart (RM {totalPrice.toFixed(2)})</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
