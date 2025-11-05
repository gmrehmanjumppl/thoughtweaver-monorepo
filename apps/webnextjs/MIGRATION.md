# Next.js Migration Guide

## Summary

Created `apps/webnextjs` - a Next.js 16 App Router version of the Thoughtweaver frontend, migrated from `apps/web` (React/Vite).

## Key Changes

### 1. Framework Migration
- ✅ **From**: React/Vite (SPA)
- ✅ **To**: Next.js 16 with App Router
- ✅ **Same Components**: All components work without changes

### 2. Routing
- ✅ **From**: Custom string-based routing (`currentPage === 'home'`)
- ✅ **To**: Next.js App Router (file-based routing)
- ✅ **Current**: Uses client-side routing in `app/page.tsx` (same as Vite version)
- ⚠️ **Future**: Can migrate to proper Next.js routes (`app/home/page.tsx`, `app/conversations/[id]/page.tsx`)

### 3. Environment Variables
- ✅ **From**: `VITE_API_URL`, `VITE_SUPABASE_URL`
- ✅ **To**: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SUPABASE_URL`

### 4. Build System
- ✅ **From**: Vite
- ✅ **To**: Next.js (webpack + SWC)

### 5. Client Components
- ✅ Added `'use client'` directive to all components using hooks/state
- ✅ Contexts are client components
- ✅ Layout is a client component (uses contexts)

## File Structure

```
apps/webnextjs/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout (wraps AppProviders)
│   ├── page.tsx          # Home page (handles routing)
│   └── globals.css       # Global styles
├── components/            # Same as apps/web
├── contexts/              # Same as apps/web
├── hooks/                 # Same as apps/web
├── lib/                   # Same as apps/web
│   ├── api/              # API services
│   ├── api-client.ts     # Updated for Next.js env vars
│   └── supabase.ts       # Same as apps/web
├── constants/             # Same as apps/web
└── assets/                # Same as apps/web
```

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

## Environment Setup

Create `apps/webnextjs/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Features

✅ **All features from apps/web work**:
- Authentication (Supabase OAuth)
- Conversations management
- Messages with AI generation
- Assistants management
- Workflows
- Projects
- Teams
- User profile
- Billing

## Next Steps (Future Enhancements)

1. ⚠️ **Convert to proper Next.js routes**: Replace custom routing with file-based routes
   - `app/home/page.tsx`
   - `app/conversations/[id]/page.tsx`
   - `app/workflows/page.tsx`
   - etc.

2. ⚠️ **Add React Server Components**: Use Server Components for static content
   - Landing pages
   - Public pages
   - Static content

3. ⚠️ **Optimize Images**: Use Next.js `Image` component instead of `<img>`

4. ⚠️ **Add API Routes**: Create Next.js API routes if needed
   - `/api/auth/callback`
   - `/api/webhooks`

5. ⚠️ **Add Metadata**: Add proper SEO metadata for each page

## Comparison

| Feature | apps/web (Vite) | apps/webnextjs (Next.js) |
|---------|----------------|--------------------------|
| Framework | React + Vite | Next.js 16 |
| Routing | Custom | App Router (can use file-based) |
| Build Tool | Vite | Next.js (webpack) |
| SSR | ❌ No | ✅ Available |
| Server Components | ❌ No | ✅ Available |
| API Routes | ❌ No | ✅ Available |
| Image Optimization | ❌ No | ✅ Available |
| Environment Variables | `VITE_*` | `NEXT_PUBLIC_*` |
| Components | ✅ Same | ✅ Same |
| Contexts | ✅ Same | ✅ Same |
| API Integration | ✅ Same | ✅ Same |

## Recommendation

**Both apps can coexist**:
- `apps/web` - Keep for development/testing
- `apps/webnextjs` - Use for production (better SEO, performance, SSR)

Or **choose one**:
- Use `apps/webnextjs` if you need SSR, SEO, or Next.js features
- Use `apps/web` if you prefer Vite's faster dev server

## Architecture Alignment

✅ **Same professional structure**:
- Modular components
- Reusable contexts
- Custom hooks
- Shared API client
- Type-safe with TypeScript

✅ **Same architecture principles**:
- Component-based design
- Centralized state management
- Type safety
- Design system consistency

