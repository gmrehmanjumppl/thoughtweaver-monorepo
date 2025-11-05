# 🚨 API Server Not Running - Quick Fix

## Problem

The frontend is trying to connect to `http://localhost:4000/api` but getting `ERR_CONNECTION_REFUSED` because the API server isn't running.

## Solution

Start the API server in a separate terminal:

### Option 1: Start API Server Only

```bash
cd apps/api
pnpm dev
```

You should see:
```
🚀 API Server running on: http://localhost:4000
📚 API Documentation: http://localhost:4000/api
❤️  Health Check: http://localhost:4000/api/health
```

### Option 2: Start All Services (Frontend + API)

From the root directory:

```bash
pnpm dev
```

This will start both the frontend and API servers.

## Verify API is Running

1. Open: http://localhost:4000/api/health
2. Should return: `{ "status": "ok" }`

## After Starting API Server

1. ✅ Refresh your frontend (`http://localhost:3000` or `http://localhost:5173`)
2. ✅ Try sending a message again
3. ✅ It should work now!

## Troubleshooting

**If API fails to start:**

1. Check if port 4000 is already in use:
   ```bash
   # Windows PowerShell
   netstat -ano | findstr :4000
   ```

2. Make sure dependencies are installed:
   ```bash
   cd apps/api
   pnpm install
   ```

3. Check `.env` file exists in `apps/api/.env`:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   OPENAI_API_KEY=sk-proj-...
   PORT=4000
   FRONTEND_URL=http://localhost:3000
   ```

