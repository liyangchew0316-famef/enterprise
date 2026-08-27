import React from 'react';
import { useApp } from '../context/AppContext';
import { ProductImage } from '../components/ProductImage';
import { ProductCard } from '../components/ProductCard';
import { HeroCarousel } from '../components/HeroCarousel';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Truck, 
  Zap, 
  Star, 
  Layers, 
  CheckCircle2,
  Flame,
  ChevronRight,
  Paintbrush,
  Cloud
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { 
    products, 
    openProductDetail, 
    setCurrentView, 
    setActiveCategory, 
    addToCart 
  } = useApp();

  const featuredProducts = products.slice(0, 4);

  const handleShopCategory = (cat: any) => {
    setActiveCategory(cat);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Full-Viewport Hero Carousel */}
      <HeroCarousel />

      {/* Trust Highlights Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-[#af101a] flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#1a1c1c]">Fast Delivery Across MY</h4>
              <p className="text-xs text-gray-500">FREE shipping over RM 80 via Pos Laju / J&T</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-[#af101a] flex items-center justify-center shrink-0">
              <Paintbrush className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#1a1c1c]">Custom Chili Drawing Lab</h4>
              <p className="text-xs text-gray-500">Draw directly on chili & save to Firebase</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-[#af101a] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#1a1c1c]">Studio Quality Guarantee</h4>
              <p className="text-xs text-gray-500">Hand-inspected before dispatch</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-[#af101a] flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#1a1c1c]">24-48 Hours Production</h4>
              <p className="text-xs text-gray-500">Made fresh in Maker Studio</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-extrabold text-[#af101a] uppercase tracking-wider mb-1">
              Top Picks & Best Sellers
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1a1c1c]">
              Featured Maker Products
            </h2>
          </div>

          <button
            onClick={() => handleShopCategory('all')}
            className="text-sm font-bold text-[#af101a] hover:underline flex items-center gap-1"
          >
            <span>View All Products</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
              onViewProduct={openProductDetail}
            />
          ))}
        </div>

      </section>

      {/* Custom Chili Drawing Lab Teaser Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#1a1c1c] to-[#2d3032] text-white rounded-3xl p-8 lg:p-12 border-2 border-red-900/50 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-block text-xs font-extrabold bg-[#af101a] text-white px-3 py-1 rounded-full uppercase tracking-wider">
              INTERACTIVE 3D DESIGN STUDIO
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl">
              DRAW YOUR CUSTOM 3D CHILI & SAVE TO FIREBASE 🌶️
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Use our interactive digital canvas to sketch designs, stamp spicy 3D emojis, add embossed names directly onto the Cabai pepper mascot, and save your creations to the Firebase Cloud gallery.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setCurrentView('custom_print');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-7 py-3.5 bg-[#af101a] hover:bg-[#8d0a12] text-white font-extrabold rounded-xl shadow-md transition-colors inline-flex items-center gap-2"
              >
                <Paintbrush className="w-5 h-5" />
                <span>Launch Chili Drawing Canvas</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Natural Story & Studio Capabilities Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
        <div className="bg-white rounded-3xl p-8 lg:p-10 border border-gray-200 shadow-xs">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-[#af101a] rounded-full text-xs font-bold mb-3">
              <span>🇲🇾 Dedicated 3D Printing Maker Studio in Malaysia</span>
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900 mb-4">
              Cabai Enterprise: Precision 3D Printing & Custom Maker Craftsmanship
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
              Welcome to <strong>Cabai Enterprise</strong> (Cabai 3D Printing), your trusted destination for <strong>3D printed products in Malaysia</strong>. Based in Penang and servicing Bukit Mertajam and all states across Malaysia, we transform creative concepts into durable, high-detail physical items using high-grade PLA+ and PETG materials.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              From our studio-signature <strong>Cabai keychains</strong>, articulated 3D printed toys, and modular desk accessories to personalized 3D pins and custom corporate badges, each piece is sliced at 0.12–0.16mm ultra-fine resolution for smooth layer finishes and structural integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-gray-100 text-xs">
            <div className="space-y-1.5">
              <h3 className="font-bold text-sm text-gray-900">Custom 3D Printing Malaysia</h3>
              <p className="text-gray-500 leading-relaxed">
                Upload images, customize embossed text on keyboard clickers and badges, or draw directly on our interactive 3D canvas for personalized fabrication.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-sm text-gray-900">Penang & Bukit Mertajam Fulfillment</h3>
              <p className="text-gray-500 leading-relaxed">
                Operating a multi-station CoreXY printing fleet to guarantee 24–48 hour rapid dispatch via express courier to every doorstep in Malaysia.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-sm text-gray-900">3D Printed Toys & Accessories</h3>
              <p className="text-gray-500 leading-relaxed">
                Explore mechanical switch fidgets, flexi dragons, phone stands, honeycomb pen pots, and unique stationery items designed for makers and creators.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
