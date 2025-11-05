# Thoughtweaver Web Application (apps/web)
## Project Overview & Documentation

**Version:** 2.0.0  
**Last Updated:** November 2025  
**Framework:** Next.js 14+ (App Router)  
**Status:** Active Development

---

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Key Features](#key-features)
5. [Setup & Development](#setup--development)
6. [Architecture](#architecture)
7. [Environment Variables](#environment-variables)
8. [API Integration](#api-integration)
9. [Authentication](#authentication)
10. [Deployment](#deployment)

---

## Overview

The Thoughtweaver Web Application is a Next.js-based frontend that provides users with an AI-powered ideation platform. Users can create conversations, interact with multiple AI assistants, manage workflows, and organize their ideas into projects.

### Key Capabilities

- ✅ **Multi-Assistant Conversations** - Chat with multiple AI assistants simultaneously
- ✅ **Workflow Management** - Structured ideation workflows
- ✅ **Project Organization** - Organize conversations into projects
- ✅ **Context Builder** - Add context pieces for better AI responses
- ✅ **Team Collaboration** - Share projects and conversations with teams
- ✅ **Billing Management** - View usage and manage subscriptions

---

## Technology Stack

### Core Framework
- **Next.js 14+** - React framework with App Router
- **React 18+** - UI library
- **TypeScript 5+** - Type safety

### Styling
- **Tailwind CSS v4.0** - Utility-first CSS
- **CSS Modules** - Component-scoped styles
- **Design Tokens** - From `@thoughtweaver/ui` package

### State Management
- **React Context** - Auth state, theme, navigation
- **Zustand** (Future) - Client state management
- **React Query** (Future) - Server state management

### Authentication
- **Supabase Auth** - OAuth (Google, Apple)
- **JWT Tokens** - Secure authentication

### UI Components
- **@thoughtweaver/ui** - Shared UI component library
- **Lucide React** - Icons
- **Custom Components** - Built from Figma designs

### Form Handling
- **React Hook Form** - Form management
- **Zod** - Schema validation

---

## Project Structure

```
apps/web/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/               # Auth route group
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── (main)/               # Main app route group
│   │   │   ├── layout.tsx       # Main layout wrapper
│   │   │   ├── page.tsx         # Home page
│   │   │   ├── conversations/
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── workflows/
│   │   │   ├── assistants/
│   │   │   ├── projects/
│   │   │   ├── settings/
│   │   │   └── billing/
│   │   ├── globals.css
│   │   ├── layout.tsx           # Root layout
│   │   └── loading.tsx
│   │
│   ├── components/               # App-specific components
│   │   ├── features/             # Feature components
│   │   │   ├── conversation/
│   │   │   ├── assistant/
│   │   │   └── workflow/
│   │   ├── layouts/              # Layout components
│   │   │   ├── AppLayout.tsx
│   │   │   └── Sidebar.tsx
│   │   └── ui/                   # UI components (from packages/ui)
│   │
│   ├── lib/                      # Utilities
│   │   ├── supabase/
│   │   │   ├── client.ts        # Supabase client
│   │   │   └── server.ts        # Server-side Supabase
│   │   ├── api/                  # API client
│   │   └── utils.ts
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useConversation.ts
│   │   └── useAssistant.ts
│   │
│   ├── contexts/                 # React contexts
│   │   ├── AuthProvider.tsx
│   │   └── ThemeProvider.tsx
│   │
│   └── middleware.ts            # Next.js middleware
│
├── public/                       # Static assets
├── next.config.js               # Next.js configuration
├── tailwind.config.js           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies
```

---

## Key Features

### 1. Authentication
- OAuth sign-in (Google, Apple)
- Session management
- Auto-profile creation
- Protected routes

### 2. Conversations
- Create and manage conversations
- Multi-assistant support
- Real-time message updates
- Message history

### 3. AI Assistants
- Default assistants (All-rounder, Analyst, Creative)
- Custom assistant creation
- Assistant personality configuration
- System prompt management

### 4. Workflows
- Pre-defined workflows
- Custom workflow creation
- Workflow step management
- Workflow suggestions

### 5. Projects
- Organize conversations into projects
- Project management
- Team sharing

### 6. Billing
- Usage statistics
- Subscription management
- Plan upgrades/downgrades

---

## Setup & Development

### Prerequisites
- Node.js v20+
- PNPM v8+

### Installation

```bash
cd apps/web
pnpm install
```

### Environment Variables

Create `apps/web/.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# API
NEXT_PUBLIC_API_URL=http://localhost:4000

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Run Development Server

```bash
cd apps/web
pnpm dev
```

The app will start on `http://localhost:3000`

### Build for Production

```bash
cd apps/web
pnpm build
pnpm start
```

---

## Architecture

### Authentication Flow

1. User clicks "Continue with Google"
2. Redirects to Supabase OAuth
3. Google authenticates user
4. Supabase creates session
5. Redirects back to app
6. Auto-creates profile in database
7. User state updated
8. Navigate to home page

### State Management

**Auth State** (`AuthContext`):
- User information
- Authentication status
- Session management

**Navigation State** (`App.tsx`):
- Current page
- Page history
- Navigation logic

**Conversation State** (`ConversationContext`):
- Active conversation
- Messages
- Selected assistants

### API Integration

The frontend communicates with:
- **Supabase** - Authentication, database queries
- **NestJS API** (`apps/api`) - Business logic, LLM calls

---

## API Integration

### Supabase Client

```typescript
// apps/web/src/lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

### NestJS API Client

```typescript
// apps/web/src/lib/api/client.ts
export async function apiRequest(endpoint: string, options?: RequestInit) {
  const { data: { session } } = await supabase.auth.getSession();
  
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/api${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${session?.access_token}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
}
```

---

## Authentication

### Protected Routes

Routes are protected using Next.js middleware:

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  // Check authentication
  // Redirect to login if not authenticated
}
```

### Auth Context

```typescript
// Usage in components
const { user, isLoading, login, logout } = useAuth();
```

---

## Deployment

### Vercel Deployment

1. Connect GitHub repository
2. Configure environment variables
3. Set build command: `cd apps/web && pnpm build`
4. Deploy

### Environment Variables Required

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_APP_URL`

---

## Current Status

### ✅ Completed
- [x] Project structure setup
- [x] Supabase authentication integration
- [x] OAuth (Google, Apple)
- [x] Profile auto-creation
- [x] UI components migration
- [x] Navigation system
- [x] Conversation UI

### ⏳ In Progress
- [ ] API integration with NestJS backend
- [ ] Real-time message updates
- [ ] Workflow execution
- [ ] Billing integration

### 📋 Planned
- [ ] React Query integration
- [ ] Zustand state management
- [ ] E2E tests with Playwright
- [ ] Performance optimization

---

## Related Documentation

- [Architecture Guide](../../ARCHITECTURE.md)
- [Developer Guide](../../DEVELOPER_GUIDE.md)
- [API Documentation](../api/README.md)
- [Database Setup](../../DATABASE_SETUP.md)

---

**Document Maintained By**: Development Team  
**Last Updated**: November 2025

