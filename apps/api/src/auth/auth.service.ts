import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AuthService {
  constructor(private readonly supabase: SupabaseService) {}

  async getProfile(userId: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  async verifyToken(token: string) {
    const {
      data: { user },
      error,
    } = await this.supabase.auth.getUser(token);

    if (error || !user) {
      return null;
    }

    return user;
  }
}

