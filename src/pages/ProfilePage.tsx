import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ProgressBar } from '../components/ui/ProgressBar';
import { StatCard } from '../components/ui/StatCard';
import { Trophy, Award, Shield, CheckCircle2, Sparkles, MapPin, Calendar, Heart } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  const badges = [
    { name: 'Drain Defender', desc: 'Cleared 3+ blocked stormwater channels', icon: '🌊', color: 'bg-teal-500/10 text-teal-600' },
    { name: 'Zero Waste Hero', desc: 'Sorted recyclables for 4 consecutive weeks', icon: '♻️', color: 'bg-emerald-500/10 text-emerald-600' },
    { name: 'Civic Leader', desc: 'Organized community sanitation drive', icon: '👑', color: 'bg-amber-500/10 text-amber-600' },
    { name: 'Clean Water Sentinel', desc: 'Reported 5 validated water hazards', icon: '💧', color: 'bg-sky-500/10 text-sky-600' },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* User Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
            alt={user?.fullName || 'Profile Avatar'}
            className="w-24 h-24 rounded-2xl object-cover ring-4 ring-emerald-500/30 shadow-md shrink-0"
          />

          <div className="space-y-1.5 text-center sm:text-left flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                Level {user?.level || 5} Civic Guardian
              </span>

              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Joined {user?.createdAt || 'Aug 2026'}
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {user?.fullName || 'Ama Boateng'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email || 'ama@example.com'}</p>
          </div>
        </div>

        {/* Level Progress */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
          <ProgressBar
            value={70}
            label={`Level ${user?.level || 5} Progress`}
            sublabel="350 PTS required for Level 6"
            color="gradient"
          />
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total EcoPoints"
          value={`${user?.ecoPoints || 1250} PTS`}
          icon={<Award className="w-6 h-6" />}
          iconBgColor="bg-emerald-500/10 text-emerald-600"
        />

        <StatCard
          title="Quests Completed"
          value="18"
          icon={<CheckCircle2 className="w-6 h-6" />}
          iconBgColor="bg-teal-500/10 text-teal-600"
        />

        <StatCard
          title="Badges Unlocked"
          value="4"
          icon={<Trophy className="w-6 h-6" />}
          iconBgColor="bg-amber-500/10 text-amber-600"
        />
      </div>

      {/* Earned Badges Grid */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Earned Achievements</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Milestone badges earned from civic participation</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((b, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-left space-y-2"
            >
              <div className="text-2xl">{b.icon}</div>
              <div className="font-bold text-xs text-slate-900 dark:text-white">{b.name}</div>
              <p className="text-[11px] text-slate-500 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
