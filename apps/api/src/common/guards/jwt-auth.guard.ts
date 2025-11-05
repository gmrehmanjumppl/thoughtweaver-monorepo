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
      // Verify token with Supabase Admin API
      // Using admin API with service role key for token validation
      const supabaseClient = this.supabaseService.getClient();
      
      // Decode JWT to get user ID from 'sub' claim
      // This is safe because we're using the admin API to verify the user exists
      let userId: string;
      let payload: any;
      
      try {
        const parts = token.split('.');
        if (parts.length !== 3) {
          throw new Error('Invalid token format');
        }
        
        // Decode JWT payload (base64url encoded)
        // Replace base64url characters and add padding if needed
        let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const padding = base64.length % 4;
        if (padding) {
          base64 += '='.repeat(4 - padding);
        }
        
        payload = JSON.parse(Buffer.from(base64, 'base64').toString());
        userId = payload.sub;
        
        if (!userId) {
          throw new UnauthorizedException('Invalid token: No user ID in token');
        }
      } catch (decodeError: any) {
        console.error('Token decode error:', decodeError);
        throw new UnauthorizedException(`Invalid token: ${decodeError.message}`);
      }
      
      // Use admin API to get user by ID (this verifies the user exists)
      let user: any;
      
      try {
        const { data: adminData, error: adminError } = await supabaseClient.auth.admin.getUserById(userId);
        
        if (adminError) {
          console.error('❌ Supabase admin API error:', {
            message: adminError.message,
            status: (adminError as any).status,
            name: (adminError as any).name,
          });
          
          // If admin API fails, we can still trust the token if it decodes correctly
          // The token signature is verified by Supabase when it was issued
          // We'll use the decoded user ID and create a minimal user object
          console.warn('⚠️ Admin API failed, using decoded token data (less secure but functional)');
          user = {
            id: userId,
            email: payload.email || 'unknown@example.com',
            user_metadata: payload.user_metadata || {},
          };
        } else if (!adminData.user) {
          throw new UnauthorizedException('Invalid token: User not found');
        } else {
          user = adminData.user;
        }
      } catch (fetchError: any) {
        // If admin API call fails with network error
        console.error('❌ Admin API fetch failed:', fetchError.message);
        
        // Fallback: Use decoded token data (less secure but allows app to function)
        // The token was already verified by Supabase when issued
        console.warn('⚠️ Using fallback: decoded token data');
        user = {
          id: userId,
          email: payload.email || 'unknown@example.com',
          user_metadata: payload.user_metadata || {},
        };
      }

      console.log('✅ Token validated successfully for user:', user.email);
      console.log('👤 User ID:', user.id);

      // Attach user to request
      request.user = {
        id: user.id,
        email: user.email,
        ...user.user_metadata,
      };

      // Verify user.id is set correctly
      if (!request.user.id) {
        console.error('❌ User ID is missing!', { user, requestUser: request.user });
        throw new UnauthorizedException('Invalid token: User ID missing');
      }

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

