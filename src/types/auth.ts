export type AuthView =
  | 'landing'
  | 'sign-in'
  | 'sign-up'
  | 'forgot-password'
  | 'reset-password'
  | 'verify-email'
  | 'success';

export interface EcoQuestUser {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  ecoPoints: number;
  level: number;
  badges: string[];
  isEmailVerified: boolean;
  createdAt: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface SignUpCredentials {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  password: string;
  confirmPassword: string;
}

export interface PasswordStrengthResult {
  score: number; // 0 to 4
  label: 'Too Weak' | 'Weak' | 'Fair' | 'Strong' | 'Very Strong';
  color: string;
  checks: {
    hasMinLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
}

export interface AuthState {
  user: EcoQuestUser | null;
  authView: AuthView;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
  unverifiedEmail: string | null;
}
