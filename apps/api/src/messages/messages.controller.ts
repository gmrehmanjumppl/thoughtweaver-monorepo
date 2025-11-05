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

class GenerateMessageDto {
  content: string;
  assistantId?: string;
}

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

  /**
   * Generate AI response using assistant
   * POST /api/conversations/:conversationId/messages/generate
   */
  @Post('generate')
  @HttpCode(HttpStatus.CREATED)
  async generate(
    @Param('conversationId') conversationId: string,
    @Body() generateDto: GenerateMessageDto,
    @CurrentUser() user: any,
  ) {
    return this.messagesService.createWithAIResponse(
      conversationId,
      generateDto.content,
      user.id,
      generateDto.assistantId,
    );
  }

  /**
   * Generate responses from multiple assistants
   * POST /api/conversations/:conversationId/messages/generate-multiple
   */
  @Post('generate-multiple')
  @HttpCode(HttpStatus.CREATED)
  async generateMultiple(
    @Param('conversationId') conversationId: string,
    @Body() generateDto: GenerateMessageDto,
    @CurrentUser() user: any,
  ) {
    return this.messagesService.generateMultipleResponses(
      conversationId,
      generateDto.content,
      user.id,
    );
  }
}

