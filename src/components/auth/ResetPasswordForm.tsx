import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FormInput } from '../ui/FormInput';
import { Button } from '../ui/Button';
import { AlertBanner } from '../ui/AlertBanner';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { validatePassword } from '../../utils/validation';
import { Lock, KeyRound, ArrowLeft } from 'lucide-react';

export const ResetPasswordForm: React.FC = () => {
  const { resetPassword, isLoading, error, setAuthView, setError, unverifiedEmail } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errPass = validatePassword(password);
    let errConfirm: string | null = null;

    if (password !== confirmPassword) {
      errConfirm = 'Passwords do not match.';
    }

    setPasswordError(errPass);
    setConfirmPasswordError(errConfirm);

    if (errPass || errConfirm) return;

    await resetPassword({ password, confirmPassword });
  };

  return (
    <div className="w-full space-y-6 text-left">
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Create new password
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Your new password must be at least 8 characters long and include numbers or special characters.
          {unverifiedEmail && (
            <span className="block mt-1 font-medium text-emerald-600 dark:text-emerald-400">
              Resetting for: {unverifiedEmail}
            </span>
          )}
        </p>
      </div>

      {error && <AlertBanner id="reset-pass-alert-error" type="error" message={error} onClose={() => setError(null)} />}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-1">
          <FormInput
            id="reset-password-new"
            label="New Password"
            isPassword
            placeholder="Enter new password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError) setPasswordError(null);
            }}
            error={passwordError}
            icon={<Lock className="w-4 h-4" />}
          />
          <PasswordStrengthMeter password={password} />
        </div>

        <FormInput
          id="reset-password-confirm"
          label="Confirm New Password"
          isPassword
          placeholder="Re-enter new password"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (confirmPasswordError) setConfirmPasswordError(null);
          }}
          error={confirmPasswordError}
          icon={<Lock className="w-4 h-4" />}
        />

        <Button
          id="btn-reset-password-submit"
          type="submit"
          fullWidth
          isLoading={isLoading}
          loadingText="Updating password..."
          icon={<KeyRound className="w-4 h-4" />}
        >
          Reset Password
        </Button>
      </form>

      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
        <button
          type="button"
          id="btn-back-to-signin-from-reset"
          onClick={() => setAuthView('sign-in')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white focus:outline-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </button>
      </div>
    </div>
  );
};
