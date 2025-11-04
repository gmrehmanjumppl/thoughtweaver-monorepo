# Thoughtweaver Monorepo Architecture
## Next.js + NestJS + Supabase Multi-Platform Architecture

**Version:** 2.0.0  
**Last Updated:** November 2025  
**Status:** Production-Ready Architecture

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Monorepo Structure](#monorepo-structure)
3. [Technology Stack](#technology-stack)
4. [Application Architecture](#application-architecture)
5. [Modular UI System](#modular-ui-system)
6. [Backend Architecture](#backend-architecture)
7. [Database Schema](#database-schema)
8. [API Design](#api-design)
9. [Figma Integration Strategy](#figma-integration-strategy)
10. [Testing Strategy](#testing-strategy)
11. [Deployment Architecture](#deployment-architecture)
12. [Migration Strategy](#migration-strategy)

---

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Monorepo Root                            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  apps/                                                 │  │
│  │  ├── web/              (Next.js 14+)                   │  │
│  │  ├── mobile/           (React Native - Future)         │  │
│  │  └── admin/            (Next.js Admin Dashboard)      │  │
│  │                                                         │  │
│  │  packages/                                             │  │
│  │  ├── ui/               (Shared UI Components)           │  │
│  │  ├── config/           (Shared Configs)                │  │
│  │  ├── types/            (Shared TypeScript Types)       │  │
│  │  ├── utils/            (Shared Utilities)              │  │
│  │  ├── api-client/       (API Client SDK)                │  │
│  │  └── database/         (Database Schema & Migrations) │  │
│  │                                                         │  │
│  │  services/                                             │  │
│  │  ├── api/              (NestJS Backend)                │  │
│  │  ├── worker/           (Background Jobs)               │  │
│  │  └── gateway/          (API Gateway - Future)          │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  External Services                                      │  │
│  │  ├── Supabase (Auth, DB, Storage)                      │  │
│  │  ├── OpenAI API (GPT-5, GPT-5 mini)                    │  │
│  │  ├── Anthropic API (Claude Sonnet/Haiku 4.5)          │  │
│  │  ├── Google AI API (Gemini 2.5 Pro/Flash)              │  │
│  │  ├── Grok API (Grok-4)                                 │  │
│  │  └── Stripe (Billing)                                  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Architecture Principles

1. **Monorepo First**: Single codebase for all platforms and services
2. **Modular Design**: Reusable, platform-agnostic components
3. **Type Safety**: Shared TypeScript types across all packages
4. **API-First**: Backend API serves all platforms (web, mobile, admin)
5. **Platform Agnostic**: UI components work on web and mobile
6. **Design System**: Centralized UI components matching Figma designs
7. **Figma Sync**: Automated design token and component sync

---

## Monorepo Structure

### Root Directory Structure

```
thoughtweaver-monorepo/
├── .github/                          # GitHub Actions workflows
│   ├── workflows/
│   │   ├── ci.yml                    # Continuous Integration
│   │   ├── cd.yml                    # Continuous Deployment
│   │   ├── test.yml                  # Test suite
│   │   └── figma-sync.yml            # Figma design sync
│   └── PULL_REQUEST_TEMPLATE.md      # PR template
│
├── apps/                             # Applications
│   ├── web/                          # Next.js 14+ Web Application
│   │   ├── app/                      # Next.js App Router pages
│   │   ├── components/               # Next.js-specific components
│   │   ├── lib/                      # Next.js utilities & hooks
│   │   ├── public/                   # Static assets
│   │   ├── styles/                   # Global styles
│   │   ├── next.config.js
│   │   ├── tailwind.config.js
│   │   └── package.json
│   │
│   ├── api/                          # NestJS Backend API
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── modules/              # Feature modules
│   │   │   │   ├── auth/
│   │   │   │   ├── conversations/
│   │   │   │   ├── assistants/
│   │   │   │   ├── workflows/
│   │   │   │   ├── messages/
│   │   │   │   ├── projects/
│   │   │   │   ├── teams/
│   │   │   │   ├── billing/
│   │   │   │   └── llm/
│   │   │   ├── common/               # Guards, interceptors, decorators
│   │   │   └── config/               # Configuration
│   │   ├── test/                     # E2E tests
│   │   ├── nest-cli.json
│   │   └── package.json
│   │
│   ├── mobile/                       # React Native App (Phase 2)
│   │   ├── src/
│   │   │   ├── screens/
│   │   │   ├── components/           # Reuses packages/ui where possible
│   │   │   └── navigation/
│   │   ├── android/
│   │   ├── ios/
│   │   └── package.json
│   │
│   └── desktop/                      # Electron App (Phase 2)
│       ├── src/
│       │   ├── main/                 # Electron main process
│       │   ├── renderer/             # Reuses packages/ui
│       │   └── preload/
│       └── package.json
│
├── packages/                         # Shared Packages
│   ├── ui/                           # UI Component Library
│   │   ├── src/
│   │   │   ├── components/           # React components
│   │   │   │   ├── Button/
│   │   │   │   │   ├── Button.tsx
│   │   │   │   │   ├── Button.test.tsx
│   │   │   │   │   ├── Button.stories.tsx
│   │   │   │   │   ├── index.ts
│   │   │   │   │   └── styles.module.css
│   │   │   │   ├── Card/
│   │   │   │   ├── Input/
│   │   │   │   └── ...                # All UI components
│   │   │   ├── layouts/              # Layout components
│   │   │   ├── forms/                # Form components
│   │   │   ├── charts/               # Chart components
│   │   │   ├── theme/                # Theme configuration
│   │   │   │   ├── tokens.ts         # Design tokens from Figma
│   │   │   │   ├── colors.ts
│   │   │   │   └── typography.ts
│   │   │   └── index.ts              # Package exports
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts            # Build config for UI package
│   │
│   ├── config/                       # Shared Configuration
│   │   ├── eslint/                   # ESLint configs
│   │   ├── typescript/               # TypeScript configs
│   │   ├── tailwind/                 # Tailwind configs
│   │   └── jest/                     # Jest configs
│   │
│   ├── types/                        # Shared TypeScript Types
│   │   ├── src/
│   │   │   ├── user.ts
│   │   │   ├── conversation.ts
│   │   │   ├── assistant.ts
│   │   │   ├── workflow.ts
│   │   │   ├── message.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── utils/                        # Shared Utilities
│   │   ├── src/
│   │   │   ├── date.ts
│   │   │   ├── string.ts
│   │   │   ├── validation.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── sdk/                          # Auto-generated NestJS API Client
│   │   ├── src/
│   │   │   ├── client.ts             # Type-safe API client
│   │   │   ├── types/                 # API types (from backend)
│   │   │   ├── endpoints/            # API endpoint definitions
│   │   │   └── hooks/                 # React Query hooks (optional)
│   │   └── package.json
│   │
│   └── ai/                           # AI Utilities & Adapters
│       ├── src/
│       │   ├── adapters/             # LLM adapter interfaces
│       │   │   ├── openai.ts
│       │   │   ├── anthropic.ts
│       │   │   ├── google.ts
│       │   │   └── grok.ts
│       │   ├── prompts/              # Prompt templates
│       │   ├── models/                # Model registry
│       │   └── utils/                # AI utilities
│       └── package.json
│
├── infra/                            # Infrastructure Configurations
│   ├── supabase/
│   │   ├── migrations/               # SQL migrations
│   │   ├── seeds/                    # Seed data
│   │   └── policies/                 # RLS policies
│   │
│   ├── docker/
│   │   ├── Dockerfile.api
│   │   ├── Dockerfile.web
│   │   └── docker-compose.yml
│   │
│   ├── stripe/
│   │   └── webhooks/                 # Webhook handlers
│   │
│   └── scripts/
│       ├── setup.sh
│       ├── migrate.sh
│       └── deploy.sh
│
├── tools/                            # Development Tools
│   ├── figma-sync/                   # Figma to Production Sync Tool
│   │   ├── src/
│   │   │   ├── detect-changes.ts     # Detect Figma repo changes
│   │   │   ├── sync-components.ts    # Sync components
│   │   │   ├── sync-tokens.ts        # Sync design tokens
│   │   │   └── transformers.ts      # Transform Figma → Production
│   │   └── package.json
│   │
│   └── code-review/                  # Code Review Bot (CodeRabbit-like)
│       ├── src/
│       └── package.json
│
├── ultartech/                        # Documentation (All docs here)
│   ├── ARCHITECTURE.md               # This file
│   ├── DEVELOPER_GUIDE.md            # Developer setup guide
│   ├── MIGRATION_GUIDE.md            # Migration & Figma sync guide
│   ├── TESTING_STRATEGY.md          # Testing guide
│   ├── FIGMA_INTEGRATION.md          # Figma design token sync
│   └── README.md                     # Documentation index
│
├── .env.example                      # Environment variables template
├── .gitignore
├── .eslintrc.js                      # Root ESLint config
├── .prettierrc                       # Prettier config
├── package.json                      # Root package.json
├── pnpm-workspace.yaml               # PNPM workspace config
├── turbo.json                        # Turborepo config
├── tsconfig.json                     # Root TypeScript config
└── README.md                         # Root README
```

---

## Technology Stack

### Frontend (Web)

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS v4.0
- **UI Components**: Custom modular components (from `packages/ui`)
- **State Management**: 
  - React Query (server state)
  - Zustand (client state)
  - React Context (theme, auth)
- **Form Handling**: React Hook Form + Zod
- **Routing**: Next.js App Router
- **Authentication**: Supabase Auth (via `@supabase/auth-helpers-nextjs`)

### Backend

- **Framework**: NestJS 10+
- **Language**: TypeScript 5+
- **Database**: Supabase PostgreSQL
- **ORM**: Prisma (or Supabase client)
- **Authentication**: Supabase Auth (JWT)
- **API Style**: RESTful + GraphQL (optional)
- **Validation**: class-validator + class-transformer
- **Testing**: Jest + Supertest

### Infrastructure

- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (avatars, files)
- **Real-time**: Supabase Realtime (for collaboration)
- **Hosting**: 
  - Web: Vercel
  - API: Railway / Render / AWS
  - Database: Supabase

### Development Tools

- **Monorepo**: Turborepo or PNPM Workspaces
- **Package Manager**: PNPM
- **Build Tool**: Turborepo
- **Linting**: ESLint
- **Formatting**: Prettier
- **Testing**: 
  - Vitest (unit tests)
  - React Testing Library (component tests)
  - Playwright (E2E tests)
- **CI/CD**: GitHub Actions
- **Code Review**: Custom bot (CodeRabbit-like)

### Design & UI

- **Design Tool**: Figma
- **Design Tokens**: JSON exported from Figma
- **Component Library**: Custom (`packages/ui`)
- **Icons**: Lucide React
- **Charts**: Recharts

---

## Application Architecture

### Next.js App Structure (apps/web)

```
apps/web/src/
├── app/                              # Next.js App Router
│   ├── (auth)/                       # Auth route group
│   │   ├── login/
│   │   └── signup/
│   │
│   ├── (main)/                       # Main app route group
│   │   ├── layout.tsx                # Main layout wrapper
│   │   ├── page.tsx                  # Home page
│   │   ├── conversations/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── workflows/
│   │   ├── assistants/
│   │   ├── projects/
│   │   ├── settings/
│   │   └── billing/
│   │
│   ├── api/                          # API Routes (proxies)
│   │   └── webhooks/
│   │
│   ├── globals.css                   # Global styles
│   ├── layout.tsx                    # Root layout
│   └── loading.tsx                   # Loading UI
│
├── components/                       # App-specific components
│   ├── features/                     # Feature components
│   │   ├── conversation/
│   │   ├── assistant/
│   │   └── workflow/
│   │
│   └── layouts/                      # Layout components
│       ├── AppLayout.tsx
│       └── Sidebar.tsx
│
├── lib/                              # Utilities
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── api/
│   └── utils.ts
│
├── hooks/                            # Custom hooks
│   ├── useAuth.ts
│   ├── useConversation.ts
│   └── useAssistant.ts
│
├── contexts/                         # React contexts
│   ├── AuthProvider.tsx
│   └── ThemeProvider.tsx
│
└── middleware.ts                     # Next.js middleware
```

### NestJS API Structure (services/api)

```
services/api/src/
├── auth/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── strategies/
│   │   ├── jwt.strategy.ts
│   │   └── supabase.strategy.ts
│   └── guards/
│       └── jwt-auth.guard.ts
│
├── conversations/
│   ├── conversations.controller.ts
│   ├── conversations.service.ts
│   ├── conversations.module.ts
│   └── dto/
│       ├── create-conversation.dto.ts
│       └── update-conversation.dto.ts
│
├── assistants/
│   ├── assistants.controller.ts
│   ├── assistants.service.ts
│   └── assistants.module.ts
│
├── workflows/
│   ├── workflows.controller.ts
│   ├── workflows.service.ts
│   └── workflows.module.ts
│
├── messages/
│   ├── messages.controller.ts
│   ├── messages.service.ts
│   └── messages.module.ts
│
├── llm/
│   ├── llm.module.ts
│   ├── services/
│   │   ├── openai.service.ts
│   │   ├── anthropic.service.ts
│   │   ├── google.service.ts
│   │   └── grok.service.ts
│   └── llm.service.ts               # Unified LLM service
│
├── common/
│   ├── filters/
│   │   └── http-exception.filter.ts
│   ├── interceptors/
│   ├── decorators/
│   └── pipes/
│
├── config/
│   ├── database.config.ts
│   └── app.config.ts
│
├── app.module.ts                     # Root module
└── main.ts                          # Entry point
```

---

## Modular UI System

### UI Package Structure (`packages/ui`)

The UI package is the **single source of truth** for all UI components across platforms.

```
packages/ui/src/
├── components/                       # Atomic Components
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   ├── Button.stories.tsx
│   │   ├── index.ts
│   │   └── Button.module.css
│   │
│   ├── Input/
│   ├── Card/
│   ├── Dialog/
│   ├── Select/
│   └── ...                           # All UI primitives
│
├── layouts/                          # Layout Components
│   ├── PageLayout/
│   ├── SidebarLayout/
│   └── GridLayout/
│
├── forms/                            # Form Components
│   ├── FormField/
│   ├── FormLabel/
│   └── FormError/
│
├── features/                         # Feature Components
│   ├── AssistantCard/
│   ├── MessageBubble/
│   ├── WorkflowCard/
│   └── ConversationList/
│
├── theme/                            # Theme System
│   ├── tokens.ts                     # Design tokens (from Figma)
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   └── breakpoints.ts
│
└── index.ts                          # Package exports
```

### Component Design Principles

1. **Atomic Design**: Components follow atomic design principles
   - Atoms: Button, Input, Label
   - Molecules: SearchBar, FormField
   - Organisms: AssistantCard, ConversationView
   - Templates: PageLayout, SidebarLayout

2. **Platform Agnostic**: Components work on web and mobile
   ```tsx
   // Web: Uses HTML elements
   <Button onClick={handleClick}>Click</Button>
   
   // Mobile: Uses React Native components
   <Button onPress={handleClick}>Click</Button>
   ```

3. **Design Token Based**: All styles use design tokens
   ```tsx
   import { tokens } from '@thoughtweaver/ui/theme';
   
   const Button = styled.button`
     padding: ${tokens.spacing.md};
     color: ${tokens.color.primary};
   `;
   ```

4. **Type-Safe**: Full TypeScript support
   ```tsx
   interface ButtonProps {
     variant?: 'primary' | 'secondary';
     size?: 'sm' | 'md' | 'lg';
     children: React.ReactNode;
   }
   ```

5. **Tested**: Every component has tests
   ```tsx
   // Button.test.tsx
   describe('Button', () => {
     it('renders correctly', () => {
       render(<Button>Click me</Button>);
       expect(screen.getByText('Click me')).toBeInTheDocument();
     });
   });
   ```

6. **Documented**: Storybook stories for each component
   ```tsx
   // Button.stories.tsx
   export default {
     component: Button,
     title: 'Components/Button',
   };
   ```

### Design Token System

Design tokens are **automatically synced from Figma** and stored in `packages/ui/src/theme/tokens.ts`:

```typescript
// tokens.ts (Generated from Figma)
export const tokens = {
  color: {
    primary: '#7C3AED',      // From Figma
    secondary: '#6366F1',
    background: '#FFFFFF',
    foreground: '#0F172A',
    // ... all colors from Figma
  },
  spacing: {
    xs: '0.25rem',           // 4px
    sm: '0.5rem',            // 8px
    md: '1rem',              // 16px
    lg: '1.5rem',            // 24px
    // ... all spacing from Figma
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      // ... all font sizes from Figma
    },
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
};
```

---

## Backend Architecture

### NestJS Module Structure

Each feature has its own module following NestJS best practices:

```typescript
// Example: conversations.module.ts
@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, Message]),
    SupabaseModule,
    LLMModule,
  ],
  controllers: [ConversationsController],
  providers: [ConversationsService, ConversationsRepository],
  exports: [ConversationsService],
})
export class ConversationsModule {}
```

### Service Layer Pattern

```typescript
// conversations.service.ts
@Injectable()
export class ConversationsService {
  constructor(
    private readonly repository: ConversationsRepository,
    private readonly llmService: LLMService,
    private readonly supabase: SupabaseClient,
  ) {}

  async createConversation(dto: CreateConversationDto, userId: string) {
    // Business logic here
    const conversation = await this.repository.create({
      ...dto,
      userId,
    });
    
    // Process workflow steps
    if (dto.workflowId) {
      await this.executeWorkflow(conversation.id, dto.workflowId);
    }
    
    return conversation;
  }
}
```

### LLM Integration Pattern

```typescript
// llm.service.ts
@Injectable()
export class LLMService {
  constructor(
    private readonly openaiService: OpenAIService,
    private readonly anthropicService: AnthropicService,
    private readonly googleService: GoogleService,
    private readonly grokService: GrokService,
  ) {}

  async generateResponse(
    model: LLMModel,
    prompt: string,
    systemPrompt: string,
    context?: string,
  ): Promise<string> {
    const provider = this.getProvider(model.provider);
    
    return provider.generate({
      model: model.id,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `${context}\n\n${prompt}` },
      ],
    });
  }
}
```

---

## Database Schema

### Supabase PostgreSQL Schema

```sql
-- Users (managed by Supabase Auth)
-- Extended via profiles table

-- Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT,
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Conversations
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  prompt TEXT NOT NULL,
  workflow_id TEXT,
  selected_assistants TEXT[] DEFAULT '{}',
  selected_llm TEXT DEFAULT 'gpt-5-mini',
  context_id UUID REFERENCES contexts(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  assistant_id TEXT,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  token_count INTEGER,
  model_used TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Assistants
CREATE TABLE assistants (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  color TEXT,
  system_prompt TEXT NOT NULL,
  personality JSONB NOT NULL,
  is_custom BOOLEAN DEFAULT false,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Workflows
CREATE TABLE workflows (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  steps JSONB NOT NULL,
  is_custom BOOLEAN DEFAULT false,
  is_default BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Contexts
CREATE TABLE contexts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT CHECK (type IN ('user', 'system', 'project', 'team')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Teams
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Team Members
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('owner', 'admin', 'member')),
  status TEXT CHECK (status IN ('active', 'pending')),
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  plan TEXT NOT NULL CHECK (plan IN ('free', 'pro')),
  status TEXT CHECK (status IN ('active', 'canceled', 'past_due')),
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Usage Tracking
CREATE TABLE usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
  metric_type TEXT NOT NULL CHECK (metric_type IN ('conversation', 'message', 'token')),
  count INTEGER NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE assistants ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE contexts ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Example RLS Policy
CREATE POLICY "Users can view own conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own conversations"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations"
  ON conversations FOR UPDATE
  USING (auth.uid() = user_id);
```

---

## API Design

### RESTful API Endpoints

```
# Authentication
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/me

# Conversations
GET    /api/conversations
POST   /api/conversations
GET    /api/conversations/:id
PUT    /api/conversations/:id
DELETE /api/conversations/:id
POST   /api/conversations/:id/messages

# Assistants
GET    /api/assistants
POST   /api/assistants
GET    /api/assistants/:id
PUT    /api/assistants/:id
DELETE /api/assistants/:id

# Workflows
GET    /api/workflows
POST   /api/workflows
GET    /api/workflows/:id
PUT    /api/workflows/:id
DELETE /api/workflows/:id

# Projects
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id

# Contexts
GET    /api/contexts
POST   /api/contexts
GET    /api/contexts/:id
PUT    /api/contexts/:id
DELETE /api/contexts/:id

# LLM
POST   /api/llm/generate
POST   /api/llm/improve-prompt
GET    /api/llm/models

# Billing
GET    /api/billing/subscription
POST   /api/billing/checkout
POST   /api/billing/webhook
GET    /api/billing/usage
```

### API Response Format

```typescript
// Success Response
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2025-11-03T10:00:00Z"
  }
}

// Error Response
{
  "success": false,
  "error": {
    "code": "CONVERSATION_NOT_FOUND",
    "message": "Conversation not found",
    "details": { ... }
  },
  "meta": {
    "timestamp": "2025-11-03T10:00:00Z"
  }
}
```

---

## Figma Integration Strategy

### Overview

Figma designs are automatically synced to code via a custom sync tool. This ensures:
1. **Design tokens** (colors, spacing, typography) stay in sync
2. **Component specifications** match designs
3. **Visual regression testing** detects design drift

### Figma Sync Tool (`tools/figma-sync`)

```typescript
// tools/figma-sync/src/sync-tokens.ts
import { FigmaApi } from '@figma/api';
import { writeFileSync } from 'fs';

async function syncDesignTokens() {
  const figma = new FigmaApi(process.env.FIGMA_TOKEN);
  const file = await figma.getFile(process.env.FIGMA_FILE_KEY);
  
  // Extract design tokens from Figma
  const tokens = extractTokens(file);
  
  // Write to packages/ui/src/theme/tokens.ts
  writeFileSync(
    'packages/ui/src/theme/tokens.ts',
    generateTokensFile(tokens)
  );
}
```

### Sync Workflow

1. **Designer updates Figma** → Changes are made in Figma
2. **GitHub Action triggers** → `figma-sync.yml` runs on schedule or manual trigger
3. **Sync tool extracts** → Design tokens and component specs extracted
4. **Code updated** → Tokens and components updated in `packages/ui`
5. **PR created** → Automated PR with changes
6. **Developer reviews** → Developer reviews and merges PR
7. **Tests run** → Visual regression tests verify changes

### Design Token Mapping

```typescript
// Figma → Code mapping
Figma Variable "Primary/500" → tokens.color.primary
Figma Variable "Spacing/16" → tokens.spacing.md
Figma Font "Inter/Regular/16" → tokens.typography.body
```

### Component Spec Sync

```typescript
// Extract component specs from Figma
interface ComponentSpec {
  name: string;
  props: ComponentProp[];
  styles: ComponentStyle[];
  variants: ComponentVariant[];
}

// Generate component skeleton
function generateComponent(spec: ComponentSpec) {
  return `
    export function ${spec.name}({ ...props }: ${spec.name}Props) {
      return (
        <div className={styles.container}>
          {/* Generated from Figma */}
        </div>
      );
    }
  `;
}
```

### Visual Regression Testing

```typescript
// Visual regression test using Chromatic/Percy
import { visualTest } from '@thoughtweaver/ui/test-utils';

visualTest('Button', {
  variants: ['primary', 'secondary'],
  states: ['default', 'hover', 'disabled'],
});
```

---

## Testing Strategy

### Testing Pyramid

```
        /\
       /E2E\         10% - End-to-End Tests (Playwright)
      /------\
     /INTEGRATION\   20% - Integration Tests (Jest)
    /------------\
   /    UNIT      \  70% - Unit Tests (Vitest)
  /----------------\
```

### Unit Tests

**Location**: Co-located with components
**Framework**: Vitest
**Coverage Target**: 80%+

```typescript
// packages/ui/src/components/Button/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    screen.getByText('Click').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Integration Tests

**Location**: `services/api/test/`
**Framework**: Jest + Supertest
**Coverage Target**: 70%+

```typescript
// services/api/test/conversations.e2e-spec.ts
describe('Conversations API', () => {
  it('should create a conversation', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/conversations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Conversation',
        prompt: 'Test prompt',
      });
    
    expect(response.status).toBe(201);
    expect(response.body.data.title).toBe('Test Conversation');
  });
});
```

### E2E Tests

**Location**: `apps/web/e2e/`
**Framework**: Playwright
**Coverage Target**: Critical user flows

```typescript
// apps/web/e2e/conversation.spec.ts
test('user can create and view conversation', async ({ page }) => {
  await page.goto('/');
  await page.fill('[data-testid="prompt-input"]', 'Test prompt');
  await page.click('[data-testid="start-weaving"]');
  
  await expect(page.locator('[data-testid="conversation-title"]'))
    .toContainText('Test prompt');
});
```

### Visual Regression Tests

**Framework**: Chromatic / Percy
**Coverage**: All UI components

```typescript
// Visual regression test
import { visualTest } from '@thoughtweaver/ui/test-utils';

visualTest('Button', {
  variants: ['primary', 'secondary'],
  states: ['default', 'hover', 'disabled'],
});
```

### Code Review Bot (CodeRabbit-like)

**Location**: `tools/code-review/`
**Features**:
- Automated code review on PRs
- Security vulnerability scanning
- Performance analysis
- Best practice suggestions
- Test coverage reports

```typescript
// tools/code-review/src/reviewer.ts
export class CodeReviewer {
  async reviewPR(pr: PullRequest) {
    const issues = [];
    
    // Security scan
    issues.push(...await this.scanSecurity(pr));
    
    // Performance analysis
    issues.push(...await this.analyzePerformance(pr));
    
    // Test coverage
    issues.push(...await this.checkTestCoverage(pr));
    
    return issues;
  }
}
```

---

## Deployment Architecture

### Environments

1. **Development**: Local development
2. **Staging**: Preview deployments (Vercel preview)
3. **Production**: Live production environment

### Deployment Flow

```
Developer pushes to branch
  ↓
GitHub Actions CI runs
  ↓
Tests pass → Build artifacts
  ↓
Deploy to Staging (Vercel Preview)
  ↓
E2E tests run on Staging
  ↓
Merge to main → Deploy to Production
```

### Infrastructure

```
┌─────────────────────────────────────────┐
│           Vercel (Frontend)             │
│  - Next.js Web App                      │
│  - Edge Functions                       │
│  - CDN                                  │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Railway / Render (API)          │
│  - NestJS API Service                   │
│  - Background Workers                   │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│           Supabase                      │
│  - PostgreSQL Database                  │
│  - Authentication                       │
│  - Storage (Files)                      │
│  - Realtime (WebSockets)               │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│      External APIs                      │
│  - OpenAI                               │
│  - Anthropic                            │
│  - Google AI                             │
│  - Stripe                               │
└─────────────────────────────────────────┘
```

---

## Migration Strategy

### Phase 1: Setup Monorepo Structure

1. Initialize monorepo with Turborepo/PNPM
2. Create package structure
3. Set up shared packages (types, utils, config)
4. Create UI package skeleton

### Phase 2: Migrate UI Components

1. Extract components from current React app
2. Refactor to use design tokens
3. Add tests and Storybook stories
4. Create component library package

### Phase 3: Set Up Backend

1. Initialize NestJS API service
2. Set up Supabase integration
3. Create database schema
4. Implement authentication module

### Phase 4: Migrate Frontend to Next.js

1. Create Next.js app structure
2. Migrate pages to App Router
3. Integrate UI package
4. Connect to backend API

### Phase 5: Implement Figma Sync

1. Create Figma sync tool
2. Set up design token extraction
3. Configure GitHub Actions
4. Test sync workflow

### Phase 6: Testing & CI/CD

1. Set up testing infrastructure
2. Configure CI/CD pipelines
3. Set up code review bot
4. Deploy to staging

### Phase 7: Production Deployment

1. Final testing
2. Production deployment
3. Monitoring setup
4. Documentation

---

## Next Steps

1. Review and approve architecture
2. Set up monorepo structure
3. Begin Phase 1 migration
4. Set up Figma sync tool
5. Configure CI/CD pipelines

---

**Document Maintained By**: Architecture Team  
**Last Updated**: November 2025  
**Related Documents**: 
- [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)
- [FIGMA_INTEGRATION.md](./FIGMA_INTEGRATION.md)
- [TESTING_STRATEGY.md](./TESTING_STRATEGY.md)

