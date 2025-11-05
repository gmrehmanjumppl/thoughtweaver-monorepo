# API Integration Guide

## Overview

The `apps/web` application now integrates with the NestJS backend API (`apps/api`) for all data operations. This document describes the API integration architecture and usage.

## Architecture

### API Client (`src/lib/api-client.ts`)

Base HTTP client that handles:
- Authentication token management (gets JWT from Supabase session)
- Request/response handling
- Error handling
- Base URL configuration

**Usage:**
```typescript
import { apiClient } from '../lib/api-client';

const data = await apiClient.get('/endpoint');
const result = await apiClient.post('/endpoint', { data });
```

### API Services (`src/lib/api/`)

Domain-specific API services:
- `auth.api.ts` - Authentication endpoints
- `conversations.api.ts` - Conversation CRUD operations
- `messages.api.ts` - Message operations and AI generation
- `assistants.api.ts` - Assistant management

**Usage:**
```typescript
import { conversationsApi, messagesApi } from '../lib/api';

// Get all conversations
const conversations = await conversationsApi.getAll();

// Generate AI response
const response = await messagesApi.generate(conversationId, {
  content: 'Hello!',
  assistantId: 'all-rounder',
});
```

## Environment Variables

Add to `.env` or `.env.local`:

```env
VITE_API_URL=http://localhost:4000/api
# or
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## Integration Points

### 1. ConversationContext

**File:** `src/contexts/ConversationContext.tsx`

**Changes:**
- Now uses `conversationsApi` for all CRUD operations
- Loads conversations from API on mount
- `createConversation` now returns a Promise
- Added `isLoading` state
- Added `deleteConversation` and `refreshConversations` methods

**Usage:**
```typescript
const { 
  conversations, 
  createConversation, 
  deleteConversation,
  isLoading 
} = useConversation();

// Create conversation (async)
const conversation = await createConversation(
  prompt,
  workflow,
  assistants,
  llm,
  contextId
);

// Delete conversation
await deleteConversation(conversationId);
```

### 2. ConversationView Component

**File:** `src/components/conversation/ConversationView.tsx`

**Changes:**
- Uses `messagesApi.generate()` to send messages and get AI responses
- Loads messages from API when conversation changes
- Maps API response format to local Message format

**Usage:**
```typescript
// Send message and generate AI response
const response = await messagesApi.generate(conversationId, {
  content: userMessage,
  assistantId: 'all-rounder',
});

// Load messages
const messages = await messagesApi.getByConversation(conversationId);
```

### 3. HomePage Component

**File:** `src/components/home/HomePage.tsx`

**Changes:**
- Updated to handle async `createConversation`
- Uses `await` when creating conversations

## API Endpoints Used

### Conversations
- `GET /api/conversations` - Get all conversations
- `POST /api/conversations` - Create conversation
- `GET /api/conversations/:id` - Get conversation by ID
- `PUT /api/conversations/:id` - Update conversation
- `DELETE /api/conversations/:id` - Delete conversation

### Messages
- `GET /api/conversations/:id/messages` - Get all messages
- `POST /api/conversations/:id/messages/generate` - Generate AI response
- `POST /api/conversations/:id/messages/generate-multiple` - Generate from multiple assistants

### Assistants
- `GET /api/assistants` - Get all assistants
- `GET /api/assistants/:id` - Get assistant by ID
- `POST /api/assistants` - Create assistant
- `PUT /api/assistants/:id` - Update assistant
- `DELETE /api/assistants/:id` - Delete assistant

### Auth
- `GET /api/auth/me` - Get current user

## Authentication

The API client automatically:
1. Gets the JWT token from Supabase session
2. Adds `Authorization: Bearer <token>` header to all requests
3. Handles token refresh (via Supabase)

## Error Handling

All API calls include error handling:
```typescript
try {
  const data = await conversationsApi.getAll();
} catch (error) {
  console.error('Failed to load conversations:', error);
  // Show error to user
}
```

## Data Mapping

API responses are mapped to local formats:

**Conversation:**
```typescript
// API format
{
  id: string;
  title: string;
  prompt: string;
  workflow_id?: string;
  selected_assistants: string[];
  selected_llm: string;
  created_at: string;
}

// Local format
{
  id: string;
  title: string;
  prompt: string;
  workflow: string;
  assistants: string[];
  timestamp: Date;
  selectedLlm?: string;
}
```

**Message:**
```typescript
// API format
{
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  assistant_id?: string;
  model_used?: string;
  created_at: string;
}

// Local format
{
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  assistantId?: string;
  llmModel?: string;
  timestamp: Date;
}
```

## Next Steps

1. **Update remaining components** to use API services
2. **Add loading states** for better UX
3. **Add error boundaries** for error handling
4. **Add retry logic** for failed requests
5. **Add request caching** for better performance

## Testing

To test the integration:

1. **Start the API server:**
   ```bash
   cd apps/api
   pnpm dev
   ```

2. **Start the web app:**
   ```bash
   cd apps/web
   pnpm dev
   ```

3. **Test the flow:**
   - Create a conversation
   - Send a message
   - Verify AI response is generated
   - Check messages are persisted

## Troubleshooting

**Error: "Failed to get auth token"**
- Ensure Supabase session is active
- Check Supabase credentials in `.env`

**Error: "API Error: 401 Unauthorized"**
- Token may be expired, refresh the page
- Check API server is running

**Error: "API Error: 404 Not Found"**
- Check API URL is correct in `.env`
- Verify endpoint exists in backend

**Error: "Failed to load conversations"**
- Check API server is running
- Verify database connection
- Check network tab for specific error

