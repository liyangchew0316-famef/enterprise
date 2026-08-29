import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { imageConfig } from '../config/assets';
import { 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Clock, 
  Eye, 
  ShoppingBag, 
  Check, 
  ShieldCheck,
  Award,
  Zap,
  Leaf,
  Printer
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { 
    products, 
    openProductDetail, 
    setCurrentView, 
    setActiveCategory, 
    addToCart 
  } = useApp();

  const [justAdded, setJustAdded] = React.useState(false);

  // Signature Cabai Product
  const cabaiProduct = products.find(p => p.id === 'prod-cabai-keychain') || products[0];

  const handleShopCategory = (cat: any) => {
    setActiveCategory(cat);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCartCabai = () => {
    if (cabaiProduct) {
      addToCart(cabaiProduct);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1800);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16 sm:space-y-20">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (CABAI ENTERPRISEE & Signature Cabai Launch Stage) */}
      {/* ========================================================================= */}
      <section className="space-y-8 pb-12 sm:pb-16 border-b border-black/8">
        
        {/* Top Header Row with Studio Identification & Fast CTA */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3.5 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="studio-label text-[#af101a] font-bold">
                [ 3D MAKER STUDIO &amp; FABRICATION ]
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#af101a]/10 text-[#af101a] text-[10px] font-mono-code font-bold border border-[#af101a]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#af101a] animate-pulse" />
                <span>SIGNATURE CABAI 🌶️</span>
              </span>
            </div>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#18181b] tracking-tight leading-[0.95]">
              CABAI ENTERPRISEE
            </h1>
            <p className="text-[#18181b]/70 text-base sm:text-lg leading-relaxed">
              Penang’s premier custom 3D printing studio. Explore signature chili keychains, tactile mechanical clickers, and modular desk accessories sliced at ultra-fine 0.12mm layer resolution.
            </p>
          </div>

          {/* Quick Catalog Button */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleShopCategory('all')}
              className="group px-5 py-3 rounded-xl bg-[#af101a] hover:bg-[#8e0c15] active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm cursor-pointer inline-flex items-center gap-2"
            >
              <span>Explore Catalog</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Centerpiece Pure Cabai Showcase Card (Surface depth & focal showcase) */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#f6f5f0] via-[#eceae3] to-[#e2dfd7] rounded-3xl p-6 sm:p-10 lg:p-12 border border-black/10 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Signature Details & Specs */}
            <div className="lg:col-span-6 space-y-6 order-2 lg:order-1">
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 rounded-full bg-[#af101a] text-white font-mono-code font-bold text-[10px] uppercase tracking-wider shadow-2xs">
                    Flagship Keychain 🌶️
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-black/8 text-[#18181b] font-mono-code font-bold text-[10px] uppercase border border-black/5">
                    Made in Penang
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-white text-emerald-800 font-mono-code font-bold text-[10px] uppercase border border-emerald-200/80 shadow-2xs">
                    Ready to Ship
                  </span>
                </div>

                <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#18181b] tracking-tight">
                  {cabaiProduct?.name || 'Cabai Signature Keychain 🌶️'}
                </h2>

                <p className="text-[#18181b]/70 text-sm sm:text-base leading-relaxed font-sans max-w-xl">
                  {cabaiProduct?.description || 'Signature 3D printed red chili pepper keychain made from high-durability eco PLA+. Vibrant glossy red body with crisp stem and sturdy keyring hook.'}
                </p>
              </div>

              {/* Standardized Spec Badges Hierarchy */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 border border-black/8 text-xs font-mono-code text-[#18181b]/90 shadow-2xs">
                  <Layers className="w-3.5 h-3.5 text-[#af101a]" />
                  <span className="font-semibold">0.12mm Ultra Detail</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 border border-black/8 text-xs font-mono-code text-[#18181b]/90 shadow-2xs">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span className="font-semibold">30 Min Precision Print</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 border border-black/8 text-xs font-mono-code text-[#18181b]/90 shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-semibold">100% Eco PLA+</span>
                </div>
              </div>

              {/* Price & Primary Actions */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono-code font-black text-3xl sm:text-4xl text-[#af101a]">
                    RM {Number(cabaiProduct?.price || 5).toFixed(2)}
                  </span>
                  {cabaiProduct?.originalPrice && (
                    <span className="font-mono-code text-sm text-black/40 line-through">
                      RM {Number(cabaiProduct.originalPrice).toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => cabaiProduct && openProductDetail(cabaiProduct)}
                    className="px-4 py-2.5 rounded-xl bg-white hover:bg-black/5 text-[#18181b] border border-black/15 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-[0.98]"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#af101a]" />
                    <span>Inspect</span>
                  </button>

                  <button
                    onClick={handleAddToCartCabai}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md active:scale-[0.98] cursor-pointer flex items-center gap-2 ${
                      justAdded 
                        ? 'bg-emerald-600 text-white shadow-emerald-900/20' 
                        : 'bg-[#18181b] hover:bg-[#af101a] text-white shadow-black/20'
                    }`}
                  >
                    {justAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Pure Cabai Image with Controlled Float Animation */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center p-4 order-1 lg:order-2">
              <div className="relative w-full max-w-[360px] sm:max-w-[420px] aspect-square flex items-center justify-center">
                
                {/* Soft backdrop radial glow */}
                <div className="absolute inset-4 rounded-full bg-red-500/12 filter blur-2xl -z-10" />

                {/* Signature Floating Cabai Image */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4.5, ease: "easeInOut", repeat: Infinity }}
                  className="w-full h-full flex items-center justify-center"
                >
                  <img
                    src={imageConfig.heroCutouts.cabaiKeychain || imageConfig.products.cabaiKeychain}
                    alt="Cabai Signature 3D Keychain"
                    className="w-full h-full object-contain drop-shadow-[0_22px_32px_rgba(0,0,0,0.22)] hover:scale-104 transition-transform duration-500 cursor-pointer select-none"
                    onClick={() => cabaiProduct && openProductDetail(cabaiProduct)}
                    onError={(e) => {
                      e.currentTarget.src = imageConfig.products.cabaiKeychain;
                    }}
                  />
                </motion.div>

                {/* Reference Tag Badge */}
                <div className="absolute bottom-1 right-2 pointer-events-none">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono-code font-bold text-white/90 border border-white/15 shadow-sm">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>Image for reference</span>
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 2. VALUE PROPS STRIP (01 - 04 Architectural Monospace Layout) */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pb-12 sm:pb-16 border-b border-black/8">
        
        <div className="p-5 rounded-2xl bg-white/80 border border-black/8 hover:border-black/15 transition-all shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="studio-label text-[#af101a] font-bold text-xs">01</span>
            <div className="p-1.5 rounded-lg bg-black/5 text-[#18181b]/70">
              <Zap className="w-3.5 h-3.5 text-[#af101a]" />
            </div>
          </div>
          <div>
            <span className="font-mono-code text-[10px] text-gray-400 font-bold uppercase block mb-0.5">
              POS LAJU / J&amp;T
            </span>
            <h4 className="font-heading font-extrabold text-sm uppercase tracking-wide text-[#18181b]">
              Fast Express Delivery
            </h4>
          </div>
          <p className="text-xs text-[#18181b]/65 leading-relaxed">
            Express courier across all Malaysia. Free shipping milestone on orders RM 80 and above.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white/80 border border-black/8 hover:border-black/15 transition-all shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="studio-label text-[#af101a] font-bold text-xs">02</span>
            <div className="p-1.5 rounded-lg bg-black/5 text-[#18181b]/70">
              <Printer className="w-3.5 h-3.5 text-blue-600" />
            </div>
          </div>
          <div>
            <span className="font-mono-code text-[10px] text-gray-400 font-bold uppercase block mb-0.5">
              CORE-XY FLEET
            </span>
            <h4 className="font-heading font-extrabold text-sm uppercase tracking-wide text-[#18181b]">
              Precision Layer Craft
            </h4>
          </div>
          <p className="text-xs text-[#18181b]/65 leading-relaxed">
            Multi-station Bambu Lab fleet delivering ultra-fine 0.12mm layer resolution &amp; smooth curves.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white/80 border border-black/8 hover:border-black/15 transition-all shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="studio-label text-[#af101a] font-bold text-xs">03</span>
            <div className="p-1.5 rounded-lg bg-black/5 text-[#18181b]/70">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            </div>
          </div>
          <div>
            <span className="font-mono-code text-[10px] text-gray-400 font-bold uppercase block mb-0.5">
              SUSTAINABLE
            </span>
            <h4 className="font-heading font-extrabold text-sm uppercase tracking-wide text-[#18181b]">
              Eco PLA+ &amp; PETG
            </h4>
          </div>
          <p className="text-xs text-[#18181b]/65 leading-relaxed">
            Non-toxic, high-durability polymer filaments with zero petroleum waste &amp; recyclable packaging.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white/80 border border-black/8 hover:border-black/15 transition-all shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="studio-label text-[#af101a] font-bold text-xs">04</span>
            <div className="p-1.5 rounded-lg bg-black/5 text-[#18181b]/70">
              <Award className="w-3.5 h-3.5 text-amber-600" />
            </div>
          </div>
          <div>
            <span className="font-mono-code text-[10px] text-gray-400 font-bold uppercase block mb-0.5">
              MAKER LAB
            </span>
            <h4 className="font-heading font-extrabold text-sm uppercase tracking-wide text-[#18181b]">
              Rapid 24-48h Dispatch
            </h4>
          </div>
          <p className="text-xs text-[#18181b]/65 leading-relaxed">
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
            <span className="studio-label text-[#af101a] block font-bold">
              [ 01 // PRODUCT DIRECTORY ]
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#18181b]">
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
                className="px-3.5 py-1.5 text-xs font-mono-code uppercase tracking-wider rounded-xl border border-black/10 bg-white/70 hover:bg-black/5 hover:border-black/20 text-[#18181b]/80 transition-all cursor-pointer active:scale-[0.98]"
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
            className="group w-full sm:w-auto px-8 py-3.5 rounded-xl border border-black/15 bg-white hover:bg-black/5 active:scale-[0.98] text-xs font-bold font-mono-code uppercase tracking-widest text-[#18181b] transition-all duration-200 cursor-pointer shadow-xs flex items-center justify-center gap-2"
          >
            <span>View Full Studio Catalog ({products.length} Products)</span>
            <ArrowRight className="w-4 h-4 text-[#af101a] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </section>

    </div>
  );
};
