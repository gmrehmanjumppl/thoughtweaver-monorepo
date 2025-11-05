import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SupabaseService } from '../../supabase/supabase.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private supabaseService: SupabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.substring(7);

    // Log token info (first 20 chars only for security)
    console.log('🔐 Validating token:', token.substring(0, 20) + '...');

    try {
      // Verify token with Supabase
      // Note: getUser() validates the JWT token and returns user info
      const {
        data: { user },
        error,
      } = await this.supabaseService.auth.getUser(token);

      if (error) {
        console.error('❌ Supabase token validation error:', {
          message: error.message,
          status: error.status,
          name: error.name,
        });
        throw new UnauthorizedException(`Invalid token: ${error.message}`);
      }

      if (!user) {
        console.error('❌ No user found for token');
        throw new UnauthorizedException('Invalid token: User not found');
      }

      console.log('✅ Token validated successfully for user:', user.email);

      // Attach user to request
      request.user = {
        id: user.id,
        email: user.email,
        ...user.user_metadata,
      };

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('❌ JWT Auth Guard error:', error);
      throw new UnauthorizedException(`Invalid token: ${error.message}`);
    }
  }
}

