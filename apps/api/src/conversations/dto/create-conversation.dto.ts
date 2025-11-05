import { IsString, IsNotEmpty, IsOptional, IsArray, IsUUID } from 'class-validator';

export class CreateConversationDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  prompt: string;

  @IsOptional()
  @IsString()
  workflowId?: string;

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

  @IsOptional()
  @IsUUID()
  teamId?: string;

  @IsOptional()
  @IsUUID()
  contextId?: string;
}

