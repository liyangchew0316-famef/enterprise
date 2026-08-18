import React from 'react';
import { useApp } from '../context/AppContext';
import { Flame, ArrowRight, Trophy, Award, Sparkles, MapPin, Phone, Mail, CheckCircle2, Shield, Cpu, Layers } from 'lucide-react';
import { imageConfig } from '../config/assets';
import { HALL_OF_GLORY_MEMBERS, STUDIO_INFO } from '../data/mockData';

export const AboutView: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1a1c1c] via-[#2d3032] to-[#1a1c1c] text-white p-8 sm:p-12 rounded-3xl border-2 border-red-900/50 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-8 text-center sm:text-left">
        <div className="space-y-4 max-w-2xl">
          <span className="inline-block text-xs font-extrabold bg-[#af101a] text-white px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
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
            src={imageConfig.logos.official || imageConfig.logos.header} 
            alt="Official CABAI ENTERPRISE Logo" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.src = imageConfig.logos.favicon;
            }}
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

        {/* ========================================================================= */}
        {/* THE HALL OF GLORY (4 LEGENDS OF CABAI ENTERPRISE)                         */}
        {/* ========================================================================= */}
        <div className="space-y-6 pt-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-700 border border-amber-300 flex items-center justify-center shadow-xs">
                <Trophy className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h2 className="font-heading font-extrabold text-2xl text-gray-900 flex items-center gap-2">
                  <span>THE HALL OF GLORY</span>
                  <span className="text-xs font-bold px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full border border-amber-200 uppercase">
                    4 Legends
                  </span>
                </h2>
                <p className="text-xs text-gray-500">
                  Honoring the visionary creators, architects, and masters behind CABAI ENTERPRISE™
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {HALL_OF_GLORY_MEMBERS.map((member, idx) => (
              <div 
                key={member.id}
                className="bg-gradient-to-b from-white to-gray-50/80 rounded-3xl p-6 border-2 border-gray-200 hover:border-amber-400/80 shadow-xs hover:shadow-lg transition-all space-y-4 relative overflow-hidden group"
              >
                {/* Decorative corner glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/30 rounded-bl-full -mr-10 -mt-10 pointer-events-none group-hover:scale-110 transition-transform" />

                {/* Header with Avatar & Role */}
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#1a1c1c] text-white flex items-center justify-center text-3xl shrink-0 shadow-md border border-gray-800 relative group-hover:scale-105 transition-transform">
                    <span>{member.avatarEmoji}</span>
                    <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-500 text-black text-[11px] font-extrabold rounded-full flex items-center justify-center shadow-xs">
                      #{idx + 1}
                    </span>
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-heading font-extrabold text-lg text-gray-900">
                        {member.name}
                      </h3>
                    </div>
                    <div className="text-xs font-bold text-[#af101a]">
                      {member.role}
                    </div>
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300/80">
                      <Award className="w-3 h-3 text-amber-700" />
                      <span>{member.badge}</span>
                    </div>
                  </div>
                </div>

                {/* Specialty Pill */}
                <div className="bg-gray-100/80 rounded-xl p-2.5 text-xs text-gray-700 flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-[#af101a] shrink-0" />
                  <span className="font-semibold text-[11px] truncate">
                    <strong>Specialty:</strong> {member.specialty}
                  </span>
                </div>

                {/* Bio */}
                <p className="text-xs text-gray-600 leading-relaxed">
                  {member.bio}
                </p>

                {/* Legendary Quote */}
                <blockquote className="p-3 bg-red-50/60 rounded-xl border-l-3 border-[#af101a] text-[11px] italic font-medium text-gray-800">
                  {member.quote}
                </blockquote>

                {/* Key Achievements */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                    Hall of Fame Milestones:
                  </span>
                  <ul className="space-y-1 text-[11px] text-gray-700">
                    {member.achievements.map((ach, aIdx) => (
                      <li key={aIdx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            ))}
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Studio Info Card */}
        <div className="bg-[#1a1c1c] text-white p-6 sm:p-8 rounded-3xl border border-gray-800 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <h2 className="font-heading font-extrabold text-lg text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#af101a]" />
              <span>OFFICIAL STUDIO INFORMATION</span>
            </h2>
            <span className="text-[10px] font-bold px-2.5 py-1 bg-red-950 text-red-300 rounded-full border border-red-800">
              Malaysia Maker Studio
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="bg-black/40 p-4 rounded-2xl border border-gray-800 space-y-1">
              <span className="text-gray-400 font-bold block text-[10px] uppercase">Studio Location</span>
              <strong className="text-white text-sm block">{STUDIO_INFO.location}</strong>
              <span className="text-[11px] text-gray-400">Digital 3D CAD & Print Production Hub</span>
            </div>

            <div className="bg-black/40 p-4 rounded-2xl border border-gray-800 space-y-1">
              <span className="text-gray-400 font-bold block text-[10px] uppercase">WhatsApp & Phone</span>
              <a 
                href={STUDIO_INFO.whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 font-bold text-sm block hover:underline"
              >
                {STUDIO_INFO.phone}
              </a>
              <span className="text-[11px] text-gray-400">Direct consultations & bulk inquiries</span>
            </div>

            <div className="bg-black/40 p-4 rounded-2xl border border-gray-800 space-y-1">
              <span className="text-gray-400 font-bold block text-[10px] uppercase">Email Inquiry</span>
              <a 
                href={`mailto:${STUDIO_INFO.email}`} 
                className="text-red-400 hover:text-red-300 font-bold text-sm block hover:underline"
              >
                {STUDIO_INFO.email}
              </a>
              <span className="text-[11px] text-gray-400">CAD files & corporate projects</span>
            </div>
          </div>
        </div>

        {/* Our Mission */}
        <div className="space-y-4">
          <h2 className="font-heading font-extrabold text-2xl text-gray-900">OUR MISSION</h2>
          <div className="p-6 bg-gray-50 border border-gray-200 text-gray-800 rounded-2xl space-y-3">
            <p className="font-heading font-extrabold text-xl text-[#af101a]">Turn ideas into objects.</p>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              We believe 3D printing makes it possible for almost any idea to become something you can hold. Whether it's a useful desk accessory, a personalized gift or simply a tiny Cabai sitting on your desk...
            </p>
            <p className="font-bold text-sm text-gray-900 pt-1">
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

          <div className="pt-2 flex flex-wrap justify-center gap-3">
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

            <button
              onClick={() => {
                setCurrentView('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-white hover:bg-gray-100 text-gray-800 font-extrabold text-xs rounded-xl border border-gray-300 shadow-xs transition-colors inline-flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#af101a]" />
              <span>Contact Studio</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

