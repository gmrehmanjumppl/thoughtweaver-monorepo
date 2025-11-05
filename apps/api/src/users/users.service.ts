import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersRepository {
  constructor(private readonly supabase: SupabaseService) {}

  async findOne(userId: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  async update(userId: string, updateDto: UpdateUserDto) {
    const { data, error } = await this.supabase
      .getClient()
      .from('profiles')
      .update({
        name: updateDto.name,
        avatar_url: updateDto.avatarUrl,
        preferences: updateDto.preferences,
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async getProfile(userId: string) {
    const profile = await this.repository.findOne(userId);
    if (!profile) {
      throw new NotFoundException(`User profile not found`);
    }
    return profile;
  }

  async updateProfile(userId: string, updateDto: UpdateUserDto) {
    return this.repository.update(userId, updateDto);
  }
}

