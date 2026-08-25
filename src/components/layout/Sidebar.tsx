import React from 'react';
import { AppRoute } from '../../types/navigation';
import { useAuth } from '../../context/AuthContext';
import { EcoQuestLogo } from '../brand/EcoQuestLogo';
import {
  LayoutDashboard,
  MapPin,
  Sparkles,
  Users,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Award,
} from 'lucide-react';

interface SidebarProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
}) => {
  const { user } = useAuth();

  const navItems: { id: AppRoute; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'map', label: 'Sanitation Map', icon: <MapPin className="w-5 h-5" />, badge: 'GIS' },
    { id: 'quests', label: 'EcoQuests', icon: <Sparkles className="w-5 h-5" />, badge: '3 Active' },
    { id: 'community', label: 'Community', icon: <Users className="w-5 h-5" /> },
    { id: 'profile', label: 'My Profile', icon: <User className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col h-screen sticky top-0 bg-white border-r border-[#D9E6DD] transition-all duration-300 z-30 select-none font-sans ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-3.5 border-b border-[#D9E6DD]">
        {!isCollapsed ? (
          <EcoQuestLogo size="sm" showSubtext={false} />
        ) : (
          <EcoQuestLogo size="sm" showSubtext={false} showText={false} className="mx-auto" />
        )}

        {/* Collapse Toggle */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-[#1F2937]/50 hover:text-[#1F2937] hover:bg-[#F8FCF8] transition-colors focus:outline-none"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Navigation List */}
      <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentRoute === item.id;
          return (
            <button
              key={item.id}
              id={`sidebar-nav-${item.id}`}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-[#2E7D32]/10 text-[#2E7D32] font-bold border border-[#2E7D32]/20'
                  : 'text-[#1F2937]/80 hover:text-[#1F2937] hover:bg-[#F8FCF8]'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
              title={isCollapsed ? item.label : undefined}
            >
              <div
                className={`transition-colors shrink-0 ${
                  isActive ? 'text-[#2E7D32]' : 'text-[#1F2937]/50 group-hover:text-[#1F2937]'
                }`}
              >
                {item.icon}
              </div>

              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between truncate text-left">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D9E6DD]/50 text-[#1F2937]/70 group-hover:bg-[#2E7D32]/10 group-hover:text-[#2E7D32] transition-colors">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* User Eco Status Preview Footer */}
      {user && !isCollapsed && (
        <div className="p-3 m-3 rounded-2xl bg-[#2E7D32]/5 border border-[#D9E6DD] space-y-2 text-left">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#1F2937]">Level {user.level} Guardian</span>
            <span className="font-extrabold text-[#2E7D32] flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-[#2E7D32]" />
              {user.ecoPoints}
            </span>
          </div>

          <div className="w-full bg-[#D9E6DD] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#2E7D32] h-full rounded-full" style={{ width: '65%' }} />
          </div>

          <p className="text-[10px] text-[#1F2937]/60">
            350 PTS until Level {user.level + 1}
          </p>
        </div>
      )}
    </aside>
  );
};
