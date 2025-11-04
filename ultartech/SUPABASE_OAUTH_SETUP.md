# Supabase OAuth Setup Guide

## Error: redirect_uri_mismatch (FIX THIS FIRST!)

**Error**: `Error 400: redirect_uri_mismatch`

**Cause**: The redirect URI in Google Cloud Console doesn't match what Supabase is sending.

**Quick Fix**:

1. **Get Your Supabase Project URL**:
   - Go to Supabase Dashboard → Settings → API
   - Copy your **Project URL** (e.g., `https://eisbyyememqqtuvmsagi.supabase.co`)

2. **Fix Redirect URI in Google Cloud Console**:
   - Go to: https://console.cloud.google.com/
   - Select your project
   - Go to **APIs & Services** → **Credentials**
   - Click on your OAuth 2.0 Client ID
   - Under **Authorized redirect URIs**, add:
     ```
     https://eisbyyememqqtuvmsagi.supabase.co/auth/v1/callback
     ```
   - **⚠️ IMPORTANT**: Replace `eisbyyememqqtuvmsagi` with YOUR project reference
   - Click **Save**

3. **Verify Exact Match**:
   - The redirect URI must be EXACTLY: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
   - No trailing slashes
   - No typos
   - Use HTTPS (not HTTP)

4. **Wait a Few Minutes**:
   - Google changes can take 1-2 minutes to propagate
   - Try signing in again after waiting

**Common Mistakes**:
- ❌ Using `http://` instead of `https://`
- ❌ Adding trailing slash: `/auth/v1/callback/`
- ❌ Wrong project reference in URL
- ❌ Forgetting `/auth/v1/callback` part

---

## Error: "Unsupported provider: provider is not enabled"

This error occurs because Google OAuth provider is not enabled in your Supabase project.

## Solution: Enable Google OAuth Provider

### Step 1: Enable Google Provider in Supabase

1. Go to Supabase Dashboard:
   ```
   https://supabase.com/dashboard/project/eisbyyememqqtuvmsagi
   ```

2. Navigate to **Authentication** → **Providers**

3. Find **Google** provider and click **Enable**

4. Configure Google OAuth:
   - **Client ID (for OAuth)**: You need to get this from Google Cloud Console
   - **Client Secret (for OAuth)**: You need to get this from Google Cloud Console

5. Set **Redirect URLs**:
   ```
   http://localhost:3000
   http://localhost:3000/**
   ```

### Step 2: Get Google OAuth Credentials

#### Option A: Quick Setup (Recommended for Development)

1. Go to Google Cloud Console: https://console.cloud.google.com/

2. Create a new project (or select existing):
   - Project name: "Thoughtweaver"
   - Click **Create**

3. Enable Google+ API:
   - Go to **APIs & Services** → **Library**
   - Search for "Google+ API"
   - Click **Enable**

4. Create OAuth Credentials:
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth client ID**
   - Application type: **Web application**
   - Name: "Thoughtweaver Web"
   - **Authorized redirect URIs** (⚠️ CRITICAL - Must match exactly):
     ```
     https://eisbyyememqqtuvmsagi.supabase.co/auth/v1/callback
     ```
     **Replace `eisbyyememqqtuvmsagi` with YOUR Supabase project reference**
   - Click **Create**
   - Copy **Client ID** and **Client Secret**

5. Add credentials to Supabase:
   - Go back to Supabase Dashboard → Authentication → Providers → Google
   - Paste **Client ID** and **Client Secret**
   - Click **Save**

**⚠️ IMPORTANT**: The redirect URI format is:
```
https://[YOUR-SUPABASE-PROJECT-REF].supabase.co/auth/v1/callback
```

To find your project reference:
- Go to Supabase Dashboard → Settings → API
- Look at your Project URL: `https://[THIS-PART].supabase.co`
- Use that part in the redirect URI

#### Option B: Use Supabase's Default Google OAuth (Easier)

Supabase provides a default Google OAuth setup for development. However, for production, you'll need your own credentials.

For now, you can:
1. Enable Google provider in Supabase
2. Supabase will use its default credentials (limited requests)
3. Later, replace with your own credentials

### Step 3: Configure Redirect URLs

In Supabase Dashboard → Authentication → URL Configuration:

**Site URL:**
```
http://localhost:3000
```

**Redirect URLs:**
```
http://localhost:3000
http://localhost:3000/**
```

### Step 4: Test Authentication

1. Start your dev server:
   ```bash
   cd apps/web
   pnpm dev
   ```

2. Go to: http://localhost:3000
3. Click "Continue with Google"
4. You should be redirected to Google sign-in page

---

## Alternative: Email/Password Authentication (For Testing)

If you want to test without OAuth setup, you can use email/password:

### Update AuthContext to Support Email/Password

```typescript
const loginWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
};

const signUpWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
};
```

### Enable Email Provider

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable **Email** provider
3. Configure email settings (use Supabase's default or your SMTP)

---

## Troubleshooting

### Error: "redirect_uri_mismatch"

**Solution**: Make sure redirect URL in Supabase matches exactly:
- Supabase: `http://localhost:3000`
- Google Cloud Console: `https://eisbyyememqqtuvmsagi.supabase.co/auth/v1/callback`

## Troubleshooting

### Error: redirect_uri_mismatch (MOST COMMON)

**Error**: `Error 400: redirect_uri_mismatch`

**Symptoms**: 
- Google shows "Access blocked: Thoughtweaver's request is invalid"
- Error details show "Error 400: redirect_uri_mismatch"

**Solution**:

1. **Find Your Supabase Project Reference**:
   - Go to Supabase Dashboard → Settings → API
   - Your Project URL is: `https://[PROJECT-REF].supabase.co`
   - Copy the `[PROJECT-REF]` part (e.g., `eisbyyememqqtuvmsagi`)

2. **Update Google Cloud Console**:
   - Go to: https://console.cloud.google.com/
   - Select your project
   - Go to **APIs & Services** → **Credentials**
   - Click on your OAuth 2.0 Client ID
   - Under **Authorized redirect URIs**, add/edit:
     ```
     https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback
     ```
   - **Example**: `https://eisbyyememqqtuvmsagi.supabase.co/auth/v1/callback`
   - Click **Save**

3. **Verify Exact Match**:
   - Must be EXACTLY: `https://[PROJECT-REF].supabase.co/auth/v1/callback`
   - No trailing slash
   - Use HTTPS (not HTTP)
   - Match the exact project reference from Supabase

4. **Wait and Retry**:
   - Google changes can take 1-2 minutes
   - Clear browser cache if needed
   - Try signing in again

**Common Mistakes**:
- ❌ `http://` instead of `https://`
- ❌ Trailing slash: `/auth/v1/callback/`
- ❌ Wrong project reference
- ❌ Missing `/auth/v1/callback` part
- ❌ Typo in domain name

---

### Error: "Unsupported provider: provider is not enabled"

---

## Next Steps After OAuth Setup

1. ✅ Enable Google OAuth provider
2. ✅ Configure redirect URLs
3. ✅ Test authentication flow
4. ✅ Run database migrations (if not done yet)
5. ✅ Verify profile creation works

---

**Last Updated**: Current session  
**Status**: OAuth setup guide created

