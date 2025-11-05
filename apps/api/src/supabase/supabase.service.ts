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

    this.client = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
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

