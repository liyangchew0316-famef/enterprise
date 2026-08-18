import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { AuthModal } from './components/AuthModal';
import { Sparkles } from 'lucide-react';

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

const MainContent: React.FC = () => {
  const { currentView } = useApp();
  const [isAiOpen, setIsAiOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9f9] relative">
      <Header />
      
      <main className="flex-1">
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
      </main>

      {/* Floating Cabai AI Floating Launcher */}
      <button
        onClick={() => setIsAiOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#1a1c1c] hover:bg-black text-white px-4 py-3 rounded-full shadow-2xl border-2 border-red-600/50 flex items-center gap-2.5 font-bold text-sm group hover:scale-105 transition-all active:scale-95"
        title="Ask Cabai AI 3D Printing Assistant"
      >
        <div className="w-7 h-7 rounded-full bg-[#af101a] flex items-center justify-center text-white shadow-sm">
          <Sparkles className="w-4 h-4 animate-pulse" />
        </div>
        <span className="font-heading tracking-wide">Ask Cabai AI</span>
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
        </span>
      </button>

      <Footer />
      <CartDrawer />
      <SearchModal />
      <AiAssistantModal isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
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
