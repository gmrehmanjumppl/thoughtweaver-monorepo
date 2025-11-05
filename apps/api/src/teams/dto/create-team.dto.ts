import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateTeamDto {
  @IsOptional()
  @IsString()
  name?: string;
}

export class AddTeamMemberDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  role: 'admin' | 'member';
}

