import React from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { imageConfig } from '../config/assets';
import { 
  ArrowRight, 
  ShieldCheck,
  Award,
  Zap,
  Leaf,
  Printer,
  Sparkles,
  Palette,
  Layers,
  Cpu,
  CheckCircle2,
  Sliders
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { 
    products, 
    openProductDetail, 
    setCurrentView, 
    setActiveCategory,
    activeCategory,
    addToCart
  } = useApp();

  const handleShopCategory = (cat: any) => {
    setActiveCategory(cat);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16 sm:space-y-20">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (DARK TECHNICAL MAKER STUDIO) */}
      {/* ========================================================================= */}
      <section className="space-y-8 pb-12 sm:pb-16 border-b border-white/10">
        
        {/* Top Header Row with Studio Identification & CTAs */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="studio-label text-[#FF4D5A] font-bold">
                [ 3D MAKER STUDIO &amp; FABRICATION ]
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#AF101A]/20 text-[#FF4D5A] text-[10px] font-mono-code font-bold border border-[#AF101A]/40">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D5A] animate-pulse" />
                <span>PENANG, MALAYSIA 🌶️</span>
              </span>
            </div>
            
            <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[0.95]">
              CABAI <span className="text-[#AF101A]">ENTERPRISE</span>
            </h1>
            
            <p className="text-white/70 text-base sm:text-lg leading-relaxed">
              Penang’s premier custom 3D printing studio. Explore signature chili keychains, tactile mechanical clickers, custom badges, and precision on-demand fabrication sliced at ultra-fine 0.12mm layer resolution.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => handleShopCategory('all')}
                className="group px-6 py-3.5 rounded-xl bg-[#AF101A] hover:bg-[#E11D48] active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-lg shadow-red-950/40 cursor-pointer inline-flex items-center gap-2"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setCurrentView('custom_print')}
                className="group px-5 py-3.5 rounded-xl bg-[#151517] hover:bg-[#1F1F24] border border-white/15 hover:border-white/30 text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer inline-flex items-center gap-2"
              >
                <Palette className="w-4 h-4 text-[#FF4D5A]" />
                <span>Custom Print Quote</span>
              </button>
            </div>
          </div>

          {/* Quick Studio Specs Pill */}
          <div className="lg:max-w-xs w-full p-4 rounded-2xl bg-[#111113] border border-white/10 space-y-3 shrink-0">
            <div className="flex items-center justify-between text-xs font-mono-code font-bold text-white/80 pb-2 border-b border-white/10">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Fleet Active
              </span>
              <span className="text-white/40">Bambu Lab Core-XY</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono-code">
              <div className="bg-[#18181B] p-2 rounded-lg border border-white/5">
                <span className="text-white/40 block text-[9px]">LAYER RES</span>
                <span className="text-white font-bold">0.12 mm</span>
              </div>
              <div className="bg-[#18181B] p-2 rounded-lg border border-white/5">
                <span className="text-white/40 block text-[9px]">MATERIAL</span>
                <span className="text-white font-bold">100% Eco PLA+</span>
              </div>
              <div className="bg-[#18181B] p-2 rounded-lg border border-white/5">
                <span className="text-white/40 block text-[9px]">DISPATCH</span>
                <span className="text-white font-bold">24-48 Hours</span>
              </div>
              <div className="bg-[#18181B] p-2 rounded-lg border border-white/5">
                <span className="text-white/40 block text-[9px]">FREE SHIP</span>
                <span className="text-amber-400 font-bold">&gt; RM 80</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Visual Stage Showcase */}
        {imageConfig.heroStage && (
          <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-[#0D0D10] shadow-2xl group">
            <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full overflow-hidden max-h-[360px]">
              <img 
                src={imageConfig.heroStage} 
                alt="Cabai Enterprise 3D Printing Maker Studio Stage"
                className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070708] via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#070708] via-transparent to-transparent" />
              
              {/* Overlay Content on Stage */}
              <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] sm:text-xs font-mono-code font-bold text-white border border-white/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D5A] animate-ping" />
                    <span>STUDIO FABRICATION BENCH</span>
                  </span>
                  <span className="hidden sm:inline-flex text-[11px] font-mono-code text-white/60 bg-black/60 px-2.5 py-1 rounded-md border border-white/10">
                    Penang Studio Core
                  </span>
                </div>

                <div className="max-w-md space-y-1 sm:space-y-2">
                  <span className="text-[10px] font-mono-code uppercase tracking-widest text-[#FF4D5A] font-bold">
                    Signature Flagship Edition
                  </span>
                  <h3 className="font-heading font-black text-lg sm:text-2xl text-white tracking-tight">
                    Malaysian Chili Pepper Keychain 🌶️
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70 line-clamp-2">
                    Our iconic 3D printed chili pepper keychain. Ergonomic curved stem, vibrant dual-tone rigid PLA+, and stainless key ring.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </section>

      {/* ========================================================================= */}
      {/* 2. VALUE PROPS STRIP (01 - 04 Architectural Monospace Layout) */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pb-12 sm:pb-16 border-b border-white/10">
        
        <div className="p-5 rounded-2xl bg-[#111113] border border-white/10 hover:border-red-500/40 transition-all shadow-md space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="studio-label text-[#FF4D5A] font-bold text-xs">01</span>
            <div className="p-1.5 rounded-lg bg-white/5 text-white/70">
              <Zap className="w-4 h-4 text-[#FF4D5A]" />
            </div>
          </div>
          <div>
            <span className="font-mono-code text-[10px] text-white/40 font-bold uppercase block mb-0.5">
              POS LAJU / J&amp;T
            </span>
            <h4 className="font-heading font-extrabold text-sm uppercase tracking-wide text-white">
              Fast Express Delivery
            </h4>
          </div>
          <p className="text-xs text-white/60 leading-relaxed">
            Express courier across all Malaysia. Free shipping milestone on orders RM 80 and above.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#111113] border border-white/10 hover:border-blue-500/40 transition-all shadow-md space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="studio-label text-blue-400 font-bold text-xs">02</span>
            <div className="p-1.5 rounded-lg bg-white/5 text-white/70">
              <Printer className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <div>
            <span className="font-mono-code text-[10px] text-white/40 font-bold uppercase block mb-0.5">
              CORE-XY FLEET
            </span>
            <h4 className="font-heading font-extrabold text-sm uppercase tracking-wide text-white">
              Precision Layer Craft
            </h4>
          </div>
          <p className="text-xs text-white/60 leading-relaxed">
            Multi-station Bambu Lab fleet delivering ultra-fine 0.12mm layer resolution &amp; smooth curves.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#111113] border border-white/10 hover:border-emerald-500/40 transition-all shadow-md space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="studio-label text-emerald-400 font-bold text-xs">03</span>
            <div className="p-1.5 rounded-lg bg-white/5 text-white/70">
              <Leaf className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div>
            <span className="font-mono-code text-[10px] text-white/40 font-bold uppercase block mb-0.5">
              SUSTAINABLE
            </span>
            <h4 className="font-heading font-extrabold text-sm uppercase tracking-wide text-white">
              Eco PLA+ &amp; PETG
            </h4>
          </div>
          <p className="text-xs text-white/60 leading-relaxed">
            Non-toxic, high-durability polymer filaments with zero petroleum waste &amp; recyclable packaging.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#111113] border border-white/10 hover:border-amber-500/40 transition-all shadow-md space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="studio-label text-amber-400 font-bold text-xs">04</span>
            <div className="p-1.5 rounded-lg bg-white/5 text-white/70">
              <Award className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div>
            <span className="font-mono-code text-[10px] text-white/40 font-bold uppercase block mb-0.5">
              MAKER LAB
            </span>
            <h4 className="font-heading font-extrabold text-sm uppercase tracking-wide text-white">
              Rapid 24-48h Dispatch
            </h4>
          </div>
          <p className="text-xs text-white/60 leading-relaxed">
            Quick turnaround from digital G-code slice to hand-deburred parcel right here in Penang.
          </p>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 3. STUDIO SELECTIONS (Catalog Grid Section) */}
      {/* ========================================================================= */}
      <section className="space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="studio-label text-[#FF4D5A] block font-bold">
              [ 01 // PRODUCT DIRECTORY ]
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
              Crafted in Penang
            </h2>
          </div>

          {/* Category Tabs with Standardized Token Styling */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'All Models' },
              { id: 'keychains', label: 'Keychains' },
              { id: 'custom', label: 'Custom Badges' },
              { id: 'mechanical', label: 'Clickers' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleShopCategory(tab.id)}
                className={`px-3.5 py-1.5 text-xs font-mono-code uppercase tracking-wider rounded-xl border transition-all cursor-pointer active:scale-[0.98] ${
                  activeCategory === tab.id
                    ? 'bg-[#AF101A] text-white border-[#AF101A] shadow-md'
                    : 'border-white/10 bg-[#111113] hover:bg-white/10 hover:border-white/20 text-white/80'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid - Exactly 5 Featured Items with Responsive Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 sm:gap-6">
          {products.slice(0, 5).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewProduct={openProductDetail}
              onAddToCart={addToCart}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={() => handleShopCategory('all')}
            className="group w-full sm:w-auto px-8 py-3.5 rounded-xl border border-white/15 bg-[#151517] hover:bg-white/10 active:scale-[0.98] text-xs font-bold font-mono-code uppercase tracking-widest text-white transition-all duration-200 cursor-pointer shadow-md flex items-center justify-center gap-2"
          >
            <span>View Full Studio Catalog ({products.length} Products)</span>
            <ArrowRight className="w-4 h-4 text-[#FF4D5A] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </section>

    </div>
  );
};
