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
    <div className="fixed inset-0 z-[100] overflow-y-auto p-4 sm:p-6 lg:p-20 bg-black/80 backdrop-blur-sm flex justify-center items-start animate-fadeIn font-sans">
      <div className="w-full max-w-2xl bg-[#111113] rounded-2xl shadow-2xl overflow-hidden border border-white/10 text-white">
        
        {/* Search Header Input */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-[#18181B]">
          <Search className="w-5 h-5 text-[#FF4D5A] shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search keychains, desk organizers, phone stands, custom chili designs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder:text-white/30 font-medium text-sm sm:text-base focus:outline-hidden"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 text-white/40 hover:text-white rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="px-2.5 py-1 bg-white/10 text-white/70 text-xs font-mono-code font-bold rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
          >
            Esc
          </button>
        </div>

        {/* Quick Tag Suggestions */}
        <div className="p-3.5 bg-[#18181B]/50 border-b border-white/10 flex items-center gap-2 overflow-x-auto text-xs font-mono-code">
          <span className="text-white/40 font-bold uppercase text-[10px] shrink-0">Popular:</span>
          {['Cabai Keychain', 'Desk Organizer', 'Phone Stand', 'Custom Name', 'PLA+', 'PETG'].map(tag => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-2.5 py-1 bg-[#18181B] hover:bg-[#AF101A] hover:text-white text-white/70 rounded-full text-xs whitespace-nowrap transition-colors border border-white/10 cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-2">
          {query.trim() !== '' && filteredProducts.length === 0 && (
            <div className="text-center py-10 text-white/50 text-sm font-mono-code">
              No matching 3D products found for "{query}". Try searching "Keychain" or "Organizer".
            </div>
          )}

          {query.trim() === '' && (
            <div className="text-center py-8 text-white/40 text-xs font-mono-code">
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
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#18181B] border border-white/5 hover:border-white/15 cursor-pointer transition-all group"
            >
              <ProductImage
                src={product.images[0]}
                productId={product.id}
                alt={product.name}
                className="w-14 h-14 object-cover rounded-lg border border-white/10 bg-[#18181B] shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-heading font-bold text-sm text-white truncate group-hover:text-[#FF4D5A] transition-colors">
                    {product.name}
                  </h4>
                  {product.isBestSeller && (
                    <span className="text-[10px] font-mono-code font-bold bg-red-950/80 text-[#FF4D5A] border border-red-800/80 px-1.5 py-0.5 rounded">
                      Best Seller
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-white/50 font-mono-code mt-1">
                  <span className="flex items-center gap-1 text-amber-400 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {product.rating}
                  </span>
                  <span>•</span>
                  <span>{product.specifications.material}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-mono-code font-extrabold text-sm text-[#FF4D5A]">
                  RM {product.price.toFixed(2)}
                </div>
                <div className="text-[10px] text-white/40 font-mono-code flex items-center gap-0.5 justify-end mt-1 group-hover:translate-x-1 group-hover:text-white transition-all">
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
