import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import TextMorph from './originkit/ui/textmorph-variant-2';
import { 
  ShoppingBag, 
  Sparkles, 
  ShieldCheck, 
  Menu, 
  X, 
  PackageCheck,
  Crown,
  ChevronRight,
  Compass,
  Store,
  Info,
  PhoneCall,
  LogIn,
  UserPlus
} from 'lucide-react';
import { imageConfig } from '../config/assets';

export const Header: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    cartCount, 
    setIsCartOpen, 
    setActiveCategory,
    currentUser,
    setIsAuthModalOpen
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleNav = (view: any, category?: any) => {
    if (category) {
      setActiveCategory(category);
    } else {
      setActiveCategory('all');
    }
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Store,
      view: 'home',
    },
    {
      id: 'shop',
      label: 'Catalog',
      icon: Compass,
      view: 'shop',
    },
    {
      id: 'daily_spin',
      label: 'Spin Wheel',
      icon: Sparkles,
      view: 'daily_spin',
      badge: 'Win RM20',
      badgeColor: 'bg-gradient-to-r from-amber-500 to-red-600 text-white animate-pulse',
    },
    {
      id: 'order_tracking',
      label: 'My Purchases',
      icon: PackageCheck,
      view: 'order_tracking',
    },
    {
      id: 'about',
      label: 'About',
      icon: Info,
      view: 'about',
    },
    {
      id: 'contact',
      label: 'Contact',
      icon: PhoneCall,
      view: 'contact',
    }
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all">
      {/* Top Banner Ticker with TextMorph */}
      <div className="bg-[#141416] text-[#f8f7f4] text-[10px] sm:text-[11px] py-1.5 sm:py-2 px-3 sm:px-4 text-center font-mono-code uppercase tracking-wider flex items-center justify-center gap-1.5 sm:gap-2 overflow-hidden border-b border-red-900/30">
        <span className="inline-block shrink-0 text-xs">🌶️</span>
        <div className="h-4 sm:h-5 w-full max-w-[280px] xs:max-w-md sm:max-w-xl flex items-center justify-center overflow-hidden">
          <TextMorph
            words={"FREE EXPRESS DELIVERY ACROSS MALAYSIA > RM 80 • 100% ECO-FRIENDLY PLA+\nCABAI ENTERPRISE™ • 3D PRINT & MAKER STUDIO • PENANG\nCUSTOM KEYCHAINS • KEYBOARD CLICKERS • BADGES • PHONE STANDS\nPRECISION 0.12MM LAYER RESOLUTION • 24-48H RAPID DISPATCH"}
            color="#f8f7f4"
            font={{ fontSize: 11, fontWeight: 600, textAlign: 'center', letterSpacing: '0.05em' }}
            transition={{ duration: 0.7, delay: 2.5, ease: 'easeInOut' }}
          />
        </div>
        <div className="hidden lg:flex items-center gap-1.5 pl-3 border-l border-white/10 text-[10px] text-emerald-400 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Fleet Active</span>
        </div>
      </div>

      {/* Main Responsive Navbar Surface */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-black/8 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20 gap-2 lg:gap-3">
            
            {/* BRAND LOGO & BADGE */}
            <button 
              onClick={() => handleNav('home')}
              className="flex items-center gap-2 sm:gap-2.5 text-left group focus:outline-hidden cursor-pointer shrink-0 min-w-0"
              title="Cabai Enterprise - 3D Printing & Maker Studio"
            >
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-[10px] sm:rounded-xl bg-[#18181b] border-2 border-red-600/60 overflow-hidden shadow-2xs group-hover:scale-105 group-hover:border-red-500 transition-all flex items-center justify-center p-0.5 shrink-0">
                <img 
                  src={imageConfig.logos.header} 
                  alt="CABAI ENTERPRISE Logo" 
                  className="w-full h-full object-cover rounded-md sm:rounded-lg"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = imageConfig.logos.favicon;
                  }}
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-white" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="font-heading font-extrabold text-base sm:text-lg lg:text-xl tracking-tight text-[#18181b] leading-tight flex items-center gap-1 truncate">
                  CABAI <span className="text-[#af101a]">ENTERPRISE</span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[8px] sm:text-[9px] font-mono-code font-bold uppercase tracking-widest text-[#18181b]/60">
                    3D Studio
                  </span>
                  <span className="text-[8px] sm:text-[9px] px-1 py-0.2 rounded-xs bg-red-100 text-[#af101a] font-mono-code font-bold">
                    Penang
                  </span>
                </div>
              </div>
            </button>

            {/* DESKTOP CENTER NAVIGATION TABS (LG & XL) */}
            <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 bg-[#f4f3ef] p-1 rounded-xl border border-black/6 shadow-inner shrink-1">
              {navItems.map((item) => {
                const isActive = currentView === item.view;
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.view)}
                    className={`relative px-2.5 py-1.5 xl:px-3.5 xl:py-2 rounded-lg text-[11px] xl:text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1.5 select-none shrink-0 ${
                      isActive 
                        ? 'bg-white text-[#af101a] shadow-xs font-extrabold ring-1 ring-black/5' 
                        : 'text-[#18181b]/70 hover:text-[#18181b] hover:bg-white/60'
                    }`}
                  >
                    <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-[#af101a]' : 'text-[#18181b]/60'}`} />
                    <span className="whitespace-nowrap">{item.label}</span>
                    {item.badge && (
                      <span className={`text-[9px] font-mono-code font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-tight shadow-2xs ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* RIGHT ACTIONS & CONTROLS (COLLISION RESISTANT ACROSS 1024px-1280px+) */}
            <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-2 xl:gap-2.5 shrink-0">

              {/* Shopping Cart Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 sm:px-3 sm:py-2 rounded-xl bg-black/5 hover:bg-[#af101a] text-[#18181b] hover:text-white transition-all duration-200 group cursor-pointer flex items-center gap-1.5 sm:gap-2 border border-black/5 shadow-2xs min-h-[40px] min-w-[40px] justify-center active:scale-[0.98]"
                title="View Shopping Cart"
                aria-label={`Shopping Cart (${cartCount} items)`}
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5 group-hover:scale-110 transition-transform" />
                  {cartCount > 0 && (
                    <span className="sm:hidden absolute -top-2 -right-2 bg-[#af101a] group-hover:bg-white group-hover:text-[#af101a] text-white text-[9px] font-mono-code font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs border border-white">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline-block text-xs font-extrabold uppercase tracking-wider">
                  Cart
                </span>
                {cartCount > 0 && (
                  <span className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 rounded-md bg-[#af101a] group-hover:bg-white text-white group-hover:text-[#af101a] text-[11px] font-mono-code font-extrabold shadow-2xs">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User Profile / Auth Action */}
              {currentUser ? (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className={`flex items-center gap-1.5 sm:gap-2 py-1.5 px-2 sm:px-2.5 xl:px-3 rounded-xl transition-all font-bold text-xs border shadow-2xs cursor-pointer min-h-[40px] active:scale-[0.98] ${
                    currentUser.role === 'vip' 
                      ? 'bg-amber-50/90 text-amber-950 border-amber-300 hover:bg-amber-100' 
                      : 'bg-white text-[#18181b] border-black/10 hover:border-black/25 hover:bg-black/2'
                  }`}
                  title={currentUser.role === 'vip' ? `VIP Pass: ${currentUser.displayName || currentUser.email}` : `Signed in as ${currentUser.displayName || currentUser.email}`}
                >
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-black shadow-xs shrink-0 ${
                    currentUser.role === 'vip' ? 'bg-[#af101a] text-amber-300' : 'bg-[#18181b] text-white'
                  }`}>
                    {currentUser.role === 'vip' ? <Crown className="w-3.5 h-3.5 fill-amber-300" /> : (currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U')}
                  </div>
                  <div className="hidden sm:flex flex-col text-left leading-none">
                    <span className="text-[11px] font-extrabold max-w-[75px] xl:max-w-[95px] truncate">
                      {currentUser.role === 'vip' ? 'VIP Pass' : (currentUser.displayName?.split(' ')[0] || 'Maker')}
                    </span>
                    <span className="text-[9px] text-black/50 font-mono-code">
                      {currentUser.role === 'vip' ? 'Core Tier' : 'Verified'}
                    </span>
                  </div>
                </button>
              ) : (
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="hidden lg:flex items-center gap-1.5 py-2 px-2.5 xl:px-3 rounded-xl bg-white hover:bg-black/5 text-[#18181b] transition-all font-bold text-xs uppercase tracking-wider border border-black/10 cursor-pointer shadow-2xs min-h-[40px] active:scale-[0.98]"
                    title="Sign In"
                  >
                    <LogIn className="w-3.5 h-3.5 text-[#af101a]" />
                    <span>Sign In</span>
                  </button>
                  <button
                    onClick={() => handleNav('register')}
                    className="flex items-center gap-1 sm:gap-1.5 py-1.5 px-2.5 sm:py-2 sm:px-3.5 rounded-xl bg-[#af101a] hover:bg-[#8e0c15] active:scale-[0.98] text-white transition-all font-bold text-xs uppercase tracking-wider cursor-pointer shadow-sm shadow-red-950/20 min-h-[40px]"
                    title="Join Cabai Studio"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Join</span>
                  </button>
                </div>
              )}

              {/* Boss Admin Console Link (Desktop 1024px+) */}
              <a
                href="https://admin-beta-pink-11.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center gap-1.5 px-2.5 xl:px-3 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all border bg-[#18181b] text-white border-black/20 hover:bg-[#af101a] hover:border-[#af101a] shadow-xs cursor-pointer min-h-[40px] active:scale-[0.98]"
                title="Open Boss Fleet Admin Console"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin</span>
              </a>

              {/* Mobile / Tablet Menu Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-[#18181b] hover:bg-black/5 active:bg-black/10 border border-black/10 focus:outline-hidden cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
                aria-label="Toggle Navigation Menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* MOBILE / TABLET DRAWER WITH MOTION ANIMATION */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden fixed inset-x-0 top-[calc(theme(spacing.16)+30px)] sm:top-[calc(theme(spacing.18)+34px)] bottom-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-start"
          >
            <motion.div 
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="w-full max-h-[85vh] overflow-y-auto bg-white border-b border-black/10 shadow-2xl px-4 pt-3 pb-8 space-y-3"
              onClick={(e) => e.stopPropagation()}
            >
              {/* User Profile Card */}
              <div className="p-3.5 bg-gradient-to-r from-gray-50 to-red-50/40 border border-black/10 rounded-2xl flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#18181b] text-white flex items-center justify-center font-bold text-base shadow-sm border border-red-500/30 shrink-0">
                    {currentUser?.role === 'vip' ? '👑' : (currentUser?.displayName ? currentUser.displayName.charAt(0).toUpperCase() : '👤')}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-extrabold text-[#18181b] truncate flex items-center gap-1">
                      <span>{currentUser ? (currentUser.displayName || currentUser.email) : 'Cabai Guest Maker'}</span>
                      {currentUser?.role === 'vip' && (
                        <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-black text-[9px] font-black">VIP</span>
                      )}
                    </div>
                    <div className="text-[10px] text-black/50 font-mono-code truncate">
                      {currentUser ? (currentUser.email || 'Logged In Account') : 'Sign in to sync 3D orders & VIP passes'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="px-3.5 py-2 bg-[#af101a] hover:bg-[#8e0c15] text-white text-xs font-bold rounded-xl shadow-xs shrink-0 cursor-pointer active:scale-95"
                >
                  {currentUser ? 'Profile' : 'Sign In'}
                </button>
              </div>

              {/* Quick Spin Hub */}
              <div className="pt-1">
                <button
                  onClick={() => handleNav('daily_spin')}
                  className="w-full p-3 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 border border-amber-300 text-amber-950 text-left flex items-center justify-between shadow-xs cursor-pointer active:scale-[0.99]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🎡</span>
                    <div>
                      <div className="text-xs font-bold">Daily Lucky Spin</div>
                      <div className="text-[10px] text-amber-800">Win vouchers &amp; discounts up to RM20</div>
                    </div>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-red-600 text-white font-mono-code font-bold uppercase animate-pulse">
                    Win RM20
                  </span>
                </button>
              </div>

              {/* Nav Links List */}
              <div className="space-y-1 pt-1">
                {navItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = currentView === item.view;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item.view)}
                      className={`w-full text-left px-3.5 py-3 rounded-xl text-sm font-bold flex items-center justify-between transition-colors cursor-pointer min-h-[44px] ${
                        isActive ? 'bg-[#af101a]/10 text-[#af101a]' : 'text-gray-800 hover:bg-gray-100 active:bg-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <IconComponent className={`w-4 h-4 ${isActive ? 'text-[#af101a]' : 'text-gray-500'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge ? (
                        <span className={`text-[9px] font-mono-code font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* External Boss Admin link */}
              <div className="pt-2 border-t border-gray-100">
                <a
                  href="https://admin-beta-pink-11.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full px-3.5 py-3 rounded-xl text-xs font-bold bg-[#18181b] hover:bg-[#af101a] text-white flex items-center justify-between transition-colors shadow-xs min-h-[44px] active:scale-[0.99]"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Boss Admin Console (Fleet Portal)</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/50" />
                </a>
              </div>
            </motion.div>
            
            {/* Backdrop closer */}
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
