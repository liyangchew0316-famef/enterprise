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
      <div className="bg-[#111113] p-6 sm:p-10 rounded-3xl border border-white/10 shadow-xl space-y-8 text-white">
        
        {/* Intro */}
        <div className="space-y-4">
          <p className="text-sm sm:text-base leading-relaxed text-white/80">
            What started as a little inside joke eventually became an idea to create something we could actually build, design and print.
          </p>
          <p className="text-sm sm:text-base leading-relaxed text-white/80">
            Today, <strong>CABAI ENTERPRISE™</strong> focuses on <strong className="text-[#FF4D5A]">3D-printed products, custom designs and creative everyday objects</strong> — turning digital ideas into physical products.
          </p>
          <div className="p-4 bg-red-950/30 border-l-4 border-[#AF101A] rounded-r-2xl font-bold text-sm text-white border border-white/10">
            From a small Cabai keychain to a completely custom 3D print, every product is designed with one goal: <br/>
            <span className="text-[#FF4D5A] font-extrabold text-base">Make something worth keeping.</span>
          </div>
        </div>

        <hr className="border-white/10" />

        {/* Our Story */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#FF4D5A]" />
            <h2 className="font-heading font-extrabold text-2xl text-white">OUR STORY</h2>
          </div>

          <div className="space-y-3 text-sm text-white/80 leading-relaxed pl-2 border-l-2 border-white/20">
            <p className="text-base font-bold text-white">It started with <strong>Cabai. 🌶️</strong></p>
            <p className="text-base font-bold text-white">Then came <strong>Cili.</strong></p>
            <p className="text-base font-bold text-[#FF4D5A]">And somehow...</p>
            <p className="text-xl font-extrabold text-[#FF4D5A] tracking-wide uppercase">Cibai.</p>
            <p>What began as a joke became the inspiration behind our brand identity.</p>
            <p>But we're serious about making things.</p>
            <p>We design, prototype and 3D print products that people can actually use, collect and enjoy.</p>
            <div className="pt-2 font-extrabold text-base text-white">
              The joke started it.<br/>
              <span className="text-[#FF4D5A]">3D printing made it real.</span>
            </div>
          </div>
        </div>

        <hr className="border-white/10" />

        {/* What We Do */}
        <div className="space-y-4">
          <h2 className="font-heading font-extrabold text-2xl text-white">WHAT WE DO</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            
            <div className="p-5 bg-[#18181B] rounded-2xl border border-white/10 space-y-2">
              <span className="text-2xl">📦</span>
              <h3 className="font-heading font-extrabold text-sm text-white">3D PRINTED PRODUCTS</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Small, creative and practical products designed and printed in-house.
              </p>
            </div>

            <div className="p-5 bg-[#18181B] rounded-2xl border border-white/10 space-y-2">
              <span className="text-2xl">⚙️</span>
              <h3 className="font-heading font-extrabold text-sm text-white">CUSTOM 3D PRINTING</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Have your own idea or 3D model? We'll help turn it into a physical object.
              </p>
            </div>

            <div className="p-5 bg-[#18181B] rounded-2xl border border-white/10 space-y-2">
              <span className="text-2xl">🌶️</span>
              <h3 className="font-heading font-extrabold text-sm text-white">CABAI COLLECTION</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                A small collection inspired by the original Cabai story — including keychains, mini figures and desk accessories.
              </p>
            </div>

          </div>
        </div>

        <hr className="border-white/10" />

        {/* ========================================================================= */}
        {/* THE HALL OF GLORY (4 LEGENDS OF CABAI ENTERPRISE)                         */}
        {/* ========================================================================= */}
        <div className="space-y-6 pt-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shadow-md">
                <Trophy className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h2 className="font-heading font-extrabold text-2xl text-white flex items-center gap-2">
                  <span>THE HALL OF GLORY</span>
                  <span className="text-xs font-bold px-2.5 py-0.5 bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/40 uppercase">
                    4 Legends
                  </span>
                </h2>
                <p className="text-xs text-white/50">
                  Honoring the visionary creators, architects, and masters behind CABAI ENTERPRISE™
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {HALL_OF_GLORY_MEMBERS.map((member, idx) => (
              <div 
                key={member.id}
                className="bg-[#18181B] rounded-3xl p-6 border border-white/10 hover:border-amber-400/60 shadow-lg transition-all space-y-4 relative overflow-hidden group"
              >
                {/* Decorative corner glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-bl-full -mr-10 -mt-10 pointer-events-none group-hover:scale-110 transition-transform" />

                {/* Header with Avatar & Role */}
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#0D0D10] text-white flex items-center justify-center text-3xl shrink-0 shadow-md border border-white/15 relative group-hover:scale-105 transition-transform">
                    <span>{member.avatarEmoji}</span>
                    <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-500 text-black text-[11px] font-extrabold rounded-full flex items-center justify-center shadow-xs">
                      #{idx + 1}
                    </span>
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-heading font-extrabold text-lg text-white">
                        {member.name}
                      </h3>
                    </div>
                    <div className="text-xs font-bold text-[#FF4D5A]">
                      {member.role}
                    </div>
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      <Award className="w-3 h-3 text-amber-400" />
                      <span>{member.badge}</span>
                    </div>
                  </div>
                </div>

                {/* Specialty Pill */}
                <div className="bg-[#111113] rounded-xl p-2.5 text-xs text-white/80 flex items-center gap-2 border border-white/5">
                  <Cpu className="w-3.5 h-3.5 text-[#FF4D5A] shrink-0" />
                  <span className="font-semibold text-[11px] truncate">
                    <strong>Specialty:</strong> {member.specialty}
                  </span>
                </div>

                {/* Bio */}
                <p className="text-xs text-white/70 leading-relaxed">
                  {member.bio}
                </p>

                {/* Legendary Quote */}
                <blockquote className="p-3 bg-red-950/40 rounded-xl border-l-4 border-[#AF101A] text-[11px] italic font-medium text-white/90 border border-white/5">
                  {member.quote}
                </blockquote>

                {/* Key Achievements */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-extrabold text-white/40 uppercase tracking-wider block">
                    Hall of Fame Milestones:
                  </span>
                  <ul className="space-y-1 text-[11px] text-white/80">
                    {member.achievements.map((ach, aIdx) => (
                      <li key={aIdx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            ))}
          </div>
        </div>

        <hr className="border-white/10" />

        {/* Studio Info Card */}
        <div className="bg-[#18181B] text-white p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="font-heading font-extrabold text-lg text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#FF4D5A]" />
              <span>OFFICIAL STUDIO INFORMATION</span>
            </h2>
            <span className="text-[10px] font-bold px-2.5 py-1 bg-red-950 text-red-300 rounded-full border border-red-800">
              Malaysia Maker Studio
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="bg-[#111113] p-4 rounded-2xl border border-white/10 space-y-1">
              <span className="text-white/40 font-bold block text-[10px] uppercase">Studio Location</span>
              <strong className="text-white text-sm block">{STUDIO_INFO.location}</strong>
              <span className="text-[11px] text-white/50">Digital 3D CAD & Print Production Hub</span>
            </div>

            <div className="bg-[#111113] p-4 rounded-2xl border border-white/10 space-y-1">
              <span className="text-white/40 font-bold block text-[10px] uppercase">WhatsApp & Phone</span>
              <a 
                href={STUDIO_INFO.whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 font-bold text-sm block hover:underline"
              >
                {STUDIO_INFO.phone}
              </a>
              <span className="text-[11px] text-white/50">Direct consultations & bulk inquiries</span>
            </div>

            <div className="bg-[#111113] p-4 rounded-2xl border border-white/10 space-y-1">
              <span className="text-white/40 font-bold block text-[10px] uppercase">Email Inquiry</span>
              <a 
                href={`mailto:${STUDIO_INFO.email}`} 
                className="text-[#FF4D5A] hover:text-red-300 font-bold text-sm block hover:underline"
              >
                {STUDIO_INFO.email}
              </a>
              <span className="text-[11px] text-white/50">CAD files & corporate projects</span>
            </div>
          </div>
        </div>

        {/* Our Mission */}
        <div className="space-y-4">
          <h2 className="font-heading font-extrabold text-2xl text-white">OUR MISSION</h2>
          <div className="p-6 bg-[#18181B] border border-white/10 text-white rounded-2xl space-y-3">
            <p className="font-heading font-extrabold text-xl text-[#FF4D5A]">Turn ideas into objects.</p>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              We believe 3D printing makes it possible for almost any idea to become something you can hold. Whether it's a useful desk accessory, a personalized gift or simply a tiny Cabai sitting on your desk...
            </p>
            <p className="font-bold text-sm text-white pt-1">
              if you can design it, you can print it.
            </p>
          </div>
        </div>

        {/* Note */}
        <div className="p-6 bg-[#18181B] rounded-2xl border border-red-900/40 text-center space-y-3">
          <h3 className="font-heading font-extrabold text-xs text-[#FF4D5A] tracking-wider uppercase">
            A LITTLE NOTE FROM CABAI ENTERPRISE™
          </h3>
          <p className="text-xs sm:text-sm text-white/80">
            We may have started with a joke about Cabai. But we're here to make real things.
          </p>
          <p className="font-heading font-extrabold text-lg text-white">
            Designed. Printed. Delivered. 🌶️
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => {
                setCurrentView('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-[#AF101A] hover:bg-[#E11D48] text-white font-extrabold text-xs rounded-xl shadow-md transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Explore The Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setCurrentView('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-[#111113] hover:bg-white/10 text-white font-extrabold text-xs rounded-xl border border-white/15 shadow-sm transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <Phone className="w-4 h-4 text-[#FF4D5A]" />
              <span>Contact Studio</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

