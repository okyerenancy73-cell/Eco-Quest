import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { FormInput } from '../components/ui/FormInput';
import { Button } from '../components/ui/Button';
import { AlertBanner } from '../components/ui/AlertBanner';
import { Checkbox } from '../components/ui/Checkbox';
import { User, Shield, Bell, Eye, LogOut, Check, Save } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || 'Ama Boateng');
  const [email, setEmail] = useState(user?.email || 'ama@example.com');
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  // Notification Preferences
  const [notifQuest, setNotifQuest] = useState(true);
  const [notifCommunity, setNotifCommunity] = useState(true);
  const [notifReports, setNotifReports] = useState(true);

  // Password state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passSuccess, setPassSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMessage('Profile settings updated successfully!');
    setTimeout(() => setSavedMessage(null), 3000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPass || !newPass) return;
    setPassSuccess(true);
    setCurrentPass('');
    setNewPass('');
    setTimeout(() => setPassSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Account Settings & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Manage your personal profile, security credentials, notification preferences, and application theme.
        </p>
      </div>

      {savedMessage && <AlertBanner id="settings-alert-success" type="success" message={savedMessage} />}

      {/* 1. Account Profile Form */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base border-b border-slate-100 dark:border-slate-800 pb-3">
          <User className="w-5 h-5 text-emerald-500" />
          <span>Account Profile</span>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              id="settings-fullname"
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <FormInput
              id="settings-email"
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button id="btn-save-profile" type="submit" size="sm" variant="primary" icon={<Save className="w-4 h-4" />}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>

      {/* 2. Security & Password */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base border-b border-slate-100 dark:border-slate-800 pb-3">
          <Shield className="w-5 h-5 text-teal-500" />
          <span>Security & Password</span>
        </div>

        {passSuccess && <AlertBanner id="pass-alert-success" type="success" message="Password updated successfully!" />}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              id="settings-curr-pass"
              label="Current Password"
              isPassword
              value={currentPass}
              onChange={(e) => setCurrentPass(e.target.value)}
              placeholder="••••••••••••"
            />

            <FormInput
              id="settings-new-pass"
              label="New Password"
              isPassword
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="••••••••••••"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button id="btn-update-password" type="submit" size="sm" variant="outline">
              Update Password
            </Button>
          </div>
        </form>
      </div>

      {/* 3. Notifications */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
            <Bell className="w-5 h-5 text-amber-500" />
            <span>Notification Preferences</span>
          </div>

          <span className="text-xs text-slate-400 italic">No unread notifications</span>
        </div>

        <div className="space-y-3">
          <Checkbox
            id="notif-quest"
            label="Quest Updates & Points Milestones"
            description="Receive alerts when new eco quests are released in your district"
            checked={notifQuest}
            onChange={(e) => setNotifQuest(e.target.checked)}
          />

          <Checkbox
            id="notif-community"
            label="Community Cleanup Invitations"
            description="Get notified about upcoming weekend sanitation drives and workshops"
            checked={notifCommunity}
            onChange={(e) => setNotifCommunity(e.target.checked)}
          />

          <Checkbox
            id="notif-reports"
            label="Environmental Hazard Reports Status"
            description="Updates when your submitted sanitation reports are resolved by municipal stewards"
            checked={notifReports}
            onChange={(e) => setNotifReports(e.target.checked)}
          />
        </div>
      </div>

      {/* 4. Appearance & Theme */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base border-b border-slate-100 dark:border-slate-800 pb-3">
          <Eye className="w-5 h-5 text-sky-500" />
          <span>Appearance & Color Theme</span>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Choose your preferred color palette mode for the EcoQuest interface
          </p>
          <div className="max-w-xs">
            <ThemeToggle variant="full" />
          </div>
        </div>
      </div>

      {/* 5. Sign Out Session */}
      <div className="p-6 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-rose-900 dark:text-rose-200">Sign Out of Session</h3>
          <p className="text-xs text-rose-700 dark:text-rose-400">Safely terminate your current authenticated EcoQuest session</p>
        </div>

        <Button id="btn-settings-signout" variant="outline" size="sm" onClick={logout} icon={<LogOut className="w-4 h-4 text-rose-600" />}>
          Sign Out
        </Button>
      </div>
    </div>
  );
};
