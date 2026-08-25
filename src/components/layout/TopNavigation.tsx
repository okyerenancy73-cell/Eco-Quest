import React from 'react';
import { AppRoute } from '../../types/navigation';
import { Breadcrumbs } from './Breadcrumbs';
import { NotificationMenu } from '../navigation/NotificationMenu';
import { ProfileMenu } from '../navigation/ProfileMenu';
import { ThemeToggle } from '../ui/ThemeToggle';
import { EcoQuestLogo } from '../brand/EcoQuestLogo';

interface TopNavigationProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({ currentRoute, onNavigate }) => {
  const pageTitles: Record<AppRoute, string> = {
    dashboard: 'Civic Dashboard',
    map: 'Sanitation & Flood Map',
    quests: 'Environmental Quests',
    community: 'Community Action Hub',
    profile: 'My Eco Profile & Badges',
    settings: 'Account Settings',
  };

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-[#D9E6DD] sticky top-0 z-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between font-sans">
      {/* Left Area: Title & Breadcrumbs */}
      <div className="flex items-center gap-3">
        {/* Mobile Brand Logo */}
        <div
          onClick={() => onNavigate('dashboard')}
          className="md:hidden flex items-center cursor-pointer"
        >
          <EcoQuestLogo size="sm" showSubtext={false} />
        </div>

        {/* Desktop Breadcrumbs & Page Title */}
        <div className="hidden md:flex flex-col text-left">
          <Breadcrumbs currentRoute={currentRoute} onNavigate={onNavigate} />
          <h1 className="text-base font-bold text-[#1F2937] tracking-tight leading-none mt-0.5">
            {pageTitles[currentRoute]}
          </h1>
        </div>
      </div>

      {/* Right Area: Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle id="top-nav-theme-toggle" />
        <NotificationMenu />
        <div className="h-5 w-px bg-[#D9E6DD] mx-1 hidden sm:block" />
        <ProfileMenu onNavigate={onNavigate} />
      </div>
    </header>
  );
};
