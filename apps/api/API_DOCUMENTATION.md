# 📚 Thoughtweaver API Documentation

**Base URL**: `http://localhost:4000/api`

All endpoints require authentication (JWT token) unless marked as `[Public]`.

---

## 🔓 Public Endpoints

### Health Check
```
GET /api/health
```
**Response:**
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2025-11-05T15:09:19.422Z",
    "service": "thoughtweaver-api"
  }
}
```

---

## 🔐 Authentication Endpoints

### Get Current User
```
GET /api/auth/me
```
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-id",
    "email": "user@example.com"
  }
}
```

### Get User Profile
```
GET /api/auth/profile
```
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name",
    "avatar_url": "https://..."
  }
}
```

---

## 👤 User Endpoints

### Get Current User Profile
```
GET /api/users/me
```
**Headers:** `Authorization: Bearer <token>`

### Update Current User Profile
```
PUT /api/users/me
```
**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "name": "Updated Name",
  "avatar_url": "https://..."
}
```

---

## 💬 Conversation Endpoints

### List All Conversations
```
GET /api/conversations
```
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "conv-id",
      "title": "My Conversation",
      "prompt": "Initial prompt",
      "workflow_id": "workflow-id",
      "selected_assistants": ["assistant-id"],
      "created_at": "2025-11-05T15:00:00Z"
    }
  ]
}
```

### Get Conversation by ID
```
GET /api/conversations/:id
```
**Headers:** `Authorization: Bearer <token>`

### Create Conversation
```
POST /api/conversations
```
**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "title": "New Conversation",
  "prompt": "Initial prompt text",
  "workflowId": "workflow-id",
  "selectedAssistants": ["assistant-id-1", "assistant-id-2"],
  "selectedLlm": "openai/gpt-5-mini",
  "contextId": "context-id" // optional
}
```

### Update Conversation
```
PUT /api/conversations/:id
```
**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "title": "Updated Title"
}
```

### Delete Conversation
```
DELETE /api/conversations/:id
```
**Headers:** `Authorization: Bearer <token>`

---

## 📨 Message Endpoints

### List Messages in Conversation
```
GET /api/conversations/:conversationId/messages
```
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "msg-id",
      "conversation_id": "conv-id",
      "role": "user",
      "content": "Hello!",
      "created_at": "2025-11-05T15:00:00Z"
    },
    {
      "id": "msg-id-2",
      "conversation_id": "conv-id",
      "role": "assistant",
      "content": "Hello! How can I help?",
      "assistant_id": "assistant-id",
      "model_used": "openai/gpt-5-mini",
      "created_at": "2025-11-05T15:00:05Z"
    }
  ]
}
```

### Get Message by ID
```
GET /api/conversations/:conversationId/messages/:id
```
**Headers:** `Authorization: Bearer <token>`

### Create Message (Manual)
```
POST /api/conversations/:conversationId/messages
```
**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "role": "user",
  "content": "My message text",
  "assistantId": "assistant-id" // optional, for assistant messages
}
```

### Generate AI Response ⭐
```
POST /api/conversations/:conversationId/messages/generate
```
**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "content": "User's message",
  "assistantId": "assistant-id" // optional, uses first selected assistant if not provided
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userMessage": {
      "id": "msg-id",
      "role": "user",
      "content": "User's message",
      "created_at": "2025-11-05T15:00:00Z"
    },
    "assistantMessage": {
      "id": "msg-id-2",
      "role": "assistant",
      "content": "AI response",
      "assistant_id": "assistant-id",
      "model_used": "openai/gpt-5-mini",
      "created_at": "2025-11-05T15:00:05Z"
    },
    "usage": {
      "tokens": {
        "prompt": 100,
        "completion": 50,
        "total": 150
      },
      "cost": 0.002,
      "model": "openai/gpt-5-mini",
      "provider": "openai"
    }
  }
}
```

### Generate Multiple Assistant Responses
```
POST /api/conversations/:conversationId/messages/generate-multiple
```
**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "content": "User's message"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userMessage": { ... },
    "assistantMessages": [
      {
        "id": "msg-id-1",
        "assistant_id": "assistant-1",
        "content": "Response 1"
      },
      {
        "id": "msg-id-2",
        "assistant_id": "assistant-2",
        "content": "Response 2"
      }
    ],
    "usage": { ... }
  }
}
```

---

## 🤖 Assistant Endpoints

### List All Assistants
```
GET /api/assistants
```
**Headers:** `Authorization: Bearer <token>`

### Get Assistant by ID
```
GET /api/assistants/:id
```
**Headers:** `Authorization: Bearer <token>`

### Create Assistant
```
POST /api/assistants
```
**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "name": "My Assistant",
  "description": "Assistant description",
  "systemPrompt": "You are a helpful assistant...",
  "personality": {
    "openness": 80,
    "conscientiousness": 70,
    "extraversion": 60,
    "agreeableness": 75,
    "neuroticism": 30
  },
  "avatarUrl": "https://...",
  "color": "bg-purple-500"
}
```

### Update Assistant
```
PUT /api/assistants/:id
```
**Headers:** `Authorization: Bearer <token>`

**Body:** Same as Create Assistant

### Delete Assistant
```
DELETE /api/assistants/:id
```
**Headers:** `Authorization: Bearer <token>`

---

## 👥 Team Endpoints

### List All Teams
```
GET /api/teams
```
**Headers:** `Authorization: Bearer <token>`

### Get Team by ID
```
GET /api/teams/:id
```
**Headers:** `Authorization: Bearer <token>`

### Create Team
```
POST /api/teams
```
**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "name": "My Team",
  "description": "Team description"
}
```

### Update Team
```
PUT /api/teams/:id
```
**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "name": "Updated Team Name",
  "description": "Updated description"
}
```

### Delete Team
```
DELETE /api/teams/:id
```
**Headers:** `Authorization: Bearer <token>`

### Get Team Members
```
GET /api/teams/:id/members
```
**Headers:** `Authorization: Bearer <token>`

### Add Team Member
```
POST /api/teams/:id/members
```
**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "email": "member@example.com",
  "role": "member" // "owner" | "admin" | "member"
}
```

### Remove Team Member
```
DELETE /api/teams/:id/members/:memberId
```
**Headers:** `Authorization: Bearer <token>`

---

## 🔑 Authentication

All endpoints (except `/api/health`) require a JWT token in the Authorization header:

```
Authorization: Bearer <your-supabase-access-token>
```

To get a token:
1. Log in via Supabase Auth in your frontend
2. Extract the `access_token` from the Supabase session
3. Include it in the `Authorization` header

---

## 📝 Response Format

All endpoints return responses in this format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2025-11-05T15:00:00Z"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "NotFoundException",
    "message": "Resource not found",
    "details": {
      "statusCode": 404,
      "message": "Cannot GET /api/conversations/invalid-id"
    }
  },
  "meta": {
    "timestamp": "2025-11-05T15:00:00Z",
    "path": "/api/conversations/invalid-id"
  }
}
```

---

## 🧪 Testing Endpoints

### Using cURL

**Health Check:**
```bash
curl http://localhost:4000/api/health
```

**Get Conversations (requires auth):**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:4000/api/conversations
```

**Create Conversation:**
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","prompt":"Hello","workflowId":"workflow-id","selectedAssistants":[]}' \
  http://localhost:4000/api/conversations
```

### Using Browser

1. **Health Check**: http://localhost:4000/api/health ✅ (No auth required)
2. **Other endpoints**: Use Postman, Insomnia, or browser extensions with auth headers

---

## 📍 Base URL

- **Development**: `http://localhost:4000/api`
- **Production**: `https://your-api-domain.com/api`

---

**Last Updated**: November 2025

