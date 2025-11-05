# Database Setup Guide

## How to Run Database Migrations

### Option 1: Using Supabase SQL Editor (Recommended)

**✅ This is the recommended approach** - Supabase manages migrations through their SQL Editor.

#### Steps:

1. **Go to Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run Initial Schema Migration**
   - Open the file: `infra/supabase/migrations/001_initial_schema.sql`
   - Copy the entire contents
   - Paste into the SQL Editor
   - Click "Run" (or press Ctrl+Enter / Cmd+Enter)
   - Wait for "Success. No rows returned" message

4. **Run Seed Data Migration**
   - Open the file: `infra/supabase/migrations/002_seed_data.sql`
   - Copy the entire contents
   - Paste into the SQL Editor
   - Click "Run"
   - Verify seed data was created

5. **Verify Tables Created**
   - Go to "Table Editor" in Supabase Dashboard
   - You should see these tables:
     - `profiles`
     - `conversations`
     - `messages`
     - `assistants`
     - `workflows`
     - `projects`
     - `teams`
     - `team_members`
     - `contexts`

### Option 2: Using Supabase CLI (Advanced)

If you prefer command-line migrations:

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### Option 3: Direct PostgreSQL Connection (Not Recommended)

Only use if you have direct database access:

```bash
# Connect to Supabase PostgreSQL
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Run migration file
\i infra/supabase/migrations/001_initial_schema.sql
\i infra/supabase/migrations/002_seed_data.sql
```

---

## Migration Files Explained

### `001_initial_schema.sql`
Creates all database tables, indexes, triggers, and Row Level Security (RLS) policies.

**What it does:**
- Creates `profiles` table (extends Supabase Auth users)
- Creates `conversations`, `messages`, `assistants`, `workflows`, `projects`, `teams`, `team_members`, `contexts` tables
- Sets up RLS policies for security
- Creates indexes for performance
- Creates triggers for `updated_at` timestamps

### `002_seed_data.sql`
Populates default data (assistants, workflows).

**What it does:**
- Inserts default AI assistants (All-rounder, Analyst, etc.)
- Inserts default workflows
- Sets up default configurations

---

## Verification Checklist

After running migrations, verify:

- [ ] All tables appear in Supabase Table Editor
- [ ] RLS policies are enabled (check table settings)
- [ ] Default assistants appear in `assistants` table
- [ ] Default workflows appear in `workflows` table
- [ ] Indexes are created (check table indexes)

---

## Troubleshooting

### Error: "relation already exists"
**Solution**: The table already exists. You can either:
- Drop the table manually: `DROP TABLE table_name CASCADE;`
- Or skip creating that table if it's already set up correctly

### Error: "permission denied"
**Solution**: Make sure you're using the SQL Editor in Supabase Dashboard (not a direct connection). The dashboard has proper permissions.

### Error: "foreign key constraint fails"
**Solution**: Make sure you run migrations in order:
1. First `001_initial_schema.sql` (creates all tables)
2. Then `002_seed_data.sql` (inserts data)

---

## Next Steps After Migration

1. ✅ Database schema is ready
2. ⏭️ Configure environment variables in `apps/api/.env`
3. ⏭️ Start NestJS API server: `cd apps/api && pnpm dev`
4. ⏭️ Test API endpoints

---

## Important Notes

- **RLS (Row Level Security)** is enabled on all tables
- **Service Role Key** bypasses RLS (use only in backend API)
- **Anon Key** respects RLS (use in frontend)
- Always use **Service Role Key** in NestJS API for backend operations
- Users can only access their own data (enforced by RLS policies)

---

**Document Maintained By**: Development Team  
**Last Updated**: November 2025

