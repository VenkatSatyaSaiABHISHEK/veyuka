import { User, UserRole } from '../types';
import { delay } from './apiHelper';

const AUTH_STORAGE_KEY = 'veyuka_crm_auth_user';

export interface AuthCheckResult {
  allowed: boolean;
  user?: User;
  errorMessage?: string;
}

const MOCK_USERS: Record<string, User> = {
  'owner@veyuka.com': {
    id: 'usr-owner',
    name: 'Vikramaditya Singhania',
    email: 'owner@veyuka.com',
    phone: '+91 99999 99999',
    role: 'owner',
    department: 'Executive Office',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    permissions: ['all'],
  },
  '9999999999': {
    id: 'usr-owner',
    name: 'Vikramaditya Singhania',
    email: 'owner@veyuka.com',
    phone: '+91 99999 99999',
    role: 'owner',
    department: 'Executive Office',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    permissions: ['all'],
  },
  'ops@veyuka.com': {
    id: 'usr-ops',
    name: 'Tanya Singhal',
    email: 'ops@veyuka.com',
    phone: '+91 98200 44321',
    role: 'operations',
    department: 'Operations & Staging',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    permissions: ['bookings', 'vendors', 'calendar', 'operations', 'customers'],
  },
  'finance@veyuka.com': {
    id: 'usr-finance',
    name: 'Aditi Chawla',
    email: 'finance@veyuka.com',
    phone: '+91 98111 22334',
    role: 'finance',
    department: 'Treasury & Accounts',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    permissions: ['finance', 'bookings', 'analytics'],
  },
  'support@veyuka.com': {
    id: 'usr-support',
    name: 'Samir Joshi',
    email: 'support@veyuka.com',
    phone: '+91 97722 33445',
    role: 'support',
    department: 'Client Concierge',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    permissions: ['operations', 'bookings', 'customers'],
  },
};

export const authService = {
  /**
   * Validate identifier (email or phone)
   */
  async checkIdentifier(identifier: string): Promise<AuthCheckResult> {
    await delay(400);
    const clean = identifier.trim().toLowerCase().replace(/\s+/g, '');

    const user = MOCK_USERS[clean] || (clean === '9999999999' ? MOCK_USERS['owner@veyuka.com'] : undefined);

    if (!user) {
      return {
        allowed: false,
        errorMessage: 'This console is for Veyuka team members.',
      };
    }

    return {
      allowed: true,
      user,
    };
  },

  /**
   * Mock OTP verification (any 6 digits valid for authorized users)
   */
  async verifyOtp(identifier: string, otp: string): Promise<{ success: boolean; user?: User; error?: string }> {
    await delay(500);
    if (!otp || otp.length !== 6) {
      return { success: false, error: 'Please enter a 6-digit code.' };
    }

    const check = await this.checkIdentifier(identifier);
    if (!check.allowed || !check.user) {
      return { success: false, error: 'Authorization failed.' };
    }

    // Persist session to localStorage and cookie
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(check.user));
      document.cookie = `veyuka_session=${encodeURIComponent(JSON.stringify(check.user))}; path=/; max-age=86400; SameSite=Lax`;
    }

    return { success: true, user: check.user };
  },

  /**
   * Get currently authenticated user from storage
   */
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    await delay(200);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      document.cookie = 'veyuka_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  },

  /**
   * Check if role has permission to access a section
   */
  hasAccess(role: UserRole, section: string): boolean {
    if (role === 'owner') return true;
    switch (section) {
      case 'today':
        return true;
      case 'bookings':
        return ['owner', 'operations', 'finance', 'support'].includes(role);
      case 'customers':
        return ['owner', 'operations', 'support'].includes(role);
      case 'vendors':
        return ['owner', 'operations'].includes(role);
      case 'calendar':
        return ['owner', 'operations', 'support'].includes(role);
      case 'finance':
        return ['owner', 'finance'].includes(role);
      case 'operations':
        return ['owner', 'operations', 'support'].includes(role);
      case 'team':
        return ['owner'].includes(role);
      case 'analytics':
        return ['owner', 'finance'].includes(role);
      case 'marketing':
        return ['owner'].includes(role);
      case 'settings':
        return ['owner'].includes(role);
      default:
        return false;
    }
  },
};
