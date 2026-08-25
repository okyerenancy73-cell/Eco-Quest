import React from 'react';
import { ShieldCheck, Award, Users, Camera, School, AlertCircle } from 'lucide-react';

export const VerificationRulesOverview: React.FC = () => {
  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-[#F8FCF8] border border-[#D9E6DD] text-left space-y-3.5 shadow-2xs font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#2E7D32] text-white flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-[#1F2937]">
              EcoQuest Multi-Signal Verification Architecture
            </h3>
            <p className="text-xs text-[#1F2937]/75">
              "The stronger the reward or impact of the quest, the stronger the verification requirement."
            </p>
          </div>
        </div>

        <span className="self-start sm:self-auto text-[10px] font-extrabold text-[#2E7D32] bg-[#2E7D32]/10 px-3 py-1 rounded-full border border-[#2E7D32]/20">
          Anti-Abuse Protected
        </span>
      </div>

      {/* 3 Verification Tiers Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
        <div className="p-3 rounded-2xl bg-white border border-[#D9E6DD] space-y-1 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#2E7D32]">
            <Camera className="w-4 h-4 text-[#2E7D32]" />
            <span>1. Light Verification</span>
          </div>
          <p className="text-[11px] text-[#1F2937]/75">
            <strong>Photo Before/After:</strong> Geotagged evidence for individual tasks (e.g. clearing a single gutter).
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-white border border-[#D9E6DD] space-y-1 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1976D2]">
            <Users className="w-4 h-4 text-[#1976D2]" />
            <span>2. Medium Verification</span>
          </div>
          <p className="text-[11px] text-[#1F2937]/75">
            <strong>Community Discussion:</strong> 1-Time Session Code / QR scans from 3+ attendees + organizer reflection.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-white border border-[#D9E6DD] space-y-1 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1976D2]">
            <School className="w-4 h-4 text-[#1976D2]" />
            <span>3. Strong Verification</span>
          </div>
          <p className="text-[11px] text-[#1F2937]/75">
            <strong>School / Major Event:</strong> Teacher / Authorized verifier sign-off + attendee mass check-in.
          </p>
        </div>
      </div>
    </div>
  );
};
