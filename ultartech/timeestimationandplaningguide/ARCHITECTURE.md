# Thoughtweaver - Complete Architecture Definition
## Production-Ready Monorepo Architecture

**Document Date:** November 2025  
**Status:** Architecture Definition for Phase 1 Implementation  
**Based On:** PRD Requirements + Current Monorepo Structure

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Monorepo Structure](#monorepo-structure)
3. [Technology Stack](#technology-stack)
4. [Application Architecture](#application-architecture)
5. [Backend Architecture (NestJS)](#backend-architecture-nestjs)
6. [Frontend Architecture (Next.js)](#frontend-architecture-nextjs)
7. [Database Architecture (Supabase)](#database-architecture-supabase)
8. [AI Layer Architecture](#ai-layer-architecture)
9. [Authentication & Authorization](#authentication--authorization)
10. [API Design](#api-design)
11. [Data Flow](#data-flow)
12. [Deployment Architecture](#deployment-architecture)
13. [Integration Points](#integration-points)

---

## System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer (Next.js)                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Next.js 14+ App Router                               │  │
│  │  - Server Components                                  │  │
│  │  - Client Components                                  │  │
│  │  - API Routes (Proxies)                               │  │
│  │  - Middleware (Auth)                                  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                 API Layer (NestJS)                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  NestJS 10+ Backend                                   │  │
│  │  - REST API Endpoints                                 │  │
│  │  - Authentication Guards                              │  │
│  │  - Business Logic                                     │  │
│  │  - AI Orchestration                                   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
        ┌─────────────────────────────────────────┐
        │      Data & Auth Layer (Supabase)        │
        │  ┌──────────────┐  ┌─────────────────┐  │
        │  │  PostgreSQL  │  │  Auth Service   │  │
        │  │  Database    │  │  (OAuth)        │  │
        │  └──────────────┘  └─────────────────┘  │
        │  ┌──────────────┐  ┌─────────────────┐  │
        │  │  Storage     │  │  Realtime       │  │
        │  │  (Files)     │  │  (WebSockets)   │  │
        │  └──────────────┘  └─────────────────┘  │
        └─────────────────────────────────────────┘
                            ↓
        ┌─────────────────────────────────────────┐
        │      External AI Providers              │
        │  - OpenAI (GPT-5, GPT-5 mini)           │
        │  - Anthropic (Claude Sonnet/Haiku 4.5) │
        │  - Google (Gemini 2.5 Pro/Flash)        │
        │  - Grok (Grok-4)                        │
        └─────────────────────────────────────────┘
```

### Architecture Principles

1. **Separation of Concerns**: Clear boundaries between frontend, backend, and data layers
2. **API-First Design**: Backend serves all clients (web, mobile future)
3. **Type Safety**: Shared TypeScript types across all layers
4. **Scalability**: Monorepo structure supports multiple apps and packages
5. **Security**: Authentication at API layer, RLS at database layer
6. **Real-time Ready**: Supabase Realtime for future collaboration features

---

## Monorepo Structure

### Directory Organization

```
thoughtweaver-monorepo/
├── apps/
│   ├── webnextjs/          # Next.js Frontend (Production)
│   │   ├── app/            # Next.js App Router
│   │   ├── components/     # Next.js-specific components
│   │   ├── lib/            # Utilities & API clients
│   │   └── public/         # Static assets
│   │
│   └── api/                # NestJS Backend API
│       ├── src/
│       │   ├── ai/         # AI Layer (LLM Integration)
│       │   ├── auth/       # Authentication
│       │   ├── conversations/  # Conversations CRUD
│       │   ├── messages/   # Messages + AI Generation
│       │   ├── assistants/ # Assistants CRUD
│       │   ├── workflows/  # Workflows CRUD
│       │   ├── projects/   # Projects CRUD
│       │   ├── teams/      # Teams CRUD
│       │   ├── users/      # User Management
│       │   ├── billing/    # Billing & Subscriptions
│       │   └── supabase/   # Supabase Integration
│       └── test/           # E2E Tests
│
├── packages/
│   ├── ui/                 # Shared UI Component Library
│   ├── types/              # Shared TypeScript Types
│   ├── config/             # Shared Configuration
│   ├── utils/              # Shared Utilities
│   ├── sdk/                # API Client SDK (Auto-generated)
│   └── ai/                 # AI Utilities (if needed)
│
├── infra/
│   ├── supabase/
│   │   ├── migrations/     # Database Migrations
│   │   └── policies/      # RLS Policies
│   └── docker/            # Docker Configs
│
└── ultartech/             # Documentation
    └── timeestimationandplaningguide/
        ├── ARCHITECTURE.md
        └── TIMELINE.md
```

---

## Technology Stack

### Frontend (Next.js)

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS v4.0
- **UI Components**: shadcn/ui + Custom components from `packages/ui`
- **State Management**: 
  - React Server Components (default)
  - React Query (server state)
  - Zustand (client state)
- **Form Handling**: React Hook Form + Zod
- **Authentication**: Supabase Auth (via `@supabase/auth-helpers-nextjs`)
- **API Client**: Auto-generated SDK from `packages/sdk`

### Backend (NestJS)

- **Framework**: NestJS 10+
- **Language**: TypeScript 5+
- **Database**: Supabase PostgreSQL
- **ORM**: Supabase Client (direct queries)
- **Authentication**: Supabase Auth (JWT validation)
- **API Style**: RESTful
- **Validation**: class-validator + class-transformer
- **Testing**: Jest + Supertest

### Infrastructure

- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth (OAuth: Google, Apple)
- **Storage**: Supabase Storage (avatars, file attachments)
- **Real-time**: Supabase Realtime (for future collaboration)
- **Hosting**: 
  - Frontend: Vercel (or similar)
  - Backend: Railway / Render / AWS
  - Database: Supabase (managed)

### AI Integration

- **Multi-Provider Support**: Direct integration with each LLM provider
- **Providers**: OpenAI, Anthropic, Google AI, Grok
- **Abstraction Layer**: Unified adapter interface in `apps/api/src/ai/`
- **Cost Tracking**: Per-model cost calculation
- **Rate Limiting**: Per-provider rate limits

---

## Application Architecture

### Next.js App Structure (apps/webnextjs)

```
apps/webnextjs/
├── app/
│   ├── (auth)/              # Auth route group
│   │   ├── login/
│   │   └── signup/
│   │
│   ├── (main)/              # Main app route group
│   │   ├── layout.tsx       # Main layout wrapper
│   │   ├── page.tsx         # Home page
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
│   ├── api/                 # API Routes (proxies to NestJS)
│   │   └── webhooks/
│   │
│   ├── globals.css
│   ├── layout.tsx           # Root layout
│   └── loading.tsx
│
├── components/
│   ├── features/            # Feature components
│   │   ├── conversation/
│   │   ├── assistant/
│   │   └── workflow/
│   │
│   └── layouts/             # Layout components
│       ├── AppLayout.tsx
│       └── Sidebar.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts        # Client-side Supabase
│   │   └── server.ts        # Server-side Supabase
│   ├── api/
│   │   └── client.ts       # API client (uses packages/sdk)
│   └── utils.ts
│
└── middleware.ts            # Next.js middleware (auth)
```

### Key Next.js Features

- **Server Components**: Default for data fetching
- **Client Components**: Marked with `'use client'` for interactivity
- **API Routes**: Proxies to NestJS backend (or direct Supabase calls)
- **Middleware**: Authentication checks, redirects
- **Layouts**: Nested layouts for shared UI
- **Loading States**: Built-in loading.tsx for Suspense boundaries

---

## Backend Architecture (NestJS)

### Module Structure

```
apps/api/src/
├── main.ts                  # Entry point (port 4000, /api prefix)
├── app.module.ts            # Root module
│
├── ai/                      # AI Layer
│   ├── ai.module.ts
│   ├── adapters/
│   │   ├── ai-adapter.interface.ts
│   │   └── ai-adapter.service.ts    # Unified adapter
│   ├── providers/
│   │   ├── openai/         # OpenAI provider
│   │   ├── anthropic/      # Anthropic provider
│   │   ├── google/         # Google provider
│   │   └── grok/           # Grok provider
│   ├── services/
│   │   └── conversation-ai.service.ts  # AI orchestration
│   ├── models/
│   │   └── model-registry.service.ts    # Model registry
│   └── utils/
│       └── cost-calculator.service.ts
│
├── auth/                    # Authentication
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   └── strategies/
│       └── supabase-jwt.strategy.ts
│
├── conversations/          # Conversations CRUD
│   ├── conversations.controller.ts
│   ├── conversations.service.ts
│   ├── conversations.repository.ts
│   └── dto/
│
├── messages/               # Messages + AI Generation
│   ├── messages.controller.ts
│   ├── messages.service.ts
│   ├── messages.repository.ts
│   └── dto/
│
├── assistants/            # Assistants CRUD
│   ├── assistants.controller.ts
│   ├── assistants.service.ts
│   └── dto/
│
├── workflows/             # Workflows CRUD
│   ├── workflows.controller.ts
│   ├── workflows.service.ts
│   └── dto/
│
├── projects/              # Projects CRUD
│   ├── projects.controller.ts
│   ├── projects.service.ts
│   └── dto/
│
├── teams/                 # Teams + Members
│   ├── teams.controller.ts
│   ├── teams.service.ts
│   └── dto/
│
├── users/                 # User Management
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── dto/
│
├── billing/               # Billing & Subscriptions
│   ├── billing.controller.ts
│   ├── billing.service.ts
│   └── stripe/
│       └── stripe.service.ts
│
├── supabase/              # Supabase Integration
│   ├── supabase.service.ts
│   └── supabase.module.ts
│
└── common/                # Shared utilities
    ├── guards/
    │   └── jwt-auth.guard.ts
    ├── decorators/
    │   └── current-user.decorator.ts
    ├── filters/
    │   └── all-exceptions.filter.ts
    └── interceptors/
        └── transform.interceptor.ts
```

### Service Layer Pattern

Each feature module follows NestJS best practices:

```typescript
// Example: conversations.module.ts
@Module({
  imports: [
    SupabaseModule,
    AIModule,
    MessagesModule,
  ],
  controllers: [ConversationsController],
  providers: [
    ConversationsService,
    ConversationsRepository,
  ],
  exports: [ConversationsService],
})
export class ConversationsModule {}
```

### Repository Pattern

Data access is abstracted through repositories:

```typescript
// conversations.repository.ts
@Injectable()
export class ConversationsRepository {
  constructor(private readonly supabase: SupabaseService) {}

  async create(data: CreateConversationDto, userId: string) {
    // Direct Supabase queries
    const { data: conversation, error } = await this.supabase
      .from('conversations')
      .insert({ ...data, user_id: userId })
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return conversation;
  }
}
```

---

## Frontend Architecture (Next.js)

### Component Hierarchy

```
Root Layout (app/layout.tsx)
├── AuthProvider (Supabase Auth)
├── QueryClientProvider (React Query)
└── Main Layout (app/(main)/layout.tsx)
    ├── Sidebar (Navigation)
    └── Page Content
        ├── HomePage
        ├── ConversationView
        ├── WorkflowBuilder
        ├── AIAssistantsPage
        └── ... (other pages)
```

### Data Fetching Strategy

1. **Server Components**: Default for initial data loading
   ```tsx
   // app/conversations/page.tsx
   export default async function ConversationsPage() {
     const conversations = await getConversations(); // Server-side
     return <ConversationsList conversations={conversations} />;
   }
   ```

2. **React Query**: For client-side data fetching and mutations
   ```tsx
   // components/conversation/ConversationView.tsx
   'use client';
   export function ConversationView({ id }: { id: string }) {
     const { data } = useQuery(['conversation', id], () => 
       api.conversations.getById(id)
     );
   }
   ```

3. **Server Actions**: For form submissions (Next.js 14+)
   ```tsx
   // app/conversations/actions.ts
   'use server';
   export async function createConversation(formData: FormData) {
     // Server-side action
   }
   ```

### State Management

- **Server State**: React Query (conversations, messages, etc.)
- **Client State**: Zustand (UI state, selections)
- **Auth State**: Supabase Auth Context
- **Form State**: React Hook Form

---

## Database Architecture (Supabase)

### Schema Overview

```sql
-- Core Tables
profiles              # User profiles (extends auth.users)
conversations         # Conversation threads
messages              # Individual messages
assistants            # AI assistants (default + custom)
workflows             # Workflow definitions
contexts              # Context information
projects              # Project organization
teams                 # Team workspaces
team_members          # Team membership
subscriptions         # Billing subscriptions
usage_tracking        # Usage metrics
```

### Key Relationships

```
profiles (1) ──→ (many) conversations
conversations (1) ──→ (many) messages
conversations (many) ──→ (1) workflow
conversations (many) ──→ (many) assistants (via selected_assistants array)
profiles (1) ──→ (many) assistants (custom assistants)
profiles (1) ──→ (many) workflows (custom workflows)
profiles (1) ──→ (many) projects
projects (1) ──→ (many) conversations
teams (1) ──→ (many) team_members
team_members (many) ──→ (1) profiles
```

### Row Level Security (RLS)

All tables have RLS enabled with policies:

```sql
-- Example: Conversations RLS
CREATE POLICY "Users can view own conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own conversations"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

---

## AI Layer Architecture

### Multi-Provider Architecture

```
ConversationAIService
    ↓
AIAdapterService (Unified Interface)
    ↓
    ├── OpenAIProvider
    ├── AnthropicProvider
    ├── GoogleProvider
    └── GrokProvider
```

### AI Adapter Interface

```typescript
interface AIAdapter {
  generate(options: GenerateOptions): Promise<LLMResponse>;
  stream(options: GenerateOptions): AsyncGenerator<string>;
}
```

### Model Registry

Centralized model configuration:

```typescript
const MODELS = {
  'gpt-5': { provider: 'openai', cost: {...} },
  'gpt-5-mini': { provider: 'openai', cost: {...} },
  'claude-sonnet-4.5': { provider: 'anthropic', cost: {...} },
  // ... etc
};
```

### Cost Calculation

- Token counting per request
- Cost per token (from model registry)
- Usage tracking in database
- Billing integration

---

## Authentication & Authorization

### Authentication Flow

1. **User clicks "Sign in with Google"** (Next.js)
2. **Redirects to Supabase Auth** (`/auth/v1/authorize`)
3. **Google OAuth** (handled by Supabase)
4. **Callback to Next.js** (`/auth/callback`)
5. **Supabase creates session** (JWT token)
6. **Next.js stores session** (cookies)
7. **API requests include JWT** (Authorization header)

### Authorization

- **API Level**: JWT Guard validates token
- **Database Level**: RLS policies enforce data access
- **Application Level**: Role-based checks (owner, admin, member)

### Token Flow

```
Next.js (Client)
    ↓ (includes JWT in Authorization header)
NestJS API
    ↓ (validates JWT with Supabase)
Supabase Auth
    ↓ (returns user info)
NestJS API (proceeds with request)
```

---

## API Design

### RESTful Endpoints

```
# Authentication
GET    /api/auth/me
PUT    /api/auth/profile

# Conversations
GET    /api/conversations
POST   /api/conversations
GET    /api/conversations/:id
PUT    /api/conversations/:id
DELETE /api/conversations/:id

# Messages
GET    /api/conversations/:id/messages
POST   /api/conversations/:id/messages
POST   /api/conversations/:id/messages/generate

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

# Teams
GET    /api/teams
POST   /api/teams
GET    /api/teams/:id/members
POST   /api/teams/:id/members

# Billing
GET    /api/billing/subscription
POST   /api/billing/checkout
GET    /api/billing/usage
```

### Response Format

```typescript
// Success Response
{
  success: true,
  data: { ... },
  meta: {
    timestamp: "2025-11-06T12:00:00Z"
  }
}

// Error Response
{
  success: false,
  error: {
    code: "CONVERSATION_NOT_FOUND",
    message: "Conversation not found",
    details: { ... }
  },
  meta: {
    timestamp: "2025-11-06T12:00:00Z"
  }
}
```

---

## Data Flow

### Creating a Conversation

```
1. User fills prompt on HomePage (Next.js)
   ↓
2. User selects assistants, workflow, LLM
   ↓
3. User clicks "Start weaving"
   ↓
4. Next.js calls: POST /api/conversations (NestJS)
   ↓
5. NestJS validates JWT, creates conversation in Supabase
   ↓
6. If workflow selected, execute workflow steps
   ↓
7. For each selected assistant:
   - Build prompt with system prompt + context
   - Call AIAdapterService.generate()
   - Save message to database
   ↓
8. Return conversation with messages to Next.js
   ↓
9. Next.js displays conversation view
```

### Generating AI Response

```
1. User sends message in ConversationView
   ↓
2. Next.js calls: POST /api/conversations/:id/messages/generate
   ↓
3. NestJS:
   - Loads conversation history
   - Loads assistant system prompts
   - Loads context
   - Builds prompt
   ↓
4. Calls AIAdapterService.generate() with selected model
   ↓
5. AI Provider returns response
   ↓
6. NestJS:
   - Saves message to database
   - Tracks token usage
   - Updates usage_tracking table
   ↓
7. Returns message to Next.js
   ↓
8. Next.js displays message in conversation
```

---

## Deployment Architecture

### Production Environment

```
┌─────────────────────────────────────────┐
│         Vercel (Frontend)               │
│  - Next.js Web App                      │
│  - Edge Functions (API routes)         │
│  - CDN (Static assets)                  │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│    Railway / Render (Backend)           │
│  - NestJS API Service                   │
│  - Port 4000                           │
│  - Environment variables                │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Supabase                        │
│  - PostgreSQL Database                  │
│  - Authentication Service               │
│  - Storage (Files)                      │
│  - Realtime (WebSockets)               │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│      External APIs                     │
│  - OpenAI                               │
│  - Anthropic                            │
│  - Google AI                             │
│  - Grok                                  │
│  - Stripe (Billing)                     │
└─────────────────────────────────────────┘
```

### Environment Variables

**Next.js (Vercel)**:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

**NestJS (Railway/Render)**:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `GOOGLE_AI_API_KEY`
- `GROK_API_KEY`
- `STRIPE_SECRET_KEY`
- `JWT_SECRET`

---

## Integration Points

### Next.js ↔ NestJS

- **API Calls**: Next.js uses `packages/sdk` to call NestJS API
- **Authentication**: JWT token passed in Authorization header
- **Error Handling**: Consistent error format across layers

### NestJS ↔ Supabase

- **Database**: Direct Supabase client queries
- **Auth**: JWT validation via Supabase Auth
- **Storage**: File uploads via Supabase Storage
- **Realtime**: WebSocket subscriptions (future)

### NestJS ↔ LLM Providers

- **Direct API Calls**: Each provider's official SDK
- **Rate Limiting**: Per-provider limits
- **Error Handling**: Provider-specific error handling
- **Cost Tracking**: Token counting and cost calculation

### Next.js ↔ Supabase (Direct)

- **Auth**: Supabase Auth helpers for session management
- **Realtime**: Direct subscriptions (for real-time updates)
- **Storage**: Direct file uploads (if needed)

---

## Security Considerations

### Authentication Security

- JWT tokens with expiration
- Refresh token rotation
- Secure cookie storage (httpOnly, secure)
- OAuth provider validation

### API Security

- Rate limiting per user/IP
- Input validation (class-validator)
- SQL injection prevention (parameterized queries)
- CORS configuration

### Database Security

- Row Level Security (RLS) on all tables
- Encrypted connections (SSL)
- Service role key only on backend
- Anon key only on frontend

### Data Privacy

- User data isolation (RLS)
- GDPR compliance features
- Data export capability
- Account deletion with data cleanup

---

## Scalability Considerations

### Horizontal Scaling

- **Frontend**: Stateless, scales via CDN
- **Backend**: Stateless API, scales horizontally
- **Database**: Supabase handles scaling

### Caching Strategy

- **Frontend**: React Query caching
- **Backend**: Redis (future) for session storage
- **Database**: Supabase connection pooling

### Performance Optimization

- **Database**: Indexed queries, connection pooling
- **API**: Response compression, pagination
- **Frontend**: Code splitting, lazy loading, image optimization

---

## Monitoring & Observability

### Logging

- **Backend**: Structured logging (Winston/Pino)
- **Frontend**: Error boundary logging
- **API**: Request/response logging

### Metrics

- **API**: Response times, error rates
- **Database**: Query performance
- **AI**: Token usage, cost tracking

### Error Tracking

- **Backend**: Sentry integration
- **Frontend**: Sentry error boundaries
- **Database**: Supabase error logs

---

## Future Enhancements

### Phase 2 Features

- Team collaboration (real-time)
- Advanced workflows (parallel steps, conditions)
- Mobile app (React Native)
- Desktop app (Electron)

### Phase 3 Features

- Enterprise SSO
- Custom LLM deployments
- Advanced analytics
- API platform

---

**Document Maintained By**: Architecture Team  
**Last Updated**: November 2025  
**Related Documents**: 
- [TIMELINE.md](./TIMELINE.md) - Implementation Timeline
- [DEVELOPMENT_CHECKLIST.md](../DEVELOPMENT_CHECKLIST.md) - Feature Checklist

