import { Injectable, NotFoundException } from '@nestjs/common';
import { ConversationsRepository } from './conversations.repository';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';

@Injectable()
export class ConversationsService {
  constructor(private readonly repository: ConversationsRepository) {}

  async findAll(userId: string) {
    return this.repository.findAll(userId);
  }

  async findOne(id: string, userId: string) {
    const conversation = await this.repository.findOne(id, userId);
    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }
    return conversation;
  }

  async create(createDto: CreateConversationDto, userId: string) {
    return this.repository.create(createDto, userId);
  }

  async update(id: string, updateDto: UpdateConversationDto, userId: string) {
    const conversation = await this.repository.findOne(id, userId);
    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }
    return this.repository.update(id, updateDto, userId);
  }

  async delete(id: string, userId: string) {
    const conversation = await this.repository.findOne(id, userId);
    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }
    return this.repository.delete(id, userId);
  }
}

