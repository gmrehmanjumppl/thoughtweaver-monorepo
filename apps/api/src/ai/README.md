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

## Usage Example

### In Messages Service

```typescript
import { Injectable } from '@nestjs/common';
import { AIAdapterService } from '../ai/adapters/ai-adapter.service';
import { PromptService } from '../ai/prompts/prompt.service';
import { ModelRegistryService } from '../ai/models/model-registry.service';

@Injectable()
export class MessagesService {
  constructor(
    private aiAdapter: AIAdapterService,
    private promptService: PromptService,
    private modelRegistry: ModelRegistryService,
  ) {}

  async generateAIResponse(
    conversationId: string,
    userMessage: string,
    assistantId: string,
    modelId: string, // e.g., 'openai/gpt-5-mini'
  ) {
    // Get assistant configuration
    const assistant = await this.getAssistant(assistantId);
    
    // Parse model ID
    const { provider, modelName } = this.modelRegistry.parseModelId(modelId);
    
    // Build system prompt
    const systemPrompt = this.promptService.buildSystemPrompt(assistant);
    
    // Get conversation history
    const messages = await this.getConversationMessages(conversationId);
    
    // Generate response
    const response = await this.aiAdapter.generateFromMessages(
      provider,
      modelName,
      messages,
      {
        systemPrompt,
        temperature: assistant.personality?.temperature || 0.7,
      }
    );
    
    // Save AI response to database
    await this.saveMessage({
      conversationId,
      role: 'assistant',
      content: response.content,
      assistantId,
      modelUsed: modelId,
      tokenCount: response.tokens.total,
      metadata: {
        cost: response.cost,
        provider: response.provider,
      },
    });
    
    // Track usage
    await this.trackUsage(conversationId, response);
    
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

3. **Integrate with Messages Service**:
   - Import `AIAdapterService`
   - Call `generate()` when user sends message
   - Save AI response to database

4. **Test API**:
   ```bash
   cd apps/api
   pnpm dev
   ```

---

## Current Status

- ✅ All provider implementations complete
- ✅ Unified adapter service ready
- ✅ Model registry configured
- ✅ Cost calculator implemented
- ✅ Prompt service ready
- ⏳ Integration with Messages service (next step)

---

**Document Maintained By**: Development Team  
**Last Updated**: November 2025

