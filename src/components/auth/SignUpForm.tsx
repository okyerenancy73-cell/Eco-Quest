import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FormInput } from '../ui/FormInput';
import { Button } from '../ui/Button';
import { Checkbox } from '../ui/Checkbox';
import { AlertBanner } from '../ui/AlertBanner';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { validateEmail, validatePassword, validateFullName } from '../../utils/validation';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import { EcoQuestLogo } from '../brand/EcoQuestLogo';

export const SignUpForm: React.FC = () => {
  const { signUp, isLoading, error, setAuthView, setError } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [fullNameError, setFullNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [termsError, setTermsError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errName = validateFullName(fullName);
    const errEmail = validateEmail(email);
    const errPass = validatePassword(password);
    let errConfirm: string | null = null;
    let errTerms: string | null = null;

    if (password !== confirmPassword) {
      errConfirm = 'Passwords do not match.';
    }

    if (!acceptTerms) {
      errTerms = 'You must agree to the Terms and Conditions to create an account.';
    }

    setFullNameError(errName);
    setEmailError(errEmail);
    setPasswordError(errPass);
    setConfirmPasswordError(errConfirm);
    setTermsError(errTerms);

    if (errName || errEmail || errPass || errConfirm || errTerms) return;

    await signUp({ fullName, email, password, confirmPassword, acceptTerms });
  };

  return (
    <div className="w-full space-y-6 text-left">
      {/* Brand Header */}
      <div className="space-y-3">
        <EcoQuestLogo size="md" />

        <div className="space-y-1 pt-1">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Join EcoQuest
          </h2>
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
            Complete quests. Earn rewards. Improve your community.
          </p>
        </div>
      </div>

      {/* Error Banner */}
      {error && <AlertBanner id="sign-up-alert-error" type="error" message={error} onClose={() => setError(null)} />}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormInput
          id="sign-up-full-name"
          label="Full Name"
          type="text"
          placeholder="e.g. Alex Rivera"
          autoComplete="name"
          required
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            if (fullNameError) setFullNameError(null);
          }}
          error={fullNameError}
          icon={<User className="w-4 h-4" />}
        />

        <FormInput
          id="sign-up-email"
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

        <div className="space-y-1">
          <FormInput
            id="sign-up-password"
            label="Password"
            isPassword
            placeholder="Create a password"
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
          id="sign-up-confirm-password"
          label="Confirm Password"
          isPassword
          placeholder="Re-enter your password"
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

        <div className="pt-1">
          <Checkbox
            id="sign-up-terms"
            checked={acceptTerms}
            onChange={(e) => {
              setAcceptTerms(e.target.checked);
              if (termsError) setTermsError(null);
            }}
            error={termsError}
            label={
              <span>
                I agree to the{' '}
                <a
                  href="#terms"
                  onClick={(e) => e.preventDefault()}
                  className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                >
                  Terms and Conditions
                </a>
              </span>
            }
          />
        </div>

        <div className="pt-2">
          <Button
            id="btn-sign-up-submit"
            type="submit"
            fullWidth
            size="lg"
            isLoading={isLoading}
            loadingText="Creating account..."
            icon={<UserPlus className="w-4 h-4" />}
          >
            CREATE ACCOUNT
          </Button>
        </div>
      </form>

      {/* Switcher to Sign In */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-600 dark:text-slate-400">
        Already have an account?{' '}
        <button
          type="button"
          id="btn-switch-to-signin"
          onClick={() => setAuthView('sign-in')}
          className="font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline focus:outline-none focus:ring-2 focus:ring-emerald-500/20 rounded-md py-0.5 px-1"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};
