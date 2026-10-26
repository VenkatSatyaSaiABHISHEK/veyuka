import { create } from 'zustand';
import { User, UserRole } from '../types';
import { authService, LoginParams } from '../services/auth';

interface AuthState {
  user: User | null;
  role: UserRole | 'guest';
  isLoggedIn: boolean;
  isLoading: boolean;
  returnUrl: string | null;
  login: (params: LoginParams) => Promise<boolean>;
  logout: () => Promise<void>;
  setReturnUrl: (url: string | null) => void;
  setUser: (user: User | null, role: UserRole | 'guest') => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: 'guest',
  isLoggedIn: false,
  isLoading: false,
  returnUrl: null,

  login: async (params: LoginParams) => {
    set({ isLoading: true });
    try {
      const response = await authService.login(params);
      set({
        user: response.user,
        role: response.user.role,
        isLoggedIn: true,
        isLoading: false,
      });
      return true;
    } catch {
      set({ isLoading: false });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
    } finally {
      set({
        user: null,
        role: 'guest',
        isLoggedIn: false,
        isLoading: false,
        returnUrl: null,
      });
    }
  },

  setReturnUrl: (url: string | null) => set({ returnUrl: url }),

  setUser: (user: User | null, role: UserRole | 'guest') =>
    set({
      user,
      role,
      isLoggedIn: !!user,
    }),
}));
