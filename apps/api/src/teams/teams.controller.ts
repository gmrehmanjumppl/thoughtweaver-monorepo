import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto, UpdateTeamDto, AddTeamMemberDto } from './dto/create-team.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  async findAll(@CurrentUser() user: any) {
    return this.teamsService.findAll(user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.teamsService.findOne(id, user.id);
  }

  @Post()
  async create(@Body() createDto: CreateTeamDto, @CurrentUser() user: any) {
    return this.teamsService.create(createDto, user.id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateTeamDto,
    @CurrentUser() user: any,
  ) {
    return this.teamsService.update(id, updateDto, user.id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.teamsService.delete(id, user.id);
  }

  @Get(':id/members')
  async getMembers(@Param('id') id: string, @CurrentUser() user: any) {
    return this.teamsService.getMembers(id, user.id);
  }

  @Post(':id/members')
  async addMember(
    @Param('id') id: string,
    @Body() addDto: AddTeamMemberDto,
    @CurrentUser() user: any,
  ) {
    return this.teamsService.addMember(id, addDto, user.id);
  }

  @Delete(':id/members/:memberId')
  async removeMember(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @CurrentUser() user: any,
  ) {
    return this.teamsService.removeMember(id, memberId, user.id);
  }
}

