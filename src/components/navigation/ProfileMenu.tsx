import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AppRoute } from '../../types/navigation';
import { ThemeToggle } from '../ui/ThemeToggle';
import { User, Settings, LogOut, Award, Shield, ChevronDown } from 'lucide-react';

interface ProfileMenuProps {
  onNavigate: (route: AppRoute) => void;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const handleRouteClick = (route: AppRoute) => {
    onNavigate(route);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        id="btn-profile-menu-trigger"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        <img
          src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
          alt={user.fullName}
          className="w-8 h-8 rounded-lg object-cover ring-2 ring-emerald-500/20"
        />

        <div className="hidden sm:flex flex-col text-left">
          <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate max-w-[120px]">
            {user.fullName}
          </span>
          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
            {user.ecoPoints} PTS
          </span>
        </div>

        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 text-left">
          {/* User Header */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
            <div className="flex items-center gap-3">
              <img
                src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                alt={user.fullName}
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/30"
              />
              <div className="space-y-0.5 truncate">
                <div className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.fullName}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md text-[10px]">
                <Shield className="w-3 h-3 text-emerald-500" />
                Level {user.level} Civic Guardian
              </span>
              <span className="inline-flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400 text-[11px]">
                <Award className="w-3.5 h-3.5" />
                {user.ecoPoints} PTS
              </span>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="p-2 space-y-1 text-xs">
            <button
              id="btn-menu-goto-profile"
              type="button"
              onClick={() => handleRouteClick('profile')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <User className="w-4 h-4 text-slate-400" />
              <span>View Profile & Badges</span>
            </button>

            <button
              id="btn-menu-goto-settings"
              type="button"
              onClick={() => handleRouteClick('settings')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Account & Settings</span>
            </button>
          </div>

          {/* Theme Switcher Row */}
          <div className="p-2 border-t border-slate-100 dark:border-slate-800">
            <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 px-3 py-1 uppercase tracking-wider">
              Appearance
            </div>
            <ThemeToggle variant="full" />
          </div>

          {/* Sign Out */}
          <div className="p-2 border-t border-slate-100 dark:border-slate-800">
            <button
              id="btn-menu-sign-out"
              type="button"
              onClick={logout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-medium transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
