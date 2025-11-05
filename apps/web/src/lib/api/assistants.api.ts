/**
 * Assistants API Service
 * 
 * Handles assistant-related API calls
 */

import { apiClient } from '../api-client';
import type {
  ApiAssistant,
  CreateAssistantDto,
  UpdateAssistantDto,
} from '@thoughtweaver/types';

export const assistantsApi = {
  /**
   * Get all assistants (default + user's custom)
   */
  async getAll(): Promise<ApiAssistant[]> {
    return apiClient.get<ApiAssistant[]>('/assistants');
  },

  /**
   * Get assistant by ID
   */
  async getById(id: string): Promise<ApiAssistant> {
    return apiClient.get<ApiAssistant>(`/assistants/${id}`);
  },

  /**
   * Create new assistant
   */
  async create(data: CreateAssistantDto): Promise<ApiAssistant> {
    return apiClient.post<ApiAssistant>('/assistants', data);
  },

  /**
   * Update assistant
   */
  async update(id: string, data: UpdateAssistantDto): Promise<ApiAssistant> {
    return apiClient.put<ApiAssistant>(`/assistants/${id}`, data);
  },

  /**
   * Delete assistant
   */
  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/assistants/${id}`);
  },
};

// Re-export types for convenience
export type { ApiAssistant, CreateAssistantDto, UpdateAssistantDto };

