import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCategory, MaterialType } from '../types';
import { Filter, Star, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export const ShopView: React.FC = () => {
  const { 
    products, 
    activeCategory, 
    setActiveCategory, 
    openProductDetail, 
    addToCart 
  } = useApp();

  const [selectedMaterial, setSelectedMaterial] = useState<MaterialType | 'ALL'>('ALL');
  const [maxPrice, setMaxPrice] = useState<number>(50);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Filter logic
  let filtered = products.filter(p => {
    // Category check
    if (activeCategory !== 'all' && p.category !== activeCategory) {
      return false;
    }
    // Material check
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
    { id: 'all', label: 'All Products', icon: '🛍️' },
    { id: 'keychains', label: 'Cabai Keychains', icon: '🌶️' },
    { id: 'organizers', label: 'Desk Organizers', icon: '🐝' },
    { id: 'desk', label: 'Phone Stands', icon: '📱' },
    { id: 'home', label: 'Home & Decor', icon: '🪴' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Title */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1a1c1c]">
            3D Shop Catalog
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Browse our full range of 3D printed keychains, desk accessories, and custom maker creations.
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 shrink-0">
          <ArrowUpDown className="w-4 h-4 text-gray-500" />
          <span className="text-xs font-bold text-gray-600">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-gray-100 text-gray-800 text-xs font-bold rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#af101a]"
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
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeCategory === cat.id
                ? 'bg-[#af101a] text-white shadow-md shadow-red-900/20'
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

            {/* Material Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Filament Material
              </label>
              <div className="space-y-1.5 text-xs text-gray-600 font-medium">
                {['ALL', 'PLA', 'PETG', 'TPU'].map((mat) => (
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
                    <span>{mat === 'ALL' ? 'All Materials' : mat}</span>
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
                min="5"
                max="50"
                step="1"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#af101a]"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                <span>RM 5.00</span>
                <span>RM 50.00</span>
              </div>
            </div>

            {/* Reset Filters */}
            <button
              onClick={() => {
                setActiveCategory('all');
                setSelectedMaterial('ALL');
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
              <p className="text-xs text-gray-500">Try adjusting the material type or price range slider.</p>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setSelectedMaterial('ALL');
                  setMaxPrice(50);
                }}
                className="px-5 py-2 bg-[#af101a] text-white font-bold text-xs rounded-lg"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col group"
                >
                  {/* Thumbnail */}
                  <div
                    onClick={() => openProductDetail(product)}
                    className="relative h-56 bg-gray-100 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {product.isBestSeller && (
                      <span className="absolute top-3 left-3 bg-[#af101a] text-white text-[11px] font-extrabold px-2.5 py-1 rounded-md shadow-xs">
                        Best Seller 🌶️
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
                    <div className="pt-4 border-t border-gray-100 mt-4 flex items-center justify-between">
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

                      <button
                        onClick={() => addToCart(product)}
                        className="px-3.5 py-2 bg-[#1a1c1c] hover:bg-[#af101a] text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        + Add to Cart
                      </button>
                    </div>

                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
