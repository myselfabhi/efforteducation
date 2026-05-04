import { create } from 'zustand';

export type UserRole = 'super_admin' | 'teacher' | 'student' | 'admin' | 'user';

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  full_name?: string | null;
  phone?: string | null;
  class_grade?: string | null;
  avatar_url?: string | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  hydrate: () => void;
  setUser: (user: User) => void;
}

const LEGACY_ROLE_MAP: Record<string, UserRole> = {
  admin: 'super_admin',
  user: 'student',
};

function normalizeUser(user: User): User {
  const role = LEGACY_ROLE_MAP[user.role] ?? user.role;
  return { ...user, role };
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  hasHydrated: false,

  login: (user, token) => {
    const normalized = normalizeUser(user);
    localStorage.setItem('quiz_token', token);
    localStorage.setItem('quiz_user', JSON.stringify(normalized));
    set({ user: normalized, token, isAuthenticated: true, hasHydrated: true });
  },

  logout: () => {
    localStorage.removeItem('quiz_token');
    localStorage.removeItem('quiz_user');
    set({ user: null, token: null, isAuthenticated: false, hasHydrated: true });
  },

  setUser: (user) => {
    const normalized = normalizeUser(user);
    localStorage.setItem('quiz_user', JSON.stringify(normalized));
    set({ user: normalized });
  },

  hydrate: () => {
    const token = localStorage.getItem('quiz_token');
    const userStr = localStorage.getItem('quiz_user');
    if (token && userStr) {
      try {
        const user = normalizeUser(JSON.parse(userStr));
        set({ user, token, isAuthenticated: true, hasHydrated: true });
        return;
      } catch {
        // fall through
      }
    }
    set({ user: null, token: null, isAuthenticated: false, hasHydrated: true });
  },
}));

/** Where to send a user after login, based on role. */
export function dashboardHomeFor(role: UserRole): string {
  switch (role) {
    case 'super_admin':
    case 'admin':
      return '/dashboard/admin';
    case 'teacher':
      return '/dashboard/teacher';
    case 'student':
    case 'user':
    default:
      return '/dashboard/student';
  }
}
