import { IsString, IsOptional, IsArray, IsUUID } from 'class-validator';

export class UpdateConversationDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  selectedAssistants?: string[];

  @IsOptional()
  @IsString()
  selectedLlm?: string;

  @IsOptional()
  @IsUUID()
  projectId?: string;
}

