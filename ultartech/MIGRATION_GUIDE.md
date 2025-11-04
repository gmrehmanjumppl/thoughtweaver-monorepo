# Migration Guide
## From React Prototype to Next.js + NestJS Monorepo

**Version:** 2.0.0  
**Last Updated:** November 2025

---

## Table of Contents

1. [Migration Overview](#migration-overview)
2. [Phase 1: Monorepo Setup](#phase-1-monorepo-setup)
3. [Phase 2: Extract UI Components](#phase-2-extract-ui-components)
4. [Phase 3: Migrate to Next.js](#phase-3-migrate-to-nextjs)
5. [Phase 4: Set Up Backend API](#phase-4-set-up-backend-api)
6. [Phase 5: Database Migration](#phase-5-database-migration)
7. [Phase 6: Integration](#phase-6-integration)
8. [Phase 7: Testing & Deployment](#phase-7-testing--deployment)

---

## Migration Overview

### Current State

- **Frontend**: React + Vite application
- **State Management**: React Context + useState
- **Data**: In-memory (mock data)
- **Authentication**: Mock OAuth
- **Styling**: Tailwind CSS v4.0
- **Components**: shadcn/ui components

### Target State

- **Frontend**: Next.js 14+ (App Router)
- **Backend**: NestJS API
- **Database**: Supabase PostgreSQL
- **State Management**: React Query + Zustand
- **UI Package**: Modular, reusable components
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS v4.0 (via UI package)

### Migration Strategy

**Incremental Migration**: Migrate feature by feature, not all at once

1. Set up monorepo structure
2. Extract UI components to shared package
3. Migrate pages to Next.js one by one
4. Set up backend API
5. Connect frontend to backend
6. Migrate data layer
7. Add tests
8. Deploy

---

## Phase 1: Monorepo Setup

### Step 1: Initialize Monorepo

```bash
# Create new directory
mkdir thoughtweaver-monorepo
cd thoughtweaver-monorepo

# Initialize git
git init
git remote add origin https://github.com/your-org/thoughtweaver-monorepo.git

# Initialize pnpm workspace
echo "packages:\n  - 'apps/*'\n  - 'packages/*'\n  - 'services/*'\n  - 'tools/*'" > pnpm-workspace.yaml

# Create root package.json
cat > package.json << EOF
{
  "name": "thoughtweaver-monorepo",
  "version": "2.0.0",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint"
  },
  "devDependencies": {
    "turbo": "^1.10.0",
    "typescript": "^5.0.0"
  }
}
EOF

# Install turbo
pnpm install
```

### Step 2: Create Directory Structure

```bash
# Create directories
mkdir -p apps/web apps/mobile apps/admin
mkdir -p packages/ui packages/types packages/utils packages/api-client packages/config packages/database
mkdir -p services/api services/worker
mkdir -p tools/figma-sync tools/scripts
mkdir -p docs/architecture docs/api docs/guides
```

### Step 3: Set Up Turborepo

**`turbo.json`**:
```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "test": {
      "dependsOn": ["^build"]
    }
  }
}
```

---

## Phase 2: Extract UI Components

### Step 1: Create UI Package

```bash
cd packages/ui
pnpm init

# Install dependencies
pnpm add react react-dom
pnpm add -D typescript @types/react @types/react-dom
pnpm add -D vite @vitejs/plugin-react
pnpm add -D tailwindcss postcss autoprefixer
pnpm add -D vitest @testing-library/react
```

**`packages/ui/package.json`**:
```json
{
  "name": "@thoughtweaver/ui",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "vite build",
    "dev": "vite build --watch",
    "test": "vitest"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

### Step 2: Migrate Components from Current App

#### Copy Components

```bash
# Copy components from current app
cp -r ../thoughtweaver/src/components/ui/* src/components/
cp -r ../thoughtweaver/src/components/shared/* src/layouts/

# Copy styles
cp ../thoughtweaver/src/styles/globals.css src/theme/
```

#### Refactor Components

**Before** (Current app):
```typescript
// src/components/ui/button.tsx
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn("px-4 py-2 rounded", className)}
      {...props}
    />
  );
}
```

**After** (UI Package):
```typescript
// packages/ui/src/components/Button/Button.tsx
import { tokens } from '../../theme';
import { cn } from '../../utils';
import styles from './Button.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ 
  variant = 'primary', 
  size = 'md',
  className,
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        styles.button,
        styles[`button--${variant}`],
        styles[`button--${size}`],
        className
      )}
      {...props}
    />
  );
}
```

### Step 3: Set Up Design Tokens

**`packages/ui/src/theme/tokens.ts`**:
```typescript
// Initially copy from current app's globals.css
// Later: Auto-generated from Figma

export const tokens = {
  color: {
    primary: '#7C3AED',
    secondary: '#6366F1',
    // ... extract from current CSS variables
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
  },
  // ...
};
```

### Step 4: Build UI Package

```bash
cd packages/ui
pnpm build
```

---

## Phase 3: Migrate to Next.js

### Step 1: Initialize Next.js App

```bash
cd apps/web
pnpm create next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"

# Install additional dependencies
pnpm add @thoughtweaver/ui @thoughtweaver/types @thoughtweaver/api-client
pnpm add @supabase/supabase-js @supabase/auth-helpers-nextjs
pnpm add @tanstack/react-query zustand
pnpm add react-hook-form zod @hookform/resolvers
```

### Step 2: Migrate Pages One by One

#### Start with Home Page

**Current** (`src/components/home/HomePage.tsx`):
```typescript
export function HomePage() {
  return (
    <div>
      {/* Home page content */}
    </div>
  );
}
```

**New** (`apps/web/src/app/(main)/page.tsx`):
```typescript
import { PageLayout } from '@thoughtweaver/ui/layouts';
import { HomePageContent } from '@/components/home/HomePageContent';

export default function HomePage() {
  return (
    <PageLayout>
      <HomePageContent />
    </PageLayout>
  );
}
```

#### Migrate Components

**`apps/web/src/components/home/HomePageContent.tsx`**:
```typescript
'use client';

import { useState } from 'react';
import { Button } from '@thoughtweaver/ui';
import { useAssistantSelection } from '@/hooks/useAssistantSelection';
import { useNavigate } from '@/hooks/useNavigate';

export function HomePageContent() {
  const { selectedAssistants, toggleAssistant } = useAssistantSelection();
  const { navigate } = useNavigate();
  
  const handleStartConversation = async () => {
    // Create conversation via API
    const response = await fetch('/api/conversations', {
      method: 'POST',
      body: JSON.stringify({
        prompt: '...',
        assistants: selectedAssistants,
      }),
    });
    
    const conversation = await response.json();
    navigate(`/conversations/${conversation.id}`);
  };

  return (
    <div>
      {/* Migrated content */}
      <Button onClick={handleStartConversation}>
        Start Weaving
      </Button>
    </div>
  );
}
```

### Step 3: Set Up Routing

**`apps/web/src/app/(main)/layout.tsx`**:
```typescript
import { AppLayout } from '@/components/layouts/AppLayout';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
```

**`apps/web/src/app/(main)/conversations/[id]/page.tsx`**:
```typescript
import { ConversationView } from '@/components/conversation/ConversationView';

export default function ConversationPage({
  params,
}: {
  params: { id: string };
}) {
  return <ConversationView conversationId={params.id} />;
}
```

### Step 4: Migrate State Management

**Current** (React Context):
```typescript
// src/contexts/AuthContext.tsx
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // ...
}
```

**New** (React Query + Zustand):
```typescript
// apps/web/src/hooks/useAuth.ts
import { useQuery } from '@tanstack/react-query';
import { useSupabase } from '@/lib/supabase';

export function useAuth() {
  const supabase = useSupabase();
  
  return useQuery({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });
}
```

---

## Phase 4: Set Up Backend API

### Step 1: Initialize NestJS

```bash
cd services/api
pnpm dlx @nestjs/cli new . --skip-git --package-manager pnpm

# Install dependencies
pnpm add @nestjs/common @nestjs/core @nestjs/platform-express
pnpm add @supabase/supabase-js @prisma/client
pnpm add class-validator class-transformer
pnpm add @nestjs/passport passport passport-jwt
pnpm add -D @types/passport-jwt
```

### Step 2: Create Modules

```bash
# Generate modules
nest g module conversations
nest g controller conversations
nest g service conversations

nest g module assistants
nest g controller assistants
nest g service assistants

# ... repeat for other modules
```

### Step 3: Set Up Authentication

**`services/api/src/auth/auth.module.ts`**:
```typescript
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { SupabaseStrategy } from './strategies/supabase.strategy';

@Module({
  imports: [PassportModule],
  providers: [JwtStrategy, SupabaseStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
```

**`services/api/src/auth/strategies/supabase.strategy.ts`**:
```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SupabaseService } from '../supabase.service';

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy) {
  constructor(private supabase: SupabaseService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SUPABASE_JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub };
  }
}
```

### Step 4: Create API Endpoints

**`services/api/src/conversations/conversations.controller.ts`**:
```typescript
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/conversations')
@UseGuards(JwtAuthGuard)
export class ConversationsController {
  constructor(private readonly service: ConversationsService) {}

  @Get()
  async findAll(@Request() req) {
    return this.service.findAll(req.user.userId);
  }

  @Post()
  async create(@Body() dto: CreateConversationDto, @Request() req) {
    return this.service.create(dto, req.user.userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
```

---

## Phase 5: Database Migration

### Step 1: Set Up Supabase

1. Create Supabase project
2. Get connection string
3. Set up environment variables

### Step 2: Create Database Schema

**`packages/database/migrations/001_initial_schema.sql`**:
```sql
-- Copy from ARCHITECTURE.md database schema section
-- Create tables, indexes, RLS policies
```

### Step 3: Run Migrations

```bash
cd packages/database
pnpm run migrate:dev
```

### Step 4: Set Up Prisma (Optional)

**`packages/database/schema.prisma`**:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Conversation {
  id                String   @id @default(uuid())
  userId            String
  title             String
  prompt            String
  workflowId        String?
  selectedAssistants String[]
  selectedLLM      String
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  messages          Message[]
  user              Profile   @relation(fields: [userId], references: [id])
}

// ... other models
```

---

## Phase 6: Integration

### Step 1: Connect Frontend to Backend

**`packages/api-client/src/client.ts`**:
```typescript
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**`packages/api-client/src/endpoints/conversations.ts`**:
```typescript
import { apiClient } from '../client';
import { Conversation, CreateConversationDto } from '@thoughtweaver/types';

export const conversationsApi = {
  findAll: () => apiClient.get<Conversation[]>('/api/conversations'),
  create: (dto: CreateConversationDto) => 
    apiClient.post<Conversation>('/api/conversations', dto),
  findOne: (id: string) => 
    apiClient.get<Conversation>(`/api/conversations/${id}`),
};
```

### Step 2: Migrate Data Layer

**Current** (In-memory):
```typescript
const [conversations, setConversations] = useState<Conversation[]>([]);
```

**New** (React Query):
```typescript
// apps/web/src/hooks/useConversations.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { conversationsApi } from '@thoughtweaver/api-client';

export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: () => conversationsApi.findAll(),
  });
}

export function useCreateConversation() {
  return useMutation({
    mutationFn: conversationsApi.create,
  });
}
```

### Step 3: Set Up Authentication

**`apps/web/src/lib/supabase/client.ts`**:
```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

**`apps/web/src/app/(auth)/login/page.tsx`**:
```typescript
'use client';

import { supabase } from '@/lib/supabase/client';

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  };

  return (
    <div>
      <button onClick={handleGoogleLogin}>
        Sign in with Google
      </button>
    </div>
  );
}
```

---

## Phase 7: Testing & Deployment

### Step 1: Add Tests

```bash
# Add tests for migrated components
# Copy test patterns from TESTING_STRATEGY.md
```

### Step 2: Set Up CI/CD

```bash
# Copy CI/CD workflows from DEVELOPER_GUIDE.md
# Set up GitHub Actions
```

### Step 3: Deploy

#### Deploy Frontend (Vercel)

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
cd apps/web
vercel --prod
```

#### Deploy Backend (Railway/Render)

```bash
# Set up Railway account
# Connect GitHub repository
# Configure environment variables
# Deploy automatically on push to main
```

### Step 4: Monitor

- Set up error tracking (Sentry)
- Set up analytics
- Monitor performance
- Monitor API usage

---

## Migration Checklist

### Phase 1: Monorepo Setup
- [ ] Initialize monorepo structure
- [ ] Set up Turborepo
- [ ] Configure workspace
- [ ] Set up shared packages

### Phase 2: UI Components
- [ ] Create UI package
- [ ] Migrate components
- [ ] Set up design tokens
- [ ] Add tests
- [ ] Build package

### Phase 3: Next.js Migration
- [ ] Initialize Next.js app
- [ ] Migrate pages one by one
- [ ] Set up routing
- [ ] Migrate state management
- [ ] Test each page

### Phase 4: Backend API
- [ ] Initialize NestJS
- [ ] Create modules
- [ ] Set up authentication
- [ ] Create API endpoints
- [ ] Test endpoints

### Phase 5: Database
- [ ] Set up Supabase
- [ ] Create schema
- [ ] Run migrations
- [ ] Set up RLS policies

### Phase 6: Integration
- [ ] Connect frontend to backend
- [ ] Migrate data layer
- [ ] Set up authentication
- [ ] Test integration

### Phase 7: Testing & Deployment
- [ ] Add tests
- [ ] Set up CI/CD
- [ ] Deploy frontend
- [ ] Deploy backend
- [ ] Monitor production

---

## Rollback Plan

If migration fails:

1. **Keep old app running**: Don't delete current React app
2. **Feature flags**: Use feature flags to toggle between old/new
3. **Gradual rollout**: Migrate users gradually
4. **Rollback process**: Document rollback steps

---

## Timeline Estimate

- **Phase 1**: 1-2 days
- **Phase 2**: 3-5 days
- **Phase 3**: 5-7 days
- **Phase 4**: 5-7 days
- **Phase 5**: 2-3 days
- **Phase 6**: 3-5 days
- **Phase 7**: 3-5 days

**Total**: ~22-34 days (4-7 weeks)

---

---

## Phase 8: Figma to Production Sync Setup

### Why Two Repositories?

**Recommended Setup:**
- **Repository 1**: `thoughtweaver-figma` - Figma auto-generated code
- **Repository 2**: `thoughtweaver` - Production monorepo

**Benefits:**
1. **Separation of Concerns**: Designers work in Figma repo, developers in production repo
2. **Parallel Workflows**: No conflicts between design updates and code refactoring
3. **Version Control**: Track design changes separately from code changes

### Step 1: Set Up Figma Repository

```bash
# Create Figma repository (separate from monorepo)
# This will auto-update when designers change Figma designs
# Structure matches Figma component hierarchy:
#   components/ui/Button.tsx
#   components/ui/Card.tsx
#   styles/globals.css
```

### Step 2: Set Up Sync Tool

```bash
cd thoughtweaver-monorepo/tools/figma-sync

# Install dependencies
pnpm install

# Configure mapping
# Create .figma-sync/mapping.json
```

**`.figma-sync/mapping.json`**:
```json
{
  "mappings": {
    "components/ui/Button.tsx": {
      "target": "packages/ui/src/components/Button/Button.tsx",
      "transforms": ["extract-styles", "extract-types", "add-exports"]
    }
  }
}
```

### Step 3: Automated Sync Workflow

**`.github/workflows/figma-sync.yml`**:
```yaml
name: Sync Figma Designs

on:
  schedule:
    - cron: '0 9 * * *'  # Daily at 9 AM
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Production Repo
        uses: actions/checkout@v3
      
      - name: Checkout Figma Repo
        uses: actions/checkout@v3
        with:
          repository: your-org/thoughtweaver-figma
          token: ${{ secrets.FIGMA_REPO_TOKEN }}
          path: figma-repo
      
      - name: Detect Changes
        run: |
          node tools/figma-sync/src/detect-changes.js \
            --figma-repo figma-repo \
            --production-repo . \
            --output .figma-sync/changes.json
      
      - name: Sync Changes
        if: hashFiles('.figma-sync/changes.json') != ''
        run: |
          node tools/figma-sync/src/sync-changes.js \
            --changes .figma-sync/changes.json \
            --figma-repo figma-repo
      
      - name: Create PR
        if: hashFiles('.figma-sync/changes.json') != ''
        uses: peter-evans/create-pull-request@v5
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          title: '🎨 Sync Design Changes from Figma'
          body: 'Automated sync of design changes from Figma repository'
```

### Step 4: Manual Sync Commands

```bash
# Check for changes
pnpm sync:check

# Sync all changes
pnpm sync:all

# Sync specific component
pnpm sync:component Button
```

### How It Works

1. **Designer updates Figma** → Figma plugin auto-generates code → Commits to `thoughtweaver-figma` repo
2. **GitHub Action detects changes** → Compares Figma repo with Production repo
3. **Maps Figma structure to Production structure** → Uses mapping.json
4. **Transforms components** → Extracts styles, types, creates proper exports
5. **Creates Pull Request** → Developer reviews and merges

### Conflict Resolution

- **Styles changed**: Merge Figma styles into production component
- **Logic changed**: Keep production logic, apply Figma styles
- **Both changed**: Flag for manual review

See [FIGMA_INTEGRATION.md](./FIGMA_INTEGRATION.md) for detailed sync workflow.

---

## Next Steps After Migration

1. ✅ Set up Figma sync tool (Phase 8 above)
2. Add comprehensive tests
3. Set up monitoring
4. Optimize performance
5. Add mobile app (React Native)

---

**Document Maintained By**: Migration Team  
**Last Updated**: November 2025  
**Related Documents**: 
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)
- [FIGMA_INTEGRATION.md](./FIGMA_INTEGRATION.md)

