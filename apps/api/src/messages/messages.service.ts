import { Injectable, NotFoundException } from '@nestjs/common';
import { MessagesRepository } from './messages.repository';
import { CreateMessageDto } from './dto/create-message.dto';
import { ConversationAIService } from '../ai/services/conversation-ai.service';

@Injectable()
export class MessagesService {
  constructor(
    private readonly repository: MessagesRepository,
    private readonly conversationAI: ConversationAIService,
  ) {}

  async findAllByConversation(conversationId: string, userId: string) {
    return this.repository.findAllByConversation(conversationId, userId);
  }

  async findOne(id: string, userId: string) {
    const message = await this.repository.findOne(id, userId);
    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
    return message;
  }

  async create(createDto: CreateMessageDto, userId: string) {
    return this.repository.create(createDto, userId);
  }

  /**
   * Create user message and generate AI response using assistant
   */
  async createWithAIResponse(
    conversationId: string,
    userMessage: string,
    userId: string,
    assistantId?: string,
  ) {
    // 1. Save user message
    const userMessageDto: CreateMessageDto = {
      conversationId,
      role: 'user' as any,
      content: userMessage,
    };
    const userMsg = await this.repository.create(userMessageDto, userId);

    // 2. Generate AI response using assistant
    const aiResponse = await this.conversationAI.generateMessage({
      conversationId,
      userId,
      userMessage,
      assistantId,
    });

    return {
      userMessage: userMsg,
      assistantMessage: aiResponse.message,
      usage: aiResponse.usage,
    };
  }

  /**
   * Generate response from multiple assistants
   */
  async generateMultipleResponses(
    conversationId: string,
    userMessage: string,
    userId: string,
  ) {
    // Save user message first
    const userMessageDto: CreateMessageDto = {
      conversationId,
      role: 'user' as any,
      content: userMessage,
    };
    const userMsg = await this.repository.create(userMessageDto, userId);

    // Generate responses from all selected assistants
    const responses = await this.conversationAI.generateFromMultipleAssistants(
      conversationId,
      userId,
      userMessage,
    );

    return {
      userMessage: userMsg,
      assistantMessages: responses.map((r) => r.message),
      usage: responses.map((r) => r.usage),
    };
  }
}

