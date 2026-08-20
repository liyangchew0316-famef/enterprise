import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ColorOption, MaterialType, BadgeCustomization, CartItem, Product } from '../types';
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
  RotateCw,
  Info,
  CheckCircle2,
  Pin,
  Magnet,
  Key
} from 'lucide-react';

export const BadgeCustomizer: React.FC = () => {
  const { addToCart, showToast, setIsCartOpen, setCurrentView } = useApp();

  // Customization State
  const [shape, setShape] = useState<'circle' | 'shield' | 'hexagon' | 'square' | 'chili'>('circle');
  const [attachment, setAttachment] = useState<'pin' | 'magnet' | 'keychain'>('pin');
  const [topText, setTopText] = useState('CABAI ENTERPRISE');
  const [bottomText, setBottomText] = useState('3D MAKER STUDIO');
  const [centerText, setCenterText] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageScale, setImageScale] = useState<number>(100);
  const [baseColor, setBaseColor] = useState<ColorOption>(DEFAULT_COLORS[0]); // Chili Red
  const [rimColor, setRimColor] = useState<ColorOption>(DEFAULT_COLORS[5] || DEFAULT_COLORS[3]); // Silk Gold
  const [textColor, setTextColor] = useState<ColorOption>(DEFAULT_COLORS[2]); // Chalk White
  const [material] = useState<MaterialType>('PLA');
  const [quantity, setQuantity] = useState<number>(1);
  const [isHovered, setIsHovered] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Attachment price modifiers
  const attachmentPrices = {
    pin: 0,
    magnet: 1.50,
    keychain: 1.00
  };

  const unitPrice = 5.00 + attachmentPrices[attachment];
  const totalPrice = unitPrice * quantity;

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
        showToast('Badge custom image uploaded successfully! 🌶️', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  // Render 3D Badge on Canvas
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

    // Outer Badge Base Path
    const drawBadgePath = (radius: number, context: CanvasRenderingContext2D) => {
      context.beginPath();
      if (shape === 'circle') {
        context.arc(cx, cy, radius, 0, 2 * Math.PI);
      } else if (shape === 'hexagon') {
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3 - Math.PI / 6;
          const x = cx + radius * Math.cos(angle);
          const y = cy + radius * Math.sin(angle);
          if (i === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.closePath();
      } else if (shape === 'square') {
        const half = radius * 0.88;
        const cornerR = 24;
        context.roundRect(cx - half, cy - half, half * 2, half * 2, cornerR);
      } else if (shape === 'shield') {
        context.moveTo(cx, cy - radius);
        context.lineTo(cx + radius * 0.9, cy - radius * 0.4);
        context.quadraticCurveTo(cx + radius * 0.85, cy + radius * 0.4, cx, cy + radius * 1.05);
        context.quadraticCurveTo(cx - radius * 0.85, cy + radius * 0.4, cx - radius * 0.9, cy - radius * 0.4);
        context.closePath();
      } else if (shape === 'chili') {
        // Chili curved silhouette
        context.moveTo(cx - 10, cy - radius);
        context.bezierCurveTo(cx + radius * 0.7, cy - radius * 0.5, cx + radius * 0.8, cy + radius * 0.3, cx + 15, cy + radius * 0.95);
        context.bezierCurveTo(cx - radius * 0.2, cy + radius * 1.05, cx - radius * 0.8, cy + radius * 0.2, cx - radius * 0.6, cy - radius * 0.3);
        context.closePath();
      }
    };

    // 1. Draw 3D Bevel Rim
    drawBadgePath(r, ctx);
    ctx.fillStyle = rimColor.hex;
    ctx.fill();
    ctx.restore();

    // 2. Draw Inner Base Plate
    ctx.save();
    drawBadgePath(r - 12, ctx);
    ctx.fillStyle = baseColor.hex;
    ctx.fill();
    
    // Texture lines (simulating 3D print concentric layer lines)
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    for (let i = 20; i < r - 16; i += 12) {
      ctx.beginPath();
      ctx.arc(cx, cy, i, 0, 2 * Math.PI);
      ctx.stroke();
    }
    ctx.restore();

    // 3. Render Uploaded Custom Image if available
    if (uploadedImage) {
      const img = new Image();
      img.src = uploadedImage;
      img.onload = () => {
        ctx.save();
        // Clip to inner badge
        drawBadgePath(r - 18, ctx);
        ctx.clip();

        const imgSize = (r * 1.1) * (imageScale / 100);
        ctx.drawImage(img, cx - imgSize / 2, cy - imgSize / 2, imgSize, imgSize);
        ctx.restore();

        renderTextAndGloss();
      };
    } else {
      // Draw Default 3D Chili / Center Icon or text
      ctx.save();
      if (centerText.trim()) {
        ctx.fillStyle = textColor.hex;
        ctx.font = 'bold 24px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        ctx.shadowBlur = 4;
        ctx.fillText(centerText, cx, cy);
      } else {
        // Draw 3D Chili Vector Icon
        ctx.font = '54px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🌶️', cx, cy - 2);
      }
      ctx.restore();

      renderTextAndGloss();
    }

    function renderTextAndGloss() {
      // 4. Render Top & Bottom Embossed 3D Text
      ctx.save();
      ctx.fillStyle = textColor.hex;
      ctx.font = 'bold 12px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowBlur = 3;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      if (topText.trim()) {
        ctx.fillText(topText.toUpperCase(), cx, cy - r + 32);
      }
      if (bottomText.trim()) {
        ctx.fillText(bottomText.toUpperCase(), cx, cy + r - 22);
      }
      ctx.restore();

      // 5. Render 3D Specular Highlight / Glass shine
      ctx.save();
      drawBadgePath(r - 12, ctx);
      ctx.clip();
      const grad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
      grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(cx - 20, cy - r / 2, r * 0.8, r * 0.45, -Math.PI / 6, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();

      // 6. Attachment Preview Pin / Magnet Indicator badge in corner
      ctx.save();
      ctx.beginPath();
      ctx.arc(width - 32, 32, 18, 0, 2 * Math.PI);
      ctx.fillStyle = '#111827';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#f59e0b';
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const attachIcon = attachment === 'pin' ? '📌' : attachment === 'magnet' ? '🧲' : '🎒';
      ctx.fillText(attachIcon, width - 32, 32);
      ctx.restore();
    }

  }, [shape, attachment, topText, bottomText, centerText, uploadedImage, imageScale, baseColor, rimColor, textColor]);

  // Handle Add to Cart
  const handleAddToCart = () => {
    const canvas = canvasRef.current;
    const previewDataUrl = canvas ? canvas.toDataURL('image/png') : '';

    const badgeTitle = `Custom 3D Badge (${shape.toUpperCase()}, ${attachment.toUpperCase()})`;

    const customBadgeProduct: Product = {
      id: `custom-badge-${Date.now()}`,
      name: badgeTitle,
      category: 'badges' as any,
      price: unitPrice,
      rating: 5.0,
      reviewsCount: 1,
      materials: ['PLA' as MaterialType],
      colors: [baseColor, rimColor],
      inStock: true,
      stockQuantity: 999,
      tags: ['Custom Badge', 'PLA 3D Print', 'Personalized', shape],
      description: `Personalized 3D Printed ${shape} badge with ${attachment} back. Base: ${baseColor.name}, Rim: ${rimColor.name}. Top: "${topText}", Bottom: "${bottomText}".`,
      images: [previewDataUrl],
      specifications: {
        material: 'PLA' as MaterialType,
        weight: '12g',
        dimensions: '50mm x 50mm x 5mm',
        printTime: '45 mins',
        layerHeight: '0.16mm',
        madeToOrder: true
      }
    };

    const cartItem: CartItem = {
      id: `badge-cart-${Date.now()}`,
      productId: customBadgeProduct.id,
      product: customBadgeProduct,
      selectedColor: baseColor,
      selectedMaterial: 'PLA',
      quantity,
      unitPrice,
      isCustomPrint: true,
      drawingImage: previewDataUrl,
      customText: `Top: ${topText} | Bottom: ${bottomText} | Style: ${shape}/${attachment}`,
      customPrintDetails: {
        fileName: `badge_${shape}_${attachment}.stl`,
        designTitle: badgeTitle,
        volumeCm3: 15,
        infillPercent: 100,
        layerHeight: '0.16',
        estimatedTimeHours: 0.75
      }
    };

    addToCart(customBadgeProduct, baseColor, 'PLA', quantity, `Shape: ${shape}, ${attachment}`);
    showToast(`Custom 3D Badge added to cart! (RM ${totalPrice.toFixed(2)}) 🛡️`, 'success');
    setIsCartOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header Title */}
      <div className="bg-gradient-to-r from-[#1a1c1c] via-[#240e12] to-[#af101a] text-white p-6 sm:p-8 rounded-3xl border border-red-900/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/40 border border-red-400/30 rounded-full text-xs font-black uppercase tracking-wider text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Badge Customize • 自定义 3D 徽章</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-4xl tracking-tight text-white">
            Custom 3D Pin &amp; Magnet Badge Studio
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            Upload your custom logo or picture, select badge shapes, embossed 3D relief text, filament colors, and wear it as a safety pin, fridge magnet, or keychain!
          </p>
        </div>

        <div className="p-4 bg-black/50 backdrop-blur-md rounded-2xl border border-white/10 text-center shrink-0 min-w-[180px]">
          <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Starting Price</div>
          <div className="font-heading font-black text-3xl text-amber-400 mt-0.5">
            RM {unitPrice.toFixed(2)}
          </div>
          <div className="text-[11px] text-gray-300 mt-1">100% High Precision PLA</div>
        </div>
      </div>

      {/* Main Studio Workbench Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: Interactive 3D Canvas Preview (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-5 sticky top-24">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#af101a]" />
              <h2 className="font-heading font-bold text-base text-gray-900">Live 3D Badge Preview</h2>
            </div>
            <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-md">
              1:1 Real Scale
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

          {/* Image Scale Slider (if uploaded) */}
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

          {/* Summary Details */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
              <div className="text-[10px] text-gray-500 font-bold uppercase">Shape</div>
              <div className="font-bold text-gray-900 capitalize">{shape}</div>
            </div>
            <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
              <div className="text-[10px] text-gray-500 font-bold uppercase">Back Style</div>
              <div className="font-bold text-gray-900 capitalize">{attachment}</div>
            </div>
            <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
              <div className="text-[10px] text-gray-500 font-bold uppercase">Material</div>
              <div className="font-bold text-[#af101a]">100% PLA</div>
            </div>
          </div>
        </div>

        {/* RIGHT: Customization Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Image Upload Section */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#af101a]" />
                <h3 className="font-heading font-extrabold text-lg text-gray-900">
                  1. Upload Custom Image or Logo (上传图片)
                </h3>
              </div>
              {uploadedImage && (
                <button
                  onClick={() => setUploadedImage(null)}
                  className="text-xs text-red-600 hover:text-red-800 font-bold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Image</span>
                </button>
              )}
            </div>

            <p className="text-xs text-gray-500">
              Upload any personal artwork, clan emblem, pet picture, or anime icon to print onto the face of your 3D badge.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {uploadedImage ? (
              <div className="flex items-center gap-4 p-3 bg-red-50/50 border border-red-200 rounded-2xl">
                <div className="w-16 h-16 rounded-xl bg-white border border-gray-300 overflow-hidden shrink-0 shadow-xs">
                  <img src={uploadedImage} alt="Uploaded Badge Decal" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Custom image loaded &amp; mapped to 3D badge!</span>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-[#af101a] font-bold hover:underline"
                  >
                    Change to another image
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
                  Click to browse or drag and drop image
                </div>
                <div className="text-xs text-gray-400">
                  Supports PNG, JPG, WebP, SVG (Max 15MB)
                </div>
              </div>
            )}
          </div>

          {/* 2. Shape Selection */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#af101a]" />
              <h3 className="font-heading font-extrabold text-lg text-gray-900">
                2. Choose Badge Shape (选择形状)
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { id: 'circle', label: 'Circle 圆形', icon: '🔴' },
                { id: 'shield', label: 'Shield 盾牌', icon: '🛡️' },
                { id: 'hexagon', label: 'Hexagon 六角', icon: '🔷' },
                { id: 'square', label: 'Square 方圆角', icon: '⬛' },
                { id: 'chili', label: 'Chili 辣椒形', icon: '🌶️' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setShape(item.id as any)}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                    shape === item.id 
                      ? 'bg-red-50 border-[#af101a] text-[#af101a] shadow-xs ring-2 ring-[#af101a]/20' 
                      : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-xs font-bold">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Attachment Selection */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Pin className="w-5 h-5 text-[#af101a]" />
              <h3 className="font-heading font-extrabold text-lg text-gray-900">
                3. Attachment &amp; Backing (佩戴方式)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { 
                  id: 'pin', 
                  label: 'Safety Pin 胸针别针', 
                  desc: 'Wear on shirts, bags & jackets', 
                  priceExtra: 0,
                  icon: '📌' 
                },
                { 
                  id: 'magnet', 
                  label: 'Neodymium Magnet 强磁铁', 
                  desc: 'Fridge magnet & apparel clip', 
                  priceExtra: 1.50,
                  icon: '🧲' 
                },
                { 
                  id: 'keychain', 
                  label: 'Keyring Clip 钥匙扣', 
                  desc: 'Metal loop for keys & bags', 
                  priceExtra: 1.00,
                  icon: '🎒' 
                }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setAttachment(item.id as any)}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                    attachment === item.id 
                      ? 'bg-red-50 border-[#af101a] text-[#af101a] shadow-xs ring-2 ring-[#af101a]/20' 
                      : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-xs font-bold px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md">
                      {item.priceExtra === 0 ? 'FREE' : `+RM ${item.priceExtra.toFixed(2)}`}
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-extrabold">{item.label}</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">{item.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Embossed 3D Text */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Type className="w-5 h-5 text-[#af101a]" />
              <h3 className="font-heading font-extrabold text-lg text-gray-900">
                4. Embossed 3D Relief Text (浮雕文字)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Top Arch Text (顶部文字)
                </label>
                <input
                  type="text"
                  value={topText}
                  onChange={(e) => setTopText(e.target.value)}
                  placeholder="e.g. CABAI ENTERPRISE"
                  maxLength={24}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:bg-white focus:border-[#af101a] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Bottom Arch Text (底部文字)
                </label>
                <input
                  type="text"
                  value={bottomText}
                  onChange={(e) => setBottomText(e.target.value)}
                  placeholder="e.g. 3D MAKER STUDIO"
                  maxLength={24}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:bg-white focus:border-[#af101a] outline-hidden"
                />
              </div>
            </div>

            {!uploadedImage && (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Center Title / Initials (中心文字/首字母，若无上传图片)
                </label>
                <input
                  type="text"
                  value={centerText}
                  onChange={(e) => setCenterText(e.target.value)}
                  placeholder="Leave blank for 🌶️ chili icon, or type e.g. BOSS"
                  maxLength={10}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:bg-white focus:border-[#af101a] outline-hidden"
                />
              </div>
            )}
          </div>

          {/* 5. 3D Filament Colors */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-[#af101a]" />
              <h3 className="font-heading font-extrabold text-lg text-gray-900">
                5. Filament Colors (PLA 打印配色)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Base Plate Color */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Base Plate (底板色)</label>
                <div className="flex flex-wrap gap-2">
                  {DEFAULT_COLORS.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setBaseColor(c)}
                      title={c.name}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${
                        baseColor.name === c.name ? 'border-[#af101a] scale-110 shadow-sm' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>

              {/* Outer Rim Color */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Outer Rim (边框色)</label>
                <div className="flex flex-wrap gap-2">
                  {DEFAULT_COLORS.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setRimColor(c)}
                      title={c.name}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${
                        rimColor.name === c.name ? 'border-[#af101a] scale-110 shadow-sm' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>

              {/* Text Color */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Embossed Text (文字色)</label>
                <div className="flex flex-wrap gap-2">
                  {DEFAULT_COLORS.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setTextColor(c)}
                      title={c.name}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${
                        textColor.name === c.name ? 'border-[#af101a] scale-110 shadow-sm' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 6. Purchase Action Bar */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-gray-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 hover:bg-gray-200 text-gray-700"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 font-bold text-sm text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2.5 hover:bg-gray-200 text-gray-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div>
                <div className="text-xs text-gray-500 font-medium">Total Amount</div>
                <div className="font-heading font-black text-2xl text-[#af101a]">
                  RM {totalPrice.toFixed(2)}
                </div>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#af101a] to-[#8d0a12] hover:brightness-110 active:scale-98 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-red-900/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add Custom 3D Badge to Cart (RM {totalPrice.toFixed(2)})</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
