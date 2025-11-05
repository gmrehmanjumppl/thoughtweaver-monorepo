/**
 * Users API Service
 * 
 * Handles user-related API calls
 */

import { apiClient } from '../api-client';
import type { ApiUser, UpdateUserDto } from '@thoughtweaver/types';

export const usersApi = {
  /**
   * Get current user profile
   */
  async getMe(): Promise<ApiUser> {
    return apiClient.get<ApiUser>('/users/me');
  },

  /**
   * Update current user profile
   */
  async updateMe(data: UpdateUserDto): Promise<ApiUser> {
    return apiClient.put<ApiUser>('/users/me', data);
  },
};

// Re-export types for convenience
export type { ApiUser, UpdateUserDto };

