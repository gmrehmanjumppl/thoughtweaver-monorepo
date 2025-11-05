import { Injectable, NotFoundException } from '@nestjs/common';
import { AIAdapterService } from '../adapters/ai-adapter.service';
import { PromptService } from '../prompts/prompt.service';
import { ModelRegistryService } from '../models/model-registry.service';
import { CostCalculatorService } from '../utils/cost-calculator.service';
import { AssistantsRepository } from '../../assistants/assistants.repository';
import { ConversationsRepository } from '../../conversations/conversations.repository';
import { MessagesRepository } from '../../messages/messages.repository';
import { SupabaseService } from '../../supabase/supabase.service';
import { MessageRole } from '../../messages/dto/create-message.dto';

export interface GenerateMessageOptions {
  conversationId: string;
  userId: string;
  userMessage: string;
  assistantId?: string; // Optional: specific assistant, otherwise uses first selected assistant
}

export interface GenerateMessageResponse {
  message: any;
  usage: {
    tokens: {
      prompt: number;
      completion: number;
      total: number;
    };
    cost: number;
    model: string;
    provider: string;
  };
}

@Injectable()
export class ConversationAIService {
  constructor(
    private readonly aiAdapter: AIAdapterService,
    private readonly promptService: PromptService,
    private readonly modelRegistry: ModelRegistryService,
    private readonly costCalculator: CostCalculatorService,
    private readonly assistantsRepository: AssistantsRepository,
    private readonly conversationsRepository: ConversationsRepository,
    private readonly messagesRepository: MessagesRepository,
    private readonly supabase: SupabaseService,
  ) {}

  /**
   * Generate AI response using assistant's system prompt and context
   */
  async generateMessage(
    options: GenerateMessageOptions,
  ): Promise<GenerateMessageResponse> {
    // 1. Get conversation with selected assistants and LLM
    const conversation = await this.conversationsRepository.findOne(
      options.conversationId,
      options.userId,
    );

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // 2. Determine which assistant to use
    const assistantId =
      options.assistantId ||
      (conversation.selected_assistants && conversation.selected_assistants.length > 0
        ? conversation.selected_assistants[0]
        : null);

    if (!assistantId) {
      throw new NotFoundException(
        'No assistant selected for this conversation',
      );
    }

    // 3. Get assistant details (system prompt, personality)
    const assistant = await this.assistantsRepository.findOne(
      assistantId,
      options.userId,
    );

    if (!assistant) {
      throw new NotFoundException(`Assistant ${assistantId} not found`);
    }

    // 4. Get context if conversation has context_id
    let contextContent = '';
    if (conversation.context_id) {
      const { data: context } = await this.supabase
        .getClient()
        .from('contexts')
        .select('content')
        .eq('id', conversation.context_id)
        .single();

      if (context) {
        contextContent = context.content;
      }
    }

    // 5. Get previous messages for conversation history
    const previousMessages = await this.messagesRepository.findAllByConversation(
      options.conversationId,
      options.userId,
    );

    // 6. Parse selected LLM model (format: "provider/model-id")
    const { provider, modelId } = this.parseModelId(
      conversation.selected_llm || 'openai/gpt-5-mini',
    );

    // 7. Build system prompt from assistant
    const systemPrompt = this.promptService.buildSystemPrompt({
      systemPrompt: assistant.system_prompt,
      personality: assistant.personality || {},
    });

    // 8. Build conversation messages array
    const messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> =
      [];

    // Add system prompt
    messages.push({
      role: 'system',
      content: systemPrompt,
    });

    // Add context if available
    if (contextContent) {
      messages.push({
        role: 'system',
        content: `Context:\n${contextContent}`,
      });
    }

    // Add previous messages
    for (const msg of previousMessages) {
      messages.push({
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content,
      });
    }

    // Add current user message
    messages.push({
      role: 'user',
      content: options.userMessage,
    });

    // 9. Generate response using AI adapter
    const response = await this.aiAdapter.generateFromMessages(
      provider,
      modelId,
      messages,
      {
        model: `${provider}/${modelId}`,
        temperature: 0.7,
        maxTokens: 2000,
      },
    );

    // 10. Calculate cost
    const cost = this.costCalculator.calculateCost(
      `${provider}/${modelId}`,
      response.tokens.prompt,
      response.tokens.completion,
    );

    // 11. Save assistant message to database
    const assistantMessage = await this.messagesRepository.create(
      {
        conversationId: options.conversationId,
        role: MessageRole.ASSISTANT,
        content: response.content,
        assistantId: assistantId,
        modelUsed: `${provider}/${modelId}`,
        tokenCount: response.tokens.total,
        metadata: {
          tokens: response.tokens,
          cost,
          provider,
          model: modelId,
        },
      },
      options.userId,
    );

    // 12. Track usage for billing
    await this.trackUsage({
      userId: options.userId,
      conversationId: options.conversationId,
      teamId: conversation.team_id,
      tokens: response.tokens,
      cost,
      model: `${provider}/${modelId}`,
      provider,
    });

    return {
      message: assistantMessage,
      usage: {
        tokens: response.tokens,
        cost,
        model: `${provider}/${modelId}`,
        provider,
      },
    };
  }

  /**
   * Generate response from multiple assistants (for multi-assistant workflows)
   */
  async generateFromMultipleAssistants(
    conversationId: string,
    userId: string,
    userMessage: string,
  ): Promise<GenerateMessageResponse[]> {
    const conversation = await this.conversationsRepository.findOne(
      conversationId,
      userId,
    );

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const assistantIds = conversation.selected_assistants || [];
    if (assistantIds.length === 0) {
      throw new NotFoundException('No assistants selected');
    }

    const responses: GenerateMessageResponse[] = [];

    // Generate response from each assistant
    for (const assistantId of assistantIds) {
      const response = await this.generateMessage({
        conversationId,
        userId,
        userMessage,
        assistantId,
      });
      responses.push(response);
    }

    return responses;
  }

  /**
   * Parse model ID from format "provider/model-id" to { provider, modelId }
   */
  private parseModelId(modelId: string): { provider: string; modelId: string } {
    const parts = modelId.split('/');
    if (parts.length === 2) {
      return {
        provider: parts[0],
        modelId: parts[1],
      };
    }

    // Default to OpenAI if format is incorrect
    return {
      provider: 'openai',
      modelId: modelId || 'gpt-5-mini',
    };
  }

  /**
   * Track usage for billing
   */
  private async trackUsage(options: {
    userId: string;
    conversationId: string;
    teamId?: string;
    tokens: { prompt: number; completion: number; total: number };
    cost: number;
    model: string;
    provider: string;
  }) {
    const { error } = await this.supabase.getClient().from('usage_tracking').insert({
      user_id: options.userId,
      conversation_id: options.conversationId,
      team_id: options.teamId || null,
      metric_type: 'token',
      count: options.tokens.total,
      cost_usd: options.cost,
      model_used: options.model,
      provider: options.provider,
      metadata: {
        input_tokens: options.tokens.prompt,
        output_tokens: options.tokens.completion,
      },
    });

    if (error) {
      console.error('Failed to track usage:', error);
      // Don't throw - usage tracking failure shouldn't break the request
    }
  }
}

