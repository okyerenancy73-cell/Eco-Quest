import { PasswordStrengthResult } from '../types/auth';

export function validateEmail(email: string): string | null {
  if (!email.trim()) {
    return 'Email address is required.';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address (e.g. name@domain.com).';
  }
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) {
    return 'Password is required.';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  return null;
}

export function validateFullName(name: string): string | null {
  if (!name.trim()) {
    return 'Full name is required.';
  }
  if (name.trim().length < 2) {
    return 'Full name must be at least 2 characters.';
  }
  return null;
}

export function evaluatePasswordStrength(password: string): PasswordStrengthResult {
  const checks = {
    hasMinLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[^A-Za-z0-9]/.test(password),
  };

  const passedCount = Object.values(checks).filter(Boolean).length;

  let score = 0;
  let label: PasswordStrengthResult['label'] = 'Too Weak';
  let color = 'bg-slate-300 dark:bg-slate-700';

  if (!password) {
    return { score: 0, label: 'Too Weak', color: 'bg-slate-200 dark:bg-slate-700', checks };
  }

  if (passedCount <= 1) {
    score = 1;
    label = 'Weak';
    color = 'bg-rose-500';
  } else if (passedCount === 2 || passedCount === 3) {
    score = 2;
    label = 'Fair';
    color = 'bg-amber-500';
  } else if (passedCount === 4) {
    score = 3;
    label = 'Strong';
    color = 'bg-emerald-500';
  } else if (passedCount === 5) {
    score = 4;
    label = 'Very Strong';
    color = 'bg-teal-500';
  }

  return { score, label, color, checks };
}
