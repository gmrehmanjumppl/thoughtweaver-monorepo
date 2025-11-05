import { Injectable, NotFoundException } from '@nestjs/common';
import { MessagesRepository } from './messages.repository';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(private readonly repository: MessagesRepository) {}

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
}

