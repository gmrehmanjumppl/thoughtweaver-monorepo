import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';

@Injectable()
export class ConversationsRepository {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll(userId: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async findOne(id: string, userId: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('conversations')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  async create(createDto: CreateConversationDto, userId: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('conversations')
      .insert({
        user_id: userId,
        title: createDto.title,
        prompt: createDto.prompt,
        workflow_id: createDto.workflowId,
        selected_assistants: createDto.selectedAssistants || [],
        selected_llm: createDto.selectedLlm || 'gpt-5-mini',
        project_id: createDto.projectId,
        team_id: createDto.teamId,
        context_id: createDto.contextId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updateDto: UpdateConversationDto, userId: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('conversations')
      .update({
        title: updateDto.title,
        status: updateDto.status,
        selected_assistants: updateDto.selectedAssistants,
        selected_llm: updateDto.selectedLlm,
        project_id: updateDto.projectId,
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
      .from('conversations')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    return { success: true };
  }
}

