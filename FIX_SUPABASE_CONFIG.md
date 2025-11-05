# 🚨 CRITICAL: Fix Supabase Configuration

## Problem

Your API server is failing because the Supabase URL is still set to a placeholder value:

```
ENOTFOUND: your-project.supabase.co
```

## ✅ Quick Fix

### Step 1: Update `apps/api/.env`

Open `apps/api/.env` and update these values:

```env
# ❌ WRONG (Current - placeholder)
SUPABASE_URL=https://your-project.supabase.co

# ✅ CORRECT (Replace with your actual Supabase URL)
SUPABASE_URL=https://eisbyyememqqtuvmsagi.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key-here
```

### Step 2: Get Your Service Role Key

1. Go to: https://supabase.com/dashboard/project/eisbyyememqqtuvmsagi/settings/api
2. Copy the **service_role** key (⚠️ Secret! Not the anon key)
3. Paste it into `apps/api/.env`:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Step 3: Restart API Server

```bash
# Stop server (Ctrl+C)
cd apps/api
pnpm dev
```

### Step 4: Verify It Works

After restarting, check backend console for:
- ✅ `Supabase client initialized` (no errors)
- ✅ `✅ Token validated successfully`
- ✅ `✅ Found X conversations` (instead of errors)

## 📋 Complete `.env` Template

Your `apps/api/.env` should look like this:

```env
# Server
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Supabase (REQUIRED - Update these!)
SUPABASE_URL=https://eisbyyememqqtuvmsagi.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your-actual-key

# OpenAI (Optional - for AI features)
OPENAI_API_KEY=sk-proj-...

# Other providers (Optional)
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_AI_API_KEY=...
GROK_API_KEY=...
```

## 🔍 Verify Configuration

After updating, test the connection:

```bash
# Test Supabase connection
curl https://eisbyyememqqtuvmsagi.supabase.co/rest/v1/
```

Should return: `{"message":"Welcome to PostgREST"}`

## ⚠️ Common Mistakes

1. **Using anon key instead of service_role key**
   - ❌ Wrong: `SUPABASE_ANON_KEY=...`
   - ✅ Correct: `SUPABASE_SERVICE_ROLE_KEY=...`

2. **Trailing slash in URL**
   - ❌ Wrong: `https://eisbyyememqqtuvmsagi.supabase.co/`
   - ✅ Correct: `https://eisbyyememqqtuvmsagi.supabase.co`

3. **Not restarting server after updating `.env`**
   - Always restart after changing environment variables!

## 🆘 Still Having Issues?

Check backend console for errors:
- `ENOTFOUND` = URL is wrong
- `fetch failed` = Network issue or wrong URL
- `Invalid token` = Service role key is wrong

See `SUPABASE_TOKEN_VALIDATION_SETUP.md` for more detailed troubleshooting.

