/**
 * Thoughtweaver Next.js App - README
 * 
 * Next.js 14+ App Router version of Thoughtweaver frontend
 * Migrated from React/Vite (apps/web) with same architecture
 */

## Overview

This is the **Next.js** version of the Thoughtweaver frontend, built with:
- **Next.js 16** with App Router
- **React 18+** with TypeScript
- **Tailwind CSS v4** for styling
- **shadcn/ui** components
- **Supabase** for authentication
- **NestJS API** integration (`apps/api`)

## Structure

```
apps/webnextjs/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx          # Home page (client component)
│   └── globals.css       # Global styles
├── components/            # React components (same as apps/web)
├── contexts/              # React Context providers
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities
│   ├── api/              # API client services
│   ├── api-client.ts     # HTTP client
│   └── supabase.ts       # Supabase client
├── constants/             # App constants
└── assets/                # Static assets
```

## Key Differences from apps/web

1. **Routing**: Uses Next.js App Router (file-based routing) instead of custom string-based routing
2. **Environment Variables**: Uses `NEXT_PUBLIC_*` instead of `VITE_*`
3. **Build Tool**: Next.js instead of Vite
4. **Server Components**: Can use React Server Components (future enhancement)
5. **API Routes**: Can use Next.js API routes (future enhancement)

## Running the App

```bash
# Install dependencies (from monorepo root)
pnpm install

# Start development server
cd apps/webnextjs
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Environment Variables

**⚠️ IMPORTANT**: Create a `.env.local` file before running the app!

```bash
# Copy the example file
cp .env.example .env.local

# Then edit .env.local with your actual values
```

Required environment variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Get Supabase credentials:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Settings → API
4. Copy the Project URL and anon/public key

## Features

✅ All features from `apps/web`:
- Authentication (Supabase OAuth)
- Conversations management
- Messages with AI generation
- Assistants management
- Workflows
- Projects
- Teams
- User profile
- Billing

## Migration Notes

- Components are **100% compatible** - same code from `apps/web`
- Contexts work the same way
- API integration unchanged
- Only routing logic changed (uses Next.js App Router)

## Next Steps

1. ✅ Basic migration complete
2. ⚠️ Convert to proper Next.js routes (replace custom routing)
3. ⚠️ Add React Server Components where beneficial
4. ⚠️ Add Next.js API routes if needed
5. ⚠️ Optimize images with Next.js Image component

## Related Apps

- `apps/web` - React/Vite version (original)
- `apps/api` - NestJS backend API
