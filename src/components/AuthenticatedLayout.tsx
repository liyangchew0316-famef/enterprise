import React, { useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from './CartDrawer';
import { SearchModal } from './SearchModal';
import { AuthModal } from './AuthModal';
import { Toast } from './Toast';
import { SEOHead } from './SEOHead';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#070708] text-white relative selection:bg-[#AF101A] selection:text-white font-sans">
      <SEOHead />
      <Header />

      <main className="flex-1 bg-[#070708] relative">
        {children}
      </main>

      <Footer />
      <CartDrawer />
      <SearchModal />
      <AuthModal />
      <Toast />
    </div>
  );
};
