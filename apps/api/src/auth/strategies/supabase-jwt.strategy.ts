import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SupabaseJwtStrategy {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async validate(token: string) {
    // Verify JWT token with Supabase
    // This should call Supabase auth API to verify the token
    try {
      // Implement Supabase JWT verification
      // For now, just decode and return
      const payload = this.jwtService.decode(token);
      return payload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

