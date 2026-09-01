import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CabaiLanding3DChili } from '../components/CabaiLanding3DChili';
import { 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Box, 
  ShieldCheck, 
  Cpu, 
  Truck, 
  Zap, 
  Palette, 
  CheckCircle2, 
  LogIn, 
  UserPlus,
  Compass,
  Sliders,
  Award
} from 'lucide-react';
import { imageConfig } from '../config/assets';

export const LandingView: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useApp();

  const handleExplore = () => {
    if (currentUser) {
      navigate('/home');
    } else {
      navigate('/login?redirect=/home');
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-[#070708] text-white selection:bg-[#AF101A] selection:text-white flex flex-col font-sans overflow-x-hidden">
      
      {/* ========================================================================= */}
      {/* 1. MINIMAL LANDING HEADER (Distinct from Main App Navbar) */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 w-full bg-[#0A0A0C]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-black border border-red-500/40 p-1 flex items-center justify-center shadow-md">
              <img
                src={imageConfig.logos.header}
                alt="Cabai Enterprise Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = imageConfig.logos.favicon;
                }}
              />
            </div>
            <div>
              <span className="font-heading font-extrabold text-sm sm:text-base tracking-wider uppercase text-white block">
                CABAI ENTERPRISE
              </span>
              <span className="text-[10px] font-mono-code text-white/50 block">
                Penang 3D Maker Studio
              </span>
            </div>
          </div>

          {/* Landing Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {currentUser ? (
              <button
                onClick={() => navigate('/home')}
                className="px-4 py-2 rounded-xl bg-[#AF101A] hover:bg-[#E11D48] active:scale-95 text-white text-xs font-mono-code font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <span>Enter Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                <button
                  onClick={handleExplore}
                  className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#151518] hover:bg-white/10 border border-white/15 text-white text-xs font-mono-code font-bold transition-all cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5 text-[#FF4D5A]" />
                  <span>Explore</span>
                </button>

                <button
                  onClick={handleLogin}
                  className="px-3.5 sm:px-4 py-2 rounded-xl bg-[#18181B] hover:bg-white/15 border border-white/15 text-white text-xs font-mono-code font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-white/80" />
                  <span>Login</span>
                </button>

                <button
                  onClick={handleRegister}
                  className="px-3.5 sm:px-4 py-2 rounded-xl bg-[#AF101A] hover:bg-[#E11D48] active:scale-95 text-white text-xs font-mono-code font-bold transition-all shadow-md shadow-red-950/40 flex items-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Create Account</span>
                  <span className="xs:hidden">Register</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION WITH 3D CHILI */}
      {/* ========================================================================= */}
      <section className="relative w-full pt-8 sm:pt-14 pb-16 sm:pb-24 overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial from-[#AF101A]/20 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* LEFT: Brand & Hero Copy */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
              
              {/* Studio Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/60 border border-red-800/60 text-[#FF4D5A] text-xs font-mono-code font-bold shadow-sm">
                <Box className="w-3.5 h-3.5 animate-spin text-[#FF4D5A]" />
                <span>CABAI 3D STUDIO &bull; PENANG, MALAYSIA</span>
              </div>

              {/* Headings */}
              <div className="space-y-3 sm:space-y-4">
                <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight text-white leading-[1.1]">
                  3D Print Your Ideas.{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D5A] via-[#E11D48] to-red-400">
                    Bring Your World to Life.
                  </span>
                </h1>

                <p className="text-white/70 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl font-normal">
                  Malaysia&apos;s premier custom 3D printing studio. We engineer signature tactile keychains, custom mechanical maker gear, and industrial on-demand prototypes sliced at precision 0.12mm layer height.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    onClick={handleExplore}
                    className="px-7 py-4 rounded-xl bg-[#AF101A] hover:bg-[#E11D48] active:scale-[0.98] text-white text-xs sm:text-sm font-mono-code font-bold uppercase tracking-wider transition-all shadow-xl shadow-red-950/60 flex items-center justify-center gap-2.5 cursor-pointer group"
                  >
                    <Compass className="w-4 h-4 text-white group-hover:rotate-45 transition-transform" />
                    <span>Explore Cabai</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={handleLogin}
                    className="px-6 py-4 rounded-xl bg-[#151518] hover:bg-white/10 active:scale-[0.98] border border-white/15 text-white text-xs sm:text-sm font-mono-code font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4 text-white/70" />
                    <span>Login</span>
                  </button>
                </div>

                {/* Create Account Link Note */}
                <div className="text-xs font-mono-code text-white/50 pt-1">
                  New to Cabai?{' '}
                  <button
                    onClick={handleRegister}
                    className="text-[#FF4D5A] hover:text-white font-bold hover:underline cursor-pointer transition-colors ml-1"
                  >
                    Create Account &rarr;
                  </button>
                </div>
              </div>

              {/* Studio Specs Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
                <div className="p-2.5 rounded-xl bg-[#111113] border border-white/5 space-y-0.5">
                  <div className="text-[10px] font-mono-code text-white/40 uppercase">Precision</div>
                  <div className="text-xs font-bold text-white font-mono-code">0.12mm Detail</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#111113] border border-white/5 space-y-0.5">
                  <div className="text-[10px] font-mono-code text-white/40 uppercase">Filaments</div>
                  <div className="text-xs font-bold text-white font-mono-code">100% Eco PLA+</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#111113] border border-white/5 space-y-0.5">
                  <div className="text-[10px] font-mono-code text-white/40 uppercase">Turnaround</div>
                  <div className="text-xs font-bold text-white font-mono-code">24h Express</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#111113] border border-white/5 space-y-0.5">
                  <div className="text-[10px] font-mono-code text-white/40 uppercase">Origin</div>
                  <div className="text-xs font-bold text-white font-mono-code">Penang, MY</div>
                </div>
              </div>

            </div>

            {/* RIGHT: Large Premium 3D Chili Showcase */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
              <div className="w-full relative">
                <CabaiLanding3DChili onExplore={handleExplore} />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. FOUR CONCISE CORE SECTIONS */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 bg-[#0C0C0E] border-y border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-mono-code font-bold text-[#FF4D5A] uppercase tracking-widest block">
              [ THE CABAI FABRICATION STANDARD ]
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
              Engineered for Makers &amp; Creators
            </h2>
            <p className="text-xs sm:text-sm text-white/60">
              Four pillars powering our high-precision additive manufacturing workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* 01: CUSTOM CREATIONS */}
            <div className="p-6 rounded-2xl bg-[#121215] border border-white/10 hover:border-red-500/40 transition-all space-y-4 shadow-lg flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-[#AF101A]/50 text-[#FF4D5A] flex items-center justify-center font-mono-code font-bold text-sm shadow-inner">
                    01
                  </div>
                  <Sliders className="w-5 h-5 text-[#FF4D5A]" />
                </div>
                <h3 className="font-heading font-bold text-base text-white">
                  CUSTOM CREATIONS
                </h3>
                <p className="text-xs text-white/60 leading-relaxed font-sans">
                  Interactive real-time 3D badge studios, custom keycap switch creators, and instant STL file quote slicer tailored to your exact measurements.
                </p>
              </div>
              <div className="pt-3 border-t border-white/5 text-[11px] font-mono-code text-white/40">
                &bull; Live 3D Canvas Customizer
              </div>
            </div>

            {/* 02: 3D PRINTED PRODUCTS */}
            <div className="p-6 rounded-2xl bg-[#121215] border border-white/10 hover:border-red-500/40 transition-all space-y-4 shadow-lg flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-[#AF101A]/50 text-[#FF4D5A] flex items-center justify-center font-mono-code font-bold text-sm shadow-inner">
                    02
                  </div>
                  <Box className="w-5 h-5 text-[#FF4D5A]" />
                </div>
                <h3 className="font-heading font-bold text-base text-white">
                  3D PRINTED PRODUCTS
                </h3>
                <p className="text-xs text-white/60 leading-relaxed font-sans">
                  Signature spicy chili mascots, ergonomic desk organizers, satisfying mechanical clicker fidgets, and tactile maker collectibles.
                </p>
              </div>
              <div className="pt-3 border-t border-white/5 text-[11px] font-mono-code text-white/40">
                &bull; Curated Studio Catalog
              </div>
            </div>

            {/* 03: MADE WITH PRECISION */}
            <div className="p-6 rounded-2xl bg-[#121215] border border-white/10 hover:border-red-500/40 transition-all space-y-4 shadow-lg flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-[#AF101A]/50 text-[#FF4D5A] flex items-center justify-center font-mono-code font-bold text-sm shadow-inner">
                    03
                  </div>
                  <Layers className="w-5 h-5 text-[#FF4D5A]" />
                </div>
                <h3 className="font-heading font-bold text-base text-white">
                  MADE WITH PRECISION
                </h3>
                <p className="text-xs text-white/60 leading-relaxed font-sans">
                  0.12mm ultra-fine layer resolution on high-speed Bambu Lab Core-XY printers with multi-color AMS capability and tough PLA-CF/TPU options.
                </p>
              </div>
              <div className="pt-3 border-t border-white/5 text-[11px] font-mono-code text-white/40">
                &bull; 0.12mm Ultra Resolution
              </div>
            </div>

            {/* 04: BUILT FOR YOUR IDEAS */}
            <div className="p-6 rounded-2xl bg-[#121215] border border-white/10 hover:border-red-500/40 transition-all space-y-4 shadow-lg flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-[#AF101A]/50 text-[#FF4D5A] flex items-center justify-center font-mono-code font-bold text-sm shadow-inner">
                    04
                  </div>
                  <Zap className="w-5 h-5 text-[#FF4D5A]" />
                </div>
                <h3 className="font-heading font-bold text-base text-white">
                  BUILT FOR YOUR IDEAS
                </h3>
                <p className="text-xs text-white/60 leading-relaxed font-sans">
                  Fast 24-48h production turnaround in Penang, nationwide Pos Laju / J&amp;T courier shipping, and secure Touch &apos;n Go eWallet + FPX payments.
                </p>
              </div>
              <div className="pt-3 border-t border-white/5 text-[11px] font-mono-code text-white/40">
                &bull; Touch &apos;n Go &amp; FPX Ready
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. CALL TO ACTION BOTTOM BANNER */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-[#070708] to-[#120709] relative">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-800/80 text-[#FF4D5A] text-xs font-mono-code font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>START YOUR PRINT PROJECT</span>
          </div>

          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
            Ready to bring your ideas into physical 3D?
          </h2>

          <p className="text-white/70 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            Create an account to browse the full catalog, configure custom 3D badges, calculate instant slicing quotes, and track your print progress in real time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleExplore}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#AF101A] hover:bg-[#E11D48] active:scale-95 text-white font-mono-code font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-red-950/60 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Cabai Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleLogin}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#18181B] hover:bg-white/15 border border-white/15 text-white font-mono-code font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-white/70" />
              <span>Login to Studio</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. MINIMAL LANDING FOOTER */}
      {/* ========================================================================= */}
      <footer className="mt-auto py-8 bg-[#050506] border-t border-white/10 text-xs font-mono-code text-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Cabai Enterprise &bull; Penang Fleet Active</span>
          </div>

          <div className="flex items-center gap-4 text-white/60">
            <Link to="/about" className="hover:text-white transition-colors">
              About
            </Link>
            <span>&bull;</span>
            <Link to="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
            <span>&bull;</span>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
          </div>

          <div>
            &copy; {new Date().getFullYear()} Cabai Enterprise. All Rights Reserved.
          </div>
        </div>
      </footer>

    </div>
  );
};
