import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FormInput } from '../ui/FormInput';
import { Button } from '../ui/Button';
import { Checkbox } from '../ui/Checkbox';
import { AlertBanner } from '../ui/AlertBanner';
import { validateEmail, validatePassword } from '../../utils/validation';
import { Mail, Lock, ArrowRight, UserCheck } from 'lucide-react';
import { EcoQuestLogo } from '../brand/EcoQuestLogo';

export const SignInForm: React.FC = () => {
  const { signIn, isLoading, error, successMessage, setAuthView, setError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errEmail = validateEmail(email);
    const errPass = validatePassword(password);

    setEmailError(errEmail);
    setPasswordError(errPass);

    if (errEmail || errPass) return;

    await signIn({ email, password, rememberMe });
  };

  const fillDemoAccount = () => {
    setEmail('eco.champion@example.com');
    setPassword('Password123!');
    setEmailError(null);
    setPasswordError(null);
    setError(null);
  };

  return (
    <div className="w-full space-y-6 text-left">
      {/* Brand Header */}
      <div className="space-y-3">
        <EcoQuestLogo size="md" />

        <div className="space-y-1 pt-1">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome back to EcoQuest
          </h2>
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
            Ready to make a difference today?
          </p>
        </div>
      </div>

      {/* Quick Demo Credentials Helper */}
      <div className="p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/90 dark:border-emerald-800/60 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">Demo account (Alex Rivera)</span>
        </div>
        <button
          type="button"
          id="btn-auto-fill-demo"
          onClick={fillDemoAccount}
          className="font-bold text-emerald-700 dark:text-emerald-300 hover:underline focus:outline-none cursor-pointer bg-white dark:bg-emerald-900/60 px-2.5 py-1 rounded-md border border-emerald-300 dark:border-emerald-700 shadow-2xs"
        >
          Auto-fill
        </button>
      </div>

      {/* Status Alert Banners */}
      {error && <AlertBanner id="sign-in-alert-error" type="error" message={error} onClose={() => setError(null)} />}
      {successMessage && <AlertBanner id="sign-in-alert-success" type="success" message={successMessage} />}

      {/* Sign In Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormInput
          id="sign-in-email"
          label="Email Address"
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

        <FormInput
          id="sign-in-password"
          label="Password"
          isPassword
          placeholder="••••••••••••"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (passwordError) setPasswordError(null);
          }}
          error={passwordError}
          icon={<Lock className="w-4 h-4" />}
        />

        {/* Remember Me & Forgot Password Row */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <Checkbox
            id="sign-in-remember"
            label="Remember me"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />

          <button
            type="button"
            id="btn-forgot-password-link"
            onClick={() => setAuthView('forgot-password')}
            className="font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline focus:outline-none focus:ring-2 focus:ring-emerald-500/20 rounded-md py-0.5 px-1"
          >
            Forgot password?
          </button>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            id="btn-sign-in-submit"
            type="submit"
            fullWidth
            size="lg"
            isLoading={isLoading}
            loadingText="Signing you in..."
            icon={<ArrowRight className="w-4 h-4" />}
          >
            SIGN IN
          </Button>
        </div>
      </form>

      {/* Switch to Sign Up Link */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-600 dark:text-slate-400">
        Don't have an account?{' '}
        <button
          type="button"
          id="btn-switch-to-signup"
          onClick={() => setAuthView('sign-up')}
          className="font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline focus:outline-none focus:ring-2 focus:ring-emerald-500/20 rounded-md py-0.5 px-1"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};
