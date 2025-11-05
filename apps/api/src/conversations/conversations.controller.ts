import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get()
  async findAll(@CurrentUser() user: any) {
    console.log('📥 GET /conversations - User:', user?.id || 'no user');
    if (!user?.id) {
      throw new Error('User ID is missing from request');
    }
    return this.conversationsService.findAll(user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.conversationsService.findOne(id, user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateConversationDto, @CurrentUser() user: any) {
    return this.conversationsService.create(createDto, user.id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateConversationDto,
    @CurrentUser() user: any,
  ) {
    return this.conversationsService.update(id, updateDto, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.conversationsService.delete(id, user.id);
  }
}

