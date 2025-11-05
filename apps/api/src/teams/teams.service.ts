import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateTeamDto, UpdateTeamDto, AddTeamMemberDto } from './dto/create-team.dto';

@Injectable()
export class TeamsRepository {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll(userId: string) {
    // Get teams where user is owner or member
    const { data, error } = await this.supabase
      .getClient()
      .from('teams')
      .select(`
        *,
        team_members!inner(user_id, role, status)
      `)
      .or(`owner_id.eq.${userId},team_members.user_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async findOne(id: string, userId: string) {
    // Verify user has access to team
    const { data, error } = await this.supabase
      .getClient()
      .from('teams')
      .select(`
        *,
        team_members(user_id, role, status)
      `)
      .eq('id', id)
      .or(`owner_id.eq.${userId},team_members.user_id.eq.${userId}`)
      .single();

    if (error) throw error;
    return data;
  }

  async create(createDto: CreateTeamDto, userId: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('teams')
      .insert({
        name: createDto.name,
        owner_id: userId,
      })
      .select()
      .single();

    if (error) throw error;

    // Add owner as team member
    await this.supabase.getClient().from('team_members').insert({
      team_id: data.id,
      user_id: userId,
      role: 'owner',
      status: 'active',
    });

    return data;
  }

  async update(id: string, updateDto: UpdateTeamDto, userId: string) {
    // Verify user is owner
    const team = await this.findOne(id, userId);
    if (team.owner_id !== userId) {
      throw new ForbiddenException('Only team owner can update team');
    }

    const { data, error } = await this.supabase
      .getClient()
      .from('teams')
      .update({
        name: updateDto.name,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string, userId: string) {
    // Verify user is owner
    const team = await this.findOne(id, userId);
    if (team.owner_id !== userId) {
      throw new ForbiddenException('Only team owner can delete team');
    }

    const { error } = await this.supabase
      .getClient()
      .from('teams')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  }

  async getMembers(teamId: string, userId: string) {
    // Verify user has access
    await this.findOne(teamId, userId);

    const { data, error } = await this.supabase
      .getClient()
      .from('team_members')
      .select(`
        *,
        profiles(id, name, avatar_url)
      `)
      .eq('team_id', teamId);

    if (error) throw error;
    
    // Get email from auth.users for each member
    // Note: This requires admin access or a custom function
    // For now, return without email (can be added via frontend)
    return data;
  }

  async addMember(teamId: string, addDto: AddTeamMemberDto, userId: string) {
    // Verify user is owner or admin
    const team = await this.findOne(teamId, userId);
    const { data: memberData } = await this.supabase
      .getClient()
      .from('team_members')
      .select('role')
      .eq('team_id', teamId)
      .eq('user_id', userId)
      .single();

    if (team.owner_id !== userId && memberData?.role !== 'admin') {
      throw new ForbiddenException('Only owner or admin can add members');
    }

    // Find user by email using Supabase Admin API (auth.users)
    // Note: We need to use admin client to access auth.users
    const { data: { users }, error: userError } = await this.supabase.auth.admin.listUsers();
    
    if (userError) {
      throw new Error(`Failed to search users: ${userError.message}`);
    }

    const user = users.find(u => u.email === addDto.email);
    if (!user) {
      throw new NotFoundException(`User with email ${addDto.email} not found`);
    }

    const { data, error } = await this.supabase
      .getClient()
      .from('team_members')
      .insert({
        team_id: teamId,
        user_id: user.id,
        role: addDto.role,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async removeMember(teamId: string, memberId: string, userId: string) {
    // Verify user is owner or admin
    const team = await this.findOne(teamId, userId);
    const member = await this.supabase
      .getClient()
      .from('team_members')
      .select('role')
      .eq('team_id', teamId)
      .eq('user_id', userId)
      .single();

    if (team.owner_id !== userId && member.data?.role !== 'admin') {
      throw new ForbiddenException('Only owner or admin can remove members');
    }

    const { error } = await this.supabase
      .getClient()
      .from('team_members')
      .delete()
      .eq('id', memberId)
      .eq('team_id', teamId);

    if (error) throw error;
    return { success: true };
  }
}

@Injectable()
export class TeamsService {
  constructor(private readonly repository: TeamsRepository) {}

  async findAll(userId: string) {
    return this.repository.findAll(userId);
  }

  async findOne(id: string, userId: string) {
    const team = await this.repository.findOne(id, userId);
    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }
    return team;
  }

  async create(createDto: CreateTeamDto, userId: string) {
    return this.repository.create(createDto, userId);
  }

  async update(id: string, updateDto: UpdateTeamDto, userId: string) {
    return this.repository.update(id, updateDto, userId);
  }

  async delete(id: string, userId: string) {
    return this.repository.delete(id, userId);
  }

  async getMembers(teamId: string, userId: string) {
    return this.repository.getMembers(teamId, userId);
  }

  async addMember(teamId: string, addDto: AddTeamMemberDto, userId: string) {
    return this.repository.addMember(teamId, addDto, userId);
  }

  async removeMember(teamId: string, memberId: string, userId: string) {
    return this.repository.removeMember(teamId, memberId, userId);
  }
}

