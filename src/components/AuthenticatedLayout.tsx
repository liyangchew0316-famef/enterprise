import React, { useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from './CartDrawer';
import { SearchModal } from './SearchModal';
import { AiAssistantModal } from './AiAssistantModal';
import { AuthModal } from './AuthModal';
import { Toast } from './Toast';
import { SEOHead } from './SEOHead';
import { Sparkles } from 'lucide-react';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children }) => {
  const [isAiOpen, setIsAiOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#070708] text-white relative selection:bg-[#AF101A] selection:text-white font-sans">
      <SEOHead />
      <Header />

      <main className="flex-1 bg-[#070708] relative">
        {children}
      </main>

      {/* Floating Cabai AI Assistant Launcher */}
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

      <Footer />
      <CartDrawer />
      <SearchModal />
      <AiAssistantModal isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
      <AuthModal />
      <Toast />
    </div>
  );
};
