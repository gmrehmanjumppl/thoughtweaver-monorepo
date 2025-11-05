import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AssistantsService } from './assistants.service';
import { CreateAssistantDto } from './dto/create-assistant.dto';
import { UpdateAssistantDto } from './dto/update-assistant.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('assistants')
export class AssistantsController {
  constructor(private readonly assistantsService: AssistantsService) {}

  @Get()
  async findAll(@CurrentUser() user: any) {
    return this.assistantsService.findAll(user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.assistantsService.findOne(id, user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateAssistantDto, @CurrentUser() user: any) {
    return this.assistantsService.create(createDto, user.id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateAssistantDto,
    @CurrentUser() user: any,
  ) {
    return this.assistantsService.update(id, updateDto, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.assistantsService.delete(id, user.id);
  }
}

