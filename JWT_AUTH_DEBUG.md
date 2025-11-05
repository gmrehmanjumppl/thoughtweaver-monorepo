# 🔐 JWT Authentication Debugging Guide

## Problem: 401 Unauthorized - Invalid Token

You're getting `401 Unauthorized` errors when calling API endpoints. This means the JWT token is invalid or not being sent correctly.

## Check These Steps

### 1. ✅ Verify Token is Being Sent

**Check Browser Console:**
- Look for: `✅ Token retrieved: eyJhbGciOiJIUzI1NiIs...`
- Look for: `📤 Sending request with Authorization header`

If you see `⚠️ No token available`, the session isn't loaded yet.

### 2. ✅ Check Backend Logs

**In your API server terminal, you should see:**
- `🔐 Validating token: eyJhbGciOiJIUzI1NiIs...`
- `✅ Token validated successfully for user: user@example.com`

**If you see errors:**
- `❌ Supabase token validation error:` - Token format issue
- `❌ No user found for token` - User doesn't exist

### 3. ✅ Verify Supabase Configuration

**Check `apps/api/.env`:**
```env
SUPABASE_URL=https://eisbyyememqqtuvmsagi.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Get Service Role Key:**
1. Go to: https://supabase.com/dashboard/project/eisbyyememqqtuvmsagi/settings/api
2. Copy **service_role** key (NOT anon key - this is secret!)
3. Add to `apps/api/.env`:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 4. ✅ Verify Token Format

The token should be a JWT (starts with `eyJ...`).

**In browser console, check:**
```javascript
// Open browser console and run:
const { supabase } = await import('./lib/supabase');
const { data: { session } } = await supabase.auth.getSession();
console.log('Token:', session?.access_token);
```

Should output something like:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpc2J5eWVtZW1xcXR1dm1zYWdpIi...
```

### 5. ✅ Test Token Manually

**Using cURL:**
```bash
# Get your token from browser console (see step 4)
TOKEN="your-token-here"

# Test with conversations endpoint
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:4000/api/conversations
```

**Expected Response:**
- ✅ `200 OK` with conversations data
- ❌ `401 Unauthorized` - Token is invalid

### 6. ✅ Common Issues

**Issue: Token expired**
- **Solution**: Refresh the page and login again

**Issue: No token in session**
- **Solution**: Make sure you're logged in. Check `AuthContext` state.

**Issue: Service Role Key missing**
- **Solution**: Add `SUPABASE_SERVICE_ROLE_KEY` to `apps/api/.env`

**Issue: Wrong Supabase URL**
- **Solution**: Verify `SUPABASE_URL` matches your project URL

### 7. ✅ Debug Steps

1. **Check frontend console:**
   - Is token being retrieved?
   - Is Authorization header being sent?

2. **Check backend console:**
   - What error message appears?
   - Is Supabase client initialized correctly?

3. **Test health endpoint** (no auth):
   ```bash
   curl http://localhost:4000/api/health
   ```
   Should return: `{ "status": "ok" }`

4. **Test with token:**
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:4000/api/conversations
   ```

## Quick Fix Checklist

- [ ] ✅ API server is running (`pnpm dev` in `apps/api`)
- [ ] ✅ User is logged in (check browser console)
- [ ] ✅ Token is being retrieved (check console logs)
- [ ] ✅ `SUPABASE_SERVICE_ROLE_KEY` is set in `apps/api/.env`
- [ ] ✅ `SUPABASE_URL` is correct in `apps/api/.env`
- [ ] ✅ Restarted API server after updating `.env`

## Still Not Working?

Check the **API server console** for detailed error messages. The improved logging will show:
- Token validation attempts
- Specific Supabase errors
- User lookup results

This will help identify the exact issue!

