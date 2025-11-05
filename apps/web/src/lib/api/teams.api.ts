/**
 * Teams API Service
 * 
 * Handles team-related API calls
 */

import { apiClient } from '../api-client';
import type {
  ApiTeam,
  ApiTeamMember,
  CreateTeamDto,
  UpdateTeamDto,
  AddTeamMemberDto,
} from '@thoughtweaver/types';

export const teamsApi = {
  /**
   * Get all teams for current user
   */
  async getAll(): Promise<ApiTeam[]> {
    return apiClient.get<ApiTeam[]>('/teams');
  },

  /**
   * Get team by ID
   */
  async getById(id: string): Promise<ApiTeam> {
    return apiClient.get<ApiTeam>(`/teams/${id}`);
  },

  /**
   * Create new team
   */
  async create(data: CreateTeamDto): Promise<ApiTeam> {
    return apiClient.post<ApiTeam>('/teams', data);
  },

  /**
   * Update team
   */
  async update(id: string, data: UpdateTeamDto): Promise<ApiTeam> {
    return apiClient.put<ApiTeam>(`/teams/${id}`, data);
  },

  /**
   * Delete team
   */
  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/teams/${id}`);
  },

  /**
   * Get team members
   */
  async getMembers(teamId: string): Promise<ApiTeamMember[]> {
    return apiClient.get<ApiTeamMember[]>(`/teams/${teamId}/members`);
  },

  /**
   * Add team member
   */
  async addMember(teamId: string, data: AddTeamMemberDto): Promise<ApiTeamMember> {
    return apiClient.post<ApiTeamMember>(`/teams/${teamId}/members`, data);
  },

  /**
   * Remove team member
   */
  async removeMember(teamId: string, memberId: string): Promise<void> {
    return apiClient.delete<void>(`/teams/${teamId}/members/${memberId}`);
  },
};

// Re-export types for convenience
export type {
  ApiTeam,
  ApiTeamMember,
  CreateTeamDto,
  UpdateTeamDto,
  AddTeamMemberDto,
};

