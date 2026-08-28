import React from 'react';
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
  Flame,
  ShieldCheck
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
      {/* 1. HERO SECTION (CABAI ENTERPRISEE & Signature Cabai Showcase) */}
      {/* ========================================================================= */}
      <section className="space-y-8 pb-12 sm:pb-16 border-b border-black/8">
        
        {/* Top Header Row with Title & Quick CTA */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="studio-label text-[#af101a] font-semibold">
                [ 3D MAKER STUDIO &amp; FABRICATION ]
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#af101a]/10 text-[#af101a] text-[10px] font-mono-code font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#af101a] animate-pulse" />
                <span>ORIGINAL CABAI 🌶️</span>
              </span>
            </div>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#1a1a1a] tracking-tight leading-[0.95]">
              CABAI ENTERPRISEE
            </h1>
            <p className="text-[#1a1a1a]/60 text-base sm:text-lg leading-relaxed">
              Penang’s premier custom 3D printing studio. Explore signature chili keychains, tactile mechanical clickers, and modular desk accessories sliced at ultra-fine 0.12mm layer resolution.
            </p>
          </div>

          {/* Quick Catalog Button */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleShopCategory('all')}
              className="px-5 py-2.5 rounded-xl bg-[#af101a] hover:bg-[#8d0a12] active:scale-95 text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm cursor-pointer inline-flex items-center gap-2"
            >
              <span>Explore Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Centerpiece Pure Cabai Showcase Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#f2f0ea] to-[#e4e2dc] rounded-3xl p-6 sm:p-10 lg:p-12 border border-black/10 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Signature Details & Specs */}
            <div className="lg:col-span-6 space-y-6 order-2 lg:order-1">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-[#af101a] text-white font-mono-code font-bold text-[10px] uppercase tracking-wider shadow-xs">
                    Flagship Keychain 🌶️
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-black/10 text-[#1a1a1a] font-mono-code font-bold text-[10px] uppercase">
                    Penang Made
                  </span>
                </div>

                <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#1a1a1a] tracking-tight">
                  {cabaiProduct?.name || 'Cabai Signature Keychain 🌶️'}
                </h2>

                <p className="text-[#1a1a1a]/70 text-sm sm:text-base leading-relaxed font-sans">
                  {cabaiProduct?.description || 'Signature 3D printed red chili pepper keychain made from high-durability eco PLA+. Vibrant glossy red body with crisp stem and sturdy keyring hook.'}
                </p>
              </div>

              {/* Quick Specs Pill Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 border border-black/5 text-xs font-mono-code text-[#1a1a1a]/80 shadow-2xs">
                  <Layers className="w-3.5 h-3.5 text-[#af101a]" />
                  <span>0.12mm Ultra Detail</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 border border-black/5 text-xs font-mono-code text-[#1a1a1a]/80 shadow-2xs">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>30 Min Precision Print</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 border border-black/5 text-xs font-mono-code text-[#1a1a1a]/80 shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Eco PLA+</span>
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
                    className="px-4 py-2.5 rounded-xl bg-white hover:bg-black/5 text-[#1a1a1a] border border-black/15 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#af101a]" />
                    <span>Inspect</span>
                  </button>

                  <button
                    onClick={handleAddToCartCabai}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm active:scale-95 cursor-pointer flex items-center gap-2 ${
                      justAdded 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-[#1a1a1a] hover:bg-[#af101a] text-white'
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

            {/* Right Column: Hero Pure Cabai Image with Subtle Float & Reference Tag */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center p-4 order-1 lg:order-2">
              <div className="relative w-full max-w-[360px] sm:max-w-[420px] aspect-square flex items-center justify-center">
                
                {/* Subtle soft backdrop glow */}
                <div className="absolute inset-4 rounded-full bg-red-500/10 filter blur-2xl -z-10" />

                {/* Signature Cabai Image */}
                <img
                  src={imageConfig.heroCutouts.cabaiKeychain || imageConfig.products.cabaiKeychain}
                  alt="Cabai Signature 3D Keychain"
                  className="w-full h-full object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.25)] hover:scale-105 transition-transform duration-500 cursor-pointer select-none"
                  onClick={() => cabaiProduct && openProductDetail(cabaiProduct)}
                  onError={(e) => {
                    e.currentTarget.src = imageConfig.products.cabaiKeychain;
                  }}
                />

                {/* Reference Tag Badge */}
                <div className="absolute bottom-1 right-2 pointer-events-none">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-black/65 backdrop-blur-md text-[10px] font-mono-code font-bold text-white/90 border border-white/15 shadow-sm">
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
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 sm:pb-16 border-b border-black/8">
        
        <div className="sm:border-l sm:first:border-l-0 sm:pl-6 lg:pl-8 space-y-2">
          <span className="studio-label text-[#af101a] font-bold">01</span>
          <h4 className="font-heading font-bold text-sm uppercase tracking-wide text-[#1a1a1a]">
            Fast Delivery
          </h4>
          <p className="text-xs text-[#1a1a1a]/60 leading-relaxed">
            Express courier via Pos Laju / J&amp;T across all Malaysia. Free shipping over RM 80.
          </p>
        </div>

        <div className="sm:border-l border-black/10 sm:pl-6 lg:pl-8 space-y-2">
          <span className="studio-label text-[#af101a] font-bold">02</span>
          <h4 className="font-heading font-bold text-sm uppercase tracking-wide text-[#1a1a1a]">
            Precision Craft
          </h4>
          <p className="text-xs text-[#1a1a1a]/60 leading-relaxed">
            Multi-station CoreXY printing fleet delivering ultra-fine 0.12mm layer resolution.
          </p>
        </div>

        <div className="sm:border-l border-black/10 sm:pl-6 lg:pl-8 space-y-2">
          <span className="studio-label text-[#af101a] font-bold">03</span>
          <h4 className="font-heading font-bold text-sm uppercase tracking-wide text-[#1a1a1a]">
            Eco-Friendly
          </h4>
          <p className="text-xs text-[#1a1a1a]/60 leading-relaxed">
            Crafted from high-grade, sustainable PLA+ and PETG materials with minimal waste.
          </p>
        </div>

        <div className="sm:border-l border-black/10 sm:pl-6 lg:pl-8 space-y-2">
          <span className="studio-label text-[#af101a] font-bold">04</span>
          <h4 className="font-heading font-bold text-sm uppercase tracking-wide text-[#1a1a1a]">
            Rapid Dispatch
          </h4>
          <p className="text-xs text-[#1a1a1a]/60 leading-relaxed">
            24–48 hour rapid production window direct from our Maker Studio in Penang.
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
            <span className="studio-label text-[#af101a] block font-semibold">
              [ 01 // PRODUCT DIRECTORY ]
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1a1a1a]">
              Crafted in Penang
            </h2>
          </div>

          {/* Category Tabs */}
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
                className="px-3 py-1.5 text-xs font-mono-code uppercase tracking-wider rounded-lg border border-black/10 bg-[#f8f7f4] hover:bg-black/5 hover:border-black/20 text-[#1a1a1a]/80 transition-all cursor-pointer"
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid - Exactly 5 Featured Items */}
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
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-black/15 bg-white hover:bg-black/5 active:scale-95 text-xs font-bold font-mono-code uppercase tracking-widest text-[#1a1a1a] transition-all duration-200 cursor-pointer shadow-xs flex items-center justify-center gap-2"
          >
            <span>View Full Studio Catalog ({products.length} Products)</span>
            <ArrowRight className="w-4 h-4 text-[#af101a]" />
          </button>
        </div>

      </section>

    </div>
  );
};
