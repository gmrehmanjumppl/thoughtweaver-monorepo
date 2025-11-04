import { Module } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { StorageModule } from './storage/storage.module';
import { RealtimeModule } from './realtime/realtime.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    StorageModule,
    RealtimeModule,
  ],
  providers: [SupabaseService],
  exports: [SupabaseService, DatabaseModule, AuthModule, StorageModule, RealtimeModule],
})
export class SupabaseModule {}

