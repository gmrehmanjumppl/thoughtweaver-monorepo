# 🚨 URGENT: Complete These Steps to Fix OAuth

## ✅ Step 1: Get Your Anon Key

1. Go to: https://supabase.com/dashboard/project/eisbyyememqqtuvmsagi/settings/api
2. Find: **anon public** key (long string starting with `eyJ...`)
3. Copy it

## ✅ Step 2: Update .env.local Files

### Update apps/webnextjs/.env.local:
Replace `REPLACE-WITH-YOUR-ACTUAL-ANON-KEY` with your actual anon key

### Update apps/web/.env.local:
Replace `REPLACE-WITH-YOUR-ACTUAL-ANON-KEY` with your actual anon key

**Example:**
```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpc2J5eWVtZW1xcXR1dm1zYWdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTAwMDAwMDAsImV4cCI6MjAyNTU3NjAwMH0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## ✅ Step 3: Configure Redirect URLs in Supabase

**CRITICAL**: Without this, OAuth will fail!

1. Go to: https://supabase.com/dashboard/project/eisbyyememqqtuvmsagi/auth/url-configuration
2. Under **Redirect URLs**, add:
   ```
   http://localhost:3000
   http://localhost:3000/
   http://localhost:5173
   http://localhost:5173/
   ```
3. Click **Save**

## ✅ Step 4: Enable Google OAuth

1. Go to: https://supabase.com/dashboard/project/eisbyyememqqtuvmsagi/auth/providers
2. Click **Google**
3. Toggle **Enable Google provider** to ON
4. If you haven't set up Google OAuth credentials:
   - Go to: https://console.cloud.google.com/apis/credentials
   - Create OAuth 2.0 Client ID
   - Authorized redirect URIs: `https://eisbyyememqqtuvmsagi.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret
   - Paste into Supabase Google provider settings
5. Click **Save**

## ✅ Step 5: Restart Servers

```bash
# Stop both servers (Ctrl+C)

# Restart Next.js
cd apps/webnextjs
pnpm dev

# Restart Vite (in another terminal)
cd apps/web
pnpm dev
```

## ✅ Step 6: Test

1. Open http://localhost:3000 or http://localhost:5173
2. Click "Sign in with Google"
3. Should work now! 🎉

## Still Not Working?

Check console for:
- ✅ Should see: `✅ Supabase client initialized successfully`
- ❌ Should NOT see: `🚨 SUPABASE CREDENTIALS MISSING!`

If you see errors, verify:
1. Anon key is correct (no extra spaces/quotes)
2. Redirect URLs are saved in Supabase
3. Google OAuth is enabled
4. Servers were restarted after updating .env.local

