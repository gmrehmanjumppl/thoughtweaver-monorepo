/**
 * Messages API Service
 * 
 * Handles message-related API calls and AI generation
 */

import { apiClient } from '../api-client';
import type {
  ApiMessage,
  CreateMessageDto,
  GenerateMessageDto,
  GenerateMessageResponse,
  GenerateMultipleResponse,
} from '@thoughtweaver/types';

export const messagesApi = {
  /**
   * Get all messages for a conversation
   */
  async getByConversation(conversationId: string): Promise<ApiMessage[]> {
    return apiClient.get<ApiMessage[]>(`/conversations/${conversationId}/messages`);
  },

  /**
   * Get message by ID
   */
  async getById(conversationId: string, messageId: string): Promise<ApiMessage> {
    return apiClient.get<ApiMessage>(`/conversations/${conversationId}/messages/${messageId}`);
  },

  /**
   * Create message manually
   */
  async create(conversationId: string, data: CreateMessageDto): Promise<ApiMessage> {
    return apiClient.post<ApiMessage>(`/conversations/${conversationId}/messages`, data);
  },

  /**
   * Generate AI response using assistant
   */
  async generate(conversationId: string, data: GenerateMessageDto): Promise<GenerateMessageResponse> {
    return apiClient.post<GenerateMessageResponse>(
      `/conversations/${conversationId}/messages/generate`,
      data,
    );
  },

  /**
   * Generate responses from multiple assistants
   */
  async generateMultiple(conversationId: string, data: GenerateMessageDto): Promise<GenerateMultipleResponse> {
    return apiClient.post<GenerateMultipleResponse>(
      `/conversations/${conversationId}/messages/generate-multiple`,
      data,
    );
  },
};

// Re-export types for convenience
export type {
  ApiMessage,
  CreateMessageDto,
  GenerateMessageDto,
  GenerateMessageResponse,
  GenerateMultipleResponse,
};

