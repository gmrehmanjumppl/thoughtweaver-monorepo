import { Module, forwardRef } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MessagesRepository } from './messages.repository';
import { SupabaseModule } from '../supabase/supabase.module';
import { AIModule } from '../ai/ai.module';

@Module({
  imports: [SupabaseModule, forwardRef(() => AIModule)],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesRepository],
  exports: [MessagesService, MessagesRepository],
})
export class MessagesModule {}

