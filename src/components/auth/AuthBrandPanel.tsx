import React from 'react';
import { ShieldCheck, Trophy, Sparkles, Droplets, Users } from 'lucide-react';
import { EcoQuestLogo } from '../brand/EcoQuestLogo';

export const AuthBrandPanel: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-slate-900 text-white p-8 lg:p-12 flex flex-col justify-between min-h-[500px] lg:min-h-full rounded-2xl lg:rounded-3xl border border-slate-800 shadow-xl">
      {/* Background Decorative Gradients & Mesh */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      {/* Top Header & Brand Identifier */}
      <div className="relative z-10 flex items-center justify-between">
        <EcoQuestLogo size="md" />

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>Civic Action Hub</span>
        </div>
      </div>

      {/* Hero Content Area */}
      <div className="relative z-10 my-8 space-y-6 text-left">
        <div className="space-y-3">
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white">
            Transforming Sanitation & Drainage into <span className="text-emerald-400 underline decoration-sky-500/50 underline-offset-8">Collective Civic Action.</span>
          </h1>
          <p className="text-sm lg:text-base text-slate-300 font-normal leading-relaxed max-w-lg">
            Join thousands of local volunteers, youth champions, and citizens reporting sanitation hazards, clearing drainage channels, preventing urban flooding, and earning rewards.
          </p>
        </div>

        {/* Feature Grid Chips */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-xs flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-500/15 text-sky-400">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Drainage & Flood Prevention</div>
              <div className="text-[11px] text-slate-400">Civic stormwater mapping</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-xs flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Eco Rewards & Badges</div>
              <div className="text-[11px] text-slate-400 font-medium">Earn points & level up</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Stats & Social Proof */}
      <div className="relative z-10 pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-left">
        <div>
          <div className="text-xl lg:text-2xl font-bold text-white tracking-tight">14,200+</div>
          <div className="text-[11px] font-medium text-slate-400">Drains Cleared</div>
        </div>
        <div>
          <div className="text-xl lg:text-2xl font-bold text-emerald-400 tracking-tight">85+</div>
          <div className="text-[11px] font-medium text-slate-400">Districts Covered</div>
        </div>
        <div>
          <div className="text-xl lg:text-2xl font-bold text-sky-400 tracking-tight">98.4%</div>
          <div className="text-[11px] font-medium text-slate-400">Resolved Hazards</div>
        </div>
      </div>
    </div>
  );
};
