import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FormInput } from '../ui/FormInput';
import { Button } from '../ui/Button';
import { AlertBanner } from '../ui/AlertBanner';
import { validateEmail } from '../../utils/validation';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { EcoQuestLogo } from '../brand/EcoQuestLogo';

export const ForgotPasswordForm: React.FC = () => {
  const { forgotPassword, isLoading, error, successMessage, setAuthView, setError } = useAuth();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateEmail(email);
    setEmailError(err);
    if (err) return;

    await forgotPassword({ email });
  };

  return (
    <div className="w-full space-y-6 text-left">
      {/* Brand Header */}
      <div className="space-y-3">
        <EcoQuestLogo size="md" />

        <div className="space-y-1 pt-1">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Forgot your password?
          </h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Enter your email and we'll send you a password reset link.
          </p>
        </div>
      </div>

      {error && <AlertBanner id="forgot-pass-alert-error" type="error" message={error} onClose={() => setError(null)} />}
      {successMessage && <AlertBanner id="forgot-pass-alert-success" type="success" message={successMessage} />}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormInput
          id="forgot-password-email"
          label="Email"
          type="email"
          placeholder="e.g. alex@example.com"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError(null);
          }}
          error={emailError}
          icon={<Mail className="w-4 h-4" />}
        />

        <div className="pt-2">
          <Button
            id="btn-forgot-password-submit"
            type="submit"
            fullWidth
            size="lg"
            isLoading={isLoading}
            loadingText="Sending reset link..."
            icon={<Send className="w-4 h-4" />}
          >
            SEND RESET LINK
          </Button>
        </div>
      </form>

      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
        <button
          type="button"
          id="btn-back-to-signin-from-forgot"
          onClick={() => setAuthView('sign-in')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline focus:outline-none focus:ring-2 focus:ring-emerald-500/20 rounded-md py-1 px-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </button>
      </div>
    </div>
  );
};
