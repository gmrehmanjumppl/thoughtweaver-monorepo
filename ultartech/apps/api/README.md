# Thoughtweaver NestJS API (apps/api)
## Project Overview & Documentation

**Version:** 2.0.0  
**Last Updated:** November 2025  
**Framework:** NestJS 10+  
**Status:** Active Development

---

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [API Endpoints](#api-endpoints)
5. [Setup & Development](#setup--development)
6. [Architecture](#architecture)
7. [Environment Variables](#environment-variables)
8. [Database Integration](#database-integration)
9. [Authentication](#authentication)
10. [Deployment](#deployment)

---

## Overview

The Thoughtweaver NestJS API is a RESTful backend service that handles all business logic, LLM integrations, database operations, and third-party service integrations. It serves as the backend for web, mobile, and future desktop applications.

### Key Capabilities

- ✅ **RESTful API** - Clean REST endpoints for all features
- ✅ **Supabase Integration** - Database, Auth, Storage, Realtime
- ✅ **LLM Integration** - OpenAI, Anthropic, Google AI, Grok
- ✅ **Authentication** - JWT-based auth with Supabase
- ✅ **Usage Tracking** - Track LLM usage and costs
- ✅ **Billing Integration** - Stripe subscription management

---

## Technology Stack

### Core Framework
- **NestJS 10+** - Progressive Node.js framework
- **TypeScript 5+** - Type safety
- **Express** - HTTP server (via NestJS)

### Database & Auth
- **Supabase** - PostgreSQL database
- **Supabase Auth** - JWT authentication
- **Supabase Storage** - File storage
- **Supabase Realtime** - Real-time subscriptions

### Authentication
- **Passport.js** - Authentication middleware
- **JWT** - Token-based authentication
- **Supabase JWT Strategy** - Custom Passport strategy

### Validation
- **class-validator** - DTO validation
- **class-transformer** - Object transformation

### External APIs
- **OpenAI** - GPT-5, GPT-5-mini
- **Anthropic** - Claude Sonnet/Haiku 4.5
- **Google AI** - Gemini 2.5 Pro/Flash
- **Grok** - Grok-4
- **Stripe** - Payment processing

---

## Project Structure

```
apps/api/
├── src/
│   ├── main.ts                    # Application entry point
│   ├── app.module.ts              # Root module
│   │
│   ├── common/                     # Shared utilities
│   │   ├── decorators/
│   │   │   ├── public.decorator.ts
│   │   │   └── current-user.decorator.ts
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts
│   │   ├── filters/
│   │   │   └── all-exceptions.filter.ts
│   │   └── interceptors/
│   │       └── transform.interceptor.ts
│   │
│   ├── config/                     # Configuration
│   │   └── config.module.ts
│   │
│   ├── supabase/                   # Supabase integration
│   │   ├── supabase.module.ts
│   │   └── supabase.service.ts
│   │
│   ├── auth/                       # Authentication
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── strategies/
│   │       └── supabase-jwt.strategy.ts
│   │
│   ├── conversations/              # Conversations module
│   │   ├── conversations.module.ts
│   │   ├── conversations.controller.ts
│   │   ├── conversations.service.ts
│   │   ├── conversations.repository.ts
│   │   └── dto/
│   │       ├── create-conversation.dto.ts
│   │       └── update-conversation.dto.ts
│   │
│   ├── messages/                   # Messages module
│   │   ├── messages.module.ts
│   │   ├── messages.controller.ts
│   │   ├── messages.service.ts
│   │   ├── messages.repository.ts
│   │   └── dto/
│   │       └── create-message.dto.ts
│   │
│   ├── assistants/                # Assistants module
│   │   ├── assistants.module.ts
│   │   ├── assistants.controller.ts
│   │   ├── assistants.service.ts
│   │   ├── assistants.repository.ts
│   │   └── dto/
│   │       ├── create-assistant.dto.ts
│   │       └── update-assistant.dto.ts
│   │
│   ├── ai/                        # AI/LLM integration
│   │   ├── ai.module.ts
│   │   └── providers/
│   │       └── openai/
│   │           └── openai.service.ts
│   │
│   ├── stripe/                    # Stripe integration
│   │   ├── stripe.module.ts
│   │   ├── stripe.service.ts
│   │   └── stripe.controller.ts
│   │
│   ├── billing/                   # Billing module (stub)
│   │   └── billing.module.ts
│   │
│   ├── health/                     # Health check
│   │   ├── health.module.ts
│   │   └── health.controller.ts
│   │
│   └── users/                      # Users module (stub)
│       └── users.module.ts
│
├── test/                          # E2E tests
├── nest-cli.json                   # NestJS CLI config
├── tsconfig.json                   # TypeScript config
└── package.json                    # Dependencies
```

---

## API Endpoints

### Public Endpoints
- `GET /api/health` - Health check

### Protected Endpoints (Require JWT Token)

#### Conversations
- `GET /api/conversations` - List all conversations
- `POST /api/conversations` - Create conversation
- `GET /api/conversations/:id` - Get conversation
- `PUT /api/conversations/:id` - Update conversation
- `DELETE /api/conversations/:id` - Delete conversation

#### Messages
- `GET /api/conversations/:conversationId/messages` - List messages
- `POST /api/conversations/:conversationId/messages` - Create message
- `GET /api/conversations/:conversationId/messages/:id` - Get message

#### Assistants
- `GET /api/assistants` - List all assistants
- `POST /api/assistants` - Create assistant
- `GET /api/assistants/:id` - Get assistant
- `PUT /api/assistants/:id` - Update assistant
- `DELETE /api/assistants/:id` - Delete assistant

#### Auth
- `GET /api/auth/profile` - Get user profile

---

## Setup & Development

### Prerequisites
- Node.js v20+
- PNPM v8+
- Supabase account
- Database migrations run (see [DATABASE_SETUP.md](../../DATABASE_SETUP.md))

### Installation

```bash
cd apps/api
pnpm install
```

### Environment Variables

Create `apps/api/.env`:

```env
# Server
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret

# LLM API Keys (Optional - for development)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_AI_API_KEY=...
GROK_API_KEY=...

# Stripe (Optional)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Run Development Server

```bash
cd apps/api
pnpm dev
```

The API will start on `http://localhost:4000`

### Build for Production

```bash
cd apps/api
pnpm build
pnpm start
```

---

## Architecture

### Module Pattern

Each feature follows NestJS module pattern:
- **Module** - Registers controllers, services, dependencies
- **Controller** - Handles HTTP requests/responses
- **Service** - Business logic
- **Repository** - Database operations
- **DTOs** - Data validation

### Request Flow

```
HTTP Request
  ↓
Controller (validates DTO)
  ↓
Service (business logic)
  ↓
Repository (database queries)
  ↓
Supabase Client
  ↓
PostgreSQL Database
  ↓
Response (transformed by interceptor)
```

### Authentication Flow

```
1. Client sends request with JWT token
2. JwtAuthGuard extracts token
3. SupabaseJwtStrategy validates token
4. Supabase Auth API verifies token
5. User attached to request
6. Controller receives authenticated user
```

---

## Database Integration

### Supabase Service

```typescript
// Usage in services
constructor(private readonly supabase: SupabaseService) {}

async findAll(userId: string) {
  const { data, error } = await this.supabase
    .getClient()
    .from('conversations')
    .select('*')
    .eq('user_id', userId);
    
  if (error) throw error;
  return data;
}
```

### Row Level Security (RLS)

All tables have RLS policies:
- Users can only access their own data
- Team members can access team data
- Service Role Key bypasses RLS (backend only)

---

## Authentication

### JWT Guard

All routes are protected by default:

```typescript
// Protected route
@Get()
async findAll(@CurrentUser() user: any) {
  return this.service.findAll(user.id);
}

// Public route
@Public()
@Get('health')
check() {
  return { status: 'ok' };
}
```

### Current User Decorator

```typescript
@Get(':id')
async findOne(
  @Param('id') id: string,
  @CurrentUser() user: any // Extracts user from request
) {
  return this.service.findOne(id, user.id);
}
```

---

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2025-11-03T10:00:00Z"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "CONVERSATION_NOT_FOUND",
    "message": "Conversation not found"
  },
  "meta": {
    "timestamp": "2025-11-03T10:00:00Z",
    "path": "/api/conversations/123"
  }
}
```

---

## Deployment

### Railway/Render Deployment

1. Connect GitHub repository
2. Configure environment variables
3. Set build command: `cd apps/api && pnpm build`
4. Set start command: `cd apps/api && pnpm start`
5. Deploy

### Docker Deployment

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN cd apps/api && pnpm build
CMD ["node", "apps/api/dist/main"]
```

---

## Current Status

### ✅ Completed
- [x] Project structure setup
- [x] Supabase integration
- [x] Authentication module
- [x] Conversations module (CRUD)
- [x] Messages module (CRUD)
- [x] Assistants module (CRUD)
- [x] Health check endpoint
- [x] Global exception handling
- [x] Global response transform

### ⏳ In Progress
- [ ] AI service integration
- [ ] Usage tracking implementation
- [ ] Billing service implementation
- [ ] Real-time subscriptions

### 📋 Planned
- [ ] Workflows module
- [ ] Projects module
- [ ] Teams module
- [ ] Storage integration
- [ ] E2E tests

---

## Testing

### Unit Tests
```bash
pnpm test
```

### E2E Tests
```bash
pnpm test:e2e
```

---

## Related Documentation

- [Architecture Guide](../../ARCHITECTURE.md)
- [Developer Guide](../../DEVELOPER_GUIDE.md)
- [Database Setup](../../DATABASE_SETUP.md)
- [Billing Explained](../../BILLING_EXPLAINED.md)
- [Implementation Guide](./IMPLEMENTATION_GUIDE.md)

---

**Document Maintained By**: Development Team  
**Last Updated**: November 2025

