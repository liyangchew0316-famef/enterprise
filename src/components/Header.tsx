import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import TextMorph from './originkit/ui/textmorph-variant-2';
import { 
  Home, 
  ShoppingBag, 
  Palette, 
  Info, 
  PhoneCall, 
  MessageSquare,
  PackageCheck,
  Sparkles, 
  ShieldCheck, 
  ShoppingCart,
  Search,
  Crown,
  ChevronRight,
  ChevronDown,
  Menu, 
  X, 
  LogIn,
  UserPlus,
  User
} from 'lucide-react';
import { imageConfig } from '../config/assets';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  view: string;
  badge?: string;
  badgeClass?: string;
}

export const Header: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    cartCount, 
    setIsCartOpen, 
    setIsSearchOpen,
    setActiveCategory,
    currentUser,
    setIsAuthModalOpen
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  
  // Ref tracking for SVG travelling outline
  const navContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const [pillRect, setPillRect] = useState<{ x: number; y: number; width: number; height: number; id: string } | null>(null);

  // Close mobile menu & more menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
      if (window.innerWidth >= 1200) {
        setMoreMenuOpen(false);
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

  // Navigation Items Definition (Home, Shop, About, Contact matching reference)
  const primaryNavItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: Home, view: 'home' },
    { id: 'shop', label: 'Shop', icon: ShoppingBag, view: 'shop' },
    { id: 'about', label: 'About', icon: Info, view: 'about' },
    { id: 'contact', label: 'Contact', icon: MessageSquare, view: 'contact' },
  ];

  const secondaryNavItems: NavItem[] = [
    { id: 'order_tracking', label: 'Tracking', icon: PackageCheck, view: 'order_tracking' },
  ];

  // All nav items combined for full desktop
  const allDesktopNavItems: NavItem[] = [...primaryNavItems, ...secondaryNavItems];

  // Active target determination for SVG outline
  const activeNavId = (() => {
    if (currentView === 'home') return 'home';
    if (currentView === 'shop' || currentView === 'product_detail') return 'shop';
    if (currentView === 'custom_print' || currentView === 'badge_custom') return 'custom_print';
    if (currentView === 'about') return 'about';
    if (currentView === 'contact') return 'contact';
    if (currentView === 'order_tracking') return 'order_tracking';
    return null;
  })();

  const targetId = hoveredItem || activeNavId;

  // Measure and update the SVG outline bounding box
  const updatePillRect = useCallback(() => {
    if (!targetId || !navContainerRef.current) {
      setPillRect(null);
      return;
    }
    const targetElement = itemRefs.current[targetId];
    if (targetElement && navContainerRef.current) {
      const containerRect = navContainerRef.current.getBoundingClientRect();
      const targetRect = targetElement.getBoundingClientRect();
      
      setPillRect({
        x: targetRect.left - containerRect.left,
        y: targetRect.top - containerRect.top,
        width: targetRect.width,
        height: targetRect.height,
        id: targetId
      });
    }
  }, [targetId]);

  useEffect(() => {
    updatePillRect();
    const timeout = setTimeout(updatePillRect, 40);
    return () => clearTimeout(timeout);
  }, [targetId, updatePillRect]);

  // Recalculate on window resize
  useEffect(() => {
    window.addEventListener('resize', updatePillRect);
    return () => window.removeEventListener('resize', updatePillRect);
  }, [updatePillRect]);

  const handleNav = (view: any, category?: any) => {
    if (category) {
      setActiveCategory(category);
    } else {
      setActiveCategory('all');
    }
    setCurrentView(view);
    setMobileMenuOpen(false);
    setMoreMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isTargetActive = targetId === activeNavId;

  return (
    <header className="sticky top-0 z-40 w-full transition-all bg-[#0A0A0A]">
      
      {/* Top Announcement Ticker */}
      <div className="bg-[#070708] text-white/80 text-[11px] py-1.5 sm:py-2 px-4 sm:px-6 text-center font-mono-code tracking-wider flex items-center justify-between border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <span className="text-[#AF101A] text-xs">🌶️</span>
          <span className="font-semibold text-white/90">3D Print Your Ideas. Bring Your World to Life.</span>
        </div>
        <div className="hidden md:flex items-center gap-3 text-[10px] sm:text-[11px] text-white/60">
          <span>Made in Bukit Mertajam, Penang</span>
          <span className="text-white/20">|</span>
          <span>Fast &amp; Secure Delivery</span>
          <span className="text-white/20">|</span>
          <button 
            onClick={() => handleNav('register')} 
            className="text-amber-400 hover:text-amber-300 font-bold transition-colors cursor-pointer"
          >
            Join Cabai VIP
          </button>
        </div>
      </div>

      {/* Main Responsive Header Container */}
      <div className="bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl py-2 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 min-h-[56px]">
          
          {/* ========================================================================= */}
          {/* 1. BRAND LOGO (Matching Reference Image typography) */}
          {/* ========================================================================= */}
          <button 
            onClick={() => handleNav('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-hidden cursor-pointer shrink-0 select-none"
            title="Cabai Enterprise - 3D Printing & Maker Studio"
            aria-label="Cabai Enterprise Home"
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-[12px] bg-[#151515] border border-white/15 overflow-hidden shadow-md group-hover:border-[#AF101A] group-hover:scale-105 transition-all duration-300 flex items-center justify-center p-0.5 shrink-0">
              <img 
                src={imageConfig.logos.header} 
                alt="CABAI ENTERPRISE Logo" 
                className="w-full h-full object-cover rounded-[10px]"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = imageConfig.logos.favicon;
                }}
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#AF101A] rounded-full border-2 border-[#0A0A0A]" />
            </div>

            <div className="flex flex-col min-w-0">
              <div className="font-heading font-black text-lg sm:text-xl tracking-tighter text-white leading-tight flex items-center gap-1.5 truncate">
                <span>CABAI</span>
                <span className="text-[#AF101A] font-mono-code font-bold text-xs tracking-widest px-1.5 py-0.5 rounded bg-[#AF101A]/20 border border-[#AF101A]/30">ENTERPRISE</span>
              </div>
              <div className="text-[9px] font-mono-code text-white/50 tracking-wider">
                Bukit Mertajam, Penang
              </div>
            </div>
          </button>

          {/* ========================================================================= */}
          {/* 2. DESKTOP CENTER NAVIGATION (1200px+: Full Expanding Uiverse Navbar) */}
          {/* ========================================================================= */}
          <motion.nav 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            ref={navContainerRef}
            className="hidden xl:flex relative items-center bg-[#151515] border border-white/[0.12] shadow-[0_8px_32px_rgba(0,0,0,0.7)] rounded-[16px] p-[5px] transition-all duration-400 ease-out group/nav w-fit max-w-[calc(100vw-32px)] gap-1 hover:gap-2 select-none"
            style={{ height: '54px' }}
          >
            {/* SVG Travelling Outline Layer */}
            <svg 
              className="absolute inset-0 pointer-events-none w-full h-full z-10 overflow-visible"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="cabaiBeamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#AF101A" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#FF4D5A" stopOpacity="1" />
                  <stop offset="100%" stopColor="#AF101A" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="whiteBeamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
                  <stop offset="50%" stopColor="rgba(255,255,255,0.95)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.15)" />
                </linearGradient>
                <filter id="beamGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              
              {pillRect && (
                <motion.rect
                  initial={false}
                  animate={{
                    x: pillRect.x,
                    y: pillRect.y,
                    width: pillRect.width,
                    height: pillRect.height,
                    opacity: 1,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 420,
                    damping: 32,
                    mass: 0.7
                  }}
                  rx={12}
                  ry={12}
                  fill="none"
                  stroke={isTargetActive ? "url(#cabaiBeamGrad)" : "url(#whiteBeamGrad)"}
                  strokeWidth="1.5"
                  strokeDasharray="60 140"
                  filter="url(#beamGlow)"
                  className="animate-border-travel"
                />
              )}
            </svg>

            {/* Navigation Button Elements */}
            {allDesktopNavItems.map((item) => {
              const isActive = activeNavId === item.id;
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  ref={(el) => (itemRefs.current[item.id] = el)}
                  onClick={() => handleNav(item.view)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onFocus={() => setHoveredItem(item.id)}
                  onBlur={() => setHoveredItem(null)}
                  className={`
                    group/btn relative flex items-center justify-center gap-1.5 xl:gap-2 h-[42px] px-3 xl:px-3.5 rounded-[12px] text-xs font-bold uppercase tracking-wider transition-all duration-250 ease-out cursor-pointer z-20 outline-none
                    ${isActive 
                      ? 'bg-[#AF101A]/20 text-white border border-[#AF101A]/40 shadow-[0_0_12px_rgba(175,16,26,0.25)]' 
                      : 'text-white/65 hover:text-white hover:bg-white/[0.07] hover:-translate-y-[2px] border border-transparent'
                    }
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <IconComponent className={`w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:-translate-y-[1px] ${isActive ? 'text-[#FF4D5A]' : 'text-white/70 group-hover/btn:text-white'}`} />
                  <span className="whitespace-nowrap">{item.label}</span>
                  {item.badge && (
                    <span className={`text-[9px] font-mono-code font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-tight shadow-xs ${item.badgeClass}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </motion.nav>

          {/* ========================================================================= */}
          {/* 3. TABLET CENTER NAVIGATION (768px – 1199px Compact Mode) */}
          {/* ========================================================================= */}
          <nav className="hidden md:flex xl:hidden items-center bg-[#151515] border border-white/[0.12] rounded-[16px] p-1 gap-1 shadow-lg">
            {primaryNavItems.map((item) => {
              const isActive = activeNavId === item.id;
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.view)}
                  className={`flex items-center gap-1.5 h-[38px] px-3 rounded-[10px] text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? 'bg-[#AF101A] text-white shadow-xs' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* More Menu Dropdown for Tablet */}
            <div className="relative">
              <button
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className={`flex items-center gap-1 h-[38px] px-2.5 rounded-[10px] text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  moreMenuOpen ? 'bg-white/15 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                aria-expanded={moreMenuOpen}
                aria-label="More Studio Links"
              >
                <span>More</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {moreMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-[#151515] border border-white/15 rounded-xl shadow-2xl p-1.5 space-y-0.5 z-50 backdrop-blur-xl"
                  >
                    {secondaryNavItems.map((item) => {
                      const IconComponent = item.icon;
                      const isActive = activeNavId === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNav(item.view)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold text-left transition-colors cursor-pointer ${
                            isActive ? 'bg-[#AF101A] text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-3.5 h-3.5 text-white/70" />
                            <span>{item.label}</span>
                          </div>
                          {item.badge && (
                            <span className="text-[8px] font-mono-code font-bold px-1.5 py-0.2 rounded-full bg-[#AF101A] text-white">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}

                    <div className="pt-1 mt-1 border-t border-white/10">
                      <a
                        href="https://admin-beta-pink-11.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setMoreMenuOpen(false)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold text-amber-400 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Boss Admin</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* ========================================================================= */}
          {/* 4. RIGHT ACTIONS & CONTROLS (Search, Cart, Account, Admin, Hamburger) */}
          {/* ========================================================================= */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">

            {/* Quick Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center justify-center w-[42px] h-[42px] rounded-[12px] bg-[#151515] hover:bg-white/10 text-white/80 hover:text-white transition-all border border-white/[0.12] hover:border-white/30 shadow-md group cursor-pointer active:scale-[0.98]"
              title="Search 3D Models & Keychains"
              aria-label="Search catalog"
            >
              <Search className="w-4 h-4 text-white/80 group-hover:scale-110 transition-transform" />
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center gap-1.5 sm:gap-2 h-[42px] px-3 sm:px-3.5 rounded-[12px] bg-[#151515] hover:bg-[#AF101A] text-white transition-all duration-200 border border-white/[0.12] hover:border-[#AF101A] shadow-md group cursor-pointer active:scale-[0.98]"
              title="View Shopping Cart"
              aria-label={`Shopping Cart with ${cartCount} items`}
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="sm:hidden absolute -top-2 -right-2 bg-[#AF101A] text-white text-[9px] font-mono-code font-bold w-4 h-4 rounded-full flex items-center justify-center border border-black shadow-xs">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline-block text-xs font-extrabold uppercase tracking-wider">
                Cart
              </span>
              {cartCount > 0 && (
                <span className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 rounded-md bg-[#AF101A] group-hover:bg-white text-white group-hover:text-[#AF101A] text-[10px] font-mono-code font-extrabold shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth Button */}
            {currentUser ? (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className={`flex items-center gap-1.5 sm:gap-2 h-[42px] px-2.5 sm:px-3 rounded-[12px] transition-all font-bold text-xs border shadow-md cursor-pointer active:scale-[0.98] ${
                  currentUser.role === 'vip' 
                    ? 'bg-amber-950/40 text-amber-200 border-amber-500/40 hover:bg-amber-900/50' 
                    : 'bg-[#151515] text-white border-white/15 hover:border-white/30 hover:bg-white/10'
                }`}
                title={currentUser.role === 'vip' ? `VIP Pass: ${currentUser.displayName || currentUser.email}` : `Signed in as ${currentUser.displayName || currentUser.email}`}
                aria-label="User Account"
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shadow-xs shrink-0 ${
                  currentUser.role === 'vip' ? 'bg-[#AF101A] text-amber-300' : 'bg-white/15 text-white'
                }`}>
                  {currentUser.role === 'vip' ? <Crown className="w-3.5 h-3.5 fill-amber-300" /> : (currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U')}
                </div>
                <div className="hidden sm:flex flex-col text-left leading-none">
                  <span className="text-[11px] font-extrabold max-w-[70px] xl:max-w-[90px] truncate text-white">
                    {currentUser.role === 'vip' ? 'VIP Pass' : (currentUser.displayName?.split(' ')[0] || 'Maker')}
                  </span>
                  <span className="text-[8px] text-white/50 font-mono-code">
                    {currentUser.role === 'vip' ? 'Core Tier' : 'Verified'}
                  </span>
                </div>
              </button>
            ) : (
              <div className="flex items-center gap-1 sm:gap-1.5">
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="hidden md:flex items-center gap-1.5 h-[42px] px-3 rounded-[12px] bg-[#151515] hover:bg-white/10 text-white transition-all font-bold text-xs uppercase tracking-wider border border-white/15 cursor-pointer shadow-md active:scale-[0.98]"
                  title="Sign In to Studio Account"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#FF4D5A]" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => handleNav('register')}
                  className="flex items-center gap-1 sm:gap-1.5 h-[42px] px-3 sm:px-3.5 rounded-[12px] bg-[#AF101A] hover:bg-[#8E0C15] text-white transition-all font-bold text-xs uppercase tracking-wider cursor-pointer shadow-lg shadow-red-950/40 border border-red-500/30 active:scale-[0.98]"
                  title="Join Cabai Studio"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Join</span>
                </button>
              </div>
            )}

            {/* Boss Admin Console Link (Desktop 1200px+) */}
            <a
              href="https://admin-beta-pink-11.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden xl:flex items-center gap-1.5 h-[42px] px-3 rounded-[12px] text-xs font-bold uppercase tracking-wider transition-all border bg-[#151515] text-white border-white/15 hover:border-amber-500/50 hover:bg-white/10 shadow-md cursor-pointer active:scale-[0.98]"
              title="Open Boss Fleet Admin Console"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin</span>
            </a>

            {/* Mobile / Tablet Menu Hamburger Button (<1200px) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden flex items-center justify-center w-[42px] h-[42px] rounded-[12px] bg-[#151515] text-white hover:bg-white/10 border border-white/15 focus:outline-hidden cursor-pointer shadow-md"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. MOBILE NAVIGATION DRAWER (Smooth motion/react animated menu) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="xl:hidden fixed inset-x-0 top-[96px] bottom-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-start"
          >
            <motion.div 
              id="mobile-navigation-drawer"
              initial={{ opacity: 0, height: 0, y: -8 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full max-h-[85vh] overflow-y-auto bg-[#151515] border-b border-white/15 shadow-2xl px-4 pt-3 pb-8 space-y-3"
              onClick={(e) => e.stopPropagation()}
            >
              {/* User Profile Card in Mobile Menu */}
              <div className="p-3.5 bg-[#1A1A1A] border border-white/10 rounded-2xl flex items-center justify-between shadow-md">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#0A0A0A] text-white flex items-center justify-center font-bold text-base shadow-sm border border-[#AF101A]/40 shrink-0">
                    {currentUser?.role === 'vip' ? '👑' : (currentUser?.displayName ? currentUser.displayName.charAt(0).toUpperCase() : <User className="w-5 h-5 text-white/70" />)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-extrabold text-white truncate flex items-center gap-1.5">
                      <span>{currentUser ? (currentUser.displayName || currentUser.email) : 'Cabai Guest Maker'}</span>
                      {currentUser?.role === 'vip' && (
                        <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-black text-[9px] font-black">VIP</span>
                      )}
                    </div>
                    <div className="text-[10px] text-white/50 font-mono-code truncate">
                      {currentUser ? (currentUser.email || 'Logged In Account') : 'Sign in to sync 3D orders & VIP passes'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="px-3.5 py-2 bg-[#AF101A] hover:bg-[#8E0C15] text-white text-xs font-bold rounded-xl shadow-xs shrink-0 cursor-pointer active:scale-95"
                >
                  {currentUser ? 'Profile' : 'Sign In'}
                </button>
              </div>

              {/* Navigation Links List */}
              <div className="space-y-1 pt-1">
                {allDesktopNavItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = activeNavId === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item.view)}
                      className={`w-full text-left px-3.5 py-3 rounded-xl text-sm font-bold flex items-center justify-between transition-colors cursor-pointer min-h-[44px] ${
                        isActive 
                          ? 'bg-[#AF101A]/20 text-[#FF4D5A] border border-[#AF101A]/40' 
                          : 'text-white/80 hover:bg-white/10 active:bg-white/15'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <IconComponent className={`w-4 h-4 ${isActive ? 'text-[#FF4D5A]' : 'text-white/50'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge ? (
                        <span className={`text-[9px] font-mono-code font-bold px-2 py-0.5 rounded-full ${item.badgeClass || 'bg-[#AF101A] text-white'}`}>
                          {item.badge}
                        </span>
                      ) : (
                        <ChevronRight className="w-4 h-4 text-white/30" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Boss Admin Fleet Console Link in Mobile Menu */}
              <div className="pt-2 border-t border-white/10">
                <a
                  href="https://admin-beta-pink-11.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full px-3.5 py-3 rounded-xl text-xs font-bold bg-[#1A1A1A] hover:bg-[#AF101A] text-white flex items-center justify-between transition-colors shadow-md min-h-[44px] border border-white/10 active:scale-[0.99]"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Boss Admin Console (Fleet Portal)</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/50" />
                </a>
              </div>
            </motion.div>
            
            {/* Backdrop Closer */}
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
};
