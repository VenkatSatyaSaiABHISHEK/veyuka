import { User, UserRole } from '../types';
import { delay } from './apiHelper';

export interface LoginParams {
  identifier: string; // Email or phone number
  otpOrPassword?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  /**
   * Determine role and authenticate user.
   * owner@veyuka.com or phone 9999999999 => role "owner"
   * Anything else => role "customer"
   */
  async login({ identifier }: LoginParams): Promise<AuthResponse> {
    const cleanId = identifier.trim().toLowerCase();
    const isOwner =
      cleanId === 'owner@veyuka.com' ||
      cleanId === '9999999999' ||
      cleanId === '+919999999999' ||
      cleanId.includes('owner');

    const role: UserRole = isOwner ? 'owner' : 'customer';

    const user: User = isOwner
      ? {
          id: 'user-owner-1',
          name: 'Veyuka Founder & Director',
          email: 'owner@veyuka.com',
          phone: '+91 99999 99999',
          role: 'owner',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          city: 'Mumbai Headquarters',
        }
      : {
          id: 'user-cust-1',
          name: cleanId.includes('@')
            ? cleanId.split('@')[0].replace('.', ' ').replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())
            : 'Ananya Singhania',
          email: cleanId.includes('@') ? cleanId : 'ananya.s@gmail.com',
          phone: cleanId.includes('@') ? '+91 98200 12345' : cleanId,
          role: 'customer',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          city: 'Mumbai',
        };

    return delay({
      user,
      token: `mock-jwt-token-${role}-${Date.now()}`,
    }, 400);
  },

  async sendOtp(identifier: string): Promise<{ success: boolean; message: string }> {
    return delay({
      success: true,
      message: `OTP sent successfully to ${identifier}. Use any 6 digits to proceed.`,
    }, 300);
  },

  async verifyOtp(identifier: string, _otp: string): Promise<AuthResponse> {
    return authService.login({ identifier });
  },

  async logout(): Promise<void> {
    return delay(undefined, 200);
  },
};
