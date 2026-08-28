import React from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Phone, Mail, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { imageConfig } from '../config/assets';

export const Footer: React.FC = () => {
  const { setCurrentView, setActiveCategory } = useApp();

  const navTo = (view: any, cat?: any) => {
    if (cat) setActiveCategory(cat);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1a1a1a] text-[#f8f7f4] pt-16 pb-12 border-t-2 border-[#af101a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                <img 
                  src={imageConfig.logos.footer} 
                  alt="Cabai Enterprise Logo" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = imageConfig.logos.favicon;
                  }}
                />
              </div>
              <div>
                <div className="font-heading font-extrabold text-lg tracking-tight text-white leading-none">
                  CABAI <span className="text-[#af101a]">ENTERPRISE</span>
                </div>
                <div className="studio-label text-[9px] text-white/50 uppercase mt-0.5">
                  Maker Studio • Penang
                </div>
              </div>
            </div>
            <p className="text-white/60 text-xs leading-relaxed">
              Specialist maker studio based in Penang, Malaysia. Focused on precision rapid prototyping, 0.12mm layer resolution, and custom 3D printing solutions.
            </p>

            <div className="pt-1 space-y-1 text-xs text-white/60 font-mono-code">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#af101a] shrink-0" />
                <span>Bukit Mertajam, Penang, MY</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#af101a] shrink-0" />
                <a href="https://wa.me/60129058515" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  +60 12-905 8515 (WhatsApp)
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Products */}
          <div className="space-y-3">
            <span className="studio-label text-[#af101a] block font-bold">
              [ PRODUCTS ]
            </span>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <button onClick={() => navTo('shop', 'keychains')} className="hover:text-white transition-colors cursor-pointer">
                  Keychains &amp; Accessories
                </button>
              </li>
              <li>
                <button onClick={() => navTo('shop', 'badges')} className="hover:text-white transition-colors cursor-pointer">
                  Badges &amp; Name Tags
                </button>
              </li>
              <li>
                <button onClick={() => navTo('shop', 'desk')} className="hover:text-white transition-colors cursor-pointer">
                  Phone Holders &amp; Stands
                </button>
              </li>
              <li>
                <button onClick={() => navTo('custom_print')} className="hover:text-white transition-colors cursor-pointer text-[#af101a] font-semibold flex items-center gap-1">
                  <span>Custom Prints &amp; Draw Lab</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </li>
              <li>
                <button onClick={() => navTo('shop', 'toys')} className="hover:text-white transition-colors cursor-pointer">
                  Fidget Clickers &amp; Articulated Models
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Studio */}
          <div className="space-y-3">
            <span className="studio-label text-[#af101a] block font-bold">
              [ STUDIO ]
            </span>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <button onClick={() => navTo('about')} className="hover:text-white transition-colors cursor-pointer">
                  About Cabai Enterprise
                </button>
              </li>
              <li>
                <button onClick={() => navTo('order_tracking')} className="hover:text-white transition-colors cursor-pointer">
                  Track Order Status
                </button>
              </li>
              <li>
                <button onClick={() => navTo('daily_spin')} className="hover:text-white transition-colors cursor-pointer">
                  Daily Spin &amp; Rewards
                </button>
              </li>
              <li>
                <button onClick={() => navTo('about')} className="hover:text-white transition-colors cursor-pointer">
                  The Hall of Glory 🏆
                </button>
              </li>
              <li>
                <button onClick={() => navTo('terms')} className="hover:text-white transition-colors cursor-pointer">
                  Production Specs &amp; Terms
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Connect & Admin */}
          <div className="space-y-3">
            <span className="studio-label text-[#af101a] block font-bold">
              [ CONNECT ]
            </span>
            <p className="text-xs text-white/60 leading-relaxed">
              Inquiries for custom bulk prints, corporate merchandise, or 3D prototyping assistance.
            </p>
            <div className="pt-1 space-y-2">
              <a 
                href="https://wa.me/60129058515" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                <span>WhatsApp Fast Chat</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>

              <div>
                <a 
                  href="https://admin-beta-pink-11.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#af101a] hover:bg-[#8d0a12] text-white text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Boss Admin Console</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono-code text-white/40 gap-4">
          <div>
            &copy; 2026 CABAI ENTERPRISE. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-4 uppercase tracking-widest text-[10px]">
            <span>MADE IN PENANG, MALAYSIA</span>
            <span>•</span>
            <button onClick={() => navTo('terms')} className="hover:text-white cursor-pointer">TERMS</button>
          </div>
        </div>

      </div>
    </footer>
  );
};

