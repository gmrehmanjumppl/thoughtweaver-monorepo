import { Controller, Get, Put, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getProfile(@CurrentUser() user: any) {
    return this.usersService.getProfile(user.id);
  }

  @Put('me')
  async updateProfile(@CurrentUser() user: any, @Body() updateDto: UpdateUserDto) {
    return this.usersService.updateProfile(user.id, updateDto);
  }
}

