import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ProductImage } from '../components/ProductImage';
import { ChiliDrawCanvas } from '../components/ChiliDrawCanvas';
import { BadgeCustomizer } from '../components/BadgeCustomizer';
import { KeyboardCustomizer } from '../components/KeyboardCustomizer';
import { saveChiliDrawingToFirestore } from '../lib/firestoreService';
import { ColorOption, MaterialType } from '../types';
import { 
  Star, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowLeft, 
  Check, 
  ShieldCheck, 
  Truck, 
  Layers, 
  Sparkles,
  Palette,
  KeyRound,
  PenTool,
  Info,
  Brush,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const ProductDetailView: React.FC = () => {
  const { 
    selectedProduct, 
    products, 
    openProductDetail, 
    addToCart, 
    setCurrentView,
    setIsCartOpen,
    showToast
  } = useApp();

  if (!selectedProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">No product selected.</p>
        <button 
          onClick={() => setCurrentView('shop')}
          className="mt-4 px-4 py-2 bg-[#af101a] text-white font-bold rounded-lg"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  // If viewing Custom Badge Studio product
  if (selectedProduct.id === 'prod-badge-customize' || selectedProduct.category === 'badges') {
    return (
      <div className="space-y-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <button
            onClick={() => setCurrentView('shop')}
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-[#af101a] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to 3D Shop Catalog</span>
          </button>
        </div>
        <BadgeCustomizer />
      </div>
    );
  }

  // If viewing Keyboard Clicker product
  if (selectedProduct.id === 'prod-keyboard-clicker') {
    return (
      <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div>
          <button
            onClick={() => setCurrentView('shop')}
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-[#af101a] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to 3D Shop Catalog</span>
          </button>
        </div>
        <KeyboardCustomizer product={selectedProduct} />
      </div>
    );
  }

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ColorOption>(selectedProduct.colors[0] || { name: 'Chili Red', hex: '#af101a', bgClass: 'bg-[#af101a]' });
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialType>(selectedProduct.materials[0] || 'PLA');
  const [quantity, setQuantity] = useState(1);
  
  // Customization fields
  const [clickerKeys, setClickerKeys] = useState<number>(1);
  const [switchType, setSwitchType] = useState<string>('Clicky Blue');
  const [keycapLabels, setKeycapLabels] = useState<string[]>(['C', 'A', 'B', 'A', 'I']);
  const [activePressedKey, setActivePressedKey] = useState<number | null>(null);
  const [clickerWordInput, setClickerWordInput] = useState<string>('CABAI');
  const [nameTagText, setNameTagText] = useState<string>('CABAI');
  const [penInk, setPenInk] = useState<string>('Black Gel');
  const [customText, setCustomText] = useState<string>('');
  
  // Drawing Canvas State for Drawable Products
  const [customDrawingDataUrl, setCustomDrawingDataUrl] = useState<string | null>(null);
  const [isDrawingStudioOpen, setIsDrawingStudioOpen] = useState<boolean>(true);

  const isClicker = selectedProduct.id === 'prod-keyboard-clicker' || selectedProduct.name.toLowerCase().includes('clicker');
  const isNameTag = selectedProduct.id === 'prod-name-tag' || selectedProduct.name.toLowerCase().includes('name tag');
  const isDrawable = selectedProduct.tags.includes('Drawable') || selectedProduct.name.toLowerCase().includes('draw') || selectedProduct.id.includes('draw');
  const isPen = selectedProduct.id === 'prod-cabai-pen' || selectedProduct.name.toLowerCase().includes('pen');

  // Mechanical switch audio simulator
  const playMechanicalClick = (type: string) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (type.includes('Blue')) {
        // High pitched clicky sound
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(950, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      } else if (type.includes('Brown')) {
        // Tactile bump sound
        osc.type = 'sine';
        osc.frequency.setValueAtTime(500, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.035);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);
        osc.start();
        osc.stop(ctx.currentTime + 0.035);
      } else {
        // Linear smooth muted sound
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
        osc.start();
        osc.stop(ctx.currentTime + 0.03);
      }
    } catch (e) {}
  };

  const handleWordInputChange = (val: string) => {
    const upper = val.toUpperCase();
    setClickerWordInput(upper);
    const chars = upper.split('');
    const defaultDefaults = ['C', 'A', 'B', 'A', 'I'];
    const newLabels = [0, 1, 2, 3, 4].map((idx) => chars[idx] || defaultDefaults[idx] || (idx + 1).toString());
    setKeycapLabels(newLabels);
  };

  const handleKeycapLabelChange = (index: number, val: string) => {
    const upper = val.toUpperCase().slice(0, 4);
    const newLabels = [...keycapLabels];
    newLabels[index] = upper;
    setKeycapLabels(newLabels);
  };

  const handleKeycapPress = (index: number) => {
    setActivePressedKey(index);
    playMechanicalClick(switchType);
    setTimeout(() => {
      setActivePressedKey(null);
    }, 150);
  };

  // Dynamic unit price calculation
  const calculatedUnitPrice = useMemo(() => {
    if (isClicker) {
      // 1 to 5 keys @ RM5.00 each
      return clickerKeys * 5.00;
    }
    if (isNameTag) {
      // 1 letter RM0.50, min 5 letters
      const cleanLetters = nameTagText.replace(/\s+/g, '');
      const letterCount = Math.max(5, cleanLetters.length);
      return letterCount * 0.50;
    }
    return selectedProduct.price;
  }, [isClicker, clickerKeys, isNameTag, nameTagText, selectedProduct.price]);

  // Build custom details string for cart/order
  const computedCustomDetails = useMemo(() => {
    const parts: string[] = [];
    if (isClicker) {
      const activeKeys = keycapLabels.slice(0, clickerKeys).map((l, i) => l.trim() || `#${i+1}`);
      parts.push(`${clickerKeys}-Key Switch (${switchType}) [Keycaps: ${activeKeys.join('-')}]`);
    }
    if (isNameTag) {
      const cleanLetters = nameTagText.trim();
      parts.push(`Name Tag: "${cleanLetters || 'CABAI'}" (${cleanLetters.length} Letters)`);
    }
    if (isDrawable) {
      if (customDrawingDataUrl) {
        parts.push(`Custom Drawn Chili: Canvas Art Attached`);
      } else {
        parts.push(`Custom Drawable: Base Template Selected`);
      }
    }
    if (isPen) {
      parts.push(`Ink Core: ${penInk}`);
    }
    if (customText.trim()) {
      parts.push(`Personalization: "${customText.trim()}"`);
    }
    return parts.join(' | ');
  }, [isClicker, clickerKeys, switchType, keycapLabels, isNameTag, nameTagText, isDrawable, customDrawingDataUrl, isPen, penInk, customText]);

  const handleAddToCart = () => {
    if (isNameTag && nameTagText.trim().length < 5) {
      showToast('Name Tag requires a minimum of 5 letters (RM2.50 base).', 'warning');
      return;
    }
    addToCart(
      selectedProduct, 
      selectedColor, 
      selectedMaterial, 
      quantity, 
      computedCustomDetails || undefined,
      calculatedUnitPrice
    );
  };

  const handleBuyNow = () => {
    if (isNameTag && nameTagText.trim().length < 5) {
      showToast('Name Tag requires a minimum of 5 letters (RM2.50 base).', 'warning');
      return;
    }
    addToCart(
      selectedProduct, 
      selectedColor, 
      selectedMaterial, 
      quantity, 
      computedCustomDetails || undefined,
      calculatedUnitPrice
    );
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const relatedProducts = products
    .filter(p => p.id !== selectedProduct.id)
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 animate-fadeIn">
      
      {/* Back Button Breadcrumb */}
      <button
        onClick={() => setCurrentView('shop')}
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-[#af101a] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to 3D Shop Catalog</span>
      </button>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white p-6 sm:p-10 rounded-3xl border border-gray-200 shadow-xs">
        
        {/* Left Col: Image Gallery (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Main Large Image */}
          <div className="relative h-96 sm:h-[450px] bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 group">
            <ProductImage
              src={selectedProduct.images[activeImageIndex] || selectedProduct.images[0]}
              productId={selectedProduct.id}
              alt={selectedProduct.name}
              className="w-full h-full object-cover transition-all duration-300 group-hover:scale-102"
            />
            
            {selectedProduct.isBestSeller && (
              <span className="absolute top-4 left-4 bg-[#af101a] text-white text-xs font-extrabold px-3 py-1.5 rounded-lg shadow-sm">
                Best Seller 🌶️
              </span>
            )}

            {isDrawable && (
              <span className="absolute top-4 right-4 bg-purple-700 text-white text-xs font-extrabold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" />
                DIY Colorable
              </span>
            )}

            {/* Reference Image Badge on Image */}
            <div className="absolute bottom-3 left-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-black/65 backdrop-blur-md text-[10px] font-mono-code font-bold text-white/90 border border-white/15 shadow-sm">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Image for reference only</span>
              </span>
            </div>
          </div>

          {/* Reference Notice Bar */}
          <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[11px] font-mono-code text-gray-500 flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-[#af101a] shrink-0" />
            <span>Product renders &amp; photos are for reference. Physical print features precision 0.12mm layer texture.</span>
          </div>

          {/* Thumbnails */}
          {selectedProduct.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {selectedProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    activeImageIndex === idx ? 'border-[#af101a] ring-2 ring-red-200' : 'border-gray-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <ProductImage src={img} productId={selectedProduct.id} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Drawable Prompt Callout if applicable */}
          {isDrawable && (
            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 text-purple-900 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Palette className="w-4 h-4 text-purple-700" />
                <span>Want to design your own custom artwork?</span>
              </div>
              <p className="text-purple-800 leading-relaxed">
                This item features a smooth matte canvas designed for hand-drawn art, markers, or custom patterns. You can also design directly in our interactive 3D Drawing Lab!
              </p>
              <button
                onClick={() => {
                  setCurrentView('lab');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white font-extrabold rounded-lg transition-colors text-xs"
              >
                <span>Launch Custom Drawing Lab</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>

        {/* Right Col: Product Options & Actions (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          <div>
            <span className="text-xs font-extrabold text-[#af101a] uppercase tracking-wider block mb-1">
              {selectedProduct.subtitle || 'CABAI MAKER STUDIO'}
            </span>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1a1c1c]">
              {selectedProduct.name}
            </h1>

            {/* Ratings & Stock */}
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center text-amber-500 text-sm font-bold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
                <span>{selectedProduct.rating}</span>
                <span className="text-xs text-gray-400 ml-1">({selectedProduct.reviewsCount} verified reviews)</span>
              </div>
              <span className="text-gray-300">•</span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Ready to Print on Fleet
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-baseline gap-3">
            <span className="font-heading font-extrabold text-3xl text-[#af101a]">
              RM {calculatedUnitPrice.toFixed(2)}
            </span>
            {selectedProduct.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                RM {(selectedProduct.originalPrice * (isClicker ? clickerKeys : 1)).toFixed(2)}
              </span>
            )}
            <span className="text-xs text-gray-500 ml-auto font-medium">
              {isClicker && `(RM5.00 × ${clickerKeys} keys)`}
              {isNameTag && `(RM0.50 × ${Math.max(5, nameTagText.length)} letters)`}
              {!isClicker && !isNameTag && 'Direct Studio Price'}
            </span>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed">
            {selectedProduct.description}
          </p>

          {/* 1. KEYBOARD CLICKER CUSTOMIZATION */}
          {isClicker && (
            <div className="p-5 bg-gradient-to-br from-red-50/80 via-white to-red-50/50 rounded-2xl border-2 border-red-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-red-950 flex items-center gap-1.5 uppercase tracking-wider">
                  <KeyRound className="w-4 h-4 text-[#af101a]" />
                  <span>Choose Key Switch Count (RM5.00 / Key):</span>
                </label>
                <span className="font-mono font-bold text-xs text-[#af101a]">1 to 5 Keys</span>
              </div>

              {/* Key count buttons */}
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => {
                      setClickerKeys(k);
                    }}
                    className={`py-2.5 rounded-xl border font-bold text-xs text-center transition-all cursor-pointer ${
                      clickerKeys === k
                        ? 'border-[#af101a] bg-[#af101a] text-white shadow-md scale-102 ring-2 ring-red-300'
                        : 'border-red-200 bg-white text-gray-800 hover:border-red-300 hover:bg-red-50/50'
                    }`}
                  >
                    <div className="text-sm font-extrabold">{k} {k === 1 ? 'Key' : 'Keys'}</div>
                    <div className="text-[10px] opacity-90 mt-0.5">RM {k * 5}</div>
                  </button>
                ))}
              </div>

              {/* Mechanical Switch Type */}
              <div className="pt-1">
                <label className="text-xs font-bold text-red-900 block mb-1.5">
                  Mechanical Switch Feel &amp; Sound Profile:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Clicky Blue', desc: 'Satisfying Click 🎶' },
                    { id: 'Tactile Brown', desc: 'Subtle Bump 💥' },
                    { id: 'Linear Red', desc: 'Smooth & Quiet 🤫' }
                  ].map((sw) => (
                    <button
                      key={sw.id}
                      type="button"
                      onClick={() => {
                        setSwitchType(sw.id);
                        playMechanicalClick(sw.id);
                      }}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        switchType === sw.id
                          ? 'border-[#af101a] bg-red-100 text-[#af101a] ring-2 ring-red-200 shadow-xs'
                          : 'border-red-200 bg-white text-gray-700 hover:bg-red-50/40'
                      }`}
                    >
                      <strong className="block text-xs">{sw.id}</strong>
                      <span className="text-[10px] text-gray-500">{sw.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Keycap Text & Lettering */}
              <div className="pt-2 border-t border-red-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-gray-900 flex items-center gap-1.5 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-[#af101a]" />
                    <span>Custom Text on Keycaps:</span>
                  </label>
                  <span className="text-[11px] text-gray-500 font-medium">Type name or letters for each key</span>
                </div>

                {/* Quick Word/Name Input */}
                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">
                    Quick Word / Name (Auto-spreads to keycaps):
                  </label>
                  <input
                    type="text"
                    maxLength={clickerKeys}
                    placeholder={`Type ${clickerKeys} letters (e.g. ${['C', 'CA', 'CAB', 'CABA', 'CABAI'][clickerKeys - 1]})`}
                    value={clickerWordInput.slice(0, clickerKeys)}
                    onChange={(e) => handleWordInputChange(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-red-300 rounded-xl font-mono font-bold text-sm tracking-widest text-gray-900 focus:outline-hidden focus:border-[#af101a] focus:ring-1 focus:ring-red-400 uppercase"
                  />
                </div>

                {/* Individual Keycap Input Fields */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-600 block">
                    Individual Keycap Legends:
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {[0, 1, 2, 3, 4].slice(0, clickerKeys).map((idx) => (
                      <div key={idx} className="text-center space-y-1">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">Key #{idx + 1}</span>
                        <input
                          type="text"
                          maxLength={3}
                          value={keycapLabels[idx] || ''}
                          onChange={(e) => handleKeycapLabelChange(idx, e.target.value)}
                          placeholder={(idx + 1).toString()}
                          className="w-full text-center py-2 bg-white border border-red-300 rounded-lg font-mono font-extrabold text-sm text-[#af101a] focus:outline-hidden focus:border-[#af101a] focus:ring-1 focus:ring-red-400 uppercase"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interactive 3D Keycap Visual Preview */}
                <div className="p-4 bg-gray-900 rounded-2xl border border-gray-800 text-center space-y-3 shadow-inner">
                  <div className="flex items-center justify-between text-[11px] text-gray-400">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Live 3D Keycap Visualizer
                    </span>
                    <span className="text-gray-400 text-[10px]">Click keycaps to test mechanical click!</span>
                  </div>

                  {/* Switch Base & Keycaps */}
                  <div className="flex items-center justify-center gap-3 p-3 bg-gray-950/80 rounded-xl border border-gray-800 shadow-inner">
                    {[0, 1, 2, 3, 4].slice(0, clickerKeys).map((idx) => {
                      const label = keycapLabels[idx] || (idx + 1).toString();
                      const isPressed = activePressedKey === idx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleKeycapPress(idx)}
                          className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-xl font-mono font-extrabold text-base transition-all duration-75 select-none cursor-pointer ${
                            isPressed 
                              ? 'translate-y-1 shadow-xs ring-2 ring-red-400' 
                              : 'shadow-lg hover:-translate-y-0.5'
                          }`}
                          style={{
                            backgroundColor: selectedColor.hex,
                            color: ['#1C1C1C', '#000000', '#2E1A47', '#1E3A8A', '#065F46', '#831843'].includes(selectedColor.hex) ? '#FFFFFF' : '#1a1c1c',
                            boxShadow: isPressed 
                              ? 'inset 0 2px 4px rgba(0,0,0,0.5)' 
                              : '0 6px 0 rgba(0,0,0,0.35), 0 8px 10px rgba(0,0,0,0.3)',
                            borderTop: '2px solid rgba(255,255,255,0.4)',
                            borderBottom: '2px solid rgba(0,0,0,0.4)'
                          }}
                          title={`Click to press Key #${idx + 1} (${label})`}
                        >
                          <span className="text-[9px] font-bold opacity-60 absolute top-1 left-1.5">#{idx + 1}</span>
                          <span className="text-base tracking-wider drop-shadow-xs font-black">{label}</span>
                          <span className="text-[8px] font-semibold opacity-70 absolute bottom-1">
                            {switchType.split(' ')[0]}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="text-[11px] text-gray-300 flex items-center justify-center gap-2">
                    <span>Filament: <strong className="text-white">{selectedColor.name}</strong></span>
                    <span>•</span>
                    <span>Material: <strong className="text-white">{selectedMaterial}</strong></span>
                    <span>•</span>
                    <span>Switch: <strong className="text-amber-300">{switchType}</strong></span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* 2. NAME TAG CUSTOMIZATION */}
          {isNameTag && (
            <div className="p-5 bg-amber-50/80 rounded-2xl border-2 border-amber-300 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-amber-950 flex items-center gap-1.5 uppercase tracking-wider">
                  <PenTool className="w-4 h-4 text-amber-700" />
                  <span>Custom Embossed Letters (1 Letter = RM0.50):</span>
                </label>
                <span className="text-[11px] font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md">
                  Min 5 Letters = RM2.50
                </span>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  maxLength={18}
                  placeholder="Type your name (e.g. CABAI, ADAM, SARAH)"
                  value={nameTagText}
                  onChange={(e) => setNameTagText(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 bg-white border-2 border-amber-300 rounded-xl font-mono font-bold text-base tracking-widest text-gray-900 focus:outline-hidden focus:border-[#af101a] focus:ring-1 focus:ring-red-400"
                />
                
                <div className="flex justify-between text-xs text-amber-900 font-semibold px-1">
                  <span>
                    Letter count: <strong>{nameTagText.trim().length}</strong> {nameTagText.trim().length < 5 ? '(Min 5 required)' : ''}
                  </span>
                  <span>Price: <strong className="text-[#af101a] text-sm">RM {calculatedUnitPrice.toFixed(2)}</strong></span>
                </div>
              </div>

              {/* 3D Embossed Name Tag Plate Preview */}
              <div className="p-4 bg-gray-900 rounded-2xl border border-gray-800 text-center space-y-3">
                <div className="flex items-center justify-between text-[11px] text-gray-400">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    3D Printed Nameplate Live Preview
                  </span>
                  <span className="text-amber-400 text-[10px]">Embossed Dual-Layer Relief</span>
                </div>

                <div 
                  className="p-4 rounded-xl border border-gray-700 shadow-xl flex items-center justify-center gap-3 min-h-[70px] relative overflow-hidden"
                  style={{
                    backgroundColor: selectedColor.hex,
                    color: ['#1C1C1C', '#000000', '#2E1A47', '#1E3A8A', '#065F46', '#831843'].includes(selectedColor.hex) ? '#FFFFFF' : '#1a1c1c',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.4), inset 0 2px 3px rgba(255,255,255,0.3)'
                  }}
                >
                  {/* Keychain Ring Hole Indicator */}
                  <div className="w-5 h-5 rounded-full bg-gray-900 border-2 border-gray-700 shrink-0 shadow-inner flex items-center justify-center text-[8px] text-gray-500">
                    ⭕
                  </div>

                  <div className="font-mono font-black text-xl sm:text-2xl tracking-widest uppercase drop-shadow-md truncate">
                    {nameTagText.trim() || 'YOUR NAME'}
                  </div>

                  <div className="text-[10px] font-extrabold uppercase opacity-75 ml-auto border border-current px-2 py-0.5 rounded">
                    {selectedMaterial}
                  </div>
                </div>

                <p className="text-[11px] text-gray-400">
                  Precision 3D printed with raised 1.2mm relief lettering in <strong className="text-white">{selectedColor.name}</strong> ({selectedMaterial}).
                </p>
              </div>
            </div>
          )}

          {/* 3. PEN REFILL OPTION */}
          {isPen && (
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2.5">
              <label className="text-xs font-extrabold text-gray-800 uppercase tracking-wider block">
                Ballpoint Ink Core Choice (0.5mm):
              </label>
              <div className="flex gap-2.5">
                {['Black Gel', 'Blue Ink', 'Red Ink'].map((ink) => (
                  <button
                    key={ink}
                    type="button"
                    onClick={() => setPenInk(ink)}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                      penInk === ink
                        ? 'border-[#af101a] bg-red-50 text-[#af101a] ring-2 ring-red-200 font-extrabold'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {ink}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 4. DRAW CUSTOM CHILI CANVAS STUDIO (FOR DRAWABLE PRODUCTS) */}
          {isDrawable && (
            <div className="p-5 bg-gradient-to-br from-purple-50 via-indigo-50/40 to-pink-50 rounded-2xl border-2 border-purple-300 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-700 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    🎨
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-sm text-purple-950">
                      Interactive 3D Chili Drawing Studio
                    </h3>
                    <p className="text-[11px] text-purple-700 font-medium">
                      Draw, color, add expressions &amp; stamps directly on the chili canvas
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDrawingStudioOpen(!isDrawingStudioOpen)}
                  className="px-3 py-1.5 bg-white text-purple-800 border border-purple-200 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-purple-50"
                >
                  <span>{isDrawingStudioOpen ? 'Hide Studio' : 'Open Drawing Studio'}</span>
                  {isDrawingStudioOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {isDrawingStudioOpen ? (
                <div className="pt-2">
                  <ChiliDrawCanvas
                    onCanvasChange={(dataUrl) => {
                      setCustomDrawingDataUrl(dataUrl);
                    }}
                    onSaveToFirebase={async (designData) => {
                      try {
                        const success = await saveChiliDrawingToFirestore({
                          id: `draw-${Date.now()}`,
                          title: designData.title || selectedProduct.name,
                          creatorName: designData.creatorName || 'Maker Member',
                          imageData: designData.imageData,
                          baseChiliTemplate: designData.baseTemplate || 'signature',
                          material: selectedMaterial,
                          colorName: selectedColor.name,
                          colorHex: selectedColor.hex,
                          scalePercent: 100,
                          infillPercent: 20,
                          specialInstructions: customText,
                          estimatedPrice: calculatedUnitPrice,
                          createdAt: new Date().toISOString()
                        });
                        if (success) {
                          showToast('Custom chili design synchronized with 3D printer! 🌶️', 'success');
                          return true;
                        }
                      } catch (e) {
                        console.error(e);
                      }
                      return false;
                    }}
                  />
                </div>
              ) : (
                <div className="p-3 bg-white rounded-xl border border-purple-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {customDrawingDataUrl ? (
                      <img 
                        src={customDrawingDataUrl} 
                        alt="Your chili drawing" 
                        className="w-12 h-12 object-contain bg-gray-50 rounded-lg border border-purple-200 p-0.5"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center text-xl">
                        🌶️
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-bold text-gray-800">
                        {customDrawingDataUrl ? '✅ Custom Drawing Attached!' : 'Standard Chili Template'}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        {customDrawingDataUrl ? 'Your drawing is saved and will be 3D printed.' : 'Click to customize your chili design.'}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsDrawingStudioOpen(true)}
                    className="px-3 py-1.5 bg-purple-700 text-white rounded-lg text-xs font-bold hover:bg-purple-800"
                  >
                    Edit Drawing
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 5. GENERAL PERSONALIZATION / CUSTOM NOTE (FOR ALL PRODUCTS) */}
          {!isNameTag && (
            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5">
              <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#af101a]" />
                <span>Custom Name / Maker Engraving Request (Optional):</span>
              </label>
              <input
                type="text"
                maxLength={40}
                placeholder="e.g. Engrave name 'Alex' on back or special instructions"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-900 focus:outline-hidden focus:border-[#af101a]"
              />
            </div>
          )}

          {/* Color Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
              3D Print Color: <strong className="text-[#af101a]">{selectedColor.name}</strong>
            </label>
            <div className="flex flex-wrap gap-2.5">
              {selectedProduct.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                    selectedColor.name === color.name
                      ? 'border-[#af101a] bg-red-50 text-[#af101a] ring-2 ring-red-200'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span 
                    className="w-3.5 h-3.5 rounded-full border border-gray-400 shrink-0" 
                    style={{ backgroundColor: color.hex }}
                  />
                  <span>{color.name}</span>
                  {selectedColor.name === color.name && <Check className="w-3.5 h-3.5 text-[#af101a]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Material Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
              Filament Material
            </label>
            <div className="flex gap-3">
              {selectedProduct.materials.map((mat) => (
                <button
                  key={mat}
                  onClick={() => setSelectedMaterial(mat)}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold border text-center transition-all ${
                    selectedMaterial === mat
                      ? 'border-[#af101a] bg-[#af101a] text-white shadow-xs'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-extrabold">{mat}</div>
                  <div className="text-[10px] opacity-80 mt-0.5">
                    {mat === 'PLA' ? 'Rigid PLA+' : mat === 'PETG' ? 'Tough PETG' : 'Flexible TPU'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100 text-gray-600 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-gray-100 text-gray-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-gray-400 font-medium">
                Total: RM {(calculatedUnitPrice * quantity).toFixed(2)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                className="py-3.5 px-6 bg-[#1a1c1c] hover:bg-[#af101a] text-white font-extrabold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="py-3.5 px-6 bg-[#af101a] hover:bg-[#8d0a12] text-white font-extrabold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <span>Buy Now (Checkout)</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Specifications Sheet Table */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-4">
        <h2 className="font-heading font-extrabold text-lg text-[#1a1c1c] uppercase tracking-wider border-b border-gray-100 pb-3">
          3D Printing Specifications &amp; Craftsmanship
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs text-gray-700">
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <span className="text-gray-400 font-bold block mb-1">Filament Material</span>
            <strong className="text-gray-900 text-sm">{selectedProduct.specifications.material}</strong>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <span className="text-gray-400 font-bold block mb-1">Part Dimensions</span>
            <strong className="text-gray-900 text-sm">{selectedProduct.specifications.dimensions}</strong>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <span className="text-gray-400 font-bold block mb-1">Print Layer Height</span>
            <strong className="text-gray-900 text-sm">{selectedProduct.specifications.layerHeight}</strong>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <span className="text-gray-400 font-bold block mb-1">Estimated Machine Print Time</span>
            <strong className="text-gray-900 text-sm">{selectedProduct.specifications.printTime}</strong>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <span className="text-gray-400 font-bold block mb-1">Weight</span>
            <strong className="text-gray-900 text-sm">{selectedProduct.specifications.weight}</strong>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <span className="text-gray-400 font-bold block mb-1">Manufacturing Studio</span>
            <strong className="text-gray-900 text-sm">Cabai Enterprise (Penang &amp; Bukit Mertajam)</strong>
          </div>
        </div>
      </div>

    </div>
  );
};
