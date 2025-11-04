# Fix: White Screen After Google OAuth Login

## Problem

After successful Google OAuth login, the app redirects to `http://localhost:3000/#` but shows a white screen.

## Root Cause

1. User successfully authenticates with Google OAuth
2. Supabase redirects back to `http://localhost:3000` (with hash fragment `#`)
3. Auth state changes to authenticated
4. But `NavigationContext` still has `currentPage: 'signup'`
5. App logic doesn't properly navigate to 'home' page
6. No page matches, resulting in white screen

## Solution Applied

### 1. Updated `App.tsx` to handle auth state changes

- Added `useEffect` to navigate to 'home' when user becomes authenticated
- Added fallback to show loading spinner while redirecting
- Improved logic to handle all authentication states

### 2. Enhanced `AuthContext.tsx`

- Added better logging for auth state changes
- Improved handling of `SIGNED_IN` event
- Better error handling

## What to Check

1. **Check Browser Console**:
   - Open DevTools (F12)
   - Look for errors
   - Check for "Auth state changed" logs

2. **Check if Navigation Happens**:
   - After login, `currentPage` should change from 'signup' to 'home'
   - Check React DevTools to see state changes

3. **Check Database**:
   - Verify `profiles` table exists
   - Check if profile was created for the user
   - If database error, might cause white screen

## Common Issues

### Issue 1: Database Error

**Error**: `relation "profiles" does not exist`

**Solution**: Run database migrations:
```sql
-- In Supabase SQL Editor, run:
-- infra/supabase/migrations/001_initial_schema.sql
```

### Issue 2: Navigation Not Happening

**Symptoms**: White screen, `currentPage` stuck on 'signup'

**Solution**: Check `useEffect` dependencies in `App.tsx`

### Issue 3: Hash Fragment Issue

**Symptoms**: URL shows `http://localhost:3000/#`

**Solution**: This is normal for Supabase OAuth redirect. The hash is handled by Supabase auth.

## Testing

1. **Clear Browser Cache**:
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

2. **Check Auth State**:
   - Open browser console
   - Type: `localStorage.getItem('sb-eisbyyememqqtuvmsagi-auth-token')`
   - Should return token if authenticated

3. **Manual Navigation Test**:
   - After login, manually navigate: `window.location.href = '/'`
   - Or refresh the page

## Expected Behavior After Fix

1. User clicks "Continue with Google"
2. Redirects to Google sign-in
3. User authenticates
4. Redirects back to `http://localhost:3000/#`
5. `onAuthStateChange` fires with `SIGNED_IN` event
6. User profile loads
7. `useEffect` in `App.tsx` detects authentication
8. Navigates to 'home' page
9. HomePage component renders

## If Still Not Working

1. **Check Console Errors**:
   - Look for React errors
   - Look for Supabase errors
   - Look for import errors

2. **Check Network Tab**:
   - Verify Supabase API calls succeed
   - Check if profile creation succeeded

3. **Verify Environment Variables**:
   - Check `VITE_SUPABASE_URL` is set
   - Check `VITE_SUPABASE_ANON_KEY` is set

4. **Check Components Load**:
   - Verify `HomePage` component exists
   - Check if lazy loading works

---

**Last Updated**: Current session  
**Status**: Fix applied to App.tsx and AuthContext.tsx

