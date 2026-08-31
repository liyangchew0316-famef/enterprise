import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { Cabai3DHero } from '../components/Cabai3DHero';
import { soundFx } from '../utils/audio';
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
  Sliders,
  Volume2,
  VolumeX,
  Flame,
  MousePointerClick
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

  // Interactive Switch Tester State
  const [activeSwitch, setActiveSwitch] = useState<'blue' | 'red' | 'brown'>('blue');
  const [clickCount, setClickCount] = useState<number>(0);
  const [keycapColor, setKeycapColor] = useState<string>('#AF101A');
  const [isKeyPressed, setIsKeyPressed] = useState<boolean>(false);

  const handleShopCategory = (cat: any) => {
    setActiveCategory(cat);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSwitchClick = () => {
    setClickCount(prev => prev + 1);
    setIsKeyPressed(true);
    soundFx.playSwitchClick(activeSwitch);
    setTimeout(() => setIsKeyPressed(false), 120);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16 sm:space-y-20">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION WITH CONTINUOUSLY ROTATING 3D CABAI */}
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
              Penang’s premier custom 3D printing studio. Interact with our signature 3D Cabai chili keychain below — rendered live in WebGL, spinning continuously, and ready for custom fabrication.
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
                onClick={() => handleShopCategory('keychains')}
                className="group px-5 py-3.5 rounded-xl bg-[#151517] hover:bg-[#1F1F24] border border-white/15 hover:border-white/30 text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer inline-flex items-center gap-2 font-mono-code"
              >
                <Flame className="w-4 h-4 text-[#FF4D5A]" />
                <span>Signature Keychains</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3D CABAI CONTINUOUSLY TURNING SHOWCASE HERO */}
        <Cabai3DHero />

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
      {/* 2.5 INTERACTIVE MAKER BENCH: MECHANICAL SWITCH SOUNDBOARD & FIDGET TESTER */}
      {/* ========================================================================= */}
      <section className="p-6 sm:p-8 rounded-3xl bg-[#111113] border border-white/15 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#AF101A]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
          
          <div className="space-y-3 max-w-lg">
            <div className="flex items-center gap-2">
              <span className="studio-label text-[#FF4D5A] font-bold">
                [ INTERACTIVE MAKER LAB ]
              </span>
              <span className="text-[10px] font-mono-code bg-white/10 px-2 py-0.5 rounded text-white/70">
                Synthesized Web Audio
              </span>
            </div>

            <h3 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
              Test Tactile Clickers &amp; Keycaps Live
            </h3>

            <p className="text-white/70 text-sm leading-relaxed">
              We 3D print custom mechanical keyboard switch clickers. Select a switch type below, customize the filament keycap, and tap to test the tactile sound profile.
            </p>

            {/* Switch Type Tabs */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {[
                { id: 'blue', label: 'Clicky Blue (50g)', color: '#0284c7' },
                { id: 'red', label: 'Linear Red (45g)', color: '#e11d48' },
                { id: 'brown', label: 'Tactile Brown (55g)', color: '#b45309' }
              ].map((sw) => (
                <button
                  key={sw.id}
                  onClick={() => {
                    setActiveSwitch(sw.id as any);
                    soundFx.playSwitchClick(sw.id as any);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono-code font-bold uppercase transition-all cursor-pointer border ${
                    activeSwitch === sw.id
                      ? 'bg-[#1F1F24] text-white border-white/30 shadow-md ring-1 ring-white/20'
                      : 'bg-[#18181B] text-white/60 border-white/10 hover:text-white'
                  }`}
                >
                  <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: sw.color }} />
                  <span>{sw.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Clickable 3D Keycap Pad */}
          <div className="flex flex-col items-center gap-4 bg-[#16161A] p-6 rounded-2xl border border-white/10 w-full lg:w-auto min-w-[280px]">
            
            <div className="text-center space-y-1">
              <span className="text-[11px] font-mono-code text-white/50 uppercase block">
                Total Studio Clicks
              </span>
              <span className="font-heading font-black text-3xl text-white">
                {clickCount.toLocaleString()}
              </span>
            </div>

            {/* Simulated 3D Keycap Button */}
            <button
              onClick={handleSwitchClick}
              className={`relative w-24 h-24 rounded-2xl flex flex-col items-center justify-center font-heading font-black text-lg text-white shadow-2xl transition-all duration-75 select-none cursor-pointer border-2 ${
                isKeyPressed 
                  ? 'translate-y-2.5 shadow-xs brightness-125' 
                  : 'shadow-[0_12px_24px_rgba(0,0,0,0.8),0_4px_0_rgba(0,0,0,0.6)] hover:-translate-y-0.5'
              }`}
              style={{
                backgroundColor: keycapColor,
                borderColor: `${keycapColor}88`
              }}
              title="Click to activate mechanical switch!"
            >
              <MousePointerClick className="w-5 h-5 mb-0.5" />
              <span className="text-xs uppercase tracking-wider">PRESS</span>
            </button>

            {/* Keycap Color Swatches */}
            <div className="flex items-center gap-2 pt-2">
              {['#AF101A', '#0284C7', '#10B981', '#D97706', '#18181B', '#F4F4F5'].map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    setKeycapColor(color);
                    soundFx.playStudioBeep(900);
                  }}
                  className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                    keycapColor === color ? 'border-white scale-110 shadow-sm ring-1 ring-white/50' : 'border-white/20 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            <span className="text-[10px] font-mono-code text-white/40">
              Tap keycap to test switch sound
            </span>
          </div>

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
