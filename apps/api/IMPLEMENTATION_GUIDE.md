# NestJS API Setup Complete ✅

## What's Been Created

### ✅ Core Modules
- **Common Module** - Guards, decorators, filters, interceptors
- **Auth Module** - JWT authentication with Supabase
- **Health Module** - API health check endpoint

### ✅ Business Modules (Full Implementation)
- **Conversations Module** - CRUD operations for conversations
- **Messages Module** - Message management within conversations
- **Assistants Module** - AI assistant management

### ✅ Stub Modules (Ready for Implementation)
- **Users Module** - User management
- **Workflows Module** - Workflow management
- **Projects Module** - Project management
- **Teams Module** - Team management
- **Billing Module** - Billing and subscriptions

### ✅ Infrastructure
- **Supabase Integration** - Database, Auth, Storage, Realtime
- **Config Module** - Application configuration
- **Global Exception Handling** - Unified error responses
- **Global Response Transform** - Consistent API responses

---

## Next Steps

### 1. Install Dependencies

```bash
cd apps/api
pnpm install
```

### 2. Set Up Environment Variables

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

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### 3. Run Database Migrations

**See**: `ultartech/DATABASE_SETUP.md` for complete instructions.

**Quick Steps**:
1. Go to Supabase Dashboard → SQL Editor
2. Run `infra/supabase/migrations/001_initial_schema.sql`
3. Run `infra/supabase/migrations/002_seed_data.sql`

### 4. Start the API Server

```bash
cd apps/api
pnpm dev
```

The API will start on `http://localhost:4000`

### 5. Test the API

```bash
# Health check (public endpoint)
curl http://localhost:4000/api/health

# Get conversations (requires auth token)
curl http://localhost:4000/api/conversations \
  -H "Authorization: Bearer YOUR_SUPABASE_JWT_TOKEN"
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
- `GET /api/assistants` - List all assistants (default + custom)
- `POST /api/assistants` - Create custom assistant
- `GET /api/assistants/:id` - Get assistant
- `PUT /api/assistants/:id` - Update assistant
- `DELETE /api/assistants/:id` - Delete assistant

#### Auth
- `GET /api/auth/profile` - Get user profile

---

## Authentication

All endpoints (except `/api/health`) require authentication via JWT token.

**How to get token:**
1. User signs in via Supabase Auth (handled in frontend)
2. Frontend receives JWT token from Supabase
3. Frontend sends token in `Authorization: Bearer <token>` header
4. NestJS validates token via Supabase Auth API

**Example Request:**
```bash
curl http://localhost:4000/api/conversations \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
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
    "message": "Conversation not found",
    "details": { ... }
  },
  "meta": {
    "timestamp": "2025-11-03T10:00:00Z",
    "path": "/api/conversations/123"
  }
}
```

---

## Database Schema

All modules use Supabase PostgreSQL with Row Level Security (RLS) enabled.

**Tables:**
- `profiles` - User profiles
- `conversations` - Conversation sessions
- `messages` - Individual messages
- `assistants` - AI assistants
- `workflows` - Workflow definitions
- `projects` - Project organization
- `teams` - Team management
- `contexts` - Context pieces

**RLS Policies:**
- Users can only access their own data
- Default assistants are visible to all users
- Custom assistants are private to creator

---

## Integration with Frontend (apps/web)

The frontend should call these endpoints using the Supabase JWT token:

```typescript
// Example: apps/web/src/lib/api/client.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function apiRequest(endpoint: string, options?: RequestInit) {
  const { data: { session } } = await supabase.auth.getSession();
  
  return fetch(`http://localhost:4000/api${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${session?.access_token}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
}
```

---

## Troubleshooting

### Error: "Supabase configuration is missing"
**Solution**: Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env` file

### Error: "Unauthorized" on protected endpoints
**Solution**: Make sure you're sending a valid JWT token in the Authorization header

### Error: "Conversation not found"
**Solution**: Verify the conversation ID and that it belongs to the authenticated user

### Error: "Cannot find module"
**Solution**: Run `pnpm install` in `apps/api` directory

---

## Development Tips

1. **Use `@Public()` decorator** for routes that don't need authentication
2. **Use `@CurrentUser()` decorator** to get the authenticated user in controllers
3. **Repository pattern** - All database queries go through repositories
4. **Service layer** - Business logic goes in services
5. **DTOs** - Use DTOs for request validation

---

**Document Maintained By**: Development Team  
**Last Updated**: November 2025

