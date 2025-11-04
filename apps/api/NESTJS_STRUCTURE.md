# NestJS API Structure Guide
## Complete Structure for Thoughtweaver API

This document outlines the complete NestJS API structure that integrates with:
- **Supabase** (PostgreSQL, Authentication, Storage, Realtime)
- **External APIs** (OpenAI, Anthropic, Google AI, Stripe)
- **Deployment**: Railway / Render

---

## 📁 Complete Directory Structure

```
apps/api/src/
├── main.ts                          # Application entry point
├── app.module.ts                    # Root application module
│
├── config/                          # Configuration
│   ├── app.config.ts               # App configuration
│   ├── database.config.ts          # Supabase/PostgreSQL config
│   ├── ai.config.ts                # AI providers config
│   ├── stripe.config.ts            # Stripe config
│   └── config.module.ts            # Configuration module
│
├── common/                          # Shared utilities & decorators
│   ├── decorators/
│   │   ├── public.decorator.ts     # Public endpoint decorator
│   │   ├── current-user.decorator.ts
│   │   └── roles.decorator.ts
│   ├── filters/
│   │   ├── http-exception.filter.ts
│   │   └── all-exceptions.filter.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   ├── interceptors/
│   │   ├── logging.interceptor.ts
│   │   └── transform.interceptor.ts
│   ├── pipes/
│   │   └── validation.pipe.ts
│   └── dto/
│       └── pagination.dto.ts
│
├── supabase/                        # Supabase Integration Module
│   ├── supabase.module.ts          # Supabase module
│   ├── supabase.service.ts         # Main Supabase client service
│   │
│   ├── database/                   # Database services
│   │   ├── database.service.ts     # PostgreSQL queries
│   │   └── database.module.ts
│   │
│   ├── auth/                       # Authentication services
│   │   ├── auth.service.ts         # Supabase Auth wrapper
│   │   └── auth.module.ts
│   │
│   ├── storage/                    # Storage services
│   │   ├── storage.service.ts      # File upload/download
│   │   └── storage.module.ts
│   │
│   └── realtime/                   # Realtime services
│       ├── realtime.service.ts     # WebSocket subscriptions
│       └── realtime.module.ts
│
├── ai/                              # AI Providers Module
│   ├── ai.module.ts                # Root AI module
│   ├── ai.service.ts               # AI orchestrator service
│   │
│   ├── providers/                  # Individual AI providers
│   │   ├── openai/
│   │   │   ├── openai.service.ts
│   │   │   ├── openai.module.ts
│   │   │   └── openai.types.ts
│   │   ├── anthropic/
│   │   │   ├── anthropic.service.ts
│   │   │   ├── anthropic.module.ts
│   │   │   └── anthropic.types.ts
│   │   ├── google/
│   │   │   ├── google.service.ts
│   │   │   ├── google.module.ts
│   │   │   └── google.types.ts
│   │   └── grok/
│   │       ├── grok.service.ts
│   │       ├── grok.module.ts
│   │       └── grok.types.ts
│   │
│   ├── adapters/                   # Unified AI adapter
│   │   ├── ai-adapter.interface.ts
│   │   └── ai-adapter.service.ts
│   │
│   ├── prompts/                    # Prompt templates
│   │   ├── prompt.service.ts
│   │   └── templates/
│   │
│   └── models/                     # Model registry
│       └── model-registry.service.ts
│
├── stripe/                          # Stripe Integration Module
│   ├── stripe.module.ts
│   ├── stripe.service.ts           # Stripe API wrapper
│   ├── stripe.controller.ts        # Webhook handler
│   ├── webhooks/
│   │   ├── webhook.service.ts
│   │   └── webhook-handler.service.ts
│   └── dto/
│       └── create-subscription.dto.ts
│
├── auth/                            # Authentication Module
│   ├── auth.module.ts
│   ├── auth.controller.ts          # Auth endpoints
│   ├── auth.service.ts             # Auth business logic
│   ├── strategies/
│   │   └── supabase-jwt.strategy.ts
│   └── dto/
│       ├── login.dto.ts
│       └── register.dto.ts
│
├── users/                           # User Management Module
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── users.repository.ts         # Supabase queries
│   └── dto/
│       ├── create-user.dto.ts
│       └── update-user.dto.ts
│
├── conversations/                   # Conversations Module
│   ├── conversations.module.ts
│   ├── conversations.controller.ts
│   ├── conversations.service.ts
│   ├── conversations.repository.ts
│   ├── dto/
│   │   ├── create-conversation.dto.ts
│   │   └── update-conversation.dto.ts
│   └── entities/
│       └── conversation.entity.ts
│
├── assistants/                      # AI Assistants Module
│   ├── assistants.module.ts
│   ├── assistants.controller.ts
│   ├── assistants.service.ts
│   ├── assistants.repository.ts
│   └── dto/
│       ├── create-assistant.dto.ts
│       └── update-assistant.dto.ts
│
├── workflows/                       # Workflows Module
│   ├── workflows.module.ts
│   ├── workflows.controller.ts
│   ├── workflows.service.ts
│   └── workflows.repository.ts
│
├── messages/                        # Messages Module
│   ├── messages.module.ts
│   ├── messages.controller.ts
│   ├── messages.service.ts
│   └── messages.repository.ts
│
├── projects/                        # Projects Module
│   ├── projects.module.ts
│   ├── projects.controller.ts
│   ├── projects.service.ts
│   └── projects.repository.ts
│
├── teams/                           # Teams Module
│   ├── teams.module.ts
│   ├── teams.controller.ts
│   ├── teams.service.ts
│   └── teams.repository.ts
│
├── billing/                         # Billing Module
│   ├── billing.module.ts
│   ├── billing.controller.ts
│   ├── billing.service.ts
│   └── dto/
│       └── create-subscription.dto.ts
│
└── health/                           # Health Check Module
    ├── health.module.ts
    ├── health.controller.ts
    └── health.service.ts
```

---

## 🔧 Module Dependencies

```
AppModule
├── ConfigModule
├── SupabaseModule
│   ├── DatabaseModule
│   ├── AuthModule (Supabase)
│   ├── StorageModule
│   └── RealtimeModule
├── AIModule
│   ├── OpenAIProvider
│   ├── AnthropicProvider
│   ├── GoogleProvider
│   └── GrokProvider
├── StripeModule
├── AuthModule (NestJS)
├── UsersModule
├── ConversationsModule
├── AssistantsModule
├── WorkflowsModule
├── MessagesModule
├── ProjectsModule
├── TeamsModule
├── BillingModule
└── HealthModule
```

---

## 📦 Key Modules Explained

### 1. **Supabase Module** (`supabase/`)
Integrates with Supabase services:

- **Database Service**: Direct PostgreSQL queries via Supabase client
- **Auth Service**: User authentication & JWT validation
- **Storage Service**: File uploads/downloads
- **Realtime Service**: WebSocket subscriptions for live updates

### 2. **AI Module** (`ai/`)
Manages all AI provider integrations:

- **Provider Services**: Individual services for each AI provider
- **AI Adapter**: Unified interface for all providers
- **Prompt Service**: Prompt template management
- **Model Registry**: Available models per provider

### 3. **Stripe Module** (`stripe/`)
Handles billing and payments:

- **Stripe Service**: Stripe API wrapper
- **Webhook Handler**: Processes Stripe webhooks
- **Subscription Management**: Create/update/cancel subscriptions

### 4. **Business Modules**
Core application features:
- **Conversations**: Chat/conversation management
- **Assistants**: AI assistant configurations
- **Workflows**: Workflow definitions
- **Messages**: Individual message handling
- **Projects**: Project organization
- **Teams**: Team collaboration

---

## 🔌 Integration Points

### Supabase Integration
```typescript
// Database queries
supabase.from('conversations').select('*')

// Authentication
supabase.auth.getUser(token)

// Storage
supabase.storage.from('avatars').upload(file)

// Realtime
supabase.channel('conversations').subscribe()
```

### External APIs
```typescript
// OpenAI
openai.chat.completions.create()

// Anthropic
anthropic.messages.create()

// Google AI
google.generateContent()

// Stripe
stripe.customers.create()
stripe.subscriptions.create()
```

---

## 🚀 Next Steps

1. **Generate NestJS modules**: Use `nest g module` commands
2. **Install dependencies**: Add Supabase, OpenAI, Stripe SDKs
3. **Configure environment**: Set up `.env` files
4. **Implement services**: Start with Supabase integration
5. **Add guards & interceptors**: Authentication & error handling
6. **Write tests**: Unit & integration tests

---

**See implementation files in `apps/api/src/` for complete code examples.**

