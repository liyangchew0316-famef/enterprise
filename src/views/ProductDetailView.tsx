import React, { useState } from 'react';
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
  Sparkles 
} from 'lucide-react';

export const ProductDetailView: React.FC = () => {
  const { 
    selectedProduct, 
    products, 
    openProductDetail, 
    addToCart, 
    setCurrentView,
    setIsCartOpen
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
  const [customText, setCustomText] = useState('');

  const handleAddToCart = () => {
    addToCart(selectedProduct, selectedColor, selectedMaterial, quantity, customText.trim() || undefined);
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, selectedColor, selectedMaterial, quantity, customText.trim() || undefined);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const relatedProducts = products
    .filter(p => p.id !== selectedProduct.id && p.category === selectedProduct.category)
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
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
        
        {/* Left Col: Image Gallery (5 cols) */}
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
                <span className="text-xs text-gray-400 ml-1">({selectedProduct.reviewsCount} customer reviews)</span>
              </div>
              <span className="text-gray-300">•</span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                In Stock & Ready to Print
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-baseline gap-3">
            <span className="font-heading font-extrabold text-3xl text-[#af101a]">
              RM {selectedProduct.price.toFixed(2)}
            </span>
            {selectedProduct.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                RM {selectedProduct.originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-xs text-gray-500 ml-auto font-medium">
              SST Included • Made to order in Subang Jaya
            </span>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed">
            {selectedProduct.description}
          </p>

          {/* Color Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
              Color Variant: <strong className="text-[#af101a]">{selectedColor.name}</strong>
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
              Filament Material Choice
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
                    {mat === 'PLA' ? 'Rigid PLA+' : mat === 'PETG' ? 'Durable PETG' : 'Flexible TPU'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Engraving Text Input if requested */}
          {selectedProduct.category === 'keychains' && (
            <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200 space-y-1.5">
              <label className="text-xs font-bold text-amber-900 block">
                Custom Text / Name Engraving (Optional)
              </label>
              <input
                type="text"
                maxLength={12}
                placeholder="e.g. AHMAD (max 12 chars)"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-amber-300 rounded-lg focus:outline-hidden focus:border-[#af101a] font-mono"
              />
            </div>
          )}

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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                className="py-3.5 px-6 bg-[#1a1c1c] hover:bg-[#af101a] text-white font-extrabold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
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
            <strong className="text-gray-900 text-sm">3D Printed Layer Lines Present</strong>
          </div>
        </div>

        <p className="text-[11px] text-gray-400 pt-2">
          *Note: All items are created layer-by-layer on precision CoreXY 3D printers. Subtle micro layer lines are a natural characteristic of authentic 3D printed crafts.
        </p>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-4">
          <h3 className="font-heading font-extrabold text-xl text-[#1a1c1c]">
            You Might Also Like
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map(p => (
              <div
                key={p.id}
                onClick={() => openProductDetail(p)}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group p-4 flex gap-4 items-center"
              >
                <ProductImage src={p.images[0]} productId={p.id} alt={p.name} className="w-20 h-20 object-cover rounded-xl bg-gray-50 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-gray-900 group-hover:text-[#af101a] transition-colors line-clamp-1">
                    {p.name}
                  </h4>
                  <div className="text-xs text-gray-500 mt-0.5">{p.specifications.material}</div>
                  <div className="font-heading font-extrabold text-sm text-[#af101a] mt-1">
                    RM {p.price.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
