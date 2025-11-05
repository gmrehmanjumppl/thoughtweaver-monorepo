import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if credentials are missing or still have placeholder values
const hasPlaceholderValues = 
  supabaseUrl.includes('your-project') || 
  supabaseAnonKey.includes('your-anon-key') ||
  supabaseUrl === '' ||
  supabaseAnonKey === '';

// Create a placeholder client if env vars are missing (prevents build-time errors)
// This will be replaced with actual client when env vars are available
let supabase: SupabaseClient;

if (hasPlaceholderValues) {
  console.error('🚨 SUPABASE CREDENTIALS MISSING OR INCOMPLETE!');
  console.error('🚨 Please edit apps/webnextjs/.env.local with your actual Supabase credentials:');
  console.error('🚨 NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co');
  console.error('🚨 NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key');
  console.error('🚨 Get credentials from: https://supabase.com/dashboard → Settings → API');
  console.error('🚨 Then restart the dev server (pnpm dev)');
  
  // Create a mock client to prevent crashes, but auth won't work
  supabase = createClient('https://placeholder.supabase.co', 'placeholder-key', {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  
  console.warn('⚠️  Using placeholder Supabase client - login will not work until credentials are configured');
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true, // Important: detect OAuth callback tokens in URL
    },
  });
  console.log('✅ Supabase client initialized successfully');
}

export { supabase };
