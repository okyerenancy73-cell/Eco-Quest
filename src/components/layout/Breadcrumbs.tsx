import React from 'react';
import { AppRoute } from '../../types/navigation';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ currentRoute, onNavigate }) => {
  const routeLabels: Record<AppRoute, string> = {
    dashboard: 'Dashboard',
    map: 'Sanitation & Flood Map',
    quests: 'Environmental Quests',
    community: 'Community Hub',
    profile: 'My Eco Profile',
    settings: 'Settings',
  };

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
      <button
        type="button"
        onClick={() => onNavigate('dashboard')}
        className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors focus:outline-none"
        title="Go to Dashboard"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">EcoQuest</span>
      </button>

      {currentRoute !== 'dashboard' && (
        <>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600 shrink-0" />
          <span className="font-semibold text-slate-900 dark:text-white truncate">
            {routeLabels[currentRoute]}
          </span>
        </>
      )}
    </nav>
  );
};
