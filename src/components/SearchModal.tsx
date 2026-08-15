import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductImage } from './ProductImage';
import { Search, X, Star, ArrowRight } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, products, openProductDetail } = useApp();
  const [query, setQuery] = useState('');

  if (!isSearchOpen) return null;

  const filteredProducts = query.trim() === '' ? [] : products.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.subtitle?.toLowerCase().includes(query.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(query.toLowerCase())) ||
    p.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 lg:p-20 bg-black/70 backdrop-blur-xs flex justify-center items-start animate-fadeIn">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Search Header Input */}
        <div className="p-4 border-b border-gray-200 flex items-center gap-3 bg-gray-50">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search keychains, desk organizers, phone stands, custom chili designs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 font-medium text-base focus:outline-hidden"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-300"
          >
            Esc
          </button>
        </div>

        {/* Quick Tag Suggestions */}
        <div className="p-4 bg-white border-b border-gray-100 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-gray-400 font-bold uppercase text-[10px] shrink-0">Popular Searches:</span>
          {['Cabai Keychain', 'Desk Organizer', 'Phone Stand', 'Custom Name', 'PLA+', 'PETG'].map(tag => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-2.5 py-1 bg-gray-100 hover:bg-red-50 hover:text-[#af101a] text-gray-700 rounded-full font-medium whitespace-nowrap transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-2">
          {query.trim() !== '' && filteredProducts.length === 0 && (
            <div className="text-center py-10 text-gray-500 text-sm">
              No matching 3D products found for "{query}". Try searching "Keychain" or "Organizer".
            </div>
          )}

          {query.trim() === '' && (
            <div className="text-center py-8 text-gray-400 text-xs">
              Type above to discover Cabai Enterprise 3D printed items.
            </div>
          )}

          {filteredProducts.map(product => (
            <div
              key={product.id}
              onClick={() => {
                setIsSearchOpen(false);
                openProductDetail(product);
              }}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-red-50/50 border border-transparent hover:border-red-100 cursor-pointer transition-all group"
            >
              <ProductImage
                src={product.images[0]}
                productId={product.id}
                alt={product.name}
                className="w-14 h-14 object-cover rounded-lg border border-gray-200 bg-gray-50 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-gray-900 truncate group-hover:text-[#af101a] transition-colors">
                    {product.name}
                  </h4>
                  {product.isBestSeller && (
                    <span className="text-[10px] font-bold bg-red-100 text-[#af101a] px-1.5 py-0.5 rounded">
                      Best Seller
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                  <span className="flex items-center gap-1 text-amber-500 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {product.rating}
                  </span>
                  <span>•</span>
                  <span>{product.specifications.material}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-heading font-extrabold text-sm text-[#af101a]">
                  RM {product.price.toFixed(2)}
                </div>
                <div className="text-[10px] text-gray-400 flex items-center gap-0.5 justify-end mt-1 group-hover:translate-x-1 transition-transform">
                  <span>View</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
