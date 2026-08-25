import React from 'react';
import { AppRoute } from '../../types/navigation';
import { LayoutDashboard, MapPin, Sparkles, Users, User } from 'lucide-react';

interface MobileNavigationProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ currentRoute, onNavigate }) => {
  const items: { id: AppRoute; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Home', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'map', label: 'Map', icon: <MapPin className="w-5 h-5" /> },
    { id: 'quests', label: 'Quests', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'community', label: 'Community', icon: <Users className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#D9E6DD] px-2 py-1.5 shadow-lg select-none font-sans"
      aria-label="Mobile Navigation"
    >
      <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
        {items.map((item) => {
          const isActive = currentRoute === item.id;
          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center min-h-[48px] py-1 px-1 rounded-xl transition-all ${
                isActive
                  ? 'text-[#2E7D32] font-bold bg-[#2E7D32]/10'
                  : 'text-[#1F2937]/70 hover:text-[#1F2937]'
              }`}
            >
              <div className={isActive ? 'scale-105 transition-transform text-[#2E7D32]' : ''}>{item.icon}</div>
              <span className="text-[10px] tracking-tight mt-0.5 leading-tight truncate w-full text-center">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
