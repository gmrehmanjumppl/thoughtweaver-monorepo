import { IsString, IsNotEmpty, IsOptional, IsObject, IsBoolean, IsUUID } from 'class-validator';

export class CreateAssistantDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsString()
  @IsNotEmpty()
  systemPrompt: string;

  @IsObject()
  @IsNotEmpty()
  personality: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  isCustom?: boolean;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @IsOptional()
  @IsUUID()
  teamId?: string;
}

