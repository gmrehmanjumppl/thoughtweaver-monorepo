import { IsString, IsOptional, IsObject, IsBoolean, IsUUID } from 'class-validator';

export class UpdateAssistantDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  systemPrompt?: string;

  @IsOptional()
  @IsObject()
  personality?: Record<string, any>;
}

