import React from 'react';
import { imageConfig } from '../config/assets';

export const CabaiLoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070708] text-white select-none">
      <div className="relative flex flex-col items-center gap-4">
        {/* Glowing Halo */}
        <div className="absolute -inset-4 bg-radial from-[#AF101A]/30 to-transparent blur-2xl rounded-full animate-pulse" />

        {/* Logo with Spin/Pulse */}
        <div className="relative w-16 h-16 rounded-2xl bg-[#111113] border border-white/15 p-2 shadow-2xl flex items-center justify-center">
          <img
            src={imageConfig.logos.header}
            alt="Cabai Enterprise"
            className="w-full h-full object-contain"
            onError={(e) => {
              e.currentTarget.src = imageConfig.logos.favicon;
            }}
          />
        </div>

        {/* Title & Spinner */}
        <div className="text-center space-y-1.5 z-10">
          <div className="flex items-center justify-center gap-2">
            <div className="w-3.5 h-3.5 border-2 border-[#AF101A] border-t-transparent rounded-full animate-spin" />
            <h3 className="font-heading font-extrabold text-sm tracking-wider uppercase text-white">
              CABAI ENTERPRISE
            </h3>
          </div>
          <p className="text-[11px] font-mono-code text-white/50">
            Initializing 3D Maker Studio...
          </p>
        </div>
      </div>
    </div>
  );
};
