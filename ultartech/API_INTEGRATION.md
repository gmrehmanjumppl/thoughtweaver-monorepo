# API Integration Guide

## Overview

This document describes how the `apps/web` frontend integrates with the `apps/api` NestJS backend using REST APIs.

**Status**: ✅ Implemented  
**Last Updated**: November 2025

---

## Architecture

### Type Definitions (`packages/types`)

All API types are defined in `packages/types/src/index.ts`:
- `ApiConversation`, `ApiMessage`, `ApiAssistant` - Database schema types
- `CreateConversationDto`, `UpdateConversationDto` - DTOs
- `ApiUser`, `ApiTeam`, `ApiTeamMember` - User and team types
- `ApiProject`, `ApiContext`, `ApiWorkflow` - Other entity types

**Important**: Types are centralized in `packages/types`, NOT in `apps/web/src/lib/api`.

### API Client (`apps/web/src/lib/api-client.ts`)

Base HTTP client that:
- Handles authentication (gets JWT from Supabase session)
- Adds `Authorization: Bearer <token>` header automatically
- Provides unified `get`, `post`, `put`, `delete` methods
- Handles errors consistently

**Environment Variable**:
```env
VITE_API_URL=http://localhost:4000/api
```

### API Services (`apps/web/src/lib/api/`)

Domain-specific API services:
- `auth.api.ts` - Authentication
- `conversations.api.ts` - Conversations CRUD
- `messages.api.ts` - Messages and AI generation
- `assistants.api.ts` - Assistants management
- `users.api.ts` - User profile management
- `teams.api.ts` - Teams and team members

**Usage**:
```typescript
import { conversationsApi, messagesApi } from '../lib/api';

// Get conversations
const conversations = await conversationsApi.getAll();

// Generate AI response
const response = await messagesApi.generate(conversationId, {
  content: 'Hello!',
  assistantId: 'all-rounder',
});
```

---

## Backend Services (`apps/api`)

### Implemented Services

✅ **Conversations** (`apps/api/src/conversations/`)
- Controller, Service, Repository
- CRUD operations
- Endpoints: GET, POST, PUT, DELETE `/api/conversations`

✅ **Messages** (`apps/api/src/messages/`)
- Controller, Service, Repository
- Message CRUD + AI generation
- Endpoints: GET, POST `/api/conversations/:id/messages`
- AI endpoints: POST `/api/conversations/:id/messages/generate`

✅ **Assistants** (`apps/api/src/assistants/`)
- Controller, Service, Repository
- CRUD operations
- Endpoints: GET, POST, PUT, DELETE `/api/assistants`

✅ **Users** (`apps/api/src/users/`)
- Controller, Service, Repository
- Profile management
- Endpoints: GET, PUT `/api/users/me`

✅ **Teams** (`apps/api/src/teams/`)
- Controller, Service, Repository
- Team CRUD + member management
- Endpoints: GET, POST, PUT, DELETE `/api/teams`
- Member endpoints: GET, POST, DELETE `/api/teams/:id/members`

### AI Layer (`apps/api/src/ai/`)

✅ **ConversationAIService** (`apps/api/src/ai/services/conversation-ai.service.ts`)
- Integrates assistants with LLM calls
- Uses context from `contexts` table
- Tracks usage for billing
- Supports multiple assistants

See [apps/api/src/ai/README.md](../../apps/api/src/ai/README.md) for details.

---

## Frontend Integration (`apps/web`)

### Updated Components

✅ **ConversationContext** (`apps/web/src/contexts/ConversationContext.tsx`)
- Uses `conversationsApi` for all operations
- Loads conversations from API
- `createConversation` is async
- Added `deleteConversation` and `refreshConversations`

✅ **ConversationView** (`apps/web/src/components/conversation/ConversationView.tsx`)
- Uses `messagesApi.generate()` for AI responses
- Loads messages from API
- Maps API types to local types

✅ **HomePage** (`apps/web/src/components/home/HomePage.tsx`)
- Updated to handle async `createConversation`
- Uses API for conversation creation

---

## API Endpoints

### Authentication
- `GET /api/auth/me` - Get current user (JWT payload)
- `GET /api/users/me` - Get user profile

### Conversations
- `GET /api/conversations` - Get all conversations
- `POST /api/conversations` - Create conversation
- `GET /api/conversations/:id` - Get conversation
- `PUT /api/conversations/:id` - Update conversation
- `DELETE /api/conversations/:id` - Delete conversation

### Messages
- `GET /api/conversations/:id/messages` - Get all messages
- `POST /api/conversations/:id/messages` - Create message
- `POST /api/conversations/:id/messages/generate` - Generate AI response
- `POST /api/conversations/:id/messages/generate-multiple` - Generate from multiple assistants

### Assistants
- `GET /api/assistants` - Get all assistants
- `POST /api/assistants` - Create assistant
- `GET /api/assistants/:id` - Get assistant
- `PUT /api/assistants/:id` - Update assistant
- `DELETE /api/assistants/:id` - Delete assistant

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile

### Teams
- `GET /api/teams` - Get all teams
- `POST /api/teams` - Create team
- `GET /api/teams/:id` - Get team
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team
- `GET /api/teams/:id/members` - Get team members
- `POST /api/teams/:id/members` - Add team member
- `DELETE /api/teams/:id/members/:memberId` - Remove team member

---

## Type Usage

### Frontend (`apps/web`)

```typescript
// Import types from packages/types
import type { ApiConversation, ApiMessage } from '@thoughtweaver/types';

// Use API services
import { conversationsApi, messagesApi } from '../lib/api';

// API services return Api* types
const conversations: ApiConversation[] = await conversationsApi.getAll();
```

### Backend (`apps/api`)

```typescript
// Use DTOs for validation
import { CreateConversationDto } from './dto/create-conversation.dto';

// Service methods use DTOs
async create(dto: CreateConversationDto, userId: string) {
  // Implementation
}
```

---

## Environment Variables

### Frontend (`apps/web/.env`)

```env
VITE_API_URL=http://localhost:4000/api
# or
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### Backend (`apps/api/.env`)

```env
PORT=4000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret
OPENAI_API_KEY=sk-...
```

---

## Setup Instructions

### 1. Build Types Package

```bash
cd packages/types
pnpm build
```

### 2. Start Backend API

```bash
cd apps/api
pnpm dev
# Runs on http://localhost:4000
```

### 3. Start Frontend

```bash
cd apps/web
pnpm dev
# Runs on http://localhost:3000
```

### 4. Test Integration

1. Create a conversation via UI
2. Send a message
3. Verify AI response is generated
4. Check messages persist in database

---

## Key Points

1. **Types are centralized** in `packages/types` - NOT in `apps/web/src/lib/api`
2. **API services** in `apps/web/src/lib/api/` import types from `packages/types`
3. **Backend DTOs** validate input using `class-validator`
4. **Authentication** handled automatically via JWT tokens from Supabase
5. **Error handling** included in all API calls

---

## Troubleshooting

**Error: "Cannot find module '@thoughtweaver/types'"**
- Build types package: `cd packages/types && pnpm build`
- Ensure types package is installed: `pnpm install`

**Error: "API Error: 401 Unauthorized"**
- Check Supabase session is active
- Verify JWT token is being sent
- Check API server is running

**Error: "Failed to load conversations"**
- Check API server is running
- Verify database connection
- Check network tab for specific error

---

**Document Maintained By**: Development Team  
**Last Updated**: November 2025  
**Related Documents**:
- [apps/api/README.md](../../apps/api/README.md) - API documentation
- [apps/web/API_INTEGRATION.md](../../apps/web/API_INTEGRATION.md) - Web app API integration
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Complete architecture guide

