import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a placeholder client if env vars are missing (prevents build-time errors)
let supabase: SupabaseClient;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project') || supabaseAnonKey.includes('your-anon-key')) {
  console.error('🚨 SUPABASE CREDENTIALS MISSING!');
  console.error('🚨 Please create apps/web/.env.local with:');
  console.error('🚨 VITE_SUPABASE_URL=https://your-project.supabase.co');
  console.error('🚨 VITE_SUPABASE_ANON_KEY=your-anon-key');
  console.error('🚨 Then restart the dev server (pnpm dev)');
  
  // Create a mock client to prevent crashes, but it won't work for auth
  supabase = createClient('https://placeholder.supabase.co', 'placeholder-key', {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true, // Important: detect OAuth callback tokens in URL
    },
  });
  console.log('✅ Supabase client initialized with:', supabaseUrl.replace(/\/\/.*@/, '//***@')); // Hide credentials in logs
}

export { supabase };
