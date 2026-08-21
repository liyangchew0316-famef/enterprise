import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductImage } from '../components/ProductImage';
import { ProductCategory, MaterialType } from '../types';
import { Filter, Star, SlidersHorizontal, ArrowUpDown, Palette, Sparkles, PenTool, ArrowRight } from 'lucide-react';

export const ShopView: React.FC = () => {
  const { 
    products, 
    activeCategory, 
    setActiveCategory, 
    openProductDetail, 
    addToCart,
    setCurrentView
  } = useApp();

  const [selectedMaterial, setSelectedMaterial] = useState<MaterialType | 'ALL'>('ALL');
  const [onlyDrawable, setOnlyDrawable] = useState<boolean>(false);
  const [keychainFilter, setKeychainFilter] = useState<'ALL' | 'CUSTOM' | 'READY'>('ALL');
  const [maxPrice, setMaxPrice] = useState<number>(50);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Filter logic
  let filtered = products.filter(p => {
    // Only drawable filter toggle
    if (onlyDrawable && !p.tags.includes('Drawable') && !p.name.toLowerCase().includes('draw')) {
      return false;
    }
    // Category check
    if (activeCategory === 'custom') {
      if (!p.tags.includes('Drawable') && !p.tags.includes('Customizable') && p.category !== 'custom') return false;
    } else if (activeCategory === 'badges') {
      if (p.category !== 'badges' && !p.id.includes('badge')) return false;
    } else if (activeCategory !== 'all' && p.category !== activeCategory) {
      return false;
    }
    // Keychain custom vs ready filter
    if (activeCategory === 'keychains' && keychainFilter !== 'ALL') {
      if (keychainFilter === 'CUSTOM' && !p.tags.includes('Customizable') && !p.tags.includes('Drawable')) {
        return false;
      }
      if (keychainFilter === 'READY' && (p.tags.includes('Customizable') || p.tags.includes('Drawable'))) {
        return false;
      }
    }
    // Material check (all PLA)
    if (selectedMaterial !== 'ALL' && !p.materials.includes(selectedMaterial as MaterialType)) {
      return false;
    }
    // Price check
    if (p.price > maxPrice) {
      return false;
    }
    return true;
  });

  // Sort logic
  if (sortBy === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  const categories: { id: ProductCategory; label: string; icon: string }[] = [
    { id: 'all', label: 'All Products (全部产品)', icon: '🛍️' },
    { id: 'badges', label: 'Safety Namebadges 🧷 (RM5)', icon: '🛡️' },
    { id: 'custom', label: 'Custom & DIY 🎨 (RM5)', icon: '🎨' },
    { id: 'keychains', label: 'Keychains (钥匙扣系列)', icon: '🌶️' },
    { id: 'organizers', label: 'Desk & Stationery', icon: '🐝' },
    { id: 'desk', label: 'Phone Stands', icon: '📱' },
    { id: 'home', label: 'Home & Magnets', icon: '🪴' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Page Title & Sort Row */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-[#af101a] border border-red-200 rounded-full text-xs font-black uppercase tracking-wider mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Eco PLA+ 3D Studio Catalog</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-[#1a1c1c]">
            All 3D Printed Products
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Explore our complete collection of custom namebadges, interactive DIY chili canvases, keychains, and desk accessories.
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 shrink-0">
          <ArrowUpDown className="w-4 h-4 text-gray-500" />
          <span className="text-xs font-bold text-gray-600">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-gray-100 text-gray-800 text-xs font-bold rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#af101a] cursor-pointer"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id);
              if (cat.id === 'custom') setOnlyDrawable(true);
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeCategory === cat.id
                ? 'bg-[#af101a] text-white shadow-md shadow-red-900/20 ring-2 ring-red-300'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Main Layout: Sidebar Filters + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-6">
            
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <SlidersHorizontal className="w-4 h-4 text-[#af101a]" />
              <h3 className="font-heading font-bold text-sm text-[#1a1c1c] uppercase tracking-wider">
                Filter Catalog
              </h3>
            </div>

            {/* Keychain Filter Switch if in Keychains Category */}
            {activeCategory === 'keychains' && (
              <div className="p-3 bg-red-50 rounded-xl border border-red-200 space-y-2">
                <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                  <span>Keychain Style Type</span>
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: 'ALL', label: 'All' },
                    { id: 'CUSTOM', label: '🎨 Custom' },
                    { id: 'READY', label: '⚡ Ready' }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setKeychainFilter(f.id as any)}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-extrabold cursor-pointer transition-all ${
                        keychainFilter === f.id
                          ? 'bg-[#af101a] text-white shadow-xs'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Drawable Toggle */}
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 space-y-2">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyDrawable}
                  onChange={(e) => setOnlyDrawable(e.target.checked)}
                  className="w-4 h-4 accent-purple-700 rounded cursor-pointer"
                />
                <span className="text-xs font-bold text-purple-950 flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5 text-purple-700" />
                  Only Drawable Products
                </span>
              </label>
              <p className="text-[11px] text-purple-700">
                Products you can draw &amp; customize on canvas!
              </p>
            </div>

            {/* Daily Spin Wheel Callout */}
            <div 
              onClick={() => setCurrentView('daily_spin')}
              className="p-4 bg-gradient-to-br from-amber-500 via-red-600 to-purple-700 rounded-2xl text-white shadow-md cursor-pointer hover:scale-102 transition-transform space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider bg-black/30 px-2 py-0.5 rounded-full">
                  Daily Lucky Wheel
                </span>
                <span className="text-xl">🎡</span>
              </div>
              <div className="font-heading font-black text-sm text-white">
                Daily Spin &amp; Win!
              </div>
              <p className="text-[11px] text-white/90 leading-tight">
                Spin once every day for a chance to win up to 20% OFF or RM5 OFF promo codes!
              </p>
              <div className="pt-1">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-white text-gray-900 font-extrabold text-[11px] rounded-lg shadow-xs">
                  <span>Spin Wheel Now</span>
                  <ArrowRight className="w-3 h-3 text-[#af101a]" />
                </span>
              </div>
            </div>

            {/* Material Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Filament Material
              </label>
              <div className="space-y-1.5 text-xs text-gray-600 font-medium">
                {['ALL', 'PLA'].map((mat) => (
                  <label 
                    key={mat} 
                    className="flex items-center gap-2.5 p-1.5 rounded hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="material"
                      checked={selectedMaterial === mat}
                      onChange={() => setSelectedMaterial(mat as any)}
                      className="accent-[#af101a]"
                    />
                    <span>{mat === 'ALL' ? 'All (100% PLA)' : 'Pure PLA Filament'}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <div className="flex justify-between text-xs font-bold text-gray-700">
                <span>Max Price:</span>
                <span className="text-[#af101a]">RM {maxPrice.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="2.5"
                max="50"
                step="0.5"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#af101a]"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                <span>RM 2.50</span>
                <span>RM 50.00</span>
              </div>
            </div>

            {/* Reset Filters */}
            <button
              onClick={() => {
                setActiveCategory('all');
                setSelectedMaterial('ALL');
                setOnlyDrawable(false);
                setMaxPrice(50);
              }}
              className="w-full py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-lg hover:bg-gray-200 transition-colors"
            >
              Reset All Filters
            </button>

          </div>
        </div>

        {/* Right Products Grid */}
        <div className="lg:col-span-3">
          {filtered.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center space-y-4">
              <div className="text-4xl">🔍</div>
              <h3 className="font-heading font-bold text-lg text-gray-800">No products match your filters</h3>
              <p className="text-xs text-gray-500">Try resetting filters to see our full PLA catalog.</p>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setSelectedMaterial('ALL');
                  setOnlyDrawable(false);
                  setMaxPrice(50);
                }}
                className="px-5 py-2 bg-[#af101a] text-white font-bold text-xs rounded-lg"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((product) => {
                const isProductDrawable = product.tags.includes('Drawable') || product.name.toLowerCase().includes('draw') || product.id.includes('draw');
                const isBadge = product.category === 'badges' || product.id.includes('badge');
                const isClicker = product.id === 'prod-keyboard-clicker';
                const isCustomKeyring = product.tags.includes('Customizable') && !isProductDrawable && !isBadge && !isClicker;

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col group"
                  >
                    {/* Thumbnail */}
                    <div
                      onClick={() => openProductDetail(product)}
                      className="relative h-56 bg-gray-100 overflow-hidden cursor-pointer"
                    >
                      <ProductImage
                        src={product.images[0]}
                        productId={product.id}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {product.isBestSeller && (
                        <span className="absolute top-3 left-3 bg-[#af101a] text-white text-[11px] font-extrabold px-2.5 py-1 rounded-md shadow-xs">
                          Best Seller 🌶️
                        </span>
                      )}

                      {isBadge && (
                        <span className="absolute top-3 right-3 bg-red-900 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1 border border-red-400/40">
                          <span>🧷 12+ Templates</span>
                        </span>
                      )}

                      {isProductDrawable && (
                        <span className="absolute top-3 right-3 bg-purple-700 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1">
                          <Palette className="w-3 h-3" />
                          <span>Draw Canvas 🎨</span>
                        </span>
                      )}

                      {isClicker && (
                        <span className="absolute top-3 right-3 bg-amber-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1">
                          <span>⌨️ Custom Keys</span>
                        </span>
                      )}

                      <span className="absolute bottom-3 right-3 bg-black/70 text-white text-[10px] font-medium px-2 py-0.5 rounded backdrop-blur-xs">
                        {product.specifications.material}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-xs font-semibold text-gray-500 mb-1">
                          {product.subtitle}
                        </div>
                        <h3
                          onClick={() => openProductDetail(product)}
                          className="font-heading font-bold text-base text-[#1a1c1c] hover:text-[#af101a] cursor-pointer transition-colors line-clamp-1"
                        >
                          {product.name}
                        </h3>

                        {/* Color Palette Indicators */}
                        <div className="flex items-center gap-1.5 mt-2">
                          {product.colors.map(color => (
                            <span
                              key={color.name}
                              title={color.name}
                              className="w-3 h-3 rounded-full border border-gray-300 inline-block"
                              style={{ backgroundColor: color.hex }}
                            />
                          ))}
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center text-amber-500 text-xs font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                            {product.rating}
                          </div>
                          <span className="text-xs text-gray-400">({product.reviewsCount})</span>
                        </div>
                      </div>

                      {/* Footer price & action */}
                      <div className="pt-4 border-t border-gray-100 mt-4 flex items-center justify-between gap-2">
                        <div>
                          <span className="font-heading font-extrabold text-lg text-[#af101a]">
                            RM {product.price.toFixed(2)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-gray-400 line-through ml-1.5">
                              RM {product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {isBadge ? (
                            <button
                              onClick={() => openProductDetail(product)}
                              className="px-3.5 py-2 bg-[#af101a] hover:bg-[#8d0a12] text-white text-xs font-extrabold rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                              <span>🧷</span>
                              <span>Customize Badge</span>
                            </button>
                          ) : isProductDrawable ? (
                            <button
                              onClick={() => openProductDetail(product)}
                              className="px-3.5 py-2 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white text-xs font-extrabold rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                              <Palette className="w-3.5 h-3.5" />
                              <span>Draw Chili 🌶️</span>
                            </button>
                          ) : isClicker ? (
                            <button
                              onClick={() => openProductDetail(product)}
                              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                              <span>⌨️ Customize</span>
                            </button>
                          ) : isCustomKeyring ? (
                            <button
                              onClick={() => openProductDetail(product)}
                              className="px-3.5 py-2 bg-[#1a1c1c] hover:bg-[#af101a] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                            >
                              <span>✨ Customize</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => addToCart(product)}
                              className="px-3.5 py-2 bg-[#1a1c1c] hover:bg-[#af101a] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                            >
                              + Add to Cart
                            </button>
                          )}
                        </div>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Natural SEO Information Section */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs space-y-4">
        <h2 className="font-heading font-bold text-lg sm:text-xl text-gray-900">
          3D Printed Products in Malaysia — Quality, Variety & Customization
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-600 leading-relaxed">
          <div>
            <p className="mb-2">
              At <strong>Cabai Enterprise</strong>, our shop catalog is engineered for makers, professionals, and 3D printing enthusiasts across Malaysia. From signature <strong>Cabai 3D keychains</strong> and articulated fidget toys to modular desk organizers and custom badge nameplates, every product is manufactured in-house using high-tensile, eco-friendly PLA.
            </p>
            <p>
              Looking for custom sizing, corporate gift branding, or specific colorways? Our <strong>custom 3D printing studio in Penang & Bukit Mertajam</strong> accommodates bulk orders and one-off bespoke creations with rapid 24–48 hour turnaround.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm mb-2">Featured Product Categories:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li><strong className="text-gray-800">3D Printed Keychains:</strong> Studio-signature chili peppers, couples sets, kawaii anime charms, and DIY drawable surfaces.</li>
              <li><strong className="text-gray-800">Custom 3D Badges:</strong> Upload company logos, personalized artwork, or embossed text with pin or neodymium magnetic backings.</li>
              <li><strong className="text-gray-800">Desk & Tech Accessories:</strong> Honeycomb pen holders, SD card organizers, cable winders, and ergonomic phone stands.</li>
              <li><strong className="text-gray-800">3D Printed Toys & Fidgets:</strong> Mechanical switch clickers, flexi dragons, and interactive art pieces.</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
};
