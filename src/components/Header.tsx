import React, { useState } from 'react';
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
      <div className="bg-[#121214] text-[#f8f7f4] text-[11px] py-2 px-4 text-center font-mono-code uppercase tracking-wider flex items-center justify-center gap-2 overflow-hidden border-b border-red-900/40">
        <span className="inline-block shrink-0 text-xs">🌶️</span>
        <div className="h-5 min-w-[260px] sm:min-w-[440px] max-w-2xl flex items-center justify-center">
          <TextMorph
            words={"FREE EXPRESS DELIVERY ACROSS MALAYSIA > RM 80 • 100% ECO-FRIENDLY PLA+\nCABAI ENTERPRISE™ • 3D PRINT & MAKER STUDIO • PENANG\nCUSTOM KEYCHAINS • KEYBOARD CLICKERS • BADGES • PHONE STANDS\nPRECISION 0.12MM LAYER RESOLUTION • 24-48H RAPID DISPATCH"}
            color="#f8f7f4"
            font={{ fontSize: 11, fontWeight: 600, textAlign: 'center', letterSpacing: '0.06em' }}
            transition={{ duration: 0.7, delay: 2.5, ease: 'easeInOut' }}
          />
        </div>
        <div className="hidden lg:flex items-center gap-1.5 pl-3 border-l border-white/10 text-[10px] text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Fleet Active</span>
        </div>
      </div>

      {/* Main Redesigned Navbar Surface */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-black/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 lg:h-20 gap-2 sm:gap-4">
            
            {/* BRAND LOGO & BADGE */}
            <button 
              onClick={() => handleNav('home')}
              className="flex items-center gap-3 text-left group focus:outline-hidden cursor-pointer shrink-0"
              title="Cabai Enterprise - 3D Printing & Maker Studio"
            >
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#18181b] border-2 border-red-600/60 overflow-hidden shadow-md group-hover:scale-105 group-hover:border-red-500 transition-all flex items-center justify-center p-0.5">
                <img 
                  src={imageConfig.logos.header} 
                  alt="CABAI ENTERPRISE Logo" 
                  className="w-full h-full object-cover rounded-lg"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = imageConfig.logos.favicon;
                  }}
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-red-600 rounded-full border-2 border-white" />
              </div>
              <div className="flex flex-col">
                <div className="font-heading font-extrabold text-lg sm:text-xl tracking-tight text-[#18181b] leading-tight flex items-center gap-1">
                  CABAI <span className="text-[#af101a]">ENTERPRISE</span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[9px] font-mono-code font-bold uppercase tracking-widest text-[#18181b]/60">
                    3D Maker Studio
                  </span>
                  <span className="text-[9px] px-1 py-0.2 rounded-sm bg-red-100 text-[#af101a] font-mono-code font-bold">
                    Penang
                  </span>
                </div>
              </div>
            </button>

            {/* DESKTOP CENTER NAVIGATION TABS */}
            <nav className="hidden lg:flex items-center gap-1 bg-[#f4f3ef] p-1.5 rounded-2xl border border-black/6 shadow-inner">
              {navItems.map((item) => {
                const isActive = currentView === item.view;
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.view)}
                    className={`relative px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1.5 select-none ${
                      isActive 
                        ? 'bg-white text-[#af101a] shadow-sm font-extrabold ring-1 ring-black/5' 
                        : 'text-[#18181b]/70 hover:text-[#18181b] hover:bg-white/60'
                    }`}
                  >
                    <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-[#af101a]' : 'text-[#18181b]/60'}`} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className={`text-[9px] font-mono-code font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-tight shadow-2xs ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* COMPACT TABLET NAVIGATION (MD to LG) */}
            <nav className="hidden md:flex lg:hidden items-center gap-1">
              <button
                onClick={() => handleNav('shop')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  currentView === 'shop' ? 'bg-[#af101a]/10 text-[#af101a]' : 'text-[#18181b]/80 hover:bg-black/5'
                }`}
              >
                Catalog
              </button>
              <button
                onClick={() => handleNav('daily_spin')}
                className="px-2.5 py-1.5 rounded-xl text-[11px] font-mono-code font-bold bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 transition-all cursor-pointer flex items-center gap-1"
              >
                <span>🎡 Spin Wheel</span>
              </button>
              <button
                onClick={() => handleNav('order_tracking')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  currentView === 'order_tracking' ? 'bg-[#af101a]/10 text-[#af101a]' : 'text-[#18181b]/80 hover:bg-black/5'
                }`}
              >
                Purchases
              </button>
            </nav>

            {/* RIGHT ACTIONS & CONTROLS */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">

              {/* Shopping Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 sm:px-3 sm:py-2 rounded-xl bg-black/5 hover:bg-[#af101a] text-[#18181b] hover:text-white transition-all duration-200 group cursor-pointer flex items-center gap-2 border border-black/5 shadow-2xs"
                title="View Shopping Cart"
              >
                <div className="relative">
                  <ShoppingBag className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
                  {cartCount > 0 && (
                    <span className="sm:hidden absolute -top-2 -right-2 bg-[#af101a] group-hover:bg-white group-hover:text-[#af101a] text-white text-[10px] font-mono-code font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs border border-white">
                      {cartCount}
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

              {/* User Account / VIP Hub Profile Trigger */}
              {currentUser ? (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className={`flex items-center gap-2 py-1.5 px-2.5 sm:px-3 rounded-xl transition-all font-bold text-xs border shadow-2xs cursor-pointer ${
                    currentUser.role === 'vip' 
                      ? 'bg-amber-50/90 text-amber-950 border-amber-300 hover:bg-amber-100' 
                      : 'bg-white text-[#18181b] border-black/10 hover:border-black/25 hover:bg-black/2'
                  }`}
                  title={currentUser.role === 'vip' ? `VIP Maker Active (${currentUser.displayName || currentUser.email})` : `Signed in as ${currentUser.displayName || currentUser.email}`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shadow-xs ${
                    currentUser.role === 'vip' ? 'bg-[#af101a] text-amber-300' : 'bg-[#18181b] text-white'
                  }`}>
                    {currentUser.role === 'vip' ? <Crown className="w-3.5 h-3.5 fill-amber-300" /> : (currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U')}
                  </div>
                  <div className="hidden sm:flex flex-col text-left leading-none">
                    <span className="text-[11px] font-extrabold max-w-[85px] truncate">
                      {currentUser.role === 'vip' ? 'VIP Pass' : (currentUser.displayName?.split(' ')[0] || 'Maker')}
                    </span>
                    <span className="text-[9px] text-black/50 font-mono-code">
                      {currentUser.role === 'vip' ? 'Core Tier' : 'Verified'}
                    </span>
                  </div>
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="hidden sm:flex items-center gap-1.5 py-2 px-3 rounded-xl bg-white hover:bg-black/5 text-[#18181b] transition-all font-bold text-xs uppercase tracking-wider border border-black/10 cursor-pointer shadow-2xs"
                    title="Sign In with Email or VIP Passcode"
                  >
                    <LogIn className="w-3.5 h-3.5 text-[#af101a]" />
                    <span>Sign In</span>
                  </button>
                  <button
                    onClick={() => handleNav('register')}
                    className="flex items-center gap-1.5 py-2 px-3 sm:px-3.5 rounded-xl bg-[#af101a] hover:bg-[#8e0c15] active:scale-95 text-white transition-all font-bold text-xs uppercase tracking-wider cursor-pointer shadow-sm shadow-red-950/20"
                    title="Join Cabai Studio 3D Hub"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Join</span>
                  </button>
                </div>
              )}

              {/* Boss Admin Console External Link */}
              <a
                href="https://admin-beta-pink-11.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all border bg-[#18181b] text-white border-black/20 hover:bg-[#af101a] hover:border-[#af101a] shadow-xs cursor-pointer"
                title="Open Boss Fleet Admin Console"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin</span>
              </a>

              {/* Mobile Menu Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-[#18181b] hover:bg-black/5 border border-black/5 focus:outline-hidden cursor-pointer"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* REDESIGNED RESPONSIVE MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-black/10 shadow-2xl px-4 pt-3 pb-8 space-y-3 animate-fadeIn">
          {/* User Status Card in Mobile Menu */}
          <div className="p-3.5 bg-gradient-to-r from-gray-50 to-red-50/40 border border-black/10 rounded-2xl flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#18181b] text-white flex items-center justify-center font-bold text-base shadow-sm border border-red-500/30">
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
              className="px-3.5 py-2 bg-[#af101a] hover:bg-[#8e0c15] text-white text-xs font-bold rounded-xl shadow-xs shrink-0 cursor-pointer"
            >
              {currentUser ? 'Profile' : 'Sign In'}
            </button>
          </div>

          {/* Quick Spin Hub */}
          <div className="pt-1">
            <button
              onClick={() => handleNav('daily_spin')}
              className="w-full p-3 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 border border-amber-300 text-amber-950 text-left flex items-center justify-between shadow-xs cursor-pointer"
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
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-between transition-colors cursor-pointer ${
                    isActive ? 'bg-[#af101a]/10 text-[#af101a]' : 'text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <IconComponent className={`w-4 h-4 ${isActive ? 'text-[#af101a]' : 'text-gray-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
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
              className="w-full px-3.5 py-2.5 rounded-xl text-xs font-bold bg-[#18181b] hover:bg-[#af101a] text-white flex items-center justify-between transition-colors shadow-xs"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Boss Admin Console (Fleet Portal)</span>
              </div>
              <ChevronRight className="w-4 h-4 text-white/50" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
