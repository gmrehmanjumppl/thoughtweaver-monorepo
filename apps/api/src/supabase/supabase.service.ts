import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private client: SupabaseClient;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL') || 
                        this.configService.get<string>('NEXT_PUBLIC_SUPABASE_URL');
    const supabaseServiceKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration is missing. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    }

    // Validate that URL is not a placeholder
    if (supabaseUrl.includes('your-project') || supabaseUrl.includes('placeholder')) {
      throw new Error(
        `❌ Invalid Supabase URL! Current: ${supabaseUrl}\n` +
        `Please update apps/api/.env with your actual Supabase URL:\n` +
        `SUPABASE_URL=https://eisbyyememqqtuvmsagi.supabase.co`
      );
    }

    // Validate that service key is not a placeholder
    if (supabaseServiceKey.includes('your-service-role-key') || supabaseServiceKey.includes('placeholder')) {
      throw new Error(
        `❌ Invalid Supabase Service Role Key!\n` +
        `Please update apps/api/.env with your actual service_role key from:\n` +
        `https://supabase.com/dashboard/project/eisbyyememqqtuvmsagi/settings/api`
      );
    }

    console.log('✅ Supabase client initializing with URL:', supabaseUrl.replace(/\/$/, ''));
    
    this.client = createClient(supabaseUrl.replace(/\/$/, ''), supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    
    console.log('✅ Supabase client initialized successfully');
  }

  getClient(): SupabaseClient {
    return this.client;
  }

  // Database operations
  get database() {
    return this.client;
  }

  // Auth operations
  get auth() {
    return this.client.auth;
  }

  // Storage operations
  get storage(): SupabaseClient['storage'] {
    return this.client.storage;
  }

  // Realtime operations
  get realtime() {
    return this.client.realtime;
  }
}

