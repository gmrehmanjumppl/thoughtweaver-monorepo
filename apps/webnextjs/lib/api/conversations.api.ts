/**
 * Conversations API Service
 * 
 * Handles conversation-related API calls
 */

import { apiClient } from '../api-client';
import type {
  ApiConversation,
  CreateConversationDto,
  UpdateConversationDto,
} from '@thoughtweaver/types';

export const conversationsApi = {
  /**
   * Get all conversations for current user
   */
  async getAll(): Promise<ApiConversation[]> {
    return apiClient.get<ApiConversation[]>('/conversations');
  },

  /**
   * Get conversation by ID
   */
  async getById(id: string): Promise<ApiConversation> {
    return apiClient.get<ApiConversation>(`/conversations/${id}`);
  },

  /**
   * Create new conversation
   */
  async create(data: CreateConversationDto): Promise<ApiConversation> {
    return apiClient.post<ApiConversation>('/conversations', data);
  },

  /**
   * Update conversation
   */
  async update(id: string, data: UpdateConversationDto): Promise<ApiConversation> {
    return apiClient.put<ApiConversation>(`/conversations/${id}`, data);
  },

  /**
   * Delete conversation
   */
  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/conversations/${id}`);
  },
};

// Re-export types for convenience
export type { ApiConversation, CreateConversationDto, UpdateConversationDto };

