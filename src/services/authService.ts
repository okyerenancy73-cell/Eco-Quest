import {
  EcoQuestUser,
  SignInCredentials,
  SignUpCredentials,
  ForgotPasswordData,
  ResetPasswordData,
} from '../types/auth';

const STORAGE_KEY = 'ecoquest_auth_session';
const USERS_DB_KEY = 'ecoquest_registered_users';

// Initialize default mock database if empty
function getStoredUsers(): Record<string, { user: EcoQuestUser; passHash: string }> {
  try {
    const raw = localStorage.getItem(USERS_DB_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse stored users:', e);
  }

  // Pre-seed a demo user for quick testing
  const seedUsers = {
    'eco.champion@example.com': {
      user: {
        id: 'user_seed_101',
        fullName: 'Alex Rivera',
        email: 'eco.champion@example.com',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        ecoPoints: 420,
        level: 3,
        badges: ['Sanitation Hero', 'Waste Warrior', 'Flood Shield'],
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
      },
      passHash: 'Password123!',
    },
  };
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(seedUsers));
  return seedUsers;
}

function saveStoredUsers(users: Record<string, { user: EcoQuestUser; passHash: string }>) {
  try {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users:', e);
  }
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  async signIn(credentials: SignInCredentials): Promise<EcoQuestUser> {
    await delay(750); // Realistic network latency

    const users = getStoredUsers();
    const normalizedEmail = credentials.email.trim().toLowerCase();
    const record = users[normalizedEmail];

    if (!record) {
      throw new Error('No account found with this email address. Please check your spelling or sign up.');
    }

    if (record.passHash !== credentials.password) {
      throw new Error('Incorrect password. Please try again or click "Forgot password?".');
    }

    if (credentials.rememberMe) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(record.user));
      } catch (e) {
        console.error('Storage error:', e);
      }
    }

    return record.user;
  },

  async signUp(credentials: SignUpCredentials): Promise<{ user: EcoQuestUser; requiresVerification: boolean }> {
    await delay(850);

    const users = getStoredUsers();
    const normalizedEmail = credentials.email.trim().toLowerCase();

    if (users[normalizedEmail]) {
      throw new Error('An account with this email address already exists. Please sign in instead.');
    }

    const newUser: EcoQuestUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      fullName: credentials.fullName.trim(),
      email: normalizedEmail,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(credentials.fullName)}`,
      ecoPoints: 50, // Welcome bonus
      level: 1,
      badges: ['Eco Rookie'],
      isEmailVerified: false,
      createdAt: new Date().toISOString(),
    };

    users[normalizedEmail] = {
      user: newUser,
      passHash: credentials.password,
    };

    saveStoredUsers(users);

    return {
      user: newUser,
      requiresVerification: true,
    };
  },

  async requestPasswordReset(data: ForgotPasswordData): Promise<void> {
    await delay(700);

    const users = getStoredUsers();
    const normalizedEmail = data.email.trim().toLowerCase();

    if (!users[normalizedEmail]) {
      // For security, don't reveal if email exists, but return gracefully
      return;
    }
  },

  async resetPassword(email: string, data: ResetPasswordData): Promise<void> {
    await delay(800);

    const users = getStoredUsers();
    const normalizedEmail = email.trim().toLowerCase();

    if (users[normalizedEmail]) {
      users[normalizedEmail].passHash = data.password;
      saveStoredUsers(users);
    } else {
      throw new Error('Invalid reset token or email context. Please request a new link.');
    }
  },

  async verifyEmail(email: string): Promise<EcoQuestUser> {
    await delay(750);

    const users = getStoredUsers();
    const normalizedEmail = email.trim().toLowerCase();
    const record = users[normalizedEmail];

    if (!record) {
      throw new Error('User account not found.');
    }

    record.user.isEmailVerified = true;
    saveStoredUsers(users);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(record.user));
    } catch (e) {
      console.error(e);
    }

    return record.user;
  },

  async resendVerificationEmail(email: string): Promise<void> {
    await delay(600);
    // Simulates sending verification mail
  },

  getCurrentUser(): EcoQuestUser | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error('Failed to restore session:', e);
    }
    return null;
  },

  logout(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  },
};
