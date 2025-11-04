# NestJS API Implementation Guide

## Quick Start

### 1. Install Dependencies

```bash
cd apps/api
pnpm add @supabase/supabase-js openai @anthropic-ai/sdk @google/generative-ai stripe @nestjs/jwt @nestjs/passport passport passport-jwt class-validator class-transformer
pnpm add -D @types/passport-jwt
```

### 2. Environment Variables

Create `.env` file in `apps/api/`:

```env
# Server
PORT=4000
NODE_ENV=development

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key

# AI Providers
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_AI_API_KEY=...
GROK_API_KEY=...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### 3. Generate Modules

```bash
cd apps/api
nest g module supabase
nest g module ai
nest g module stripe
nest g module auth
nest g module users
nest g module conversations
nest g module assistants
nest g module workflows
nest g module messages
nest g module projects
nest g module teams
nest g module billing
nest g module health
```

### 4. Generate Services & Controllers

```bash
# Supabase
nest g service supabase
nest g service supabase/database
nest g service supabase/auth
nest g service supabase/storage
nest g service supabase/realtime

# AI
nest g service ai/providers/openai
nest g service ai/providers/anthropic
nest g service ai/providers/google
nest g service ai/providers/grok
nest g service ai/adapters

# Stripe
nest g service stripe
nest g controller stripe

# Business modules
nest g service users
nest g controller users
nest g service conversations
nest g controller conversations
# ... repeat for other modules
```

### 5. Run Development Server

```bash
cd apps/api
pnpm dev
```

---

## Module Implementation Order

1. **Config Module** - Set up configuration
2. **Supabase Module** - Database & Auth integration
3. **Auth Module** - Authentication guards & strategies
4. **AI Module** - AI provider integrations
5. **Stripe Module** - Payment processing
6. **Business Modules** - Core features

---

## Next Steps

1. Implement Supabase services
2. Add authentication guards
3. Create DTOs for validation
4. Implement business logic
5. Add error handling
6. Write tests

See `NESTJS_STRUCTURE.md` for complete structure details.
