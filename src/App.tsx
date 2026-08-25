import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthLayout } from './components/auth/AuthLayout';
import { AppShell } from './components/layout/AppShell';
import { AppRoute } from './types/navigation';

import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { MapPage } from './pages/MapPage';
import { QuestsPage } from './pages/QuestsPage';
import { CommunityPage } from './pages/CommunityPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

const AuthenticatedApp: React.FC = () => {
  const { user, authView, setAuthView } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('dashboard');

  // If unauthenticated:
  // Step 1: Landing Page (default)
  // Step 2: Auth Page (Sign In, Sign Up, Forgot Password)
  if (!user) {
    if (authView === 'landing') {
      return (
        <LandingPage
          onGetStarted={() => setAuthView('sign-up')}
          onLogIn={() => setAuthView('sign-in')}
        />
      );
    }
    return <AuthLayout />;
  }

  // Step 3: Authenticated App Shell & Dashboard Pages
  const renderActivePage = () => {
    switch (currentRoute) {
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentRoute} />;
      case 'map':
        return <MapPage />;
      case 'quests':
        return <QuestsPage />;
      case 'community':
        return <CommunityPage />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage onNavigate={setCurrentRoute} />;
    }
  };

  return (
    <AppShell currentRoute={currentRoute} onNavigate={setCurrentRoute}>
      {renderActivePage()}
    </AppShell>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthenticatedApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
