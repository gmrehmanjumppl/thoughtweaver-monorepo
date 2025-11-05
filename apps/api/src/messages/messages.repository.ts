import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesRepository {
  constructor(private readonly supabase: SupabaseService) {}

  async findAllByConversation(conversationId: string, userId: string) {
    // First verify the conversation belongs to the user
    const { data: conversation } = await this.supabase
      .getClient()
      .from('conversations')
      .select('id')
      .eq('id', conversationId)
      .eq('user_id', userId)
      .single();

    if (!conversation) {
      throw new Error('Conversation not found or access denied');
    }

    const { data, error } = await this.supabase
      .getClient()
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  }

  async findOne(id: string, userId: string) {
    // Verify message belongs to user's conversation
    const { data, error } = await this.supabase
      .getClient()
      .from('messages')
      .select(`
        *,
        conversations!inner(user_id)
      `)
      .eq('id', id)
      .eq('conversations.user_id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  async create(createDto: CreateMessageDto, userId: string) {
    // Verify conversation belongs to user
    const { data: conversation } = await this.supabase
      .getClient()
      .from('conversations')
      .select('id')
      .eq('id', createDto.conversationId)
      .eq('user_id', userId)
      .single();

    if (!conversation) {
      throw new Error('Conversation not found or access denied');
    }

    const { data, error } = await this.supabase
      .getClient()
      .from('messages')
      .insert({
        conversation_id: createDto.conversationId,
        role: createDto.role,
        content: createDto.content,
        assistant_id: createDto.assistantId,
        metadata: createDto.metadata || {},
        model_used: createDto.modelUsed,
        token_count: createDto.tokenCount,
      })
      .select()
      .single();

    if (error) throw error;

    // Update conversation updated_at timestamp
    await this.supabase
      .getClient()
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', createDto.conversationId);

    return data;
  }
}

