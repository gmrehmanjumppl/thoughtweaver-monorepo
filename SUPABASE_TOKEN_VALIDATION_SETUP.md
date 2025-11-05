# 🔧 Supabase Configuration for Token Validation

## Problem: "Invalid token: fetch failed"

The backend is trying to validate JWT tokens using Supabase Admin API, but it's failing with "fetch failed". This guide will help you configure Supabase correctly.

## ✅ Required Supabase Settings

### 1. Get Your Supabase Credentials

1. **Go to Supabase Dashboard**:
   - Visit: https://supabase.com/dashboard
   - Select your project: `eisbyyememqqtuvmsagi`

2. **Get API Keys**:
   - Go to: **Settings** → **API**
   - Copy these values:
     - **Project URL**: `https://eisbyyememqqtuvmsagi.supabase.co`
     - **service_role key** (⚠️ Secret! Don't share)
     - **anon key** (for reference)

### 2. Configure Backend Environment Variables

**File**: `apps/api/.env`

```env
# Supabase Configuration (REQUIRED)
SUPABASE_URL=https://eisbyyememqqtuvmsagi.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Optional (for JWT verification)
SUPABASE_JWT_SECRET=your-jwt-secret-from-supabase

# Server Configuration
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Where to get these**:
- `SUPABASE_URL`: Settings → API → Project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Settings → API → `service_role` key (⚠️ Secret!)
- `SUPABASE_JWT_SECRET`: Settings → API → JWT Secret (optional, for direct JWT verification)

### 3. Verify Supabase Client Configuration

The backend uses the **service role key** to access Admin API. Make sure:

1. ✅ **Service Role Key is set** in `apps/api/.env`
2. ✅ **Supabase URL is correct** (no trailing slash)
3. ✅ **API server is restarted** after updating `.env`

### 4. Test Configuration

After updating `.env`, restart your API server:

```bash
# Stop server (Ctrl+C)
cd apps/api
pnpm dev
```

**Check backend console** for:
- ✅ `Supabase client initialized` (no errors)
- ✅ `🔐 Validating token: eyJ...` (when making API calls)
- ✅ `✅ Token validated successfully for user: email@example.com`

## 🔍 Troubleshooting

### Issue: "fetch failed" error

**Possible causes**:
1. **Service Role Key missing or incorrect**
   - Solution: Check `apps/api/.env` has correct `SUPABASE_SERVICE_ROLE_KEY`
   - Get it from: Supabase Dashboard → Settings → API → service_role key

2. **Supabase URL incorrect**
   - Solution: Check `SUPABASE_URL` in `.env` matches your project URL exactly
   - Should be: `https://eisbyyememqqtuvmsagi.supabase.co` (no trailing slash)

3. **Network/firewall blocking**
   - Solution: Check if your network allows outbound HTTPS to Supabase
   - Test: `curl https://eisbyyememqqtuvmsagi.supabase.co/rest/v1/`

### Issue: "User not found"

**Possible causes**:
1. **User doesn't exist in Supabase**
   - Solution: Make sure user logged in successfully via OAuth
   - Check: Supabase Dashboard → Authentication → Users

2. **Token expired**
   - Solution: Refresh page and login again
   - Supabase tokens expire after 1 hour (default)

### Issue: Google Avatar Not Showing

**Check these**:
1. **User metadata structure**:
   - Open browser console
   - Look for: `🔍 User metadata:` log
   - Check if `picture` or `avatar_url` exists in `user_metadata`

2. **Avatar URL format**:
   - Look for: `🖼️ Avatar URL:` log
   - Should be a valid HTTPS URL

3. **Supabase OAuth settings**:
   - Go to: Supabase Dashboard → Authentication → Providers → Google
   - Make sure Google OAuth is configured correctly
   - Check if avatar is being saved in user metadata

## 🛠️ Manual Supabase Configuration Steps

If automatic token validation fails, you can also:

### Option 1: Use JWT Secret (Recommended)

Add `SUPABASE_JWT_SECRET` to `apps/api/.env`:

```env
SUPABASE_JWT_SECRET=your-jwt-secret-from-supabase-dashboard
```

This allows direct JWT signature verification without Admin API calls.

### Option 2: Check Supabase Project Settings

1. **Go to**: Supabase Dashboard → Settings → API
2. **Verify**:
   - ✅ Project URL is correct
   - ✅ Service Role Key exists and is enabled
   - ✅ API is enabled for your project

### Option 3: Check Authentication Settings

1. **Go to**: Supabase Dashboard → Authentication → Providers
2. **Verify**:
   - ✅ Google OAuth is enabled
   - ✅ Redirect URLs are configured:
     - `http://localhost:3000`
     - `http://localhost:5173`
   - ✅ User metadata is being saved

## 📝 Quick Checklist

- [ ] ✅ `SUPABASE_URL` set in `apps/api/.env`
- [ ] ✅ `SUPABASE_SERVICE_ROLE_KEY` set in `apps/api/.env`
- [ ] ✅ API server restarted after updating `.env`
- [ ] ✅ Supabase project is active and accessible
- [ ] ✅ Google OAuth configured in Supabase Dashboard
- [ ] ✅ User can login successfully via Google
- [ ] ✅ Backend console shows token validation logs

## 🆘 Still Having Issues?

1. **Check backend console** for detailed error messages
2. **Check browser console** for avatar metadata logs
3. **Verify Supabase Dashboard** → Authentication → Users shows your user
4. **Test Supabase connection**:
   ```bash
   curl https://eisbyyememqqtuvmsagi.supabase.co/rest/v1/
   ```

If you're still stuck, share:
- Backend console error messages
- Browser console logs (especially `🔍 User metadata:`)
- Your `.env` file structure (without actual keys!)

