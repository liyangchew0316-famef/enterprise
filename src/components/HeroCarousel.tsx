import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { ArrowLeft, ArrowRight, Sparkles, Eye, ArrowUpRight } from 'lucide-react';
import { imageConfig, resolveHeroCutoutUrl } from '../config/assets';

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
  
  // Screen size classification: mobile (<640px), tablet (640px-1023px), desktop (>=1024px)
  const [viewportMode, setViewportMode] = useState<'mobile' | 'tablet' | 'desktop'>(() => {
    if (typeof window !== 'undefined') {
      const w = window.innerWidth;
      if (w < 640) return 'mobile';
      if (w < 1024) return 'tablet';
      return 'desktop';
    }
    return 'desktop';
  });

  const isMobile = viewportMode === 'mobile';
  const isTablet = viewportMode === 'tablet';

  // Resize listener
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setViewportMode('mobile');
      } else if (w < 1024) {
        setViewportMode('tablet');
      } else {
        setViewportMode('desktop');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Assemble the 4 featured products from existing Cabai product catalog
  const heroProducts: HeroProductItem[] = useMemo(() => {
    if (!products || products.length === 0) {
      return [];
    }

    const selected: Product[] = [];
    
    // Iconic Cabai items
    const signature = products.find(p => p.id === 'prod-cabai-keychain') || products[0];
    const clicker = products.find(p => p.id === 'prod-keyboard-clicker') || products[1] || signature;
    const drawable = products.find(p => p.id === 'prod-draw-custom-chili') || products[2] || signature;
    const badge = products.find(p => p.id === 'prod-badge-customize') || products[3] || clicker;

    selected.push(signature, clicker, drawable, badge);

    while (selected.length < 4) {
      selected.push(products[selected.length % products.length]);
    }

    return selected.slice(0, 4).map((p, idx) => {
      const colorScheme = DEFAULT_HERO_COLORS[idx % DEFAULT_HERO_COLORS.length];
      const cutoutImg = p.heroImage || resolveHeroCutoutUrl(p);

      return {
        ...p,
        bg: colorScheme.bg,
        panel: colorScheme.panel,
        displayImg: cutoutImg,
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

  // Mobile Swipe Gesture Tracking
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Minimum threshold of 50px and must be predominantly horizontal
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        navigate('next');
      } else {
        navigate('prev');
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  if (heroProducts.length === 0) {
    return null;
  }

  const activeProduct = heroProducts[activeIndex];

  // Helper to compute styles for each item across Mobile / Tablet / Desktop
  const getItemStyle = (index: number) => {
    const total = heroProducts.length;
    const roleOffset = (index - activeIndex + total) % total;

    if (isMobile) {
      // MOBILE: ONLY active product is displayed.
      if (roleOffset === 0) {
        return {
          left: '50%',
          bottom: '17%',
          height: '55%',
          transform: 'translateX(-50%) scale(1.05)',
          filter: 'blur(0px)',
          opacity: 1,
          zIndex: 20,
          display: 'block',
          pointerEvents: 'auto' as const,
        };
      } else {
        // Hide secondary/back products on mobile
        return {
          left: '50%',
          bottom: '17%',
          height: '55%',
          transform: 'translateX(-50%) scale(0.85)',
          filter: 'blur(4px)',
          opacity: 0,
          zIndex: 0,
          display: 'none',
          pointerEvents: 'none' as const,
        };
      }
    }

    if (isTablet) {
      // TABLET: Intermediate 2-3 product layout (Center + Left + Right, Back hidden)
      if (roleOffset === 0) {
        return {
          left: '50%',
          bottom: '8%',
          height: '76%',
          transform: 'translateX(-50%) scale(1.42)',
          filter: 'blur(0px)',
          opacity: 1,
          zIndex: 20,
          display: 'block',
          pointerEvents: 'auto' as const,
        };
      } else if (roleOffset === 1) {
        return {
          left: '80%',
          bottom: '14%',
          height: '22%',
          transform: 'translateX(-50%) scale(1)',
          filter: 'blur(2px)',
          opacity: 0.75,
          zIndex: 10,
          display: 'block',
          pointerEvents: 'auto' as const,
        };
      } else if (roleOffset === 3) {
        return {
          left: '20%',
          bottom: '14%',
          height: '22%',
          transform: 'translateX(-50%) scale(1)',
          filter: 'blur(2px)',
          opacity: 0.75,
          zIndex: 10,
          display: 'block',
          pointerEvents: 'auto' as const,
        };
      } else {
        // Back product hidden on tablet
        return {
          left: '50%',
          bottom: '14%',
          height: '18%',
          transform: 'translateX(-50%) scale(0.9)',
          filter: 'blur(4px)',
          opacity: 0,
          zIndex: 0,
          display: 'none',
          pointerEvents: 'none' as const,
        };
      }
    }

    // DESKTOP: Full 4-Product Carousel
    if (roleOffset === 0) {
      // CENTER
      return {
        left: '50%',
        bottom: '0%',
        height: '92%',
        transform: 'translateX(-50%) scale(1.68)',
        filter: 'blur(0px)',
        opacity: 1,
        zIndex: 20,
        display: 'block',
        pointerEvents: 'auto' as const,
      };
    } else if (roleOffset === 1) {
      // RIGHT
      return {
        left: '70%',
        bottom: '12%',
        height: '28%',
        transform: 'translateX(-50%) scale(1)',
        filter: 'blur(2px)',
        opacity: 0.85,
        zIndex: 10,
        display: 'block',
        pointerEvents: 'auto' as const,
      };
    } else if (roleOffset === 2) {
      // BACK
      return {
        left: '50%',
        bottom: '12%',
        height: '22%',
        transform: 'translateX(-50%) scale(1)',
        filter: 'blur(4px)',
        opacity: 0.7,
        zIndex: 5,
        display: 'block',
        pointerEvents: 'none' as const,
      };
    } else {
      // LEFT (roleOffset === 3)
      return {
        left: '30%',
        bottom: '12%',
        height: '28%',
        transform: 'translateX(-50%) scale(1)',
        filter: 'blur(2px)',
        opacity: 0.85,
        zIndex: 10,
        display: 'block',
        pointerEvents: 'auto' as const,
      };
    }
  };

  const handleProductClick = (product: HeroProductItem, index: number) => {
    if (isAnimating) return;
    if (index === activeIndex) {
      openProductDetail(product);
    } else {
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
    <div
      id="cabai-hero-viewport"
      className="isolate relative w-full overflow-hidden select-none z-0"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Dynamic Background Canvas with 650ms smooth transition */}
      <div
        className="relative w-full h-[100dvh] min-h-[580px] max-h-[1080px] overflow-hidden transition-colors duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ backgroundColor: activeProduct.bg }}
      >
        {/* Subtle Ambient Grain Overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-10 opacity-35"
          style={{
            backgroundImage: `url("${GRAIN_DATA_URI}")`,
            backgroundSize: '200px 200px',
            backgroundRepeat: 'repeat',
          }}
        />

        {/* 1. TOP BRAND / CRAFT BAR */}
        {/* Mobile Brand (Top: 20px, Left: 20px) */}
        <div
          id="cabai-hero-brand-mobile"
          className="sm:hidden absolute top-[20px] left-[20px] z-20 text-[11px] font-bold uppercase text-white tracking-[0.2em] opacity-90 flex items-center gap-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span>CABAI ENTERPRISE</span>
        </div>

        {/* Desktop / Tablet Brand & Craft Badges */}
        <div
          id="cabai-hero-brand-desktop"
          className="hidden sm:flex absolute top-6 left-6 sm:left-8 z-20 text-xs font-semibold uppercase text-white tracking-[0.18em] opacity-90 items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span>CABAI ENTERPRISE</span>
        </div>

        <div className="absolute top-6 right-6 sm:right-8 z-20 hidden sm:flex items-center gap-3 text-xs font-medium text-white/80">
          <span className="px-2.5 py-1 rounded-full bg-black/20 border border-white/10 backdrop-blur-xs uppercase tracking-widest text-[10px]">
            0.12mm Ultra Precision
          </span>
          <span className="px-2.5 py-1 rounded-full bg-black/20 border border-white/10 backdrop-blur-xs uppercase tracking-widest text-[10px]">
            Penang, Malaysia 🇲🇾
          </span>
        </div>

        {/* 2. GIANT BACKGROUND TEXT (CABAI) */}
        <div
          id="cabai-hero-ghost-typography"
          className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none z-1"
          style={{
            top: isMobile ? '22%' : '18%',
          }}
        >
          <span
            className="text-white font-[900] leading-none whitespace-nowrap tracking-[-0.02em] opacity-90 transition-all duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{
              fontFamily: 'Anton, sans-serif',
              fontSize: isMobile
                ? 'clamp(80px, 30vw, 150px)'
                : isTablet
                ? 'clamp(110px, 26vw, 240px)'
                : 'clamp(140px, 28vw, 380px)',
              textShadow: '0 20px 80px rgba(0, 0, 0, 0.35)',
            }}
          >
            CABAI
          </span>
        </div>

        {/* 3. PRODUCT CAROUSEL LAYER */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {heroProducts.map((product, idx) => {
            const style = getItemStyle(idx);
            const isCenter = idx === activeIndex;

            if (style.display === 'none') {
              return null;
            }

            return (
              <div
                key={product.id}
                onClick={() => handleProductClick(product, idx)}
                className="absolute cursor-pointer will-change-transform will-change-filter will-change-opacity"
                style={{
                  ...style,
                  aspectRatio: '0.65 / 1',
                  transition:
                    'transform 650ms cubic-bezier(0.4, 0, 0.2, 1), filter 650ms cubic-bezier(0.4, 0, 0.2, 1), opacity 650ms cubic-bezier(0.4, 0, 0.2, 1), left 650ms cubic-bezier(0.4, 0, 0.2, 1), bottom 650ms cubic-bezier(0.4, 0, 0.2, 1), height 650ms cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                title={isCenter ? `View ${product.name}` : `Switch to ${product.name}`}
              >
                <img
                  src={product.displayImg}
                  alt={product.name}
                  draggable={false}
                  className="w-full h-full object-contain object-bottom select-none pointer-events-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)] transition-transform duration-300 hover:scale-[1.03]"
                />
              </div>
            );
          })}
        </div>

        {/* 4. DESKTOP / TABLET FLOATING INFO BADGE (Hidden on Mobile) */}
        <div
          className="hidden sm:block absolute top-20 left-6 sm:top-24 sm:left-8 z-20 max-w-xs transition-all duration-[650ms] ease-out"
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

        {/* 5. MOBILE COMPOSITION ELEMENTS (< 640px) */}
        {/* A. Mobile Navigation (Bottom: 95px, Left: 20px) */}
        <div
          id="cabai-mobile-navigation"
          className="sm:hidden absolute bottom-[95px] left-[20px] z-20 flex items-center gap-3"
        >
          <button
            type="button"
            onClick={() => navigate('prev')}
            disabled={isAnimating}
            aria-label="Previous product"
            className="w-[44px] h-[44px] rounded-full border border-white/80 flex items-center justify-center text-white bg-black/15 active:bg-white/20 active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md backdrop-blur-xs"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2.25} />
          </button>

          <button
            type="button"
            onClick={() => navigate('next')}
            disabled={isAnimating}
            aria-label="Next product"
            className="w-[44px] h-[44px] rounded-full border border-white/80 flex items-center justify-center text-white bg-black/15 active:bg-white/20 active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md backdrop-blur-xs"
          >
            <ArrowRight className="w-5 h-5" strokeWidth={2.25} />
          </button>

          {/* Compact slide indicator dots */}
          <div className="flex items-center gap-1.5 ml-2">
            {heroProducts.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === activeIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* B. Mobile Product Info (Bottom: 24px, Left: 20px) */}
        <div
          id="cabai-mobile-product-info"
          className="sm:hidden absolute bottom-[24px] left-[20px] z-20 max-w-[55%] pr-2 cursor-pointer"
          onClick={() => openProductDetail(activeProduct)}
        >
          <h3 className="text-sm font-extrabold uppercase text-white tracking-wide truncate drop-shadow-sm">
            {activeProduct.name}
          </h3>
          <p className="text-xs font-black text-white/95 mt-0.5 tracking-wider">
            RM {Number(activeProduct.price).toFixed(2)}
          </p>
        </div>

        {/* C. Mobile Discover Button (Bottom: 24px, Right: 20px) */}
        <div
          id="cabai-mobile-discover-cta"
          className="sm:hidden absolute bottom-[24px] right-[20px] z-20"
        >
          <button
            type="button"
            onClick={() => {
              setCurrentView('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-3.5 py-2 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 border border-white/30 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
          >
            <span>DISCOVER PRODUCTS</span>
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>
        </div>

        {/* 6. DESKTOP & TABLET BOTTOM AREA (Hidden on Mobile) */}
        {/* Desktop Bottom-Left Content & Controls */}
        <div
          id="cabai-hero-bottom-left"
          className="hidden sm:block absolute bottom-6 left-6 sm:bottom-12 sm:left-12 lg:bottom-16 lg:left-24 z-20 max-w-[340px] space-y-4"
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

            <p className="hidden md:block text-xs sm:text-sm text-white/85 leading-[1.6] font-normal">
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
              className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full border-2 border-white flex items-center justify-center text-white bg-transparent hover:bg-white/15 active:scale-95 hover:scale-[1.08] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg backdrop-blur-xs"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.25} />
            </button>

            <button
              type="button"
              onClick={() => navigate('next')}
              disabled={isAnimating}
              aria-label="Next product"
              className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full border-2 border-white flex items-center justify-center text-white bg-transparent hover:bg-white/15 active:scale-95 hover:scale-[1.08] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg backdrop-blur-xs"
            >
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.25} />
            </button>

            <div className="flex items-center gap-1.5 ml-3">
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

        {/* Desktop Bottom-Right CTA: DISCOVER IT */}
        <div
          id="cabai-hero-discover-cta"
          className="hidden sm:block absolute bottom-6 right-6 sm:bottom-12 sm:right-10 lg:bottom-16 lg:right-16 z-20"
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

