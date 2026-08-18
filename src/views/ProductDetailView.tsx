import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ProductImage } from '../components/ProductImage';
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
  Info
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

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ColorOption>(selectedProduct.colors[0]);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialType>(selectedProduct.materials[0] || 'PLA');
  const [quantity, setQuantity] = useState(1);
  
  // Customization fields
  const [clickerKeys, setClickerKeys] = useState<number>(1);
  const [switchType, setSwitchType] = useState<string>('Clicky Blue');
  const [nameTagText, setNameTagText] = useState<string>('CABAI');
  const [penInk, setPenInk] = useState<string>('Black Gel');
  const [customText, setCustomText] = useState<string>('');

  const isClicker = selectedProduct.id === 'prod-keyboard-clicker' || selectedProduct.name.toLowerCase().includes('clicker');
  const isNameTag = selectedProduct.id === 'prod-name-tag' || selectedProduct.name.toLowerCase().includes('name tag');
  const isDrawable = selectedProduct.name.toLowerCase().includes('drawable');
  const isPen = selectedProduct.id === 'prod-cabai-pen' || selectedProduct.name.toLowerCase().includes('pen');

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
      parts.push(`${clickerKeys}-Key Switch (${switchType})`);
    }
    if (isNameTag) {
      const cleanLetters = nameTagText.trim();
      parts.push(`Name: "${cleanLetters || 'CABAI'}" (${cleanLetters.length} Letters)`);
    }
    if (isPen) {
      parts.push(`Ink Core: ${penInk}`);
    }
    if (customText.trim()) {
      parts.push(`Note: "${customText.trim()}"`);
    }
    return parts.join(' | ');
  }, [isClicker, clickerKeys, switchType, isNameTag, nameTagText, isPen, penInk, customText]);

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
          <div className="relative h-96 sm:h-[450px] bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
            <ProductImage
              src={selectedProduct.images[activeImageIndex] || selectedProduct.images[0]}
              productId={selectedProduct.id}
              alt={selectedProduct.name}
              className="w-full h-full object-cover transition-all duration-300"
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
            <div className="p-4 bg-red-50/60 rounded-2xl border border-red-200 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-red-950 flex items-center gap-1.5 uppercase tracking-wider">
                  <KeyRound className="w-4 h-4 text-[#af101a]" />
                  <span>Choose Key Switch Count (RM5.00 / Key):</span>
                </label>
                <span className="font-mono font-bold text-xs text-[#af101a]">Max 5 Keys</span>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setClickerKeys(k)}
                    className={`py-2.5 rounded-xl border font-bold text-xs text-center transition-all ${
                      clickerKeys === k
                        ? 'border-[#af101a] bg-[#af101a] text-white shadow-xs scale-102'
                        : 'border-red-200 bg-white text-gray-800 hover:border-red-300'
                    }`}
                  >
                    <div className="text-sm font-extrabold">{k} {k === 1 ? 'Key' : 'Keys'}</div>
                    <div className="text-[10px] opacity-90 mt-0.5">RM {k * 5}</div>
                  </button>
                ))}
              </div>

              {/* Mechanical Switch Type */}
              <div className="pt-2">
                <label className="text-xs font-bold text-red-900 block mb-1.5">
                  Mechanical Switch Feel & Sound:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Clicky Blue', desc: 'Satisfying Click' },
                    { id: 'Tactile Brown', desc: 'Subtle Bump' },
                    { id: 'Linear Red', desc: 'Smooth & Quiet' }
                  ].map((sw) => (
                    <button
                      key={sw.id}
                      type="button"
                      onClick={() => setSwitchType(sw.id)}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        switchType === sw.id
                          ? 'border-[#af101a] bg-red-100/70 text-[#af101a] ring-2 ring-red-200'
                          : 'border-red-200 bg-white text-gray-700 hover:bg-red-50/40'
                      }`}
                    >
                      <strong className="block text-xs">{sw.id}</strong>
                      <span className="text-[10px] text-gray-500">{sw.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. NAME TAG CUSTOMIZATION */}
          {isNameTag && (
            <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-amber-950 flex items-center gap-1.5 uppercase tracking-wider">
                  <PenTool className="w-4 h-4 text-amber-700" />
                  <span>Custom Embossed Letters (1 Letter = RM0.50):</span>
                </label>
                <span className="text-[11px] font-bold text-amber-800">Min 5 Letters = RM2.50</span>
              </div>

              <div className="space-y-1.5">
                <input
                  type="text"
                  maxLength={16}
                  placeholder="Enter custom name (e.g. CABAI, ADAM, SARAH)"
                  value={nameTagText}
                  onChange={(e) => setNameTagText(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 bg-white border border-amber-300 rounded-xl font-mono font-bold text-sm tracking-wider text-gray-900 focus:outline-hidden focus:border-[#af101a]"
                />
                <div className="flex justify-between text-[11px] text-amber-800 font-medium">
                  <span>
                    Letter count: <strong>{nameTagText.trim().length}</strong> {nameTagText.trim().length < 5 ? '(Requires min 5)' : ''}
                  </span>
                  <span>Calculated: <strong>RM {calculatedUnitPrice.toFixed(2)}</strong></span>
                </div>
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
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold text-center transition-all ${
                      penInk === ink
                        ? 'border-[#af101a] bg-red-50 text-[#af101a] ring-2 ring-red-200'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {ink}
                  </button>
                ))}
              </div>
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
        <h3 className="font-heading font-extrabold text-lg text-[#1a1c1c] uppercase tracking-wider border-b border-gray-100 pb-3">
          3D Printing Specifications
        </h3>

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
            <span className="text-gray-400 font-bold block mb-1">Manufacturing Note</span>
            <strong className="text-gray-900 text-sm">Precision FDM Bambu Lab CoreXY</strong>
          </div>
        </div>
      </div>

    </div>
  );
};
