# Thoughtweaver Developer Guide
## Complete Step-by-Step Setup & Development Guide

**Version:** 2.0.0  
**Last Updated:** November 2025  
**Target Platform:** Multi-Platform (Web First, Mobile Later)

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Project Structure Setup](#project-structure-setup)
4. [Environment Variables Setup](#environment-variables-setup)
5. [Database Setup](#step-4-database-setup)
6. [Supabase Authentication Setup (OAuth)](#step-5-set-up-supabase-authentication-oauth)
7. [Verify Setup](#step-6-verify-setup)
8. [Development Workflow](#development-workflow)
9. [Figma Integration Setup](#figma-integration-setup)
10. [Testing Setup](#testing-setup)
11. [CI/CD Setup](#cicd-setup)
12. [Common Tasks](#common-tasks)
13. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

1. **Node.js** v20+ (LTS)
   ```bash
   node --version  # Should be v20.x.x or higher
   ```

2. **PNPM** v8+ (Package Manager)
   ```bash
   npm install -g pnpm
   pnpm --version  # Should be v8.x.x or higher
   ```

3. **Git** v2.40+
   ```bash
   git --version
   ```

4. **PostgreSQL** (via Supabase - cloud)
   - Or local PostgreSQL 15+ for development

5. **Docker** (Optional - for local services)
   ```bash
   docker --version
   ```

### Required Accounts & API Keys

1. **Supabase Account**
   - Create account at https://supabase.com
   - Create new project
   - Note: Project URL, anon key, service role key

2. **Figma Account**
   - Access to Thoughtweaver Figma design
   - Figma Personal Access Token (for sync tool)

3. **LLM API Keys** (for development)
   - OpenAI API key (get from https://platform.openai.com/api-keys)
   - Anthropic API key (get from https://console.anthropic.com/)
   - Google AI API key (get from https://makersuite.google.com/app/apikey)
   - Grok API key (get from https://x.ai/api when available)
   
   **Note**: See [LLM_API_KEY_GUIDE.md](./LLM_API_KEY_GUIDE.md) for detailed strategy and why we use individual keys instead of Vercel AI SDK.

4. **Stripe Account** (for billing)
   - Stripe account
   - Test API keys

5. **GitHub Account**
   - Repository access
   - GitHub Personal Access Token (for CI/CD)

---

## Initial Setup

### Step 0: Create GitHub Repositories

**IMPORTANT**: Create TWO separate repositories before starting:

#### Repository 1: `thoughtweaver-figma` (Figma Code Repository)

1. Go to GitHub.com → Click "New repository"
2. Repository name: `thoughtweaver-figma`
3. Description: "Auto-generated code from Figma designs - Design sync repository"
4. Visibility: Private (or Public if preferred)
5. **DO NOT** initialize with README
6. Click "Create repository"
7. Copy the repository URL (e.g., `https://github.com/YOUR_USERNAME/thoughtweaver-figma.git`)

**This repository will contain:**
- Auto-generated code from Figma
- Structure matches Figma component hierarchy
- Updated automatically when designers change Figma designs

#### Repository 2: `thoughtweaver-monorepo` (Production Monorepo)

1. Go to GitHub.com → Click "New repository"
2. Repository name: `thoughtweaver-monorepo`
3. Description: "Thoughtweaver - AI-Powered Ideation Platform (Production Monorepo)"
4. Visibility: Private (or Public if preferred)
5. **DO NOT** initialize with README
6. Click "Create repository"
7. Copy the repository URL (e.g., `https://github.com/YOUR_USERNAME/thoughtweaver-monorepo.git`)

**This repository will contain:**
- Production codebase
- Refactored, modular structure
- All applications and packages

---

### Step 1: Set Up Figma Repository (First)

**This is where your current Figma-generated code goes initially:**

```bash
# Navigate to your current Figma code location
# (e.g., C:\Users\soomr\Downloads\Thoughtweaver)

cd "C:\Users\soomr\Downloads\Thoughtweaver"

# Initialize git (if not already initialized)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Figma-generated code"

# Add remote repository (use your Figma repo URL)
git remote add origin https://github.com/YOUR_USERNAME/thoughtweaver-figma.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main

# Verify
git remote -v
# Should show:
# origin  https://github.com/YOUR_USERNAME/thoughtweaver-figma.git (fetch)
# origin  https://github.com/YOUR_USERNAME/thoughtweaver-figma.git (push)
```

**Your Figma code is now in**: `thoughtweaver-figma` repository ✅

---

### Step 2: Create Monorepo Structure from Scratch

**Now create the production monorepo:**

```bash
# Create new directory for monorepo
mkdir thoughtweaver-monorepo
cd thoughtweaver-monorepo

# Initialize git
git init
git branch -M main

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/thoughtweaver-monorepo.git
```

#### Create Complete Directory Structure

```bash
# Applications (deployable apps)
mkdir -p apps/web
mkdir -p apps/api
mkdir -p apps/mobile
mkdir -p apps/desktop

# Shared Packages
mkdir -p packages/ui/src/components
mkdir -p packages/ui/src/theme
mkdir -p packages/ui/src/layouts
mkdir -p packages/sdk/src
mkdir -p packages/ai/src/adapters
mkdir -p packages/ai/src/utils
mkdir -p packages/types/src
mkdir -p packages/config/src
mkdir -p packages/utils/src

# Infrastructure
mkdir -p infra/supabase/migrations
mkdir -p infra/supabase/seeds
mkdir -p infra/supabase/policies
mkdir -p infra/docker
mkdir -p infra/stripe/webhooks
mkdir -p infra/scripts

# Development Tools
mkdir -p tools/figma-sync/src
mkdir -p tools/scripts

# Documentation (already exists, but ensure it's here)
mkdir -p ultartech

# GitHub Actions
mkdir -p .github/workflows

# Root configuration files location
# (We'll create these files next)
```

#### Verify Structure

```bash
# Check your structure
tree -L 2
# Or on Windows:
dir /s /b

# Should see:
# apps/
#   web/
#   api/
#   mobile/
#   desktop/
# packages/
#   ui/
#   sdk/
#   ai/
#   types/
#   config/
#   utils/
# infra/
# tools/
# ultartech/
# .github/
```

---

### Step 3: Initialize Monorepo Configuration

#### Create Root `package.json`

```bash
# Create root package.json
cat > package.json << 'EOF'
{
  "name": "thoughtweaver-monorepo",
  "version": "2.0.0",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check",
    "clean": "turbo run clean"
  },
  "devDependencies": {
    "turbo": "^1.10.16",
    "typescript": "^5.2.2"
  },
  "packageManager": "pnpm@8.10.0",
  "engines": {
    "node": ">=18.0.0"
  }
}
EOF
```

#### Create `pnpm-workspace.yaml`

```bash
# Create pnpm workspace configuration
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - 'apps/*'
  - 'packages/*'
  - 'tools/*'
EOF
```

#### Create `turbo.json`

```bash
# Create Turborepo configuration
cat > turbo.json << 'EOF'
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
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
      "dependsOn": ["^build"]
    },
    "type-check": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "clean": {
      "cache": false
    }
  }
}
EOF
```

#### Create Root `tsconfig.json`

```bash
# Create root TypeScript configuration
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": {
      "@thoughtweaver/ui": ["./packages/ui/src"],
      "@thoughtweaver/types": ["./packages/types/src"],
      "@thoughtweaver/sdk": ["./packages/sdk/src"],
      "@thoughtweaver/config": ["./packages/config/src"],
      "@thoughtweaver/utils": ["./packages/utils/src"],
      "@thoughtweaver/ai": ["./packages/ai/src"]
    }
  },
  "include": [],
  "exclude": ["node_modules"]
}
EOF
```

#### Create `.gitignore`

```bash
# Create .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/
.nyc_output/

# Production
build/
dist/
.next/
out/

# Environment variables
.env
.env.local
.env*.local

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# OS
.DS_Store
*.pem
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Turbo
.turbo/

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts
EOF
```

#### Create Root `README.md`

```bash
# Create root README
cat > README.md << 'EOF'
# Thoughtweaver Monorepo

AI-Powered Ideation Platform - Production Monorepo

## Repository Structure

- `apps/web/` - Next.js frontend application
- `apps/api/` - NestJS backend API
- `apps/mobile/` - React Native mobile app (Phase 2)
- `apps/desktop/` - Electron desktop app (Phase 2)
- `packages/ui/` - Shared UI component library
- `packages/sdk/` - Auto-generated API client SDK
- `packages/ai/` - AI utilities & LLM adapters
- `packages/types/` - Shared TypeScript types
- `packages/config/` - Shared configuration
- `packages/utils/` - Shared utilities
- `infra/` - Infrastructure configurations
- `tools/` - Development tools
- `ultartech/` - Documentation

## Quick Start

See [ultartech/DEVELOPER_GUIDE.md](./ultartech/DEVELOPER_GUIDE.md) for complete setup instructions.

## Documentation

All documentation is in the `ultartech/` folder:
- [ARCHITECTURE.md](./ultartech/ARCHITECTURE.md) - Complete architecture guide
- [DEVELOPER_GUIDE.md](./ultartech/DEVELOPER_GUIDE.md) - Developer setup guide
- [MIGRATION_GUIDE.md](./ultartech/MIGRATION_GUIDE.md) - Migration guide
EOF
```

#### Commit Initial Structure

```bash
# Add all files
git add .

# Create initial commit
git commit -m "chore: Initial monorepo structure setup

- Created directory structure
- Configured pnpm workspace
- Setup Turborepo
- Added root configuration files"

# Push to GitHub
git push -u origin main
```

---

### Step 4: Install Dependencies & Verify Setup

```bash
# Install all dependencies (root + all packages)
pnpm install

# This will install:
# - Turborepo CLI
# - TypeScript
# - Root workspace dependencies
```

**Note**: Individual package dependencies will be installed when you create each package's `package.json` in later steps.

---

### Step 5: Verify Repository Setup

```bash
# Verify git remote
git remote -v
# Should show your thoughtweaver-monorepo repository

# Verify structure
ls -la
# Should see: apps/, packages/, infra/, tools/, ultartech/, etc.

# Verify pnpm workspace
pnpm list --depth=0
# Should show workspace structure
```

---

## Project Structure Setup

**Now that you have the basic structure, continue with:**

1. **Set up packages** - See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) Phase 2
2. **Set up applications** - See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) Phase 3
3. **Migrate Figma code** - See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) Phase 2

---

### Where Your Figma Code Is Now

- ✅ **Figma Code**: In `thoughtweaver-figma` repository (separate repo)
- ✅ **Production Code**: Will be in `thoughtweaver-monorepo` repository (this repo)
- ✅ **Sync Process**: Design changes from Figma repo will sync to production repo via tools (see Phase 8 in MIGRATION_GUIDE.md)

---

### Step 6: Continue with Package Setup

Now that the monorepo structure is created, continue with:

1. **Set up packages** - See Phase 2 in [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)
2. **Set up applications** - See Phase 3 in [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)
3. **Migrate your Figma code** - Components will be migrated from `thoughtweaver-figma` repo

**Important**: Your Figma code is in the separate `thoughtweaver-figma` repository. We'll migrate components from there to the production monorepo structure.

---

## Environment Variables Setup

### Step 1: Create Environment Files

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your values
```

#### Root `.env` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Figma Configuration
FIGMA_TOKEN=your-figma-personal-access-token
FIGMA_FILE_KEY=your-figma-file-key

# LLM API Keys
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_AI_API_KEY=...
GROK_API_KEY=...

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
API_URL=http://localhost:4000

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/thoughtweaver

# JWT Secret
JWT_SECRET=your-jwt-secret-key

# GitHub (for CI/CD)
GITHUB_TOKEN=your-github-token
```

#### Service-specific `.env` files:

**`apps/web/.env.local`**:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
API_URL=http://localhost:4000
```

**`apps/api/.env`**:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/thoughtweaver
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-jwt-secret-key
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

### Step 4: Database Setup

#### Option A: Supabase (Cloud - Recommended)

1. Go to Supabase Dashboard
2. Create new project
3. Go to SQL Editor
4. Run database migrations (see `infra/supabase/migrations/`)

**Migration Files**:
- `infra/supabase/migrations/001_initial_schema.sql` - Complete database schema
- `infra/supabase/migrations/002_seed_data.sql` - Default data (assistants, workflows)

**To Run Migrations**:
1. Open Supabase Dashboard → SQL Editor
2. Click "New Query"
3. Copy and paste contents of `001_initial_schema.sql`
4. Click "Run" (or press Ctrl+Enter)
5. Repeat for `002_seed_data.sql`

#### Option B: Local PostgreSQL

```bash
# Run PostgreSQL via Docker
docker run -d \
  --name thoughtweaver-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=thoughtweaver \
  -p 5432:5432 \
  postgres:15

# Run migrations
cd infra/supabase/migrations
psql -h localhost -U postgres -d thoughtweaver -f 001_initial_schema.sql
psql -h localhost -U postgres -d thoughtweaver -f 002_seed_data.sql
```

### Step 5: Set Up Supabase Authentication (OAuth)

**⚠️ Important**: Authentication is already integrated in the code, but you need to enable OAuth providers in Supabase.

#### Quick Setup Steps

1. **Enable Google OAuth Provider**:
   - Go to Supabase Dashboard → **Authentication** → **Providers**
   - Find **Google** provider and click **Enable**
   - Configure OAuth credentials (see detailed guide below)

2. **Get Google OAuth Credentials** (if using your own):
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create project → Enable Google+ API
   - Create OAuth Client ID (Web application)
   - Add redirect URI: `https://your-project.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret

3. **Configure Redirect URLs in Supabase**:
   - Go to Supabase Dashboard → **Authentication** → **URL Configuration**
   - Set **Site URL**: `http://localhost:3000`
   - Add **Redirect URLs**:
     ```
     http://localhost:3000
     http://localhost:3000/**
     ```

4. **Add Credentials to Supabase**:
   - Go to **Authentication** → **Providers** → **Google**
   - Paste your **Client ID** and **Client Secret**
   - Click **Save**

#### Common Error

**Error**: `"Unsupported provider: provider is not enabled"`

**Solution**: Enable the OAuth provider in Supabase Dashboard → Authentication → Providers

#### Detailed Guide

For complete step-by-step instructions with screenshots and troubleshooting, see:
- **[SUPABASE_OAUTH_SETUP.md](./SUPABASE_OAUTH_SETUP.md)** - Complete OAuth setup guide

This guide includes:
- Detailed Google Cloud Console setup
- Apple OAuth setup (optional)
- Troubleshooting common errors
- Redirect URL configuration
- Testing authentication flow

### Step 6: Verify Setup

```bash
# Run all tests
pnpm test

# Build all packages
pnpm build

# Start development servers
pnpm dev
```

**Verify Authentication**:
1. Start dev server: `cd apps/web && pnpm dev`
2. Open browser: http://localhost:3000
3. Click "Continue with Google"
4. You should be redirected to Google sign-in
5. After signing in, you should be redirected back to the app

**If you see error**: `"Unsupported provider: provider is not enabled"`  
→ See Step 5 above or [SUPABASE_OAUTH_SETUP.md](./SUPABASE_OAUTH_SETUP.md)

---

## Next Steps

**✅ Basic Structure Complete!**

You now have:
- ✅ Two repositories created (`thoughtweaver-figma` and `thoughtweaver-monorepo`)
- ✅ Figma code in `thoughtweaver-figma` repository
- ✅ Monorepo structure created in `thoughtweaver-monorepo`
- ✅ Root configuration files (package.json, turbo.json, tsconfig.json, etc.)

**Continue with:**

1. **Run Database Migrations** ⚠️
   - Go to Supabase Dashboard → SQL Editor
   - Run `infra/supabase/migrations/001_initial_schema.sql`
   - Run `infra/supabase/migrations/002_seed_data.sql`

2. **Enable OAuth Providers** ⚠️
   - See Step 5 above or [SUPABASE_OAUTH_SETUP.md](./SUPABASE_OAUTH_SETUP.md)
   - Enable Google OAuth in Supabase Dashboard
   - Configure redirect URLs

3. **Set up packages** - See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) Phase 2
   - UI Package setup
   - Types Package setup
   - AI Package setup
   - SDK Package setup

4. **Set up applications** - See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) Phase 3 & 4
   - Next.js Web App setup
   - NestJS API setup

5. **Migrate Figma code** - See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) Phase 2
   - Copy components from `thoughtweaver-figma` repo
   - Transform to production structure

**For detailed package setup instructions, see [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)**  
**For OAuth setup troubleshooting, see [SUPABASE_OAUTH_SETUP.md](./SUPABASE_OAUTH_SETUP.md)**

---

## Development Workflow

### Step 1: Starting Development

```bash
# Start all services in development mode
pnpm dev

# This runs:
# - Next.js dev server (apps/web) on http://localhost:3000
# - NestJS API server (apps/api) on http://localhost:4000
# - UI package watch mode
# - Storybook (packages/ui) on http://localhost:6006
```

#### Start Individual Services

```bash
# Start only web app
pnpm --filter web dev

# Start only API
pnpm --filter api dev

# Start only UI package
pnpm --filter ui dev
```

### Step 2: Creating a New Feature

#### Example: Adding a New Page

1. **Create Page Component** (`apps/web/src/app/(main)/settings/page.tsx`):
```typescript
import { PageLayout } from '@thoughtweaver/ui/layouts';
import { PageHeader } from '@thoughtweaver/ui/components';

export default function SettingsPage() {
  return (
    <PageLayout>
      <PageHeader title="Settings" />
      <main className="p-6">
        {/* Settings content */}
      </main>
    </PageLayout>
  );
}
```

2. **Add Route** (Next.js App Router handles this automatically)

3. **Add Navigation Link** (`apps/web/src/components/layouts/Sidebar.tsx`):
```typescript
<NavLink href="/settings">
  <SettingsIcon />
  Settings
</NavLink>
```

### Step 3: Creating a New UI Component

1. **Create Component** (`packages/ui/src/components/NewComponent/NewComponent.tsx`):
```typescript
import { tokens } from '../../theme';
import styles from './NewComponent.module.css';

export interface NewComponentProps {
  title: string;
  onClick?: () => void;
}

export function NewComponent({ title, onClick }: NewComponentProps) {
  return (
    <div className={styles.container} onClick={onClick}>
      <h2>{title}</h2>
    </div>
  );
}
```

2. **Add Tests** (`packages/ui/src/components/NewComponent/NewComponent.test.tsx`):
```typescript
import { render, screen } from '@testing-library/react';
import { NewComponent } from './NewComponent';

describe('NewComponent', () => {
  it('renders title', () => {
    render(<NewComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

3. **Add Storybook Story** (`packages/ui/src/components/NewComponent/NewComponent.stories.tsx`):
```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { NewComponent } from './NewComponent';

const meta: Meta<typeof NewComponent> = {
  component: NewComponent,
  title: 'Components/NewComponent',
};

export default meta;
type Story = StoryObj<typeof NewComponent>;

export const Default: Story = {
  args: {
    title: 'Example Title',
  },
};
```

4. **Export Component** (`packages/ui/src/index.ts`):
```typescript
export * from './components/NewComponent';
```

5. **Use in App** (`apps/web/src/app/page.tsx`):
```typescript
import { NewComponent } from '@thoughtweaver/ui';

export default function HomePage() {
  return <NewComponent title="Hello" />;
}
```

### Step 4: Adding a New API Endpoint

1. **Create Controller** (`apps/api/src/modules/feature/feature.controller.ts`):
```typescript
import { Controller, Get, Post, Body } from '@nestjs/common';
import { FeatureService } from './feature.service';

@Controller('api/feature')
export class FeatureController {
  constructor(private readonly featureService: FeatureService) {}

  @Get()
  async findAll() {
    return this.featureService.findAll();
  }

  @Post()
  async create(@Body() dto: CreateFeatureDto) {
    return this.featureService.create(dto);
  }
}
```

2. **Create Service** (`apps/api/src/modules/feature/feature.service.ts`):
```typescript
import { Injectable } from '@nestjs/common';
import { FeatureRepository } from './feature.repository';

@Injectable()
export class FeatureService {
  constructor(private readonly repository: FeatureRepository) {}

  async findAll() {
    return this.repository.findAll();
  }

  async create(dto: CreateFeatureDto) {
    return this.repository.create(dto);
  }
}
```

3. **Add to Module** (`apps/api/src/modules/feature/feature.module.ts`):
```typescript
import { Module } from '@nestjs/common';
import { FeatureController } from './feature.controller';
import { FeatureService } from './feature.service';

@Module({
  controllers: [FeatureController],
  providers: [FeatureService],
})
export class FeatureModule {}
```

4. **Register Module** (`apps/api/src/app.module.ts`):
```typescript
import { FeatureModule } from './feature/feature.module';

@Module({
  imports: [
    // ... other modules
    FeatureModule,
  ],
})
export class AppModule {}
```

5. **Use in Frontend** (`packages/sdk/src/endpoints/feature.ts`):
```typescript
import { apiClient } from '../client';

export const featureApi = {
  findAll: () => apiClient.get('/api/feature'),
  create: (data: CreateFeatureDto) => apiClient.post('/api/feature', data),
};
```

---

## Figma Integration Setup

### Step 1: Get Figma Access Token

1. Go to Figma → Settings → Account
2. Scroll to "Personal Access Tokens"
3. Click "Create new token"
4. Name it "Thoughtweaver Sync"
5. Copy the token

### Step 2: Get Figma File Key

1. Open your Figma design file
2. Look at the URL: `https://www.figma.com/file/FILE_KEY/Design-Name`
3. Copy the `FILE_KEY` (the long string between `/file/` and `/`)

### Step 3: Set Up Figma Sync Tool

```bash
cd tools/figma-sync
pnpm install

# Install Figma API client
pnpm add @figma/rest-api-sdk
```

**`tools/figma-sync/src/sync-tokens.ts`**:
```typescript
import { FigmaApi } from '@figma/rest-api-sdk';
import { writeFileSync } from 'fs';
import { join } from 'path';

async function syncTokens() {
  const figma = new FigmaApi({
    accessToken: process.env.FIGMA_TOKEN!,
  });

  const file = await figma.getFile(process.env.FIGMA_FILE_KEY!);
  
  // Extract design tokens
  const tokens = extractDesignTokens(file);
  
  // Generate TypeScript file
  const content = generateTokensFile(tokens);
  
  // Write to UI package
  const outputPath = join(
    process.cwd(),
    '../../packages/ui/src/theme/tokens.ts'
  );
  
  writeFileSync(outputPath, content);
  console.log('✅ Design tokens synced successfully!');
}
```

### Step 4: Configure GitHub Actions

**`.github/workflows/figma-sync.yml`**:
```yaml
name: Sync Figma Designs

on:
  schedule:
    - cron: '0 9 * * *'  # Daily at 9 AM
  workflow_dispatch:  # Manual trigger

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Sync Figma tokens
        env:
          FIGMA_TOKEN: ${{ secrets.FIGMA_TOKEN }}
          FIGMA_FILE_KEY: ${{ secrets.FIGMA_FILE_KEY }}
        run: pnpm --filter figma-sync sync:tokens
      
      - name: Create PR if changes
        uses: peter-evans/create-pull-request@v5
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          commit-message: 'chore: sync design tokens from Figma'
          title: 'Sync Design Tokens from Figma'
          body: 'Automated sync of design tokens from Figma'
```

### Step 5: Run Sync Manually

```bash
# From root
pnpm --filter figma-sync sync:tokens

# Or from figma-sync directory
cd tools/figma-sync
pnpm sync:tokens
```

### Step 6: Handle Design Updates

When a designer updates Figma:

1. **Automatic Sync** (if scheduled):
   - GitHub Action runs daily
   - Creates PR with changes
   - Review and merge

2. **Manual Sync**:
   ```bash
   pnpm --filter figma-sync sync:tokens
   ```

3. **Review Changes**:
   ```bash
   git diff packages/ui/src/theme/tokens.ts
   ```

4. **Update Components** (if needed):
   - Check which components use changed tokens
   - Update components if design changed
   - Run visual regression tests

---

## Testing Setup

### Step 1: Unit Tests Setup

#### UI Package Tests

```bash
cd packages/ui
pnpm add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

**`packages/ui/vitest.config.ts`**:
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
```

**`packages/ui/src/test/setup.ts`**:
```typescript
import '@testing-library/jest-dom';
```

#### Run Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test Button.test.tsx
```

### Step 2: Integration Tests Setup

**`apps/api/test/setup.ts`**:
```typescript
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

export async function createTestApp() {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  return moduleFixture.createNestApplication();
}
```

**`apps/api/test/conversations.e2e-spec.ts`**:
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Conversations (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api/conversations (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/conversations')
      .expect(200);
  });
});
```

### Step 3: E2E Tests Setup (Playwright)

```bash
cd apps/web
pnpm add -D @playwright/test
pnpm exec playwright install
```

**`apps/web/playwright.config.ts`**:
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

**`apps/web/e2e/conversation.spec.ts`**:
```typescript
import { test, expect } from '@playwright/test';

test('user can create conversation', async ({ page }) => {
  await page.goto('/');
  
  // Fill prompt
  await page.fill('[data-testid="prompt-input"]', 'Test prompt');
  
  // Click start
  await page.click('[data-testid="start-weaving"]');
  
  // Verify conversation created
  await expect(page.locator('[data-testid="conversation-title"]'))
    .toBeVisible();
});
```

### Step 4: Visual Regression Tests

```bash
cd packages/ui
pnpm add -D @chromatic-com/storybook chromatic
```

**`packages/ui/.storybook/main.ts`**:
```typescript
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
};

export default config;
```

**Run Visual Tests**:
```bash
# Build Storybook
pnpm build-storybook

# Publish to Chromatic
pnpm chromatic --project-token=your-token
```

---

## CI/CD Setup

### Step 1: GitHub Actions Workflow

**`.github/workflows/ci.yml`**:
```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm test

  build:
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm build
```

### Step 2: Deployment Workflow

**`.github/workflows/deploy.yml`**:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-web:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Step 3: Code Review Bot Setup

**`tools/code-review/src/index.ts`**:
```typescript
import { GitHub } from '@actions/github';
import { analyzeCode } from './analyzer';

export async function reviewPR(prNumber: number) {
  const github = new GitHub(process.env.GITHUB_TOKEN!);
  
  // Get PR diff
  const { data: diff } = await github.pulls.get({
    owner: 'your-org',
    repo: 'thoughtweaver-monorepo',
    pull_number: prNumber,
  });
  
  // Analyze code
  const issues = await analyzeCode(diff);
  
  // Post review comments
  for (const issue of issues) {
    await github.pulls.createReviewComment({
      owner: 'your-org',
      repo: 'thoughtweaver-monorepo',
      pull_number: prNumber,
      body: issue.message,
      path: issue.file,
      line: issue.line,
    });
  }
}
```

---

## Common Tasks

### Task 1: Adding a New Feature

1. **Create feature branch**:
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Create UI components** (if needed):
   ```bash
   cd packages/ui/src/components
   mkdir NewFeature
   # Create component files
   ```

3. **Create API endpoints**:
   ```bash
   cd apps/api/src
   nest g module feature
   nest g controller feature
   nest g service feature
   ```

4. **Add tests**:
   ```bash
   # Unit tests for components
   # Integration tests for API
   # E2E tests for feature flow
   ```

5. **Update documentation**:
   ```bash
   # Update API docs
   # Update component docs
   ```

6. **Create PR**:
   ```bash
   git push origin feature/new-feature
   # Create PR on GitHub
   ```

### Task 2: Updating Design Tokens

1. **Designer updates Figma**

2. **Sync tokens**:
   ```bash
   pnpm --filter figma-sync sync:tokens
   ```

3. **Review changes**:
   ```bash
   git diff packages/ui/src/theme/tokens.ts
   ```

4. **Update components** (if needed):
   ```bash
   # Components will automatically use new tokens
   # Run visual regression tests
   pnpm test:visual
   ```

### Task 3: Fixing a Bug

1. **Reproduce bug**:
   ```bash
   # Run app locally
   pnpm dev
   # Reproduce the issue
   ```

2. **Write failing test**:
   ```typescript
   // Test that reproduces the bug
   it('should handle edge case', () => {
     // Test code
   });
   ```

3. **Fix the bug**:
   ```typescript
   // Fix the code
   ```

4. **Verify fix**:
   ```bash
   pnpm test
   # Test passes ✅
   ```

5. **Create PR**:
   ```bash
   git checkout -b fix/bug-name
   git commit -m "fix: description of bug fix"
   git push origin fix/bug-name
   ```

### Task 4: Deploying to Production

1. **Merge to main**:
   ```bash
   # Merge PR to main branch
   ```

2. **CI/CD runs automatically**:
   - Tests run
   - Build succeeds
   - Deployment triggers

3. **Verify deployment**:
   ```bash
   # Check production URL
   # Run smoke tests
   ```

---

## Troubleshooting

### Issue: Build Fails

**Error**: `Cannot find module '@thoughtweaver/ui'`

**Solution**:
```bash
# Build UI package first
pnpm --filter ui build

# Or build all packages
pnpm build
```

### Issue: Tests Fail

**Error**: `Cannot find module` in tests

**Solution**:
```bash
# Clear cache
pnpm clean

# Reinstall dependencies
pnpm install

# Run tests again
pnpm test
```

### Issue: Figma Sync Fails

**Error**: `Invalid Figma token`

**Solution**:
1. Check `FIGMA_TOKEN` in `.env`
2. Verify token has correct permissions
3. Regenerate token if needed

### Issue: OAuth Authentication Fails

**Error**: `"Unsupported provider: provider is not enabled"`

**Solution**:
1. Go to Supabase Dashboard → Authentication → Providers
2. Enable the OAuth provider (Google, Apple, etc.)
3. Configure OAuth credentials if needed
4. Set redirect URLs correctly
5. See [SUPABASE_OAUTH_SETUP.md](./SUPABASE_OAUTH_SETUP.md) for detailed guide

**Error**: `"redirect_uri_mismatch"`

**Solution**:
1. Check redirect URLs in Supabase Dashboard → Authentication → URL Configuration
2. Ensure Site URL is: `http://localhost:3000`
3. Ensure Redirect URLs include: `http://localhost:3000` and `http://localhost:3000/**`
4. In Google Cloud Console, ensure redirect URI matches: `https://your-project.supabase.co/auth/v1/callback`

### Issue: Database Connection Fails

**Error**: `Connection refused`

**Solution**:
```bash
# Check Supabase connection
# Verify DATABASE_URL in .env
# Check if Supabase project is active
```

### Issue: Port Already in Use

**Error**: `Port 3000 already in use`

**Solution**:
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 pnpm dev
```

---

## Next Steps

1. ✅ Complete initial setup
2. ✅ Set up development environment
3. ✅ Configure Figma sync
4. ✅ Set up testing
5. ✅ Configure CI/CD
6. 🚀 Start developing!

---

**Document Maintained By**: Development Team  
**Last Updated**: November 2025  
**Related Documents**: 
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Complete architecture guide
- [FIGMA_INTEGRATION.md](./FIGMA_INTEGRATION.md) - Figma sync setup
- [TESTING_STRATEGY.md](./TESTING_STRATEGY.md) - Testing guide
- [SUPABASE_OAUTH_SETUP.md](./SUPABASE_OAUTH_SETUP.md) - Complete OAuth setup guide
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - Migration instructions
- [CLIENT_DEPLOYMENT_CONFIG.md](./CLIENT_DEPLOYMENT_CONFIG.md) - Client deployment configuration guide
- [COMPLETE_TECHNICAL_DOCUMENTATION.md](./COMPLETE_TECHNICAL_DOCUMENTATION.md) - **Complete technical implementation details, fixes, and code**

