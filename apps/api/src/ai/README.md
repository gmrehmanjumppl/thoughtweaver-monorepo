# AI Layer Implementation Guide

## Overview

Complete AI layer implementation for all LLM providers (OpenAI, Anthropic, Google AI, Grok) following the architecture defined in `ultartech/LLM_API_KEY_GUIDE.md` and `ultartech/ARCHITECTURE.md`.

---

## Structure Created

```
apps/api/src/ai/
├── ai.module.ts                    # Root AI module
├── adapters/
│   ├── ai-adapter.interface.ts     # Base interfaces
│   └── ai-adapter.service.ts       # Unified adapter service
├── providers/
│   ├── openai/
│   │   ├── openai.module.ts       # OpenAI module
│   │   ├── openai.provider.ts     # OpenAI provider implementation
│   │   └── openai.service.ts      # Deprecated (backward compat)
│   ├── anthropic/
│   │   ├── anthropic.module.ts
│   │   └── anthropic.provider.ts
│   ├── google/
│   │   ├── google.module.ts
│   │   └── google.provider.ts
│   └── grok/
│       ├── grok.module.ts
│       └── grok.provider.ts
├── services/
│   ├── conversation-ai.service.ts  # Conversation AI service (assistants + LLM + context)
│   └── index.ts
├── models/
│   └── model-registry.service.ts   # Model registry (all models)
├── prompts/
│   └── prompt.service.ts           # Prompt building utilities
└── utils/
    └── cost-calculator.service.ts   # Cost calculation
```

---

## What Was Implemented

### ✅ 1. Base Adapter Interface (`adapters/ai-adapter.interface.ts`)

Defines the unified interface all providers must implement:

```typescript
interface LLMAdapter {
  generate(prompt: string, options: LLMOptions): Promise<LLMResponse>;
  calculateCost(inputTokens: number, outputTokens: number, model: string): number;
}
```

### ✅ 2. Provider Implementations

All 4 providers implemented with:
- API client initialization
- `generate()` method
- `calculateCost()` method
- Model name mapping
- Error handling

**Providers:**
- ✅ **OpenAI** - Uses `openai` SDK
- ✅ **Anthropic** - Uses `@anthropic-ai/sdk`
- ✅ **Google AI** - Uses `@google/generative-ai`
- ✅ **Grok** - Uses fetch API (OpenAI-compatible)

### ✅ 3. Unified Adapter Service (`adapters/ai-adapter.service.ts`)

Main service that:
- Routes requests to correct provider
- Handles provider availability checks
- Provides unified API

**Usage:**
```typescript
// Generate response
const response = await aiAdapterService.generate(
  'openai',
  'gpt-5-mini',
  'Hello, how are you?',
  { systemPrompt: 'You are a helpful assistant' }
);
```

### ✅ 4. Model Registry (`models/model-registry.service.ts`)

Registry of all available models:
- `openai/gpt-5`
- `openai/gpt-5-mini`
- `anthropic/claude-sonnet-4.5`
- `anthropic/claude-haiku-4.5`
- `google/gemini-2.5-pro`
- `google/gemini-2.5-flash`
- `grok/grok-4`

Each model includes:
- Pricing information
- Configuration (temperature, maxTokens)
- Enabled status

### ✅ 5. Prompt Service (`prompts/prompt.service.ts`)

Utilities for building prompts:
- System prompt builder
- Conversation context builder
- Workflow prompt builder
- Context injection

### ✅ 6. Cost Calculator (`utils/cost-calculator.service.ts`)

Calculates costs based on:
- Model pricing from registry
- Input/output token counts
- Provider-specific pricing

### ✅ 7. Conversation AI Service (`services/conversation-ai.service.ts`)

**High-level service that integrates assistants with LLM calls and context.**

This service is the main entry point for generating AI responses in conversations. It handles:
- **Assistant Integration**: Uses assistant's `system_prompt` and `personality` for LLM generation
- **Context Support**: Fetches and injects context from `contexts` table when available
- **Conversation History**: Builds conversation history from previous messages
- **Model Selection**: Supports all LLM providers (OpenAI, Anthropic, Google, Grok)
- **Usage Tracking**: Automatically tracks tokens and costs for billing
- **Multi-Assistant**: Supports generating responses from multiple assistants

**Key Methods:**
- `generateMessage()`: Generate single AI response using assistant
- `generateFromMultipleAssistants()`: Generate responses from all selected assistants

---

## Environment Variables Required

Add to `apps/api/.env`:

```env
# OpenAI (Required for OpenAI provider)
OPENAI_API_KEY=sk-...

# Anthropic (Optional - only if using Anthropic)
ANTHROPIC_API_KEY=sk-ant-...

# Google AI (Optional - only if using Google)
GOOGLE_AI_API_KEY=...

# Grok (Optional - only if using Grok)
GROK_API_KEY=...
```

**Note**: Only providers with API keys configured will be available. Providers without keys will be disabled gracefully.

---

## Usage Examples

### 1. Using ConversationAIService Directly

```typescript
import { Injectable } from '@nestjs/common';
import { ConversationAIService } from '../ai/services/conversation-ai.service';

@Injectable()
export class MessagesService {
  constructor(private readonly conversationAI: ConversationAIService) {}

  async generateResponse(conversationId: string, userMessage: string, userId: string) {
    // Generate AI response using assistant's system prompt and context
    const response = await this.conversationAI.generateMessage({
      conversationId,
      userId,
      userMessage,
      assistantId: 'all-rounder', // Optional: uses first selected assistant if not provided
    });

    return {
      message: response.message,
      usage: response.usage, // { tokens, cost, model, provider }
    };
  }

  async generateMultipleResponses(conversationId: string, userMessage: string, userId: string) {
    // Generate responses from all selected assistants
    const responses = await this.conversationAI.generateFromMultipleAssistants(
      conversationId,
      userId,
      userMessage,
    );

    return responses.map(r => ({
      message: r.message,
      usage: r.usage,
    }));
  }
}
```

### 2. Using REST API Endpoints

**Generate Single AI Response:**
```bash
POST /api/conversations/{conversationId}/messages/generate
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "content": "What is React?",
  "assistantId": "all-rounder"  // Optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userMessage": {
      "id": "...",
      "conversationId": "...",
      "role": "user",
      "content": "What is React?",
      "createdAt": "2025-11-05T..."
    },
    "assistantMessage": {
      "id": "...",
      "conversationId": "...",
      "role": "assistant",
      "content": "React is a JavaScript library...",
      "assistantId": "all-rounder",
      "modelUsed": "openai/gpt-5-mini",
      "tokenCount": 150,
      "metadata": {
        "tokens": { "prompt": 100, "completion": 50, "total": 150 },
        "cost": 0.0003,
        "provider": "openai",
        "model": "gpt-5-mini"
      }
    },
    "usage": {
      "tokens": {
        "prompt": 100,
        "completion": 50,
        "total": 150
      },
      "cost": 0.0003,
      "model": "openai/gpt-5-mini",
      "provider": "openai"
    }
  },
  "meta": {
    "timestamp": "2025-11-05T..."
  }
}
```

**Generate Multiple Responses (from all selected assistants):**
```bash
POST /api/conversations/{conversationId}/messages/generate-multiple
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "content": "Explain TypeScript"
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
        "assistantId": "all-rounder",
        "content": "...",
        "usage": { ... }
      },
      {
        "assistantId": "strategist",
        "content": "...",
        "usage": { ... }
      }
    ],
    "usage": [ ... ]
  }
}
```

### 3. How ConversationAIService Works

When you call `generateMessage()`, the service:

1. **Gets Conversation**: Fetches conversation with `selected_assistants`, `selected_llm`, and `context_id`
2. **Gets Assistant**: Fetches assistant details (`system_prompt`, `personality`)
3. **Gets Context**: If `context_id` exists, fetches context content from `contexts` table
4. **Gets History**: Fetches all previous messages in the conversation
5. **Builds System Prompt**: Uses `PromptService` to build system prompt from assistant
6. **Builds Messages Array**: Constructs conversation messages with:
   - System prompt (from assistant)
   - Context (if available)
   - Previous messages
   - Current user message
7. **Generates Response**: Calls `AIAdapterService.generateFromMessages()` with selected LLM
8. **Saves Message**: Saves assistant message to database with `assistant_id` and `model_used`
9. **Tracks Usage**: Records usage in `usage_tracking` table for billing

### 4. Using Lower-Level Services (Advanced)

If you need more control, you can use the lower-level services directly:

```typescript
import { AIAdapterService } from '../ai/adapters/ai-adapter.service';
import { PromptService } from '../ai/prompts/prompt.service';

@Injectable()
export class CustomService {
  constructor(
    private aiAdapter: AIAdapterService,
    private promptService: PromptService,
  ) {}

  async customGenerate() {
    // Build system prompt
    const systemPrompt = this.promptService.buildSystemPrompt({
      systemPrompt: 'You are a helpful assistant',
      personality: { tone: 'professional' },
    });

    // Generate response
    const response = await this.aiAdapter.generateFromMessages(
      'openai',
      'gpt-5-mini',
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Hello!' },
      ],
      { temperature: 0.7 },
    );

    return response;
  }
}
```

---

## Model ID Format

Models use format: `{provider}/{model-name}`

Examples:
- `openai/gpt-5-mini`
- `anthropic/claude-sonnet-4.5`
- `google/gemini-2.5-pro`
- `grok/grok-4`

---

## Cost Calculation

Costs are calculated automatically per API call:

```typescript
// Cost calculated in response
const response = await aiAdapter.generate(...);
console.log(`Cost: $${response.cost}`);
console.log(`Tokens: ${response.tokens.total}`);
```

---

## Error Handling

All providers handle errors gracefully:
- Missing API keys → Provider disabled (not error)
- API errors → Wrapped with provider name
- Invalid models → Clear error messages

---

## Integration with Assistants and Context

### Assistant Integration

Conversations use assistants to define how AI responds:

```typescript
// Conversation has selected_assistants array
{
  "selected_assistants": ["all-rounder", "strategist"],
  "selected_llm": "openai/gpt-5-mini"
}

// Each assistant has:
{
  "id": "all-rounder",
  "system_prompt": "You are a helpful AI assistant...",
  "personality": {
    "tone": "friendly",
    "style": "conversational"
  }
}
```

When generating a response:
1. System uses the first selected assistant (or specified `assistantId`)
2. Assistant's `system_prompt` becomes the LLM system message
3. Assistant's `personality` is injected into the prompt
4. Response is saved with `assistant_id` for tracking

### Context Integration

Conversations can have a `context_id` that references the `contexts` table:

```typescript
// Conversation has context_id
{
  "context_id": "uuid-here",
  "selected_assistants": ["all-rounder"]
}

// Context table contains:
{
  "id": "uuid-here",
  "name": "Project Context",
  "content": "This project is about building a React app...",
  "type": "project"
}
```

When generating a response:
1. If `context_id` exists, context content is fetched
2. Context is injected as a system message before conversation history
3. LLM uses context to provide more relevant responses

### Workflow Example

```typescript
// 1. User creates conversation with assistant and context
POST /api/conversations
{
  "title": "React Help",
  "prompt": "Help me learn React",
  "selectedAssistants": ["all-rounder"],
  "selectedLlm": "openai/gpt-5-mini",
  "contextId": "project-context-uuid"
}

// 2. User sends message
POST /api/conversations/{id}/messages/generate
{
  "content": "What are React hooks?"
}

// 3. System generates response:
// - Uses assistant's system prompt
// - Includes context from context_id
// - Uses conversation history
// - Generates with selected LLM
// - Saves message with assistant_id
// - Tracks usage for billing
```

---

## Next Steps

1. **Install Dependencies**:
   ```bash
   cd apps/api
   pnpm install
   ```

2. **Add API Keys** to `.env`:
   ```env
   OPENAI_API_KEY=sk-...
   # Add other keys as needed
   ```

3. **Test API**:
   ```bash
   cd apps/api
   pnpm dev
   ```

4. **Use REST Endpoints**:
   - `POST /api/conversations/{id}/messages/generate` - Generate single response
   - `POST /api/conversations/{id}/messages/generate-multiple` - Generate from multiple assistants

---

## Current Status

- ✅ All provider implementations complete (OpenAI, Anthropic, Google, Grok)
- ✅ Unified adapter service ready
- ✅ Model registry configured
- ✅ Cost calculator implemented
- ✅ Prompt service ready
- ✅ **ConversationAIService implemented** - Integrates assistants with LLM and context
- ✅ **Messages service integration complete** - AI generation endpoints available
- ✅ **Usage tracking integrated** - Automatic billing tracking

---

## API Endpoints

### Messages Endpoints

**Generate AI Response:**
- `POST /api/conversations/:conversationId/messages/generate`
- Body: `{ content: string, assistantId?: string }`
- Returns: User message + Assistant message + Usage info

**Generate Multiple Responses:**
- `POST /api/conversations/:conversationId/messages/generate-multiple`
- Body: `{ content: string }`
- Returns: User message + Array of assistant messages + Usage info

**List Messages:**
- `GET /api/conversations/:conversationId/messages`
- Returns: Array of messages in conversation

**Get Message:**
- `GET /api/conversations/:conversationId/messages/:id`
- Returns: Single message

**Create Message (Manual):**
- `POST /api/conversations/:conversationId/messages`
- Body: `{ role: 'user' | 'assistant' | 'system', content: string }`
- Returns: Created message

---

**Document Maintained By**: Development Team  
**Last Updated**: November 2025

