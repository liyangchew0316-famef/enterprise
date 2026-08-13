import React from 'react';
import { useApp } from '../context/AppContext';
import { Flame, ArrowRight } from 'lucide-react';
import cabaiLogo from '../assets/images/regenerated_image_1786627761972.png';

export const AboutView: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1a1c1c] via-[#2d3032] to-[#1a1c1c] text-white p-8 sm:p-12 rounded-3xl border-2 border-red-900/50 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-8 text-center sm:text-left">
        <div className="space-y-4 max-w-2xl">
          <span className="inline-block text-xs font-extrabold bg-[#af101a] text-white px-3 py-1 rounded-full uppercase tracking-wider">
            ABOUT CABAI ENTERPRISE™
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl tracking-tight">
            From Cabai to Something Real.
          </h1>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            CABAI ENTERPRISE™ started with a simple idea: <strong className="text-white">What if something as simple as “Cabai” could become something real?</strong>
          </p>
        </div>

        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-black border-2 border-red-800/80 overflow-hidden shadow-2xl shadow-red-950/60 shrink-0">
          <img 
            src={cabaiLogo} 
            alt="Official CABAI ENTERPRISE Logo" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Main Narrative Card */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-gray-200 shadow-xs space-y-8 text-gray-800">
        
        {/* Intro */}
        <div className="space-y-4">
          <p className="text-sm sm:text-base leading-relaxed text-gray-700">
            What started as a little inside joke eventually became an idea to create something we could actually build, design and print.
          </p>
          <p className="text-sm sm:text-base leading-relaxed text-gray-700">
            Today, <strong>CABAI ENTERPRISE™</strong> focuses on <strong className="text-[#af101a]">3D-printed products, custom designs and creative everyday objects</strong> — turning digital ideas into physical products.
          </p>
          <div className="p-4 bg-red-50/70 border-l-4 border-[#af101a] rounded-r-2xl font-bold text-sm text-gray-900">
            From a small Cabai keychain to a completely custom 3D print, every product is designed with one goal: <br/>
            <span className="text-[#af101a] font-extrabold text-base">Make something worth keeping.</span>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Our Story */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#af101a]" />
            <h2 className="font-heading font-extrabold text-2xl text-gray-900">OUR STORY</h2>
          </div>

          <div className="space-y-3 text-sm text-gray-700 leading-relaxed pl-2 border-l-2 border-gray-200">
            <p className="text-base font-bold text-gray-900">It started with <strong>Cabai. 🌶️</strong></p>
            <p className="text-base font-bold text-gray-900">Then came <strong>Cili.</strong></p>
            <p className="text-base font-bold text-[#af101a]">And somehow...</p>
            <p className="text-xl font-extrabold text-[#af101a] tracking-wide uppercase">Cibai.</p>
            <p>What began as a joke became the inspiration behind our brand identity.</p>
            <p>But we're serious about making things.</p>
            <p>We design, prototype and 3D print products that people can actually use, collect and enjoy.</p>
            <div className="pt-2 font-extrabold text-base text-gray-900">
              The joke started it.<br/>
              <span className="text-[#af101a]">3D printing made it real.</span>
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* What We Do */}
        <div className="space-y-4">
          <h2 className="font-heading font-extrabold text-2xl text-gray-900">WHAT WE DO</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            
            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
              <span className="text-2xl">📦</span>
              <h3 className="font-heading font-extrabold text-sm text-gray-900">3D PRINTED PRODUCTS</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Small, creative and practical products designed and printed in-house.
              </p>
            </div>

            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
              <span className="text-2xl">⚙️</span>
              <h3 className="font-heading font-extrabold text-sm text-gray-900">CUSTOM 3D PRINTING</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Have your own idea or 3D model? We'll help turn it into a physical object.
              </p>
            </div>

            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
              <span className="text-2xl">🌶️</span>
              <h3 className="font-heading font-extrabold text-sm text-gray-900">CABAI COLLECTION</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                A small collection inspired by the original Cabai story — including keychains, mini figures and desk accessories.
              </p>
            </div>

          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Our Mission */}
        <div className="space-y-4">
          <h2 className="font-heading font-extrabold text-2xl text-gray-900">OUR MISSION</h2>
          <div className="p-6 bg-[#1a1c1c] text-white rounded-2xl space-y-3">
            <p className="font-heading font-extrabold text-xl text-[#af101a]">Turn ideas into objects.</p>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              We believe 3D printing makes it possible for almost any idea to become something you can hold. Whether it's a useful desk accessory, a personalized gift or simply a tiny Cabai sitting on your desk...
            </p>
            <p className="font-bold text-sm text-white pt-1">
              if you can design it, you can print it.
            </p>
          </div>
        </div>

        {/* Note */}
        <div className="p-6 bg-red-50 rounded-2xl border border-red-200 text-center space-y-3">
          <h3 className="font-heading font-extrabold text-xs text-[#af101a] tracking-wider uppercase">
            A LITTLE NOTE FROM CABAI ENTERPRISE™
          </h3>
          <p className="text-xs sm:text-sm text-gray-700">
            We may have started with a joke about Cabai. But we're here to make real things.
          </p>
          <p className="font-heading font-extrabold text-lg text-gray-900">
            Designed. Printed. Delivered. 🌶️
          </p>

          <div className="pt-2">
            <button
              onClick={() => {
                setCurrentView('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-[#af101a] hover:bg-[#8d0a12] text-white font-extrabold text-xs rounded-xl shadow-md transition-colors inline-flex items-center gap-2"
            >
              <span>Explore The Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
