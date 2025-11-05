import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService, TeamsRepository } from './teams.service';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [TeamsController],
  providers: [TeamsService, TeamsRepository],
  exports: [TeamsService, TeamsRepository],
})
export class TeamsModule {}

