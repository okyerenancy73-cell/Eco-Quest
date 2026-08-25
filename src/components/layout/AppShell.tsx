import React, { useState } from 'react';
import { AppRoute } from '../../types/navigation';
import { Sidebar } from './Sidebar';
import { TopNavigation } from './TopNavigation';
import { MobileNavigation } from './MobileNavigation';

interface AppShellProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ currentRoute, onNavigate, children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FCF8] text-[#1F2937] flex font-sans antialiased selection:bg-[#2E7D32] selection:text-white">
      {/* Desktop Persistent Sidebar */}
      <Sidebar
        currentRoute={currentRoute}
        onNavigate={onNavigate}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-20 md:pb-8 bg-[#F8FCF8]">
        {/* Top Header Navigation */}
        <TopNavigation currentRoute={currentRoute} onNavigate={onNavigate} />

        {/* Dynamic Page Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          {children}
        </main>
      </div>

      {/* Adaptive Mobile Navigation */}
      <MobileNavigation currentRoute={currentRoute} onNavigate={onNavigate} />
    </div>
  );
};
