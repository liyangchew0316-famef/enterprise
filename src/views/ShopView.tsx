import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductImage } from '../components/ProductImage';
import { ProductCard } from '../components/ProductCard';
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
      <div className="bg-white/90 p-6 rounded-3xl border border-black/8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-[#af101a] border border-red-200/80 rounded-full text-xs font-mono-code font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Eco PLA+ 3D Studio Catalog</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#18181b]">
            All 3D Printed Products
          </h1>
          <p className="text-[#18181b]/65 text-xs sm:text-sm">
            Explore our complete collection of custom namebadges, interactive DIY chili canvases, keychains, and desk accessories.
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 shrink-0">
          <ArrowUpDown className="w-4 h-4 text-[#18181b]/50" />
          <span className="text-xs font-mono-code font-bold text-[#18181b]/70 uppercase">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="px-3.5 py-2 bg-[#f8f7f4] text-[#18181b] text-xs font-mono-code font-bold rounded-xl border border-black/10 focus:outline-hidden focus:border-[#af101a] cursor-pointer"
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
            className={`px-4 py-2.5 rounded-xl text-xs font-mono-code font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98] ${
              activeCategory === cat.id
                ? 'bg-[#af101a] text-white shadow-sm ring-2 ring-[#af101a]/30'
                : 'bg-white text-[#18181b]/80 hover:bg-black/5 border border-black/8'
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
          <div className="bg-white/90 p-5 rounded-2xl border border-black/8 shadow-xs space-y-6">
            
            <div className="flex items-center gap-2 pb-3 border-b border-black/6">
              <SlidersHorizontal className="w-4 h-4 text-[#af101a]" />
              <h3 className="font-heading font-extrabold text-sm text-[#18181b] uppercase tracking-wider">
                Filter Catalog
              </h3>
            </div>

            {/* Keychain Filter Switch if in Keychains Category */}
            {activeCategory === 'keychains' && (
              <div className="p-3 bg-red-50/70 rounded-xl border border-red-200/80 space-y-2">
                <label className="text-xs font-mono-code font-bold text-[#18181b] flex items-center gap-1.5">
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
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-mono-code font-bold cursor-pointer transition-all active:scale-95 ${
                        keychainFilter === f.id
                          ? 'bg-[#af101a] text-white shadow-xs'
                          : 'bg-white text-[#18181b]/80 hover:bg-black/5 border border-black/8'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Drawable Toggle */}
            <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-200/80 space-y-2">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyDrawable}
                  onChange={(e) => setOnlyDrawable(e.target.checked)}
                  className="w-4 h-4 accent-purple-700 rounded cursor-pointer"
                />
                <span className="text-xs font-mono-code font-bold text-purple-950 flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5 text-purple-700" />
                  Only Drawable Products
                </span>
              </label>
              <p className="text-[11px] text-purple-700/90 leading-relaxed">
                Products you can draw &amp; customize on canvas!
              </p>
            </div>

            {/* Daily Spin Wheel Callout */}
            <div 
              onClick={() => setCurrentView('daily_spin')}
              className="p-4 bg-gradient-to-br from-amber-500 via-red-600 to-purple-700 rounded-2xl text-white shadow-md cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider bg-black/30 px-2 py-0.5 rounded-full">
                  Daily Lucky Wheel
                </span>
                <span className="text-xl">🎡</span>
              </div>
              <div className="font-heading font-extrabold text-sm text-white">
                Daily Spin &amp; Win!
              </div>
              <p className="text-[11px] text-white/90 leading-tight">
                Spin once every day for a chance to win up to 20% OFF or RM5 OFF promo codes!
              </p>
              <div className="pt-1">
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-white text-[#18181b] font-mono-code font-bold text-[11px] rounded-xl shadow-xs">
                  <span>Spin Wheel Now</span>
                  <ArrowRight className="w-3 h-3 text-[#af101a]" />
                </span>
              </div>
            </div>

            {/* Material Filter */}
            <div className="space-y-2">
              <label className="text-xs font-mono-code font-bold text-[#18181b]/70 uppercase tracking-wider block">
                Filament Material
              </label>
              <div className="space-y-1.5 text-xs text-[#18181b]/80 font-medium">
                {['ALL', 'PLA'].map((mat) => (
                  <label 
                    key={mat} 
                    className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-black/5 cursor-pointer"
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
            <div className="space-y-2 pt-2 border-t border-black/6">
              <div className="flex justify-between text-xs font-mono-code font-bold text-[#18181b]/80">
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
              <div className="flex justify-between text-[10px] text-[#18181b]/40 font-mono-code">
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
              className="w-full py-2.5 bg-[#f8f7f4] hover:bg-black/5 text-[#18181b] font-mono-code font-bold text-xs rounded-xl border border-black/8 transition-colors cursor-pointer active:scale-[0.98]"
            >
              Reset All Filters
            </button>

          </div>
        </div>

        {/* Right Products Grid */}
        <div className="lg:col-span-3">
          {filtered.length === 0 ? (
            <div className="bg-white/90 p-12 rounded-2xl border border-black/8 text-center space-y-4">
              <div className="text-4xl">🔍</div>
              <h3 className="font-heading font-extrabold text-lg text-[#18181b]">No products match your filters</h3>
              <p className="text-xs text-[#18181b]/60">Try resetting filters to see our full PLA catalog.</p>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setSelectedMaterial('ALL');
                  setOnlyDrawable(false);
                  setMaxPrice(50);
                }}
                className="px-5 py-2.5 bg-[#af101a] text-white font-mono-code font-bold text-xs rounded-xl cursor-pointer active:scale-[0.98]"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  onViewProduct={openProductDetail}
                />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Natural SEO Information Section */}
      <div className="bg-white/90 p-6 sm:p-8 rounded-3xl border border-black/8 shadow-xs space-y-4">
        <h2 className="font-heading font-extrabold text-lg sm:text-xl text-[#18181b]">
          3D Printed Products in Malaysia — Quality, Variety & Customization
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#18181b]/70 leading-relaxed font-sans">
          <div>
            <p className="mb-2">
              At <strong>Cabai Enterprise</strong>, our shop catalog is engineered for makers, professionals, and 3D printing enthusiasts across Malaysia. From signature <strong>Cabai 3D keychains</strong> and articulated fidget toys to modular desk organizers and custom badge nameplates, every product is manufactured in-house using high-tensile, eco-friendly PLA.
            </p>
            <p>
              Looking for custom sizing, corporate gift branding, or specific colorways? Our <strong>custom 3D printing studio in Penang & Bukit Mertajam</strong> accommodates bulk orders and one-off bespoke creations with rapid 24–48 hour turnaround.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-bold text-[#18181b] text-sm mb-2">Featured Product Categories:</h3>
            <ul className="list-disc list-inside space-y-1 text-[#18181b]/70">
              <li><strong className="text-[#18181b]">3D Printed Keychains:</strong> Studio-signature chili peppers, couples sets, kawaii anime charms, and DIY drawable surfaces.</li>
              <li><strong className="text-[#18181b]">Custom 3D Badges:</strong> Upload company logos, personalized artwork, or embossed text with pin or neodymium magnetic backings.</li>
              <li><strong className="text-[#18181b]">Desk & Tech Accessories:</strong> Honeycomb pen holders, SD card organizers, cable winders, and ergonomic phone stands.</li>
              <li><strong className="text-[#18181b]">3D Printed Toys & Fidgets:</strong> Mechanical switch clickers, flexi dragons, and interactive art pieces.</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
};
