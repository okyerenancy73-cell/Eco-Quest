import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { AuthBrandPanel } from './AuthBrandPanel';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { ResetPasswordForm } from './ResetPasswordForm';
import { EmailVerificationCard } from './EmailVerificationCard';
import { AuthSuccessCard } from './AuthSuccessCard';
import { EcoQuestLogo } from '../brand/EcoQuestLogo';
import { ArrowLeft } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  const { authView, setAuthView } = useAuth();

  const renderActiveView = () => {
    switch (authView) {
      case 'sign-in':
        return <SignInForm />;
      case 'sign-up':
        return <SignUpForm />;
      case 'forgot-password':
        return <ForgotPasswordForm />;
      case 'reset-password':
        return <ResetPasswordForm />;
      case 'verify-email':
        return <EmailVerificationCard />;
      case 'success':
        return <AuthSuccessCard />;
      default:
        return <SignInForm />;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans antialiased selection:bg-emerald-500 selection:text-white relative">
      
      {/* Top Floating Back to Home Button */}
      <button
        type="button"
        id="btn-back-to-landing"
        onClick={() => setAuthView('landing')}
        className="fixed top-4 left-4 z-50 inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold text-xs shadow-sm hover:shadow-md transition-all cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        <span>Back to Home</span>
      </button>

      {/* Outer Container */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch pt-8 lg:pt-0">
        
        {/* Left Column: Brand Hero Panel (Hidden on small screens, shown on lg) */}
        <div className="hidden lg:block lg:col-span-5 h-full">
          <AuthBrandPanel />
        </div>

        {/* Right Column: Active Form Container */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          {/* Mobile Top Brand Header */}
          <div className="lg:hidden flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
            <EcoQuestLogo size="sm" />

            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              Civic App
            </span>
          </div>

          {/* Form Card */}
          <div className="w-full bg-white dark:bg-slate-900 rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/80 dark:border-slate-800/80 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-300">
            {renderActiveView()}
          </div>

          {/* Accessibility Footer Notice */}
          <div className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
            EcoQuest ClimateTech Platform &copy; {new Date().getFullYear()} &bull; WCAG 2.1 AA Compliant &bull; Secure Auth
          </div>
        </div>

      </div>
    </div>
  );
};

