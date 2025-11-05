# 🔧 SUPABASE OAUTH CONFIGURATION GUIDE

## Your Supabase Project
- **Project URL**: `https://eisbyyememqqtuvmsagi.supabase.co`
- **Callback URL**: `https://eisbyyememqqtuvmsagi.supabase.co/auth/v1/callback`

## Step 1: Update .env.local Files

### For apps/webnextjs (Next.js - port 3000):

Edit `apps/webnextjs/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SUPABASE_URL=https://eisbyyememqqtuvmsagi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ACTUAL-ANON-KEY-HERE
```

### For apps/web (Vite - port 5173):

Edit `apps/web/.env.local`:
```env
VITE_API_URL=http://localhost:4000/api
VITE_SUPABASE_URL=https://eisbyyememqqtuvmsagi.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-ACTUAL-ANON-KEY-HERE
```

**Replace `YOUR-ACTUAL-ANON-KEY-HERE` with your actual anon key from Supabase Dashboard → Settings → API**

## Step 2: Configure Redirect URLs in Supabase

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**: `eisbyyememqqtuvmsagi`
3. **Go to**: Authentication → URL Configuration
4. **Add these Redirect URLs**:
   ```
   http://localhost:3000
   http://localhost:3000/
   http://localhost:5173
   http://localhost:5173/
   ```
5. **Click**: "Save"

## Step 3: Configure Google OAuth Provider

1. **In Supabase Dashboard**, go to: **Authentication** → **Providers**
2. **Click**: **Google**
3. **Enable Google provider**: Toggle ON
4. **Add OAuth credentials** (if not already added):
   - Get from: https://console.cloud.google.com/apis/credentials
   - Client ID: (from Google Cloud Console)
   - Client Secret: (from Google Cloud Console)
5. **Redirect URLs** (should auto-populate with your Supabase callback):
   - `https://eisbyyememqqtuvmsagi.supabase.co/auth/v1/callback`
6. **Click**: "Save"

## Step 4: Restart Both Dev Servers

```bash
# Stop both servers (Ctrl+C)

# Start Next.js app
cd apps/webnextjs
pnpm dev

# Start Vite app (in another terminal)
cd apps/web
pnpm dev
```

## Step 5: Test Login

1. Open `http://localhost:3000` (Next.js) or `http://localhost:5173` (Vite)
2. Click "Sign in with Google"
3. Should redirect to Google OAuth
4. After authentication, should redirect back to your app

## Troubleshooting

**Still seeing placeholder URL?**
- ✅ Make sure `.env.local` files have the correct Supabase URL
- ✅ Make sure you restarted the dev server after updating `.env.local`
- ✅ Check console for: `✅ Supabase client initialized successfully`

**OAuth redirect fails?**
- ✅ Make sure redirect URLs are added in Supabase Dashboard (Step 2)
- ✅ Make sure Google OAuth is enabled in Supabase
- ✅ Make sure Google OAuth credentials are configured correctly

**Need your anon key?**
- Go to Supabase Dashboard → Settings → API
- Copy the "anon public" key

