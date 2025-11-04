# LLM API Key Strategy Guide
## Individual API Keys vs Vercel AI SDK - Architecture Recommendation

**Version:** 2.0.0  
**Last Updated:** November 2025  
**Status:** Production-Ready Recommendation

---

## Executive Summary

**✅ RECOMMENDED: Individual API Keys + Unified Adapter Pattern**

For Thoughtweaver's architecture, use **individual API keys** from each provider with a custom unified adapter layer. This provides maximum flexibility, cost control, and aligns with your NestJS backend architecture.

---

## Why We Chose Individual API Keys Over Vercel AI SDK

### Decision Summary

**We chose individual API keys instead of Vercel AI SDK because:**

1. ✅ **Backend Architecture Compatibility**
   - Our backend is NestJS (not Next.js Edge Functions)
   - NestJS runs on any platform (Railway, Render, AWS, etc.)
   - Vercel AI SDK is optimized for Vercel Edge Functions
   - Direct API integration works better with NestJS

2. ✅ **Cost Tracking Requirements**
   - Our PRD requires granular cost tracking per provider/model
   - Need to track: OpenAI costs, Anthropic costs, Google costs, Grok costs separately
   - Users have usage limits per provider
   - Individual keys allow direct cost monitoring per provider
   - Vercel AI Gateway centralizes billing but loses granular tracking

3. ✅ **Full Control & Flexibility**
   - Need access to provider-specific features
   - Custom retry logic per provider
   - Custom rate limiting strategies
   - Fine-tuned error handling per provider
   - Vercel AI SDK abstracts away provider-specific features

4. ✅ **No Vendor Lock-in**
   - Can deploy backend anywhere (not tied to Vercel)
   - Can switch providers easily
   - Can use any hosting platform
   - Vercel AI SDK locks you to Vercel ecosystem

5. ✅ **Architecture Alignment**
   - Already designed `packages/ai/adapters/` pattern
   - Unified adapter layer fits individual keys perfectly
   - Matches our modular monorepo structure
   - Better separation of concerns

6. ✅ **Multi-Provider Strategy**
   - Support 7 different models across 4 providers
   - Each provider has different:
     - Pricing models (per token, per request, etc.)
     - Rate limits (requests per minute, tokens per minute)
     - Feature sets (streaming, function calling, etc.)
     - API structures
   - Need to handle each provider differently
   - Individual keys give full control over each integration

7. ✅ **Cost Optimization**
   - Can route requests to cheapest provider based on task
   - Can implement fallback strategies per provider
   - Can track costs per conversation/user/provider
   - Needed for usage-based billing system

8. ✅ **Production Requirements**
   - Building production system (not prototype)
   - Need enterprise-grade reliability
   - Need detailed logging and monitoring per provider
   - Need custom error handling and retry logic
   - Individual keys provide all necessary control

### When Vercel AI SDK Would Be Better

Vercel AI SDK would be better if:
- ❌ Frontend-only AI calls (we have NestJS backend)
- ❌ Simple use cases (we need cost tracking, multi-provider)
- ❌ Deploying only on Vercel (we might deploy elsewhere)
- ❌ Rapid prototyping (we're building production system)

**Important Note**: Vercel AI Gateway still requires individual API keys from providers. It just provides a unified interface and centralized billing. You still pay providers directly, so you don't save on API costs.

---

## Comparison Table

| Feature | Individual API Keys | Vercel AI SDK/AI Gateway |
|---------|-------------------|-------------------------|
| **Cost Control** | ✅ Direct control per provider | ⚠️ Centralized billing (still pay providers) |
| **Cost Tracking** | ✅ Track per provider/model | ⚠️ Less granular tracking |
| **Flexibility** | ✅ Full provider features | ⚠️ Limited to SDK capabilities |
| **Vendor Lock-in** | ✅ None | ❌ Locked to Vercel |
| **Backend Compatibility** | ✅ Works with NestJS | ⚠️ Optimized for Next.js |
| **Multi-Provider Support** | ✅ Full control | ✅ Unified interface |
| **Setup Complexity** | ⚠️ Need adapter layer | ✅ Simple SDK |
| **Rate Limiting** | ⚠️ Handle manually | ✅ Built-in |
| **Failover** | ⚠️ Custom implementation | ✅ Built-in |

---

## Why Individual API Keys for Thoughtweaver?

### 1. **Backend Architecture**
Your backend is **NestJS** (not necessarily on Vercel):
- Vercel AI SDK is optimized for Next.js/Vercel Edge Functions
- NestJS backend needs direct provider access
- Better control over API calls from backend

### 2. **Cost Tracking Requirements**
Your PRD mentions cost tracking per LLM:
- Need granular cost tracking per provider/model
- Individual keys allow direct cost monitoring
- Easier to implement usage-based billing

### 3. **Multi-Provider Strategy**
You support 7 different models:
- OpenAI (GPT-5, GPT-5 mini)
- Anthropic (Claude Sonnet/Haiku 4.5)
- Google (Gemini 2.5 Pro/Flash)
- Grok (Grok-4)

Each provider has different:
- Pricing models
- Rate limits
- Feature sets
- API structures

### 4. **Flexibility & Control**
- Full access to provider-specific features
- Custom retry logic per provider
- Custom rate limiting strategies
- No vendor lock-in

### 5. **Existing Architecture**
You already have `packages/ai/` designed for adapters:
```
packages/ai/
├── adapters/
│   ├── openai.ts
│   ├── anthropic.ts
│   ├── google.ts
│   └── grok.ts
```

This pattern fits **individual API keys** perfectly!

---

## Recommended Architecture

### Package Structure

```
packages/ai/
├── src/
│   ├── adapters/
│   │   ├── base.adapter.ts          # Base adapter interface
│   │   ├── openai.adapter.ts        # OpenAI adapter
│   │   ├── anthropic.adapter.ts     # Anthropic adapter
│   │   ├── google.adapter.ts        # Google adapter
│   │   └── grok.adapter.ts          # Grok adapter
│   ├── llm.service.ts               # Unified LLM service
│   ├── models.ts                    # Model registry
│   ├── types.ts                     # TypeScript types
│   └── utils/
│       ├── cost-calculator.ts       # Cost tracking
│       └── retry-handler.ts         # Retry logic
```

### Unified Adapter Pattern

**`packages/ai/src/adapters/base.adapter.ts`**:
```typescript
export interface LLMAdapter {
  generate(prompt: string, options: LLMOptions): Promise<LLMResponse>;
  stream(prompt: string, options: LLMOptions): AsyncGenerator<string>;
  calculateCost(tokens: number, model: string): number;
}

export interface LLMOptions {
  model: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface LLMResponse {
  content: string;
  tokens: {
    prompt: number;
    completion: number;
    total: number;
  };
  model: string;
  provider: string;
  cost: number;
}
```

**`packages/ai/src/llm.service.ts`**:
```typescript
import { OpenAIAdapter } from './adapters/openai.adapter';
import { AnthropicAdapter } from './adapters/anthropic.adapter';
import { GoogleAdapter } from './adapters/google.adapter';
import { GrokAdapter } from './adapters/grok.adapter';

export class LLMService {
  private adapters: Map<string, LLMAdapter> = new Map();

  constructor() {
    // Initialize adapters with API keys from environment
    this.adapters.set('openai', new OpenAIAdapter({
      apiKey: process.env.OPENAI_API_KEY!,
    }));
    
    this.adapters.set('anthropic', new AnthropicAdapter({
      apiKey: process.env.ANTHROPIC_API_KEY!,
    }));
    
    this.adapters.set('google', new GoogleAdapter({
      apiKey: process.env.GOOGLE_AI_API_KEY!,
    }));
    
    this.adapters.set('grok', new GrokAdapter({
      apiKey: process.env.GROK_API_KEY!,
    }));
  }

  async generate(
    provider: string,
    model: string,
    prompt: string,
    options: LLMOptions
  ): Promise<LLMResponse> {
    const adapter = this.adapters.get(provider);
    if (!adapter) {
      throw new Error(`Unknown provider: ${provider}`);
    }

    return adapter.generate(prompt, { ...options, model });
  }

  // Cost tracking
  trackUsage(response: LLMResponse, userId: string) {
    // Track usage in database
    // Update user's usage limits
    // Calculate billing
  }
}
```

### Backend Integration (NestJS)

**`apps/api/src/modules/llm/llm.service.ts`**:
```typescript
import { Injectable } from '@nestjs/common';
import { LLMService } from '@thoughtweaver/ai';

@Injectable()
export class LLMService {
  constructor(private llmService: LLMService) {}

  async generateResponse(
    userId: string,
    model: string,
    prompt: string,
    systemPrompt?: string
  ) {
    const [provider, modelName] = model.split('/'); // e.g., "openai/gpt-5"
    
    const response = await this.llmService.generate(
      provider,
      modelName,
      prompt,
      { systemPrompt }
    );

    // Track usage for billing
    await this.trackUsage(userId, response);

    return response;
  }

  private async trackUsage(userId: string, response: LLMResponse) {
    // Save to database
    // Update usage limits
    // Calculate costs
  }
}
```

---

## Environment Variables Setup

### Development

**`.env`**:
```env
# LLM API Keys (Individual)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_AI_API_KEY=...
GROK_API_KEY=...

# Optional: Rate limit overrides
OPENAI_RATE_LIMIT=100
ANTHROPIC_RATE_LIMIT=50
```

### Production

**`.env.production`**:
```env
# Use secure secret management
# Supabase Vault or AWS Secrets Manager
OPENAI_API_KEY=${VAULT_OPENAI_KEY}
ANTHROPIC_API_KEY=${VAULT_ANTHROPIC_KEY}
GOOGLE_AI_API_KEY=${VAULT_GOOGLE_KEY}
GROK_API_KEY=${VAULT_GROK_KEY}
```

---

## Cost Tracking Implementation

**`packages/ai/src/utils/cost-calculator.ts`**:
```typescript
interface Pricing {
  input: number;  // per 1M tokens
  output: number; // per 1M tokens
}

const PRICING: Record<string, Pricing> = {
  'openai/gpt-5': { input: 10, output: 30 },
  'openai/gpt-5-mini': { input: 0.15, output: 0.6 },
  'anthropic/claude-sonnet-4.5': { input: 3, output: 15 },
  'anthropic/claude-haiku-4.5': { input: 0.25, output: 1.25 },
  'google/gemini-2.5-pro': { input: 1.25, output: 5 },
  'google/gemini-2.5-flash': { input: 0.075, output: 0.3 },
  'grok/grok-4': { input: 1, output: 3 },
};

export function calculateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const pricing = PRICING[model];
  if (!pricing) {
    throw new Error(`Unknown model pricing: ${model}`);
  }

  const inputCost = (inputTokens / 1_000_000) * pricing.input;
  const outputCost = (outputTokens / 1_000_000) * pricing.output;

  return inputCost + outputCost;
}
```

---

## When to Consider Vercel AI SDK

Consider Vercel AI SDK if:

1. **Frontend-only AI calls** (not your case - you have NestJS backend)
2. **Simple use cases** (you need cost tracking, multi-provider)
3. **Deploying on Vercel** (you might deploy backend elsewhere)
4. **Rapid prototyping** (you're building production system)

**Note**: Vercel AI Gateway still requires individual API keys from providers. It just provides a unified interface and billing. You still pay providers directly.

---

## Migration Path (If Needed)

If you want to try Vercel AI SDK later:

```typescript
// Keep adapter pattern
// Add Vercel adapter as another option

export class VercelAdapter implements LLMAdapter {
  async generate(prompt: string, options: LLMOptions) {
    // Use Vercel AI SDK
    const { generateText } = await import('ai');
    // ...
  }
}
```

---

## Final Recommendation

### ✅ Use Individual API Keys

**Reasons:**
1. ✅ Matches your NestJS backend architecture
2. ✅ Provides granular cost tracking (required for billing)
3. ✅ Full control over provider features
4. ✅ Aligns with your `packages/ai/` adapter pattern
5. ✅ No vendor lock-in
6. ✅ Works with any hosting platform

### Implementation Steps

1. **Get API keys from all providers**:
   - OpenAI: https://platform.openai.com/api-keys
   - Anthropic: https://console.anthropic.com/
   - Google AI: https://makersuite.google.com/app/apikey
   - Grok: https://x.ai/api (when available)

2. **Set up adapter pattern** in `packages/ai/`

3. **Implement unified LLM service**

4. **Add cost tracking** per provider/model

5. **Test with each provider**

---

## Security Best Practices

### API Key Storage

```typescript
// ✅ Good: Use environment variables
const apiKey = process.env.OPENAI_API_KEY;

// ❌ Bad: Hardcode in code
const apiKey = 'sk-...';

// ✅ Good: Use secret management in production
const apiKey = await getSecret('openai-api-key');
```

### Key Rotation

```typescript
// Support multiple keys for rotation
const apiKeys = {
  primary: process.env.OPENAI_API_KEY!,
  secondary: process.env.OPENAI_API_KEY_SECONDARY,
};

// Rotate keys automatically
function getApiKey() {
  return apiKeys.primary || apiKeys.secondary;
}
```

### Rate Limiting

```typescript
// Implement per-provider rate limits
class RateLimiter {
  async checkLimit(provider: string, userId: string) {
    // Check rate limits
    // Track usage
    // Throw error if exceeded
  }
}
```

---

## Summary

**For Thoughtweaver:**

✅ **Use Individual API Keys** with unified adapter pattern  
✅ **Implement in `packages/ai/`** adapter layer  
✅ **Track costs per provider/model** for billing  
✅ **Keep flexibility** for future providers  

### Why Not Vercel AI SDK?

**We chose individual API keys over Vercel AI SDK for these reasons:**

1. **Backend Architecture**: NestJS backend (not Next.js Edge Functions) - Vercel AI SDK is optimized for Vercel Edge Functions
2. **Cost Tracking**: Need granular cost tracking per provider/model for billing - Vercel AI Gateway centralizes billing but loses granular tracking
3. **Full Control**: Need provider-specific features, custom retry logic, rate limiting - Vercel AI SDK abstracts away these details
4. **No Vendor Lock-in**: Can deploy backend anywhere - Vercel AI SDK locks you to Vercel ecosystem
5. **Multi-Provider Strategy**: 7 models across 4 providers with different pricing/features - Individual keys give full control
6. **Production Requirements**: Building production system needing enterprise-grade reliability - Individual keys provide necessary control

**Note**: Vercel AI Gateway still requires individual provider API keys. You still pay providers directly, so you don't save on API costs.

---

**Document Maintained By**: Architecture Team  
**Last Updated**: November 2025  
**Related Documents**: 
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)

