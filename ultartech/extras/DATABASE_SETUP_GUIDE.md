# Database Setup Guide - Following Developer Guide

**Reference**: `ultartech/DEVELOPER_GUIDE.md` Step 4  
**Status**: Schema Ready, Need to Run Migrations

---

## Current Status

### ✅ What's Complete

- ✅ Database schema designed (`001_initial_schema.sql`)
- ✅ Seed data prepared (`002_seed_data.sql`)
- ✅ Migration files created in correct location
- ✅ Schema includes all tables, RLS policies, indexes

### ⚠️ What Needs Action

- ⚠️ Migrations NOT RUN in Supabase
- ⚠️ Tables don't exist yet
- ⚠️ Can't test database queries

---

## Step-by-Step: Run Database Migrations

### Step 1: Open Supabase SQL Editor

1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/eisbyyememqqtuvmsagi
2. Click **SQL Editor** in left sidebar
3. Click **New Query** button

### Step 2: Run Initial Schema Migration

1. Open file: `infra/supabase/migrations/001_initial_schema.sql`
2. Copy **entire contents** of the file
3. Paste into Supabase SQL Editor
4. Click **Run** button (or press Ctrl+Enter / Cmd+Enter)
5. Wait for success message

**Expected Output**:
```
Success. No rows returned
```

**If Error**: Check error message (common: table already exists - that's okay)

### Step 3: Run Seed Data Migration

1. Open file: `infra/supabase/migrations/002_seed_data.sql`
2. Copy **entire contents** of the file
3. Paste into Supabase SQL Editor (new query)
4. Click **Run**
5. Wait for success message

**Expected Output**:
```
Success. No rows returned
```

### Step 4: Verify Tables Created

1. Go to Supabase Dashboard → **Table Editor**
2. Should see tables:
   - ✅ profiles
   - ✅ conversations
   - ✅ messages
   - ✅ assistants
   - ✅ workflows
   - ✅ contexts
   - ✅ projects
   - ✅ teams
   - ✅ team_members

### Step 5: Verify Seed Data

1. Go to **Table Editor** → **assistants**
2. Should see 3 default assistants:
   - All-rounder
   - The Analyst
   - The Creative

3. Go to **Table Editor** → **workflows**
4. Should see 2 default workflows:
   - Build-as-we-go
   - Strategic ideation

---

## Troubleshooting

### Error: "relation already exists"

**Cause**: Tables already created (maybe from previous attempt)

**Solution**: 
- This is okay - tables exist
- Skip migration or drop tables first if needed
- Continue to next step

### Error: "permission denied"

**Cause**: RLS policies might be blocking

**Solution**:
- Check RLS is enabled
- Verify policies are created
- Check Supabase project settings

### Error: "column does not exist"

**Cause**: Migration didn't run completely

**Solution**:
- Check which migration failed
- Run again from that point
- Or drop all tables and start fresh

---

## After Migrations Run

### Next Steps

1. **Test Database Connection**:
   ```sql
   SELECT * FROM profiles LIMIT 1;
   ```

2. **Verify RLS Policies**:
   - Go to **Authentication** → **Policies**
   - Should see policies for all tables

3. **Update Frontend**:
   - Update contexts to use Supabase queries
   - Replace mock data with real queries

---

## Migration Files

### File 1: `001_initial_schema.sql`

**Contents**:
- 9 tables creation
- RLS policies for all tables
- Indexes for performance
- Triggers for timestamps

**Size**: ~250 lines

### File 2: `002_seed_data.sql`

**Contents**:
- Default assistants (3)
- Default workflows (2)

**Size**: ~50 lines

---

## Verification Checklist

After running migrations:

- [ ] All 9 tables created
- [ ] RLS policies enabled
- [ ] Seed data inserted
- [ ] Can query tables
- [ ] No errors in SQL Editor

---

**Last Updated**: Current Session  
**Status**: Ready to Run  
**Next**: Execute migrations in Supabase SQL Editor

