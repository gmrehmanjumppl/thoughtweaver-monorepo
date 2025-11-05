# Thoughtweaver Monorepo

**Version:** 2.0.0  
**Last Updated:** November 2025  
**Status:** Production-Ready Architecture

---

## 🚀 Quick Start

### Prerequisites

- **Node.js**: >= 18.0.0
- **Package Manager**: PNPM 8.10.0+
- **Database**: Supabase PostgreSQL
- **API Keys**: OpenAI, Anthropic, Google AI, Grok (optional)

### Installation

```bash
# Install dependencies for all packages
pnpm install

# Build all packages
pnpm build

# Start all applications in development mode
pnpm dev
```

---

## 📁 Monorepo Structure

```
thoughtweaver-monorepo/
├── apps/
│   ├── web/          # React/Vite Frontend ✅
│   ├── webnextjs/    # Next.js 16 Frontend ✅ (NEW)
│   └── api/          # NestJS Backend API ✅
│
├── packages/
│   ├── ui/           # Shared UI Components ✅
│   ├── types/        # Shared TypeScript Types ✅
│   ├── config/       # Shared Configuration ✅
│   ├── utils/        # Shared Utilities ⚠️ Placeholder
│   ├── sdk/          # API Client SDK ⚠️ Placeholder
│   └── ai/           # AI Utilities ⚠️ Empty (AI logic in apps/api)
│
├── infra/
│   └── supabase/
│       └── migrations/  # Database migrations ✅
│
├── ultartech/        # Documentation ✅
└── tools/           # Development tools (future)
```

---

## 🎯 Running Individual Applications

### Frontend (React/Vite) - `apps/web`

```bash
# Navigate to web app
cd apps/web

# Install dependencies (if not done at root)
pnpm install

# Start development server
pnpm dev

# Access at: http://localhost:5173
```

**Environment Variables** (`apps/web/.env.local`):
```env
VITE_API_URL=http://localhost:4000/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Frontend (Next.js) - `apps/webnextjs` ⭐ NEW

```bash
# Navigate to Next.js app
cd apps/webnextjs

# Install dependencies (if not done at root)
pnpm install

# Start development server
pnpm dev

# Access at: http://localhost:3000
```

**Environment Variables** (`apps/webnextjs/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Note**: Both `apps/web` (Vite) and `apps/webnextjs` (Next.js) are available. Choose based on your preference:
- **Vite**: Faster dev server, simpler setup
- **Next.js**: Better SEO, SSR, image optimization, API routes

### Backend API (NestJS)

```bash
# Navigate to API
cd apps/api

# Install dependencies (if not done at root)
pnpm install

# Start development server
pnpm dev

# Access at: http://localhost:4000/api
# Health check: http://localhost:4000/api/health
```

**Environment Variables** (`apps/api/.env`):
```env
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret

# LLM API Keys
OPENAI_API_KEY=sk-proj-...
# ANTHROPIC_API_KEY=sk-ant-...
# GOOGLE_AI_API_KEY=...
# GROK_API_KEY=...
```

---

## 🛠️ Available Scripts

### Root Level Commands

```bash
# Development (runs all apps in parallel)
pnpm dev

# Build all packages and apps
pnpm build

# Run tests
pnpm test

# Lint all packages
pnpm lint

# Type checking
pnpm type-check

# Clean build artifacts
pnpm clean
```

### Per-Package Commands

Each package/app can be run independently:

```bash
# Web app
cd apps/web && pnpm dev
cd apps/web && pnpm build
cd apps/web && pnpm lint

# API
cd apps/api && pnpm dev
cd apps/api && pnpm build
cd apps/api && pnpm lint

# Types package
cd packages/types && pnpm build
```

---

## 🏗️ Architecture Overview

### Monorepo Strategy

✅ **Multi-App**: Separate applications for web and API  
✅ **Modular**: Shared packages for reusable code  
✅ **Reusable**: Components, types, and utilities shared across apps  
✅ **Scalable**: Easy to add mobile/desktop apps in future  

### Application Structure

**Frontend (`apps/web`)**:
- React 18+ with Vite
- TypeScript
- Tailwind CSS
- Supabase Auth (client-side)
- REST API integration

**Frontend (`apps/webnextjs`)** ⭐ NEW:
- Next.js 16 with App Router
- React 18+ with TypeScript
- Tailwind CSS
- Supabase Auth (client-side)
- REST API integration
- SSR & SEO capabilities

**Backend (`apps/api`)**:
- NestJS 10+
- TypeScript
- PostgreSQL (via Supabase)
- JWT Authentication
- Multi-LLM AI Layer (OpenAI, Anthropic, Google, Grok)

### Shared Packages

**`packages/ui`**: 
- 45+ shadcn/ui components
- Layout components
- Theme system

**`packages/types`**:
- Shared TypeScript interfaces
- API types
- Database types

**`packages/config`**:
- Shared configuration
- ESLint, TypeScript configs

---

## 📦 Package Management

### PNPM Workspaces

This monorepo uses **PNPM workspaces** for package management:

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'tools/*'
```

### Turborepo

**Turborepo** handles build orchestration and caching:

```json
// turbo.json
{
  "pipeline": {
    "build": { "dependsOn": ["^build"] },
    "dev": { "cache": false, "persistent": true }
  }
}
```

**Benefits**:
- ✅ Parallel execution
- ✅ Build caching
- ✅ Dependency graph optimization

---

## 🗄️ Database Setup

### Supabase Migration

1. **Navigate to Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project

2. **Run SQL Migration**
   - Go to SQL Editor
   - Copy contents of `infra/supabase/migrations/001_initial_schema.sql`
   - Run the SQL script

3. **Verify Tables**
   - Check that all tables are created:
     - `profiles`
     - `conversations`
     - `messages`
     - `assistants`
     - `workflows`
     - `projects`
     - `teams`
     - `subscriptions`
     - `usage_tracking`

See `ultartech/DATABASE_SETUP.md` for detailed instructions.

---

## 🔐 Authentication Setup

### Supabase OAuth

1. **Configure OAuth Providers**
   - Go to Supabase Dashboard → Authentication → Providers
   - Enable Google OAuth
   - Enable Apple OAuth (optional)
   - Add redirect URLs:
     - `http://localhost:5173` (development)
     - `https://your-domain.com` (production)

2. **Set Environment Variables**
   - Copy `.env.example` to `.env.local` in `apps/web`
   - Add your Supabase URL and anon key

See `ultartech/SUPABASE_OAUTH_SETUP.md` for detailed instructions.

---

## 🤖 AI Layer Setup

### LLM Provider API Keys

The AI layer supports multiple LLM providers. Add API keys to `apps/api/.env`:

```env
# Required (at least one)
OPENAI_API_KEY=sk-proj-...

# Optional (enable as needed)
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_AI_API_KEY=...
GROK_API_KEY=...
```

**Supported Providers**:
- ✅ OpenAI (GPT-5, GPT-5-mini)
- ✅ Anthropic (Claude Sonnet/Haiku 4.5)
- ✅ Google AI (Gemini 2.5 Pro/Flash)
- ✅ Grok (Grok-4)

See `ultartech/LLM_API_KEY_GUIDE.md` for detailed setup.

---

## 📚 Documentation

All documentation is in the `ultartech/` folder:

- **[ARCHITECTURE.md](./ultartech/ARCHITECTURE.md)** - Complete architecture guide
- **[DEVELOPER_GUIDE.md](./ultartech/DEVELOPER_GUIDE.md)** - Setup & development guide
- **[API_INTEGRATION.md](./ultartech/API_INTEGRATION.md)** - Frontend API integration
- **[DATABASE_SETUP.md](./ultartech/DATABASE_SETUP.md)** - Database setup guide
- **[apps/api/README.md](./ultartech/apps/api/README.md)** - API documentation
- **[apps/web/README.md](./ultartech/apps/web/README.md)** - Web app documentation

---

## 🧪 Development Workflow

### 1. Start All Services

```bash
# Terminal 1: Start all apps
pnpm dev

# Or start individually:
# Terminal 1: Backend API
cd apps/api && pnpm dev

# Terminal 2: Frontend
cd apps/web && pnpm dev
```

### 2. Make Changes

- **Frontend**: Edit files in `apps/web/src/`
- **Backend**: Edit files in `apps/api/src/`
- **Shared Packages**: Edit files in `packages/*/src/`

### 3. Build & Test

```bash
# Build all packages
pnpm build

# Run tests
pnpm test

# Type check
pnpm type-check
```

---

## 🚢 Deployment

### Frontend (Vercel/Netlify)

```bash
cd apps/web
pnpm build
# Deploy dist/ folder
```

### Backend (Railway/Render/AWS)

```bash
cd apps/api
pnpm build
# Deploy dist/ folder
# Set environment variables
```

### Database (Supabase)

- Already hosted on Supabase
- Migrations run manually via Supabase Dashboard

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: `pnpm install` fails  
**Solution**: Make sure you're using PNPM 8.10.0+

```bash
npm install -g pnpm@8.10.0
```

**Issue**: Port already in use  
**Solution**: Change ports in `.env` files

**Issue**: API connection fails  
**Solution**: Check `VITE_API_URL` in `apps/web/.env.local`

**Issue**: Database connection fails  
**Solution**: Verify Supabase credentials in `apps/api/.env`

---

## 📊 Project Status

### ✅ Completed

- **Frontend**: React/Vite app with full UI
- **Backend**: NestJS API with all modules
- **AI Layer**: Multi-provider LLM integration
- **Database**: Supabase PostgreSQL schema
- **Authentication**: Supabase Auth integration
- **API Integration**: Frontend connected to backend

### ⚠️ In Progress

- Workflows module (stub)
- Projects module (stub)
- Billing module (stub)
- Stripe integration (stub)

### 🔮 Future

- Mobile app (`apps/mobile`)
- Desktop app (`apps/desktop`)
- Auto-generated SDK (`packages/sdk`)
- Figma sync tool (`tools/figma-sync`)

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

See `ultartech/DEVELOPER_GUIDE.md` for detailed contribution guidelines.

---

## 📄 License

Private - All Rights Reserved

---

## 🆘 Support

- **Documentation**: See `ultartech/` folder
- **Issues**: Check existing documentation first
- **Questions**: Review architecture docs

---

**Maintained By**: Development Team  
**Last Updated**: November 2025
