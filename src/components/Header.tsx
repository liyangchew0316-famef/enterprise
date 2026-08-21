import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  ShoppingBag, 
  Sparkles, 
  Truck, 
  ShieldCheck, 
  Menu, 
  X, 
  Layers, 
  Flame,
  ChevronDown,
  PackageCheck,
  Paintbrush,
  User,
  LogIn
} from 'lucide-react';
import { imageConfig } from '../config/assets';

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

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs transition-all">
      {/* Top Banner Ticker */}
      <div className="bg-[#1a1c1c] text-white text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <span className="inline-block animate-pulse">🌶️</span>
        <span>
          <strong className="text-[#af101a]">CABAI ENTERPRISE™</strong> — FREE Express Delivery across Malaysia on orders over <strong>RM 80</strong>!
        </span>
      </div>

      {/* Main Header Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <button 
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 text-left group focus:outline-hidden"
          >
            <div className="w-11 h-11 rounded-xl bg-black border border-red-900/40 overflow-hidden shadow-md shadow-red-950/30 group-hover:scale-105 transition-transform flex items-center justify-center">
              <img 
                src={imageConfig.logos.header} 
                alt="CABAI ENTERPRISE Logo" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = imageConfig.logos.favicon;
                }}
              />
            </div>
            <div>
              <div className="font-heading font-extrabold text-lg sm:text-xl tracking-tight text-[#1a1c1c] leading-none flex items-center gap-1">
                CABAI <span className="text-[#af101a]">ENTERPRISE</span>
              </div>
              <div className="text-[10px] tracking-widest text-gray-500 font-bold uppercase mt-0.5">
                3D Print & Maker Studio
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            <button
              onClick={() => handleNav('home')}
              className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                currentView === 'home' ? 'text-[#af101a] bg-red-50' : 'text-gray-700 hover:text-[#af101a] hover:bg-gray-50'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNav('shop')}
              className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                currentView === 'shop' ? 'text-[#af101a] bg-red-50' : 'text-gray-700 hover:text-[#af101a] hover:bg-gray-50'
              }`}
            >
              Shop Catalog
            </button>

            <button
              onClick={() => handleNav('daily_spin')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 animate-bounce duration-1000 ${
                currentView === 'daily_spin' 
                  ? 'text-white bg-amber-600 shadow-xs' 
                  : 'text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300'
              }`}
            >
              <span>🎡 Daily Spin</span>
            </button>

            <button
              onClick={() => handleNav('order_tracking')}
              className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                currentView === 'order_tracking' ? 'text-[#af101a] bg-red-50' : 'text-gray-700 hover:text-[#af101a] hover:bg-gray-50'
              }`}
            >
              <PackageCheck className="w-4 h-4 text-[#af101a]" />
              <span>My Purchases</span>
            </button>

            <button
              onClick={() => handleNav('about')}
              className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                currentView === 'about' ? 'text-[#af101a] bg-red-50' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              About
            </button>

            <button
              onClick={() => handleNav('contact')}
              className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                currentView === 'contact' ? 'text-[#af101a] bg-red-50' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Right Action Icons & Boss Admin Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-full text-gray-700 hover:text-[#af101a] hover:bg-gray-100 transition-colors"
              title="Search products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-gray-100 text-[#1a1c1c] hover:bg-red-50 hover:text-[#af101a] transition-all group"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#af101a] text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account / Sign In Trigger Button */}
            {currentUser ? (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className={`flex items-center gap-2 py-1.5 px-3 rounded-full transition-all font-semibold text-xs shadow-2xs group ${
                  currentUser.role === 'vip' 
                    ? 'bg-amber-50/90 hover:bg-amber-100/90 text-amber-900 border border-amber-300' 
                    : 'bg-red-50/80 hover:bg-red-100/80 text-gray-900 border border-red-200'
                }`}
                title={currentUser.role === 'vip' ? 'Signed in as VIP' : `Signed in as ${currentUser.displayName || currentUser.email}`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold shadow-xs ${
                  currentUser.role === 'vip' ? 'bg-[#af101a] text-amber-300' : 'bg-gray-900 text-white'
                }`}>
                  {currentUser.role === 'vip' ? '👑' : (currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U')}
                </div>
                <span className="hidden sm:inline-block max-w-[90px] truncate font-bold text-gray-800 group-hover:text-[#af101a]">
                  {currentUser.role === 'vip' ? 'VIP' : (currentUser.displayName?.split(' ')[0] || 'Member')}
                </span>
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-[#af101a] transition-all font-bold text-xs border border-red-200 shadow-2xs cursor-pointer"
                title="Log In or Create Account"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline-block">Log In</span>
              </button>
            )}

            {/* Boss Admin Dashboard External Link */}
            <a
              href="https://admin-beta-pink-11.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border bg-white text-gray-800 border-gray-300 hover:border-[#af101a] hover:text-[#af101a] shadow-xs"
              title="Boss Admin Console (External Portal)"
            >
              <ShieldCheck className="w-4 h-4 text-[#af101a]" />
              <span>Boss Admin</span>
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-3 pb-6 space-y-2 animate-fadeIn">
          {/* User Status Card in Mobile Menu */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#af101a] text-white flex items-center justify-center font-bold text-sm">
                {currentUser?.role === 'vip' ? '👑' : (currentUser?.displayName ? currentUser.displayName.charAt(0).toUpperCase() : '👤')}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-gray-900 truncate">
                  {currentUser ? (currentUser.role === 'vip' ? 'VIP' : (currentUser.displayName || currentUser.email)) : 'Guest Customer'}
                </div>
                <div className="text-[10px] text-gray-500 truncate">
                  {currentUser ? (currentUser.role === 'vip' ? 'VIP' : (currentUser.email || 'Registered Member')) : 'Not logged in'}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsAuthModalOpen(true);
              }}
              className="px-3 py-1.5 bg-[#af101a] hover:bg-[#8d0a12] text-white text-xs font-bold rounded-lg shadow-xs"
            >
              {currentUser ? 'Profile' : 'Log In'}
            </button>
          </div>
          <button
            onClick={() => handleNav('home')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold text-gray-800 hover:bg-gray-50"
          >
            🏠 Home
          </button>
          <button
            onClick={() => handleNav('shop')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold text-gray-800 hover:bg-gray-50"
          >
            🛍️ Shop Catalog
          </button>
          <button
            onClick={() => handleNav('daily_spin')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold bg-amber-50 text-amber-900 flex items-center gap-2"
          >
            <span>🎡</span>
            <span>Daily Spin 幸运转盘 (赢优惠券)</span>
          </button>
          <button
            onClick={() => handleNav('order_tracking')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold text-gray-800 hover:bg-gray-50 flex items-center gap-2"
          >
            <PackageCheck className="w-5 h-5 text-[#af101a]" />
            <span>My Purchases & Orders</span>
          </button>
          <button
            onClick={() => handleNav('order_tracking')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold text-gray-800 hover:bg-gray-50 flex items-center gap-2"
          >
            <Truck className="w-5 h-5 text-gray-500" />
            <span>Track Order Status</span>
          </button>
          <button
            onClick={() => handleNav('about')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold text-gray-800 hover:bg-gray-50"
          >
            ℹ️ About Us
          </button>
          <button
            onClick={() => handleNav('contact')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold text-gray-800 hover:bg-gray-50"
          >
            📞 Contact Us
          </button>
          <div className="pt-2 border-t border-gray-100">
            <a
              href="https://admin-beta-pink-11.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-left px-3 py-2.5 rounded-lg text-base font-bold bg-[#1a1c1c] text-white flex items-center gap-2"
            >
              <ShieldCheck className="w-5 h-5 text-[#af101a]" />
              <span>Boss Admin Console</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
