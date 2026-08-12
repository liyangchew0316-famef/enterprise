import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';

import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { ProductDetailView } from './views/ProductDetailView';
import { CustomPrintView } from './views/CustomPrintView';
import { CheckoutView } from './views/CheckoutView';
import { OrderTrackingView } from './views/OrderTrackingView';
import { BossAdminView } from './views/BossAdminView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';

const MainContent: React.FC = () => {
  const { currentView } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9f9]">
      <Header />
      
      <main className="flex-1">
        {currentView === 'home' && <HomeView />}
        {currentView === 'shop' && <ShopView />}
        {currentView === 'product_detail' && <ProductDetailView />}
        {currentView === 'custom_print' && <CustomPrintView />}
        {currentView === 'checkout' && <CheckoutView />}
        {currentView === 'order_tracking' && <OrderTrackingView />}
        {currentView === 'boss_admin' && <BossAdminView />}
        {currentView === 'about' && <AboutView />}
        {currentView === 'contact' && <ContactView />}
      </main>

      <Footer />
      <CartDrawer />
      <SearchModal />
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
