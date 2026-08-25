import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { ShieldCheck, Trophy, LogOut, Sparkles, CheckCircle2 } from 'lucide-react';

export const AuthSuccessCard: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="w-full space-y-6 text-left">
      {/* Header Badge */}
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="relative">
          <img
            src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
            alt={user.fullName}
            className="w-20 h-20 rounded-2xl object-cover ring-4 ring-emerald-500/20 shadow-md"
          />
          <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full shadow-xs">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3 text-emerald-500" />
            <span>Authenticated Session Active</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome, {user.fullName}!
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
        </div>
      </div>

      {/* Gamification Profile Preview Card */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-900 dark:text-white">Eco Points</div>
              <div className="text-[11px] text-slate-500">{user.ecoPoints} PTS earned</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-900 dark:text-white">Level {user.level}</div>
              <div className="text-[11px] text-slate-500">Civic Guardian</div>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Earned Badges</div>
          <div className="flex flex-wrap gap-1.5">
            {user.badges.map((badge, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
              >
                🏅 {badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Integration Notice */}
      <div className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        <span className="font-semibold text-slate-900 dark:text-white">Scalable Auth Architecture Ready:</span>
        <br />
        This authenticated user session is persisted and ready to connect to the EcoQuest main dashboard, community reporting, and reward quests.
      </div>

      {/* Actions */}
      <div className="pt-2">
        <Button
          id="btn-auth-logout"
          type="button"
          variant="outline"
          fullWidth
          onClick={logout}
          icon={<LogOut className="w-4 h-4" />}
        >
          Sign Out of EcoQuest
        </Button>
      </div>
    </div>
  );
};
