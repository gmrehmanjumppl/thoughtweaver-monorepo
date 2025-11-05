import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateAssistantDto } from './dto/create-assistant.dto';
import { UpdateAssistantDto } from './dto/update-assistant.dto';

@Injectable()
export class AssistantsRepository {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll(userId: string) {
    // Get default assistants + user's custom assistants
    const { data, error } = await this.supabase
      .getClient()
      .from('assistants')
      .select('*')
      .or(`is_default.eq.true,user_id.eq.${userId}`)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async findOne(id: string, userId: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('assistants')
      .select('*')
      .eq('id', id)
      .or(`is_default.eq.true,user_id.eq.${userId}`)
      .single();

    if (error) throw error;
    return data;
  }

  async create(createDto: CreateAssistantDto, userId: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('assistants')
      .insert({
        id: createDto.id,
        user_id: userId,
        name: createDto.name,
        description: createDto.description,
        avatar_url: createDto.avatarUrl,
        color: createDto.color,
        system_prompt: createDto.systemPrompt,
        personality: createDto.personality,
        is_custom: createDto.isCustom ?? true,
        is_default: createDto.isDefault ?? false,
        team_id: createDto.teamId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updateDto: UpdateAssistantDto, userId: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('assistants')
      .update({
        name: updateDto.name,
        description: updateDto.description,
        avatar_url: updateDto.avatarUrl,
        color: updateDto.color,
        system_prompt: updateDto.systemPrompt,
        personality: updateDto.personality,
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string, userId: string) {
    const { error } = await this.supabase
      .getClient()
      .from('assistants')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    return { success: true };
  }
}

