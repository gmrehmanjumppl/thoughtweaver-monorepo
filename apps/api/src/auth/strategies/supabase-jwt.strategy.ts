import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class SupabaseJwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private supabaseService: SupabaseService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('SUPABASE_JWT_SECRET') || 'your-jwt-secret',
    });
  }

  async validate(payload: any) {
    // Verify token with Supabase
    const {
      data: { user },
    } = await this.supabaseService.auth.getUser(payload.sub);

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      ...user.user_metadata,
    };
  }
}

