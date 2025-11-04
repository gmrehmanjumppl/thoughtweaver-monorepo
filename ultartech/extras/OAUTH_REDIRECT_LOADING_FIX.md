# Fix: Loading After Google OAuth Redirect (Normal Browser)

## Problem

After logging in with Google OAuth:
- **Incognito mode**: ✅ Works fine
- **Normal browser**: ❌ Stuck in loading after redirect

## Root Cause

The issue occurs because:

1. **Cached Session**: Normal browser has cached Supabase session
2. **Auth Event**: When OAuth redirects back, Supabase might fire `TOKEN_REFRESHED` instead of `SIGNED_IN`
3. **Navigation State**: `NavigationContext` starts with `currentPage: 'signup'` and might not update
4. **Timing Issue**: Auth state changes before navigation logic runs

## Solution Implemented

### Fix 1: Handle All Auth Events

**File**: `apps/web/src/contexts/AuthContext.tsx`

**Changed**: Handle `TOKEN_REFRESHED` and `USER_UPDATED` events

```typescript
// Handle all auth events that indicate user is signed in
if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') && session?.user) {
  clearTimeout(timeoutId);
  await loadUserProfile(session.user);
}
```

**Why**: OAuth redirect might trigger `TOKEN_REFRESHED` instead of `SIGNED_IN`

### Fix 2: Improve Navigation Logic

**File**: `apps/web/src/App.tsx`

**Changed**: Better handling of navigation after auth

```typescript
// Navigate to home when user becomes authenticated
useEffect(() => {
  if (isAuthenticated && user) {
    // Force navigation to home if on signup page or no page set
    if (currentPage === 'signup' || currentPage === null || !currentPage) {
      console.log('Navigating to home after authentication');
      navigate('home');
    }
  } else if (!isAuthenticated && !isLoading && currentPage !== 'signup') {
    navigate('signup');
  }
}, [isAuthenticated, user, isLoading, currentPage, navigate]);
```

**Why**: 
- Checks for `user` object (more reliable than just `isAuthenticated`)
- Handles `null` currentPage
- Only navigates when not loading

### Fix 3: Initialize Navigation State Properly

**File**: `apps/web/src/contexts/NavigationContext.tsx`

**Changed**: Start with `null` instead of `'signup'`

```typescript
const [currentPage, setCurrentPage] = useState<Page | null>(null);
```

**Why**: 
- Allows app to determine initial page based on auth state
- Prevents stuck on signup page when authenticated

### Fix 4: Better Signup Page Handling

**File**: `apps/web/src/App.tsx`

**Changed**: Ensure navigation happens when authenticated

```typescript
// If authenticated but no page selected or on signup page, navigate to home
if (isAuthenticated && (currentPage === null || currentPage === 'signup' || !currentPage)) {
  if (currentPage !== 'home') {
    navigate('home');
  }
  // Show loading while navigating
  return <RedirectingSpinner />;
}
```

**Why**: Forces navigation even if useEffect didn't trigger

---

## Testing

### Test in Normal Browser

1. **Clear localStorage** (if needed):
   ```javascript
   // In browser console:
   localStorage.clear();
   ```

2. **Login with Google**:
   - Click "Continue with Google"
   - Authenticate
   - Should redirect back to app

3. **Expected Behavior**:
   - Shows loading briefly (< 2 seconds)
   - Navigates to home page
   - Shows app content

### Test in Incognito

1. Open incognito window
2. Login with Google
3. Should work (already working)

---

## Debugging

### If Still Stuck

1. **Check Browser Console**:
   - Look for "Auth state changed" logs
   - Check for errors
   - Verify user object is set

2. **Check Auth State**:
   ```javascript
   // In browser console:
   // Check localStorage
   Object.keys(localStorage).filter(k => k.includes('supabase'))
   
   // Check if user is set
   // Look at React DevTools → AuthContext → user
   ```

3. **Check Navigation State**:
   ```javascript
   // In browser console:
   // Look at React DevTools → NavigationContext → currentPage
   ```

4. **Force Navigation**:
   ```javascript
   // In browser console (if stuck):
   window.location.href = '/';
   ```

---

## Common Issues

### Issue 1: `TOKEN_REFRESHED` Event Not Handled

**Symptom**: Loading after redirect

**Fix**: Already handled in Fix 1

### Issue 2: Navigation Not Triggering

**Symptom**: Stuck on signup page

**Fix**: Already handled in Fix 2 and Fix 4

### Issue 3: Cached Session Confusion

**Symptom**: Works in incognito, not normal browser

**Fix**: Clear localStorage or use logout button

---

## Expected Behavior After Fix

1. User clicks "Continue with Google"
2. Redirects to Google OAuth
3. User authenticates
4. Redirects back to `http://localhost:3000/#`
5. Hash fragment cleared
6. `onAuthStateChange` fires (event: `SIGNED_IN` or `TOKEN_REFRESHED`)
7. `loadUserProfile()` runs
8. User state set
9. `useEffect` in App.tsx detects authentication
10. Navigates to 'home'
11. HomePage renders

**Total Time**: < 2 seconds from redirect to home page

---

## Files Modified

1. `apps/web/src/contexts/AuthContext.tsx` - Handle all auth events
2. `apps/web/src/App.tsx` - Improve navigation logic
3. `apps/web/src/contexts/NavigationContext.tsx` - Initialize with null

---

**Last Updated**: Current Session  
**Status**: Fix implemented - Should resolve loading issue

