import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AuthView,
  EcoQuestUser,
  SignInCredentials,
  SignUpCredentials,
  ForgotPasswordData,
  ResetPasswordData,
} from '../types/auth';
import { authService } from '../services/authService';

interface AuthContextType {
  user: EcoQuestUser | null;
  authView: AuthView;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
  unverifiedEmail: string | null;
  setAuthView: (view: AuthView) => void;
  setError: (msg: string | null) => void;
  setSuccessMessage: (msg: string | null) => void;
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  forgotPassword: (data: ForgotPasswordData) => Promise<void>;
  resetPassword: (data: ResetPasswordData) => Promise<void>;
  verifyEmail: (email?: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  logout: () => void;
  addEcoPoints: (points: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<EcoQuestUser | null>(null);
  const [authView, setAuthView] = useState<AuthView>('landing');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

  // Synchronize hash location with authView & user state
  useEffect(() => {
    const existingUser = authService.getCurrentUser();
    if (existingUser) {
      setUser(existingUser);
      setAuthView('success');
      return;
    }

    // Read initial hash if present
    const hash = window.location.hash.toLowerCase().replace('#', '');
    if (hash === 'signup' || hash === 'sign-up') {
      setAuthView('sign-up');
    } else if (hash === 'login' || hash === 'sign-in') {
      setAuthView('sign-in');
    } else if (hash === 'forgot-password' || hash === 'forgot') {
      setAuthView('forgot-password');
    } else {
      setAuthView('landing');
    }

    const handleHashChange = () => {
      if (authService.getCurrentUser()) return;
      const currentHash = window.location.hash.toLowerCase().replace('#', '');
      if (currentHash === 'signup' || currentHash === 'sign-up') {
        setAuthView('sign-up');
      } else if (currentHash === 'login' || currentHash === 'sign-in') {
        setAuthView('sign-in');
      } else if (currentHash === 'forgot-password' || currentHash === 'forgot') {
        setAuthView('forgot-password');
      } else if (currentHash === 'landing' || currentHash === '') {
        setAuthView('landing');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const clearFeedback = () => {
    setError(null);
    setSuccessMessage(null);
  };

  const handleSetAuthView = (view: AuthView) => {
    clearFeedback();
    setAuthView(view);
    if (view === 'landing') window.location.hash = 'landing';
    else if (view === 'sign-in') window.location.hash = 'login';
    else if (view === 'sign-up') window.location.hash = 'signup';
    else if (view === 'forgot-password') window.location.hash = 'forgot-password';
  };

  const handleSignIn = async (credentials: SignInCredentials) => {
    setIsLoading(true);
    clearFeedback();
    try {
      const loggedUser = await authService.signIn(credentials);
      setUser(loggedUser);
      setSuccessMessage(`Welcome back, ${loggedUser.fullName}!`);
      setAuthView('success');
      window.location.hash = 'dashboard';
    } catch (err: any) {
      setError(err.message || 'Incorrect email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (credentials: SignUpCredentials) => {
    setIsLoading(true);
    clearFeedback();
    try {
      const { user: createdUser, requiresVerification } = await authService.signUp(credentials);
      setUnverifiedEmail(createdUser.email);
      if (requiresVerification) {
        setSuccessMessage('Account created successfully! Please verify your email address.');
        setAuthView('verify-email');
        window.location.hash = 'verify-email';
      } else {
        setUser(createdUser);
        setAuthView('success');
        window.location.hash = 'dashboard';
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (data: ForgotPasswordData) => {
    setIsLoading(true);
    clearFeedback();
    try {
      await authService.requestPasswordReset(data);
      setUnverifiedEmail(data.email);
      setSuccessMessage(`Password reset link sent to ${data.email}.`);
      setAuthView('reset-password');
      window.location.hash = 'reset-password';
    } catch (err: any) {
      setError(err.message || 'Failed to process request.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (data: ResetPasswordData) => {
    setIsLoading(true);
    clearFeedback();
    try {
      const targetEmail = unverifiedEmail || 'eco.champion@example.com';
      await authService.resetPassword(targetEmail, data);
      setSuccessMessage('Your password has been successfully updated. Please sign in with your new password.');
      setAuthView('sign-in');
      window.location.hash = 'login';
    } catch (err: any) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async (emailToVerify?: string) => {
    const targetEmail = emailToVerify || unverifiedEmail;
    if (!targetEmail) {
      setError('No email provided for verification.');
      return;
    }
    setIsLoading(true);
    clearFeedback();
    try {
      const verifiedUser = await authService.verifyEmail(targetEmail);
      setUser(verifiedUser);
      setSuccessMessage('Email verified successfully! Welcome to EcoQuest.');
      setAuthView('success');
      window.location.hash = 'dashboard';
    } catch (err: any) {
      setError(err.message || 'Email verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!unverifiedEmail) return;
    setIsLoading(true);
    clearFeedback();
    try {
      await authService.resendVerificationEmail(unverifiedEmail);
      setSuccessMessage(`Verification email resent to ${unverifiedEmail}.`);
    } catch (err: any) {
      setError(err.message || 'Failed to resend email.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    clearFeedback();
    setAuthView('landing');
    window.location.hash = 'landing';
  };

  const handleAddEcoPoints = (points: number) => {
    setUser((prev) => {
      if (!prev) return null;
      const updatedPoints = prev.ecoPoints + points;
      const updatedLevel = Math.max(prev.level, Math.floor(updatedPoints / 200) + 1);
      const updatedUser: EcoQuestUser = {
        ...prev,
        ecoPoints: updatedPoints,
        level: updatedLevel,
      };

      try {
        const storedUsersRaw = localStorage.getItem('ecoquest_registered_users');
        if (storedUsersRaw) {
          const storedUsers = JSON.parse(storedUsersRaw);
          const email = prev.email.toLowerCase();
          if (storedUsers[email]) {
            storedUsers[email].user = updatedUser;
            localStorage.setItem('ecoquest_registered_users', JSON.stringify(storedUsers));
          }
        }
        localStorage.setItem('ecoquest_auth_session', JSON.stringify(updatedUser));
      } catch (e) {
        console.error('Failed to persist eco points:', e);
      }

      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authView,
        isLoading,
        error,
        successMessage,
        unverifiedEmail,
        setAuthView: handleSetAuthView,
        setError,
        setSuccessMessage,
        signIn: handleSignIn,
        signUp: handleSignUp,
        forgotPassword: handleForgotPassword,
        resetPassword: handleResetPassword,
        verifyEmail: handleVerifyEmail,
        resendVerification: handleResendVerification,
        logout: handleLogout,
        addEcoPoints: handleAddEcoPoints,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
