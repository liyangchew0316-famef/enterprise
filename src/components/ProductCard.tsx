import React from 'react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { ProductImage } from './ProductImage';
import { Image as ImageIcon, Sparkles, Palette } from 'lucide-react';

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
  const isDrawable = product.tags?.includes('Drawable') || product.name.toLowerCase().includes('draw');
  const isBadge = product.category === 'badges' || product.id.includes('badge');
  const hasImage = Boolean(product.images && product.images.length > 0 && product.images[0]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#1A1A1A] transition-all duration-500 hover:border-white/20 hover:shadow-2xl flex flex-col justify-between"
    >
      {/* Top Image Section (Square aspect ratio) */}
      <div 
        className="relative aspect-square overflow-hidden bg-[#141414] cursor-pointer"
        onClick={() => onViewProduct(product)}
      >
        {hasImage ? (
          <ProductImage
            src={product.images[0]}
            productId={product.id}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white/20">
            <ImageIcon className="w-12 h-12 stroke-[1.5]" />
            <span className="text-xs mt-2 font-mono">Cabai 3D Print</span>
          </div>
        )}

        {/* Feature Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          <div className="flex items-center gap-1.5">
            {product.isBestSeller && (
              <span className="bg-[#af101a] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg shadow-md uppercase tracking-wider backdrop-blur-xs">
                Best Seller 🌶️
              </span>
            )}
            {isBadge && !product.isBestSeller && (
              <span className="bg-red-950/90 border border-red-500/40 text-red-200 text-[10px] font-bold px-2 py-0.5 rounded-lg backdrop-blur-xs">
                🧷 Custom Badge
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {isDrawable && (
              <span className="bg-purple-950/90 border border-purple-500/40 text-purple-200 text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 backdrop-blur-xs">
                <Palette className="w-3 h-3 text-purple-300" />
                <span>Draw Lab</span>
              </span>
            )}
            <span className="bg-black/70 text-white/80 text-[10px] font-medium px-2 py-0.5 rounded-md backdrop-blur-md border border-white/5">
              {product.specifications?.material || 'PLA+'}
            </span>
          </div>
        </div>

        {/* Desktop Hover Information Panel (Smooth bottom-up slide) */}
        <div
          className="
            hidden lg:block
            absolute
            inset-x-0
            bottom-0
            p-4 sm:p-5
            translate-y-4
            opacity-0
            transition-all
            duration-500
            ease-out
            group-hover:translate-y-0
            group-hover:opacity-100
            z-20
          "
          onClick={(e) => e.stopPropagation()}
        >
          <div className="rounded-xl bg-black/80 p-4 backdrop-blur-md border border-white/10 shadow-2xl">
            <h3 
              className="text-lg font-semibold text-white line-clamp-1 hover:text-white/90 transition-colors"
              title={product.name}
            >
              {product.name}
            </h3>

            {product.description && (
              <p className="mt-1 line-clamp-2 text-sm text-white/50 leading-snug">
                {product.description}
              </p>
            )}

            <div className="mt-4 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-white">
                  RM {Number(product.price).toFixed(2)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs text-white/40 line-through">
                    RM {Number(product.originalPrice).toFixed(2)}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => onViewProduct(product)}
                className="
                  rounded-lg
                  border
                  border-white/10
                  px-3
                  py-2
                  text-xs
                  font-medium
                  text-white
                  transition
                  hover:bg-white
                  hover:text-black
                  cursor-pointer
                "
              >
                View Product
              </button>
            </div>

            <button
              type="button"
              onClick={() => onAddToCart(product)}
              className="
                mt-3
                h-11
                w-full
                rounded-xl
                bg-white
                font-semibold
                text-black
                transition
                hover:bg-white/90
                active:scale-[0.98]
                cursor-pointer
                text-sm
                flex
                items-center
                justify-center
                gap-1.5
              "
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Information Panel (Always visible on touch/small screens) */}
      <div className="p-4 lg:hidden flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-white line-clamp-1">
            {product.name}
          </h3>

          {product.description && (
            <p className="mt-1 line-clamp-2 text-xs sm:text-sm text-white/50">
              {product.description}
            </p>
          )}
        </div>

        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-semibold text-white">
                RM {Number(product.price).toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-white/40 line-through">
                  RM {Number(product.originalPrice).toFixed(2)}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => onViewProduct(product)}
              className="
                rounded-lg
                border
                border-white/10
                px-3
                py-1.5
                text-xs
                font-medium
                text-white
                transition
                hover:bg-white
                hover:text-black
                cursor-pointer
              "
            >
              View Product
            </button>
          </div>

          <button
            type="button"
            onClick={() => onAddToCart(product)}
            className="
              h-10
              sm:h-11
              w-full
              rounded-xl
              bg-white
              font-semibold
              text-black
              transition
              hover:bg-white/90
              active:scale-[0.98]
              text-xs
              sm:text-sm
              cursor-pointer
              flex
              items-center
              justify-center
              gap-1.5
            "
          >
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
};
