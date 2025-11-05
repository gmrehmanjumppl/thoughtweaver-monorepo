import { Injectable, NotFoundException } from '@nestjs/common';
import { AssistantsRepository } from './assistants.repository';
import { CreateAssistantDto } from './dto/create-assistant.dto';
import { UpdateAssistantDto } from './dto/update-assistant.dto';

@Injectable()
export class AssistantsService {
  constructor(private readonly repository: AssistantsRepository) {}

  async findAll(userId: string) {
    return this.repository.findAll(userId);
  }

  async findOne(id: string, userId: string) {
    const assistant = await this.repository.findOne(id, userId);
    if (!assistant) {
      throw new NotFoundException(`Assistant with ID ${id} not found`);
    }
    return assistant;
  }

  async create(createDto: CreateAssistantDto, userId: string) {
    return this.repository.create(createDto, userId);
  }

  async update(id: string, updateDto: UpdateAssistantDto, userId: string) {
    const assistant = await this.repository.findOne(id, userId);
    if (!assistant) {
      throw new NotFoundException(`Assistant with ID ${id} not found`);
    }
    return this.repository.update(id, updateDto, userId);
  }

  async delete(id: string, userId: string) {
    const assistant = await this.repository.findOne(id, userId);
    if (!assistant) {
      throw new NotFoundException(`Assistant with ID ${id} not found`);
    }
    return this.repository.delete(id, userId);
  }
}

