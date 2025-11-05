import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get('me')
  async getMe(@CurrentUser() user: any) {
    if (!user) {
      return { user: null };
    }
    return { user };
  }

  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    return this.authService.getProfile(user.id);
  }
}

