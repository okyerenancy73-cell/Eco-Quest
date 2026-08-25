import React from 'react';
import { ArrowRight, Leaf } from 'lucide-react';
import logoImg from '../assets/images/ecoquest_logo_1787141216833.jpg';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogIn: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogIn }) => {
  return (
    <div className="min-h-screen bg-[#F8FCF8] text-[#1F2937] flex flex-col justify-between items-center relative overflow-hidden font-sans select-none selection:bg-[#2E7D32] selection:text-white">
      
      {/* Top Mobile Status Bar Spacer / Header */}
      <div className="w-full max-w-md px-6 pt-4 pb-2 flex items-center justify-between text-xs font-semibold text-[#1F2937] z-10">
        <span className="font-bold tracking-tight">9:41</span>
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-3 text-[#1F2937]" viewBox="0 0 16 12" fill="currentColor">
            <rect x="0" y="8" width="3" height="4" rx="0.5" />
            <rect x="4.25" y="5.5" width="3" height="6.5" rx="0.5" />
            <rect x="8.5" y="3" width="3" height="9" rx="0.5" />
            <rect x="12.75" y="0" width="3" height="12" rx="0.5" />
          </svg>
          <svg className="w-4 h-3 text-[#1F2937]" viewBox="0 0 16 12" fill="currentColor">
            <path d="M8 1.5a6.5 6.5 0 015.6 3.2.5.5 0 01-.17.67l-1.12.7a.5.5 0 01-.68-.15 4.5 4.5 0 00-7.26 0 .5.5 0 01-.68.15l-1.12-.7a.5.5 0 01-.17-.67A6.5 6.5 0 018 1.5z" />
          </svg>
          <div className="w-5 h-2.5 rounded-sm border border-[#1F2937] p-0.5 flex items-center">
            <div className="w-full h-full bg-[#1F2937] rounded-2xs" />
          </div>
        </div>
      </div>

      {/* Main Content Container (Centered & Constrained like the design image) */}
      <div className="w-full max-w-md px-6 py-4 flex-1 flex flex-col items-center justify-center text-center z-10 my-auto">
        
        {/* Emblem Graphic */}
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 mb-6 transition-transform hover:scale-102 duration-300">
          <img
            src={logoImg}
            alt="EcoQuest Official Emblem Logo"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover rounded-full drop-shadow-xl ring-4 ring-[#2E7D32]/20 shadow-[#2E7D32]/10"
          />
        </div>

        {/* Brand Name Title */}
        <div className="mb-2">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight flex items-center justify-center font-sans">
            <span className="text-[#2E7D32]">Eco</span>
            <span className="text-[#1976D2] font-extrabold relative inline-block">
              Quest
              {/* Leaf Accent on Q */}
              <svg
                className="absolute -top-1 left-0 w-4 h-4 text-[#2E7D32]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17 8C17 8 13.5 8.5 11 11C8.5 13.5 8 17 8 17C8 17 11.5 16.5 14 14C16.5 11.5 17 8 17 8Z" />
              </svg>
            </span>
          </h1>
        </div>

        {/* Tagline */}
        <div className="text-xs sm:text-sm font-extrabold tracking-widest uppercase mb-6 flex items-center justify-center gap-1.5 font-sans">
          <span className="text-[#2E7D32]">PLAY.</span>
          <span className="text-[#1976D2]">PROTECT.</span>
          <span className="text-[#2E7D32]">PREVENT.</span>
        </div>

        {/* Headline */}
        <div className="space-y-1 mb-3">
          <h2 className="text-xl sm:text-2xl font-black text-[#1F2937] tracking-tight">
            Small actions.
          </h2>
          <h2 className="text-xl sm:text-2xl font-black text-[#2E7D32] tracking-tight">
            Big impact.
          </h2>
        </div>

        {/* Leaf Line Divider */}
        <div className="w-full max-w-xs flex items-center justify-center gap-3 my-2 opacity-80">
          <div className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-[#2E7D32]/40 to-[#2E7D32]" />
          <Leaf className="w-4 h-4 text-[#2E7D32] shrink-0 fill-current" />
          <div className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-[#2E7D32]/40 to-[#2E7D32]" />
        </div>

        {/* Subtitle / Description */}
        <p className="text-xs sm:text-sm font-medium text-[#1F2937]/80 max-w-xs leading-relaxed mb-8">
          Join EcoQuest and help build cleaner, safer and flood-resilient communities.
        </p>

        {/* Buttons Stack */}
        <div className="w-full max-w-xs space-y-3.5 mb-6">
          {/* Primary "Get Started" Button */}
          <button
            type="button"
            id="btn-landing-get-started"
            onClick={onGetStarted}
            className="w-full py-3.5 px-6 rounded-full bg-[#2E7D32] hover:bg-[#2E7D32]/90 active:scale-[0.98] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md shadow-[#2E7D32]/25 transition-all cursor-pointer font-sans"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Secondary "Log In" Button */}
          <button
            type="button"
            id="btn-landing-login"
            onClick={onLogIn}
            className="w-full py-3.5 px-6 rounded-full bg-white hover:bg-[#F8FCF8] active:scale-[0.98] border-2 border-[#2E7D32] text-[#2E7D32] font-bold text-sm sm:text-base shadow-2xs transition-all cursor-pointer font-sans"
          >
            Log In
          </button>
        </div>

      </div>

      {/* Bottom Scenic Vector Illustration Background */}
      <div className="w-full relative h-36 sm:h-44 mt-auto overflow-hidden pointer-events-none">
        <svg
          viewBox="0 0 500 180"
          preserveAspectRatio="none"
          className="w-full h-full text-[#2E7D32]"
        >
          {/* Distant Soft Skyline */}
          <path
            d="M0 120 H50 V105 H60 V120 H120 V95 H135 V120 H200 V100 H220 V120 H300 V108 H315 V120 H400 V98 H420 V120 H500 V180 H0 Z"
            fill="#D9E6DD"
            opacity="0.6"
          />

          {/* Rolling Hills Background */}
          <path
            d="M-20 140 Q 120 100 250 135 T 520 120 V 180 H -20 Z"
            fill="#66BB6A"
            opacity="0.3"
          />
          <path
            d="M-20 150 Q 160 115 320 145 T 520 130 V 180 H -20 Z"
            fill="#66BB6A"
            opacity="0.6"
          />

          {/* Center Blue Winding River */}
          <path
            d="M210 180 Q 235 155 248 140 Q 252 135 250 130 C 248 128 252 128 250 125 V 180 Z"
            fill="#1976D2"
            opacity="0.4"
          />
          <path
            d="M215 180 C 235 160 242 145 250 130 C 255 145 270 165 295 180 Z"
            fill="#1976D2"
          />

          {/* Lush Left Corner Foliage */}
          <g fill="#2E7D32">
            <path d="M-10 180 C0 130 30 110 50 125 C30 145 10 160 -10 180 Z" />
            <path d="M10 180 C20 120 50 100 70 115 C50 140 30 160 10 180 Z" fill="#2E7D32" opacity="0.9" />
            <path d="M-20 160 C0 100 40 80 60 100 C30 125 0 145 -20 160 Z" fill="#66BB6A" />
          </g>

          {/* Lush Right Corner Foliage */}
          <g fill="#2E7D32">
            <path d="M510 180 C500 130 470 110 450 125 C470 145 490 160 510 180 Z" />
            <path d="M490 180 C480 120 450 100 430 115 C450 140 470 160 490 180 Z" fill="#2E7D32" opacity="0.9" />
            <path d="M520 160 C500 100 460 80 440 100 C470 125 500 145 520 160 Z" fill="#66BB6A" />
          </g>
        </svg>
      </div>

      {/* Bottom Bar indicator (Mobile mockup polish) */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-[#1F2937]/30 rounded-full z-20 pointer-events-none" />
    </div>
  );
};
