import React from 'react';
import { useApp } from '../context/AppContext';
import { Flame, MapPin, Mail, Phone, ShieldCheck, Heart, ArrowRight } from 'lucide-react';
import cabaiLogo from '../assets/images/cabai_official_logo_1786624077846.jpg';

export const Footer: React.FC = () => {
  const { setCurrentView, setActiveCategory } = useApp();

  const navTo = (view: any, cat?: any) => {
    if (cat) setActiveCategory(cat);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1a1c1c] text-white pt-16 pb-12 border-t-4 border-[#af101a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-black border border-red-900/50 overflow-hidden shadow-lg shadow-red-950/40 flex items-center justify-center shrink-0">
                <img 
                  src={cabaiLogo} 
                  alt="CABAI ENTERPRISE Logo" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="font-heading font-extrabold text-xl tracking-tight">
                CABAI <span className="text-[#af101a]">ENTERPRISE</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Malaysia’s premier 3D printing studio. Turning digital CAD concepts and STL files into physical precision products with premium PLA+, PETG, and flexible TPU materials.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-gray-400">
              <MapPin className="w-4 h-4 text-[#af101a] shrink-0" />
              <span>Inside your computer</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-base text-white uppercase tracking-wider">
              Explore Products
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <button onClick={() => navTo('shop')} className="hover:text-[#af101a] transition-colors">
                  Full Catalog
                </button>
              </li>
              <li>
                <button onClick={() => navTo('shop', 'keychains')} className="hover:text-[#af101a] transition-colors flex items-center gap-1.5">
                  <span>Cabai Keychains</span>
                  <span className="text-[10px] bg-red-900/60 text-red-300 px-1.5 py-0.5 rounded-full font-bold">Best Seller</span>
                </button>
              </li>
              <li>
                <button onClick={() => navTo('shop', 'organizers')} className="hover:text-[#af101a] transition-colors">
                  Desk Organizers
                </button>
              </li>
              <li>
                <button onClick={() => navTo('shop', 'desk')} className="hover:text-[#af101a] transition-colors">
                  Phone Stands & Holders
                </button>
              </li>
              <li>
                <button onClick={() => navTo('custom_print')} className="hover:text-[#af101a] transition-colors font-medium text-white flex items-center gap-1">
                  <span>Upload STL File</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#af101a]" />
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-base text-white uppercase tracking-wider">
              Support & Track
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <button onClick={() => navTo('order_tracking')} className="hover:text-[#af101a] transition-colors">
                  Track Parcel Status
                </button>
              </li>
              <li>
                <button onClick={() => navTo('about')} className="hover:text-[#af101a] transition-colors">
                  Our 3D Printers & Quality Guarantee
                </button>
              </li>
              <li>
                <button onClick={() => navTo('contact')} className="hover:text-[#af101a] transition-colors">
                  Contact Maker Studio
                </button>
              </li>
              <li>
                <button onClick={() => navTo('boss_admin')} className="hover:text-[#af101a] transition-colors text-amber-400 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Boss Admin Dashboard</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Payments & Guarantee */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-base text-white uppercase tracking-wider">
              Payments Accepted
            </h4>

            <div className="pt-1">
              <div className="flex flex-wrap gap-2 text-xs font-bold text-gray-300">
                <span className="px-2.5 py-1 rounded bg-gray-800 border border-gray-700">FPX Online</span>
                <span className="px-2.5 py-1 rounded bg-gray-800 border border-gray-700">Touch 'n Go</span>
                <span className="px-2.5 py-1 rounded bg-gray-800 border border-gray-700">Visa / Mastercard</span>
                <span className="px-2.5 py-1 rounded bg-gray-800 border border-gray-700">GrabPay</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <div>
            © 2026 CABAI ENTERPRISE™ (SSM Registered: 202603019821). All Rights Reserved. Crafted with 🌶️ in Malaysia.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navTo('about')} className="hover:underline">Privacy Policy</button>
            <span>•</span>
            <button onClick={() => navTo('about')} className="hover:underline">Terms of Service</button>
          </div>
        </div>

      </div>
    </footer>
  );
};
