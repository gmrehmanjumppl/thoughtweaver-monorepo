import { Module } from '@nestjs/common';
import { AssistantsController } from './assistants.controller';
import { AssistantsService } from './assistants.service';
import { AssistantsRepository } from './assistants.repository';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [AssistantsController],
  providers: [AssistantsService, AssistantsRepository],
  exports: [AssistantsService],
})
export class AssistantsModule {}

