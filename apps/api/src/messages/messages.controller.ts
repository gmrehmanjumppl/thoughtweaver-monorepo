import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('conversations/:conversationId/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  async findAll(
    @Param('conversationId') conversationId: string,
    @CurrentUser() user: any,
  ) {
    return this.messagesService.findAllByConversation(conversationId, user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.messagesService.findOne(id, user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('conversationId') conversationId: string,
    @Body() createDto: CreateMessageDto,
    @CurrentUser() user: any,
  ) {
    return this.messagesService.create(
      { ...createDto, conversationId },
      user.id,
    );
  }
}

