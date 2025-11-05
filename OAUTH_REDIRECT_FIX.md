# 🚨 CRITICAL: OAuth Redirect URL Configuration

## The Problem

You're getting a **401 Unauthorized** error because the redirect URL doesn't match what's configured in Supabase. Supabase is very strict about redirect URLs - they must match **exactly**.

## ✅ Solution: Configure Redirect URLs in Supabase Dashboard

**CRITICAL STEP**: You MUST add these URLs to your Supabase project settings:

### Step 1: Go to Supabase Dashboard

1. Open: https://supabase.com/dashboard/project/eisbyyememqqtuvmsagi/auth/url-configuration
2. Scroll to **Redirect URLs** section

### Step 2: Add These Exact URLs

Add **ALL** of these URLs (one per line):

```
http://localhost:3000
http://localhost:3000/
http://localhost:5173
http://localhost:5173/
```

**Important**: 
- Include URLs with and without trailing slash (`/`)
- Don't add any path after the port number (e.g., don't add `/auth/callback`)
- Make sure there are no extra spaces or quotes

### Step 3: Click "Save"

### Step 4: Verify Google OAuth Provider

1. Go to: https://supabase.com/dashboard/project/eisbyyememqqtuvmsagi/auth/providers
2. Click **Google**
3. Make sure **Enable Google provider** is **ON**
4. Verify Google OAuth credentials are configured (Client ID and Client Secret)

### Step 5: Restart Dev Server

```bash
# Stop server (Ctrl+C)
# Restart
cd apps/web
pnpm dev
```

## Why This Happens

When you use `redirectTo: window.location.origin` in the OAuth flow, Supabase redirects back to that exact URL. If that URL isn't in the allowed list in Supabase dashboard, you'll get a 401 error.

The code now uses `window.location.origin + window.location.pathname` to ensure the redirect URL matches what Supabase expects.

## Still Getting 401?

1. **Check the exact URL** in your browser after OAuth redirect
2. **Copy that exact URL** (including port, but NOT including the hash fragment)
3. **Add it to Supabase Redirect URLs** if it's different from what you added
4. **Save** and **restart** your dev server

## Expected Flow After Fix

1. ✅ Click "Sign in with Google"
2. ✅ Complete OAuth flow
3. ✅ Redirect back to `http://localhost:3000` or `http://localhost:5173`
4. ✅ Supabase processes hash fragment automatically
5. ✅ `SIGNED_IN` event fires
6. ✅ User profile loads
7. ✅ Navigate to home page

