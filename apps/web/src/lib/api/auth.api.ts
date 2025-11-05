/**
 * Auth API Service
 * 
 * Handles authentication-related API calls
 */

import { apiClient } from '../api-client';
import type { ApiUser } from '@thoughtweaver/types';

export interface AuthMeResponse {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}

export const authApi = {
  /**
   * Get current authenticated user
   * Note: Uses /users/me endpoint (not /auth/me)
   */
  async getMe(): Promise<AuthMeResponse> {
    // For now, redirect to users API
    // In the future, auth/me might return JWT payload
    return apiClient.get<AuthMeResponse>('/users/me');
  },

  /**
   * Login (handled by Supabase client-side)
   * This endpoint is kept for future use if needed
   */
  async login(email: string, password: string) {
    // Note: Login is handled by Supabase client-side
    // This is kept for future backend authentication if needed
    throw new Error('Login is handled by Supabase client-side');
  },

  /**
   * Logout (handled by Supabase client-side)
   */
  async logout() {
    // Note: Logout is handled by Supabase client-side
    // This is kept for future backend authentication if needed
    throw new Error('Logout is handled by Supabase client-side');
  },
};

