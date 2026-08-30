import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { AuthModal } from './components/AuthModal';
import { DailySpinModal } from './components/DailySpinModal';
import { BadgeCustomizer } from './components/BadgeCustomizer';
import { KeyboardCustomizer } from './components/KeyboardCustomizer';
import { SEOHead } from './components/SEOHead';
import { Sparkles, ArrowLeft } from 'lucide-react';

import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { ProductDetailView } from './views/ProductDetailView';
import { CustomPrintView } from './views/CustomPrintView';
import { CheckoutView } from './views/CheckoutView';
import { TngPaymentView } from './views/TngPaymentView';
import { OrderTrackingView } from './views/OrderTrackingView';
import { BossAdminView } from './views/BossAdminView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { TermsView } from './views/TermsView';
import { RegisterView, StepItem, SocialButton, InputGroup, PasswordInput } from './views/RegisterView';

const MainContent: React.FC = () => {
  const { currentView, setCurrentView } = useApp();
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isSpinModalOpen, setIsSpinModalOpen] = useState(false);

  // If view is daily_spin, trigger spin modal
  useEffect(() => {
    if (currentView === 'daily_spin') {
      setIsSpinModalOpen(true);
    }
  }, [currentView]);

  // If on register view, render the dedicated full-screen modern registration experience
  if (currentView === 'register') {
    return (
      <>
        <SEOHead />
        <RegisterView />
        <AuthModal />
        <Toast />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#070708] text-white relative selection:bg-[#af101a] selection:text-white">
      <SEOHead />
      <Header />
      
      <main className="flex-1 bg-[#070708]">
        {currentView === 'home' && <HomeView />}
        {currentView === 'shop' && <ShopView />}
        {currentView === 'product_detail' && <ProductDetailView />}
        {currentView === 'custom_print' && <CustomPrintView />}
        {currentView === 'checkout' && <CheckoutView />}
        {currentView === 'tng_payment' && <TngPaymentView />}
        {currentView === 'order_tracking' && <OrderTrackingView />}
        {currentView === 'boss_admin' && <BossAdminView />}
        {currentView === 'about' && <AboutView />}
        {currentView === 'contact' && <ContactView />}
        {currentView === 'terms' && <TermsView />}
        
        {/* Custom Badge Studio View */}
        {currentView === 'badge_custom' && (
          <div className="space-y-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
              <button
                onClick={() => setCurrentView('shop')}
                className="inline-flex items-center gap-2 text-xs font-bold text-white/60 hover:text-[#ff4d5a] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to 3D Shop Catalog</span>
              </button>
            </div>
            <BadgeCustomizer />
          </div>
        )}

        {/* If daily_spin fallback background view is shop */}
        {currentView === 'daily_spin' && <ShopView />}
      </main>

      {/* Floating Cabai AI Floating Launcher */}
      <button
        onClick={() => setIsAiOpen(true)}
        className="fixed bottom-6 right-6 z-30 bg-[#151517] hover:bg-[#1C1C20] text-white px-4 py-3 rounded-full shadow-2xl border border-white/15 hover:border-red-500/40 flex items-center gap-2.5 font-bold text-sm group hover:scale-105 transition-all active:scale-95 cursor-pointer backdrop-blur-md"
        title="Ask Cabai AI 3D Printing Assistant"
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#AF101A] to-[#E11D48] flex items-center justify-center text-white shadow-md">
          <Sparkles className="w-4 h-4 animate-pulse" />
        </div>
        <span className="font-heading tracking-wide">Ask Cabai AI</span>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#AF101A]"></span>
        </span>
      </button>

      {/* Quick Daily Spin Floating Button (Bottom Left) */}
      <button
        onClick={() => setIsSpinModalOpen(true)}
        className="fixed bottom-6 left-6 z-30 bg-[#151517] hover:bg-[#1C1C20] text-white px-3.5 py-2.5 rounded-full shadow-2xl border border-white/15 hover:border-amber-500/40 flex items-center gap-2 font-bold text-xs group hover:scale-105 transition-all active:scale-95 cursor-pointer backdrop-blur-md"
        title="Daily Lucky Spin Wheel (10%/20%/RM5 OFF)"
      >
        <span className="text-base group-hover:rotate-180 transition-transform duration-500">🎡</span>
        <span className="text-amber-300 font-mono-code font-bold">Spin &amp; Win</span>
      </button>

      <Footer />
      <CartDrawer />
      <SearchModal />
      <AiAssistantModal isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
      <DailySpinModal 
        isOpen={isSpinModalOpen} 
        onClose={() => {
          setIsSpinModalOpen(false);
          if (currentView === 'daily_spin') setCurrentView('shop');
        }} 
      />
      <AuthModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

// Export the required functional components for reusability
export { StepItem, SocialButton, InputGroup, PasswordInput };
