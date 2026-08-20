import React from 'react';
import { useApp } from '../context/AppContext';
import { ProductImage } from '../components/ProductImage';
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
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1a1c1c] via-[#232628] to-[#1a1c1c] text-white py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-b-4 border-[#af101a]">
        
        {/* Subtle background mesh grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/80 border border-red-800/60 text-red-300 text-xs font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#af101a] animate-ping" />
              <span>3D PRINTED MAKER STUDIO</span>
            </div>

            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-tight">
              TURN YOUR IDEAS INTO <span className="text-[#af101a] underline decoration-red-800/50 underline-offset-8">SOMETHING REAL</span>
            </h1>

            <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Precision 3D printed keychains, modular desk organizers, interactive custom chili drawing studio, and instant 3D printing quotes delivered across Malaysia.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={() => {
                  setCurrentView('shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-8 py-4 bg-[#af101a] hover:bg-[#8d0a12] text-white font-extrabold rounded-xl shadow-lg shadow-red-900/40 transition-all flex items-center justify-center gap-2 text-base group"
              >
                <span>Shop Products</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  setCurrentView('custom_print');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-gray-700 hover:border-gray-500 font-extrabold rounded-xl backdrop-blur-xs transition-all flex items-center justify-center gap-2 text-base"
              >
                <Paintbrush className="w-5 h-5 text-[#af101a]" />
                <span>Draw Custom Chili 🌶️</span>
              </button>
            </div>

            {/* Micro Specs Bar */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-gray-800 text-center lg:text-left text-xs text-gray-400">
              <div>
                <strong className="block text-white font-bold text-sm">0.12mm</strong>
                <span>Ultra Fine Resolution</span>
              </div>
              <div>
                <strong className="block text-white font-bold text-sm">24-48 Hrs</strong>
                <span>Fast Studio Printing</span>
              </div>
              <div>
                <strong className="block text-white font-bold text-sm">PLA+ & PETG</strong>
                <span>Eco & Tough Materials</span>
              </div>
            </div>

          </div>

          {/* Right Visual Banner */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-800 bg-gray-900 group">
              <ProductImage
                src={products[0]?.images[0]}
                productId={products[0]?.id || 'prod-keyboard-clicker'}
                alt={products[0]?.name || 'Cabai 3D Printed'}
                className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6">
                <span className="text-xs font-bold text-[#af101a] uppercase tracking-wider mb-1">
                  Featured Product
                </span>
                <h3 className="font-heading font-extrabold text-2xl text-white">
                  {products[0]?.name || 'Keyboard Clicker'}
                </h3>
                <p className="text-xs text-gray-300 mt-1">
                  {products[0]?.subtitle || 'Custom 3D Printed Switch Fidget'}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-heading font-extrabold text-lg text-white">
                    RM {(products[0]?.price || 5.00).toFixed(2)}{' '}
                    {products[0]?.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">
                        RM {products[0]?.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </span>
                  <button
                    onClick={() => openProductDetail(products[0])}
                    className="px-4 py-2 bg-[#af101a] text-white font-bold text-xs rounded-lg hover:bg-[#8d0a12] transition-colors"
                  >
                    View Product
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

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
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col group"
            >
              {/* Image Box */}
              <div 
                className="relative h-60 bg-gray-100 overflow-hidden cursor-pointer"
                onClick={() => openProductDetail(product)}
              >
                <ProductImage
                  src={product.images[0]}
                  productId={product.id}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {product.isBestSeller && (
                  <span className="absolute top-3 left-3 bg-[#af101a] text-white text-[11px] font-extrabold px-2.5 py-1 rounded-md shadow-xs">
                    Best Seller 🌶️
                  </span>
                )}

                <span className="absolute bottom-3 right-3 bg-black/70 text-white text-[11px] font-medium px-2 py-0.5 rounded backdrop-blur-xs">
                  {product.specifications.material}
                </span>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-semibold text-gray-500 mb-1">
                    {product.subtitle}
                  </div>
                  <h3 
                    onClick={() => openProductDetail(product)}
                    className="font-heading font-bold text-base text-[#1a1c1c] hover:text-[#af101a] cursor-pointer transition-colors line-clamp-1"
                  >
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center text-amber-500 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                      {product.rating}
                    </div>
                    <span className="text-xs text-gray-400">({product.reviewsCount} reviews)</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 mt-4 flex items-center justify-between">
                  <div>
                    <span className="font-heading font-extrabold text-lg text-[#af101a]">
                      RM {product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-400 line-through ml-1.5">
                        RM {product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    className="px-3.5 py-2 bg-[#1a1c1c] hover:bg-[#af101a] text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    + Add to Cart
                  </button>
                </div>

              </div>

            </div>
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
