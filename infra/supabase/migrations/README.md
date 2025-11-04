# Database Setup Guide

## Step 1: Run Initial Schema Migration

1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/eisbyyememqqtuvmsagi
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `001_initial_schema.sql`
5. Click **Run** (or press Ctrl+Enter)
6. Verify tables were created successfully

## Step 2: Run Seed Data Migration

1. In SQL Editor, create a new query
2. Copy and paste the contents of `002_seed_data.sql`
3. Click **Run**
4. Verify default assistants and workflows were inserted

## Step 3: Verify Database Setup

```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check RLS policies
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Check default assistants
SELECT id, name, is_default FROM assistants WHERE is_default = true;

-- Check default workflows
SELECT id, name, is_default FROM workflows WHERE is_default = true;
```

## Step 4: Update Database Password in .env

1. Go to Supabase Dashboard → Settings → Database
2. Find **Connection string** section
3. Copy the password from the connection string
4. Update `DATABASE_URL` in:
   - Root `.env`
   - `apps/api/.env`

Replace `[YOUR-PASSWORD]` with your actual database password.

## Troubleshooting

### If migration fails:
- Check for syntax errors in SQL
- Ensure UUID extension is enabled
- Verify you're connected to the correct database

### If RLS policies don't work:
- Check that policies are enabled: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
- Verify auth.uid() function is available

---

**Next Steps**: After database setup, continue with Developer Guide - Step 5: Verify Setup

