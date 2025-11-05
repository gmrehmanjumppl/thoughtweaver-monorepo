import { IsString, IsNotEmpty, IsOptional, IsUUID, IsEnum, IsObject } from 'class-validator';

export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}

export class CreateMessageDto {
  @IsUUID()
  @IsNotEmpty()
  conversationId: string;

  @IsEnum(MessageRole)
  @IsNotEmpty()
  role: MessageRole;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsString()
  assistantId?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsString()
  modelUsed?: string;

  @IsOptional()
  tokenCount?: number;
}

