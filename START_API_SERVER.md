# 🚨 API Server Not Running - Quick Fix

## Problem

You're seeing `Failed to fetch` error because the API server is not running.

## ✅ Solution

### Step 1: Start the API Server

Open a **new terminal** and run:

```bash
cd apps/api
pnpm dev
```

You should see:
```
🚀 API Server running on: http://localhost:4000
✅ Supabase client initialized successfully
```

### Step 2: Verify API is Running

Test the health endpoint:
```bash
curl http://localhost:4000/api/health
```

Should return: `{"status":"ok"}`

### Step 3: Refresh Frontend

Refresh your Next.js app (`http://localhost:3000`). The API calls should now work!

## 🔍 Troubleshooting

### Issue: Port 4000 already in use

**Solution**: Change the port in `apps/api/.env`:
```env
PORT=4001
```

Then update `apps/webnextjs/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4001/api
```

### Issue: Still getting "Failed to fetch"

**Check**:
1. ✅ API server is running (`pnpm dev` in `apps/api`)
2. ✅ API server shows `🚀 API Server running on: http://localhost:4000`
3. ✅ No errors in API server console
4. ✅ Health endpoint works: `curl http://localhost:4000/api/health`

### Issue: CORS errors

The backend now allows multiple origins. If you still see CORS errors:
1. Check `apps/api/.env` has `FRONTEND_URL=http://localhost:3000`
2. Restart API server after updating `.env`

## 📋 Quick Checklist

- [ ] ✅ API server is running (`cd apps/api && pnpm dev`)
- [ ] ✅ Health endpoint works (`curl http://localhost:4000/api/health`)
- [ ] ✅ No errors in API server console
- [ ] ✅ `NEXT_PUBLIC_API_URL=http://localhost:4000/api` in `apps/webnextjs/.env.local`
- [ ] ✅ Frontend refreshed after starting API server

## 🆘 Still Having Issues?

1. **Check API server console** for errors
2. **Check browser console** for detailed error messages
3. **Verify Supabase config** - see `FIX_SUPABASE_CONFIG.md`

The API server must be running before the frontend can make requests!
