import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { ArrowLeft, ArrowRight, Sparkles, Tag, Eye } from 'lucide-react';
import { imageConfig } from '../config/assets';

interface HeroProductItem extends Product {
  bg: string;
  panel: string;
  displayImg: string;
}

const DEFAULT_HERO_COLORS = [
  { bg: '#8D0A12', panel: '#A51821' }, // Spicy Red (Signature Cabai)
  { bg: '#1E2836', panel: '#2A3749' }, // Studio Slate (Keyboard Clicker)
  { bg: '#581C87', panel: '#6B21A8' }, // Deep Purple (Draw Custom Chili)
  { bg: '#134E39', panel: '#186349' }, // Maker Emerald (Custom Badge)
];

const GRAIN_DATA_URI =
  "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E";

export const HeroCarousel: React.FC = () => {
  const { products, openProductDetail, setCurrentView } = useApp();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 640;
    }
    return false;
  });

  // Track window resize to adjust scale/coordinates for mobile vs desktop
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Assemble the 4 featured products from existing Cabai product catalog
  const heroProducts: HeroProductItem[] = useMemo(() => {
    if (!products || products.length === 0) {
      return [];
    }

    // Pick 4 featured products (or duplicate gracefully if fewer than 4)
    const selected: Product[] = [];
    
    // Try to find specific iconic Cabai items first
    const signature = products.find(p => p.id === 'prod-cabai-keychain') || products[0];
    const clicker = products.find(p => p.id === 'prod-keyboard-clicker') || products[1] || signature;
    const drawable = products.find(p => p.id === 'prod-draw-custom-chili') || products[2] || signature;
    const badge = products.find(p => p.id === 'prod-badge-customize') || products[3] || clicker;

    selected.push(signature, clicker, drawable, badge);

    // Fallback: fill to at least 4 items
    while (selected.length < 4) {
      selected.push(products[selected.length % products.length]);
    }

    return selected.slice(0, 4).map((p, idx) => {
      const colorScheme = DEFAULT_HERO_COLORS[idx % DEFAULT_HERO_COLORS.length];
      const img = (p.images && p.images.length > 0 && p.images[0])
        ? p.images[0]
        : imageConfig.logos.fallback;

      return {
        ...p,
        bg: colorScheme.bg,
        panel: colorScheme.panel,
        displayImg: img,
      };
    });
  }, [products]);

  // Preload all 4 hero images on mount
  useEffect(() => {
    if (heroProducts.length > 0) {
      heroProducts.forEach((item) => {
        if (item.displayImg) {
          const img = new Image();
          img.src = item.displayImg;
        }
      });
    }
  }, [heroProducts]);

  // Carousel navigation handlers
  const navigate = useCallback((direction: 'next' | 'prev') => {
    if (isAnimating || heroProducts.length === 0) return;

    setIsAnimating(true);
    if (direction === 'next') {
      setActiveIndex((prev) => (prev + 1) % heroProducts.length);
    } else {
      setActiveIndex((prev) => (prev + heroProducts.length - 1) % heroProducts.length);
    }

    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 650);

    return () => clearTimeout(timer);
  }, [isAnimating, heroProducts.length]);

  if (heroProducts.length === 0) {
    return null;
  }

  const activeProduct = heroProducts[activeIndex];

  // Helper to compute styles for each item based on its role relative to activeIndex
  const getItemStyle = (index: number) => {
    const total = heroProducts.length;
    // Roles:
    // center: activeIndex
    // right: (activeIndex + 1) % total
    // back: (activeIndex + 2) % total
    // left: (activeIndex + 3) % total
    const roleOffset = (index - activeIndex + total) % total;

    if (roleOffset === 0) {
      // CENTER PRODUCT
      return {
        left: '50%',
        bottom: isMobile ? '20%' : '0%',
        height: isMobile ? '60%' : '92%',
        transform: isMobile ? 'translateX(-50%) scale(1.25)' : 'translateX(-50%) scale(1.68)',
        filter: 'blur(0px)',
        opacity: 1,
        zIndex: 20,
        pointerEvents: 'auto' as const,
      };
    } else if (roleOffset === 1) {
      // RIGHT PRODUCT
      return {
        left: isMobile ? '80%' : '70%',
        bottom: isMobile ? '32%' : '12%',
        height: isMobile ? '16%' : '28%',
        transform: 'translateX(-50%) scale(1)',
        filter: 'blur(2px)',
        opacity: 0.85,
        zIndex: 10,
        pointerEvents: 'auto' as const,
      };
    } else if (roleOffset === 2) {
      // BACK PRODUCT
      return {
        left: '50%',
        bottom: isMobile ? '32%' : '12%',
        height: isMobile ? '13%' : '22%',
        transform: 'translateX(-50%) scale(1)',
        filter: 'blur(4px)',
        opacity: 0.7,
        zIndex: 5,
        pointerEvents: 'none' as const,
      };
    } else {
      // LEFT PRODUCT (roleOffset === 3)
      return {
        left: isMobile ? '20%' : '30%',
        bottom: isMobile ? '32%' : '12%',
        height: isMobile ? '16%' : '28%',
        transform: 'translateX(-50%) scale(1)',
        filter: 'blur(2px)',
        opacity: 0.85,
        zIndex: 10,
        pointerEvents: 'auto' as const,
      };
    }
  };

  const handleProductClick = (product: HeroProductItem, index: number) => {
    if (isAnimating) return;
    if (index === activeIndex) {
      openProductDetail(product);
    } else {
      // If clicking left or right side item, navigate directly to it
      const total = heroProducts.length;
      const roleOffset = (index - activeIndex + total) % total;
      if (roleOffset === 1) {
        navigate('next');
      } else if (roleOffset === 3) {
        navigate('prev');
      }
    }
  };

  return (
    <div className="relative w-full overflow-hidden select-none">
      {/* Dynamic Background Container with 650ms smooth color transition */}
      <div
        className="relative w-full h-screen min-h-[640px] max-h-[1080px] overflow-hidden transition-colors duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ backgroundColor: activeProduct.bg }}
      >
        {/* Subtle Grain Texture Overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-[50] opacity-40"
          style={{
            backgroundImage: `url("${GRAIN_DATA_URI}")`,
            backgroundSize: '200px 200px',
            backgroundRepeat: 'repeat',
          }}
        />

        {/* Brand Label (Top-Left) */}
        <div
          id="cabai-hero-brand-label"
          className="absolute top-6 left-4 sm:left-8 z-[60] text-xs font-semibold uppercase text-white tracking-[0.18em] opacity-90 flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span>CABAI ENTERPRISE</span>
        </div>

        {/* Studio Craft Tag (Top-Right) */}
        <div className="absolute top-6 right-4 sm:right-8 z-[60] hidden sm:flex items-center gap-3 text-xs font-medium text-white/80">
          <span className="px-2.5 py-1 rounded-full bg-black/20 border border-white/10 backdrop-blur-xs uppercase tracking-widest text-[10px]">
            0.12mm Ultra Precision
          </span>
          <span className="px-2.5 py-1 rounded-full bg-black/20 border border-white/10 backdrop-blur-xs uppercase tracking-widest text-[10px]">
            Penang, Malaysia 🇲🇾
          </span>
        </div>

        {/* Giant Ghost Typography (CABAI) */}
        <div
          id="cabai-hero-ghost-typography"
          className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none z-[2]"
          style={{ top: '18%' }}
        >
          <span
            className="text-white font-[900] leading-none whitespace-nowrap tracking-[-0.02em] opacity-100"
            style={{
              fontFamily: 'Anton, sans-serif',
              fontSize: 'clamp(90px, 28vw, 380px)',
              textShadow: '0 20px 80px rgba(0, 0, 0, 0.35)',
            }}
          >
            CABAI
          </span>
        </div>

        {/* Absolute Product Carousel */}
        <div className="absolute inset-0 z-[3] pointer-events-none">
          {heroProducts.map((product, idx) => {
            const style = getItemStyle(idx);
            const isCenter = idx === activeIndex;

            return (
              <div
                key={product.id}
                onClick={() => handleProductClick(product, idx)}
                className={`absolute cursor-pointer transition-all duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform will-change-filter will-change-opacity`}
                style={{
                  ...style,
                  aspectRatio: '0.6 / 1',
                  transition:
                    'transform 650ms cubic-bezier(0.4, 0, 0.2, 1), filter 650ms cubic-bezier(0.4, 0, 0.2, 1), opacity 650ms cubic-bezier(0.4, 0, 0.2, 1), left 650ms cubic-bezier(0.4, 0, 0.2, 1), bottom 650ms cubic-bezier(0.4, 0, 0.2, 1), height 650ms cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                title={isCenter ? `View ${product.name}` : `Switch to ${product.name}`}
              >
                <img
                  src={product.displayImg}
                  alt={product.name}
                  draggable={false}
                  className="w-full h-full object-contain object-bottom select-none pointer-events-none drop-shadow-[0_25px_35px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:scale-[1.03]"
                />
              </div>
            );
          })}
        </div>

        {/* Subtle Translucent Product Badge / Info Panel */}
        <div
          className="absolute top-20 left-4 sm:top-24 sm:left-8 z-[60] max-w-xs transition-all duration-[650ms] ease-out"
        >
          <div
            className="p-3.5 sm:p-4 rounded-2xl backdrop-blur-md border border-white/20 shadow-xl text-white transition-colors duration-[650ms]"
            style={{ backgroundColor: `${activeProduct.panel}CC` }}
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-white/90 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300 animate-spin" />
                <span>Featured 3D Creation</span>
              </span>
              <span className="text-xs sm:text-sm font-black text-white bg-black/30 px-2 py-0.5 rounded-md backdrop-blur-xs">
                RM {Number(activeProduct.price).toFixed(2)}
              </span>
            </div>

            <h3 className="font-heading font-extrabold text-sm sm:text-base text-white line-clamp-1">
              {activeProduct.name}
            </h3>

            <p className="text-[11px] sm:text-xs text-white/80 line-clamp-2 mt-1 leading-snug">
              {activeProduct.subtitle || activeProduct.description}
            </p>

            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => openProductDetail(activeProduct)}
                className="w-full py-1.5 px-3 bg-white text-black font-bold text-xs rounded-lg hover:bg-white/90 active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Product</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom-Left Content & Controls */}
        <div
          id="cabai-hero-bottom-left"
          className="absolute bottom-6 left-4 sm:bottom-16 sm:left-16 lg:left-24 z-[60] max-w-[340px] space-y-4"
        >
          <div className="space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-widest text-white/80">
              CABAI ORIGINALS • {activeProduct.name}
            </div>

            <h2
              className="font-extrabold uppercase text-white opacity-95 tracking-[0.02em] text-base sm:text-[22px] leading-tight"
            >
              3D PRINTED CREATIONS
            </h2>

            <p className="hidden sm:block text-xs sm:text-sm text-white/85 leading-[1.6] font-normal">
              Designed with creativity. Printed with precision. Discover unique 3D printed creations made by Cabai Enterprise.
            </p>
          </div>

          {/* Circular Navigation Buttons */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => navigate('prev')}
              disabled={isAnimating}
              aria-label="Previous product"
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white flex items-center justify-center text-white bg-transparent hover:bg-white/15 active:scale-95 hover:scale-[1.08] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg backdrop-blur-xs"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.25} />
            </button>

            <button
              type="button"
              onClick={() => navigate('next')}
              disabled={isAnimating}
              aria-label="Next product"
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white flex items-center justify-center text-white bg-transparent hover:bg-white/15 active:scale-95 hover:scale-[1.08] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg backdrop-blur-xs"
            >
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.25} />
            </button>

            <div className="hidden sm:flex items-center gap-1.5 ml-3">
              {heroProducts.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    if (isAnimating || i === activeIndex) return;
                    setIsAnimating(true);
                    setActiveIndex(i);
                    setTimeout(() => setIsAnimating(false), 650);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                    i === activeIndex ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom-Right CTA: DISCOVER IT */}
        <div
          id="cabai-hero-discover-cta"
          className="absolute bottom-6 right-4 sm:bottom-16 sm:right-10 lg:right-16 z-[60]"
        >
          <button
            type="button"
            onClick={() => {
              setCurrentView('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group flex items-center gap-2 text-white opacity-95 hover:opacity-100 uppercase tracking-[-0.02em] leading-none transition-all duration-200 cursor-pointer"
            style={{
              fontFamily: 'Anton, sans-serif',
              fontSize: 'clamp(20px, 4vw, 56px)',
              fontWeight: 400,
            }}
          >
            <span className="group-hover:translate-x-[-2px] transition-transform">
              DISCOVER IT
            </span>
            <ArrowRight
              className="w-5 h-5 sm:w-8 sm:h-8 transition-transform group-hover:translate-x-2"
              strokeWidth={2.25}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
