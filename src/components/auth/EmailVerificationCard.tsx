import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { AlertBanner } from '../ui/AlertBanner';
import { MailCheck, RefreshCw, CheckCircle, ArrowLeft } from 'lucide-react';

export const EmailVerificationCard: React.FC = () => {
  const { verifyEmail, resendVerification, isLoading, error, successMessage, unverifiedEmail, setAuthView, setError } =
    useAuth();

  const [cooldown, setCooldown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      setCanResend(false);
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResendClick = async () => {
    await resendVerification();
    setCooldown(30);
  };

  return (
    <div className="w-full space-y-6 text-left">
      {/* Visual Envelope Header */}
      <div className="flex flex-col items-center justify-center text-center space-y-3 pt-2">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
          <MailCheck className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Verify your Email
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            We sent a verification link to your email address:
          </p>
          <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full inline-block mt-1">
            {unverifiedEmail || 'your.email@example.com'}
          </p>
        </div>
      </div>

      {error && <AlertBanner id="email-verify-alert-error" type="error" message={error} onClose={() => setError(null)} />}
      {successMessage && <AlertBanner id="email-verify-alert-success" type="success" message={successMessage} />}

      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 text-xs text-slate-600 dark:text-slate-300">
        <p className="leading-relaxed">
          Please check your inbox and click the verification link to activate your EcoQuest profile. If you don't see the email, check your spam folder.
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
          <span>Didn't receive the email?</span>
          <button
            type="button"
            id="btn-resend-verification"
            disabled={!canResend || isLoading}
            onClick={handleResendClick}
            className="font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
            {canResend ? 'Resend Email' : `Resend in ${cooldown}s`}
          </button>
        </div>
      </div>

      {/* Action Button to simulate instant verification */}
      <div className="space-y-3 pt-2">
        <Button
          id="btn-simulate-verify-email"
          type="button"
          onClick={() => verifyEmail()}
          fullWidth
          isLoading={isLoading}
          loadingText="Verifying email..."
          icon={<CheckCircle className="w-4 h-4" />}
        >
          Confirm Email & Activate Account
        </Button>

        <div className="text-center">
          <button
            type="button"
            id="btn-back-to-signin-from-verify"
            onClick={() => setAuthView('sign-in')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white focus:outline-none"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Sign In</span>
          </button>
        </div>
      </div>
    </div>
  );
};
