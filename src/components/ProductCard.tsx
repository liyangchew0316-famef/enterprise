import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { ProductImage } from './ProductImage';
import { 
  Image as ImageIcon, 
  Palette, 
  Eye, 
  ShoppingCart, 
  Check, 
  X, 
  Info, 
  Layers,
  Clock,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onViewProduct
}) => {
  const [showMobileDetails, setShowMobileDetails] = useState<boolean>(false);
  const [justAdded, setJustAdded] = useState<boolean>(false);

  const isDrawable = product.tags?.includes('Drawable') || product.name.toLowerCase().includes('draw');
  const isBadge = product.category === 'badges' || product.id.includes('badge');
  const hasImage = Boolean(product.images && product.images.length > 0 && product.images[0]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
    }, 1500);
  };

  const handleToggleDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMobileDetails((prev) => !prev);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#111113] transition-all duration-300 hover:border-red-600/40 hover:shadow-2xl hover:shadow-red-950/20 hover:-translate-y-1 flex flex-col justify-between"
    >
      {/* Top Image & Interactive Details Container (Strict Square aspect ratio) */}
      <div 
        className="relative aspect-square w-full overflow-hidden bg-[#18181B] cursor-pointer select-none"
        onClick={() => setShowMobileDetails((prev) => !prev)}
        title="Tap or hover to view description & specifications"
      >
        {hasImage ? (
          <ProductImage
            src={product.images[0]}
            productId={product.id}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-104"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white/30">
            <ImageIcon className="w-10 h-10 stroke-[1.5]" />
            <span className="text-[10px] mt-2 font-mono-code">CABAI 3D STUDIO</span>
          </div>
        )}

        {/* Feature Badges Fixed Row (Top Layer) */}
        <div className="absolute top-2.5 left-2.5 right-2.5 h-6 flex items-center justify-between pointer-events-none z-10">
          <div className="flex items-center gap-1.5 overflow-hidden">
            {product.isBestSeller && (
              <span className="bg-[#af101a] text-white text-[9px] sm:text-[10px] font-mono-code font-bold px-2 py-0.5 rounded-full shadow-md uppercase tracking-wider whitespace-nowrap">
                Flagship 🌶️
              </span>
            )}
            {isBadge && !product.isBestSeller && (
              <span className="bg-white/20 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-mono-code font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                Badge
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {isDrawable && (
              <span className="bg-purple-900/90 text-white text-[9px] sm:text-[10px] font-mono-code font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs whitespace-nowrap">
                <Palette className="w-2.5 h-2.5" />
                <span>Draw</span>
              </span>
            )}
            <span className="bg-black/80 text-white text-[9px] sm:text-[10px] font-mono-code font-bold px-2 py-0.5 rounded-full backdrop-blur-md border border-white/15 shadow-2xs whitespace-nowrap">
              {product.specifications?.material || 'PLA+'}
            </span>

            {/* Mobile Info Tap Toggle Button */}
            <button
              type="button"
              onClick={handleToggleDetails}
              className={`lg:hidden pointer-events-auto p-1 rounded-md backdrop-blur-md transition-all shadow-md active:scale-95 ${
                showMobileDetails 
                  ? 'bg-[#af101a] text-white ring-2 ring-white/40' 
                  : 'bg-black/70 text-white hover:bg-black border border-white/20'
              }`}
              title={showMobileDetails ? 'Hide description' : 'Tap to show description'}
            >
              {showMobileDetails ? <X className="w-3.5 h-3.5" /> : <Info className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Discrete Reference Image Disclaimer Tag (Always visible on image unless full details overlay is active) */}
        {!showMobileDetails && (
          <div className="absolute bottom-2 left-2.5 z-10 pointer-events-none group-hover:opacity-0 transition-opacity duration-200">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[9px] font-mono-code font-medium text-white/80 border border-white/10 shadow-xs">
              <Sparkles className="w-2.5 h-2.5 text-amber-300" />
              <span>Image for reference</span>
            </span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* DESKTOP HOVER & MOBILE TAP DETAILS OVERLAY PANEL */}
        {/* ========================================================================= */}
        <div
          className={`
            absolute
            inset-x-0
            bottom-0
            top-0
            p-3.5
            z-20
            flex
            flex-col
            justify-between
            transition-all
            duration-300
            ease-out
            bg-black/85
            backdrop-blur-md
            ${
              showMobileDetails 
                ? 'opacity-100 pointer-events-auto' 
                : 'opacity-0 pointer-events-none lg:group-hover:opacity-100 lg:group-hover:pointer-events-auto'
            }
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top of overlay: Title & Reference Notice */}
          <div className="flex items-start justify-between gap-2 border-b border-white/15 pb-2.5">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#af101a]" />
                <span className="text-[10px] text-amber-300 font-mono-code font-bold uppercase tracking-wider">
                  Product Details
                </span>
              </div>
              <h3 
                className="font-heading font-extrabold text-sm text-white truncate"
                title={product.name}
              >
                {product.name}
              </h3>
            </div>

            {/* Close button on mobile/touch */}
            <button
              type="button"
              onClick={() => setShowMobileDetails(false)}
              className="p-1 rounded-md bg-white/15 hover:bg-white/25 text-white transition-colors shrink-0 cursor-pointer"
              title="Close description overlay"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Description Section */}
          <div className="my-auto py-2 overflow-y-auto max-h-[130px] space-y-2 pr-1">
            <p className="text-xs text-white/90 leading-relaxed font-sans">
              {product.description || 'Precision 3D printed with authentic layer texture and durable structure.'}
            </p>

            {/* Reference notice inside description overlay */}
            <div className="flex items-center gap-1 text-[10px] text-white/60 font-mono-code pt-1 border-t border-white/10">
              <HelpCircle className="w-3 h-3 text-amber-400 shrink-0" />
              <span>Image shown for design reference</span>
            </div>
          </div>

          {/* Bottom Specs & Action Buttons */}
          <div className="border-t border-white/15 pt-2.5 space-y-2">
            {/* Quick 3D Printing Specs */}
            <div className="flex flex-wrap items-center gap-1.5">
              {product.specifications?.dimensions && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-mono-code text-white/90">
                  <Layers className="w-3 h-3 text-[#FF4D5A]" />
                  <span>{product.specifications.dimensions}</span>
                </span>
              )}
              {product.specifications?.printTime && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-mono-code text-white/90">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>{product.specifications.printTime}</span>
                </span>
              )}
            </div>

            {/* Price & Action Buttons */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-extrabold text-white font-mono-code">
                  RM {Number(product.price).toFixed(2)}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onViewProduct(product)}
                  className="rounded-lg bg-white/15 hover:bg-white/25 border border-white/20 px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                  title="Inspect Full 3D Options"
                >
                  <Eye className="w-3.5 h-3.5 text-[#FF4D5A]" />
                  <span>Inspect</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`
                    px-3
                    py-1.5
                    rounded-lg
                    font-extrabold
                    transition-all
                    active:scale-95
                    cursor-pointer
                    text-[11px]
                    uppercase
                    tracking-wider
                    flex
                    items-center
                    gap-1
                    shadow-sm
                    ${
                      justAdded 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-[#af101a] text-white hover:bg-[#8e0c15]'
                    }
                  `}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Added</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Static Information Footer on Card */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-[#111113]">
        <div 
          className="cursor-pointer"
          onClick={() => onViewProduct(product)}
        >
          <div className="flex items-center justify-between text-[10px] text-white/50 uppercase font-mono-code font-bold">
            <span>{product.category}</span>
            <span className="text-white/40">• 0.12mm PLA</span>
          </div>
          
          <h3 className="font-heading font-extrabold text-sm sm:text-base text-white line-clamp-1 mt-1 group-hover:text-[#FF4D5A] transition-colors">
            {product.name}
          </h3>
        </div>

        <div className="pt-2.5 border-t border-white/10 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono-code font-black text-base sm:text-lg text-white">
              RM {Number(product.price).toFixed(2)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="font-mono-code text-[11px] text-white/40 line-through">
                RM {Number(product.originalPrice).toFixed(2)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className={`
              px-3.5
              py-2
              rounded-xl
              text-xs
              font-bold
              uppercase
              tracking-wider
              transition-all
              cursor-pointer
              flex
              items-center
              gap-1.5
              shadow-xs
              active:scale-[0.97]
              ${
                justAdded 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-[#1C1C20] hover:bg-[#AF101A] text-white border border-white/10 hover:border-[#AF101A]'
              }
            `}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};



