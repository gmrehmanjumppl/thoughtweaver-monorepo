# 🔐 SUPABASE SETUP GUIDE - Quick Start

## You Need to Set Up Supabase First!

The app is currently using placeholder credentials (`placeholder.supabase.co`) which don't work.

## Step 1: Create Supabase Project (if you don't have one)

1. **Go to**: https://supabase.com/dashboard
2. **Click**: "New Project" (or "Sign Up" if you don't have an account)
3. **Fill in**:
   - Project name: `thoughtweaver` (or any name)
   - Database password: (create a strong password, save it!)
   - Region: Choose closest to you
   - Pricing plan: Free tier is fine
4. **Click**: "Create new project"
5. **Wait**: 2-3 minutes for project initialization

## Step 2: Get Your Credentials

Once project is ready:

1. In Supabase Dashboard, go to **Settings** → **API**
2. You'll see:
   - **Project URL** (looks like: `https://abcdefghijklmnop.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

## Step 3: Update .env.local File

Open `apps/webnextjs/.env.local` and replace:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ACTUAL-ANON-KEY-HERE
```

**Replace:**
- `YOUR-PROJECT-ID` → Your actual project ID from Supabase
- `YOUR-ACTUAL-ANON-KEY-HERE` → Your actual anon key from Supabase

**Example:**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Step 4: Restart Dev Server

```bash
# Stop server (Ctrl+C)
cd apps/webnextjs
pnpm dev
```

You should see:
```
✅ Supabase client initialized successfully
```

## Step 5: Configure OAuth (for Google/Apple Login)

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Enable **Google**:
   - Click "Google"
   - Toggle "Enable Google provider"
   - Add redirect URL: `http://localhost:3000`
   - Save
3. Enable **Apple** (optional):
   - Same process as Google

## Step 6: Run Database Migrations

The app needs database tables. Run the migration:

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy contents of `infra/supabase/migrations/001_initial_schema.sql`
4. Paste and click **Run**
5. Wait for success message

## Troubleshooting

**Still seeing placeholder URL?**
- ✅ Make sure `.env.local` is in `apps/webnextjs/` directory
- ✅ Make sure variable names are exactly: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ Make sure values don't have quotes around them
- ✅ Restart the dev server completely

**Don't have Supabase account?**
- Sign up at https://supabase.com (free tier available)
- Takes 5 minutes to set up

**Need help?**
- Supabase docs: https://supabase.com/docs
- Check `ultartech/DATABASE_SETUP.md` for detailed instructions
