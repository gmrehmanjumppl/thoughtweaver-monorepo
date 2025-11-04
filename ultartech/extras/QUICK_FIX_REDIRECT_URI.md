# Quick Fix: redirect_uri_mismatch Error

**Error**: `Error 400: redirect_uri_mismatch`

**What This Means**: The redirect URI in Google Cloud Console doesn't match what Supabase is sending.

---

## 🔧 Quick Fix (5 Minutes)

### Step 1: Get Your Supabase Project Reference

1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/eisbyyememqqtuvmsagi
2. Click **Settings** → **API**
3. Look at **Project URL**: `https://eisbyyememqqtuvmsagi.supabase.co`
4. Copy the project reference: `eisbyyememqqtuvmsagi`

### Step 2: Update Google Cloud Console

1. Go to Google Cloud Console: https://console.cloud.google.com/
2. Select your project (or create new)
3. Go to **APIs & Services** → **Credentials**
4. Click on your **OAuth 2.0 Client ID** (if you have one) or create new:
   - Click **Create Credentials** → **OAuth client ID**
   - Application type: **Web application**
   - Name: "Thoughtweaver"

5. Under **Authorized redirect URIs**, add:
   ```
   https://eisbyyememqqtuvmsagi.supabase.co/auth/v1/callback
   ```
   **⚠️ Replace `eisbyyememqqtuvmsagi` with YOUR project reference from Step 1**

6. Click **Save**

### Step 3: Verify

- ✅ Must be EXACTLY: `https://[PROJECT-REF].supabase.co/auth/v1/callback`
- ✅ No trailing slash
- ✅ Use HTTPS (not HTTP)
- ✅ No typos

### Step 4: Wait and Test

- Wait 1-2 minutes for Google to update
- Try signing in again
- Should work now!

---

## 📋 Checklist

- [ ] Got project reference from Supabase Dashboard
- [ ] Added redirect URI to Google Cloud Console
- [ ] URI format is exactly: `https://[PROJECT-REF].supabase.co/auth/v1/callback`
- [ ] Using HTTPS (not HTTP)
- [ ] No trailing slash
- [ ] Saved changes
- [ ] Waited 1-2 minutes
- [ ] Tested sign-in again

---

## ⚠️ Common Mistakes

- ❌ Using `http://` instead of `https://`
- ❌ Adding trailing slash: `/auth/v1/callback/`
- ❌ Wrong project reference (typo)
- ❌ Missing `/auth/v1/callback` part
- ❌ Using `localhost` instead of Supabase URL

---

## 🔗 Full Guide

For complete OAuth setup guide, see: [SUPABASE_OAUTH_SETUP.md](./SUPABASE_OAUTH_SETUP.md)

