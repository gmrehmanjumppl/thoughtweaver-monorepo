# Billing & Usage Tracking Explained

## Overview

This document explains how billing and usage tracking works for LLM API calls in Thoughtweaver, including how to handle unauthenticated users.

---

## Database Schema

### 1. `subscriptions` Table

Stores user subscription plans and Stripe billing information:

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  team_id UUID REFERENCES teams(id),
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  plan TEXT CHECK (plan IN ('free', 'pro', 'team')),
  status TEXT CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Key Points:**
- Every user gets a **free** subscription auto-created on signup
- Pro/Team plans are created when user upgrades via Stripe
- `stripe_subscription_id` links to Stripe subscription

### 2. `usage_tracking` Table

Tracks all LLM usage (tokens, messages, conversations):

```sql
CREATE TABLE usage_tracking (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id), -- NULL for anonymous users
  team_id UUID REFERENCES teams(id),
  conversation_id UUID REFERENCES conversations(id),
  metric_type TEXT CHECK (metric_type IN ('conversation', 'message', 'token')),
  count INTEGER,
  cost_usd NUMERIC(10, 6), -- Cost in USD for token usage
  model_used TEXT, -- e.g., 'openai/gpt-5-mini'
  provider TEXT, -- e.g., 'openai', 'anthropic'
  metadata JSONB, -- { input_tokens: 100, output_tokens: 50 }
  created_at TIMESTAMP
);
```

**Key Points:**
- `user_id` can be NULL for anonymous/unauthenticated users
- Tracks cost per API call
- Stores token counts for billing calculations

---

## How Billing Works

### Scenario 1: Authenticated User (User in DB)

**Flow:**
1. User signs up → `profiles` table created → `subscriptions` table created (free plan)
2. User makes API call → API checks subscription → Allows/rejects based on plan limits
3. API call succeeds → Usage tracked in `usage_tracking` table with `user_id`
4. Monthly billing → Calculate usage from `usage_tracking` → Charge via Stripe

**Example:**
```typescript
// User makes API call
const user = await getUser(userId); // From auth token
const subscription = await getSubscription(userId); // 'free' or 'pro'

// Check limits
if (subscription.plan === 'free' && usageThisMonth > FREE_LIMIT) {
  throw new Error('Usage limit exceeded');
}

// Make API call
const response = await aiService.generate(...);

// Track usage
await usageTracking.create({
  user_id: userId,
  metric_type: 'token',
  count: response.tokens.total,
  cost_usd: calculateCost(response),
  model_used: 'openai/gpt-5-mini',
  provider: 'openai'
});
```

### Scenario 2: Unauthenticated User (No User in DB)

**Flow:**
1. Anonymous user makes API call → No `user_id` available
2. API allows limited usage (e.g., 5 requests per IP per day)
3. Usage tracked with `user_id = NULL` but with IP address or session ID in metadata
4. No billing (free tier for anonymous users)

**Example:**
```typescript
// Anonymous user makes API call
const sessionId = req.headers['x-session-id'] || generateSessionId();
const ipAddress = req.ip;

// Check anonymous limits (e.g., rate limiting)
const anonymousUsage = await getAnonymousUsage(sessionId, ipAddress);
if (anonymousUsage.requestsToday > ANONYMOUS_LIMIT) {
  throw new Error('Rate limit exceeded. Please sign up for more.');
}

// Make API call
const response = await aiService.generate(...);

// Track usage WITHOUT user_id
await usageTracking.create({
  user_id: null, // NULL for anonymous users
  metric_type: 'token',
  count: response.tokens.total,
  cost_usd: calculateCost(response),
  model_used: 'openai/gpt-5-mini',
  provider: 'openai',
  metadata: {
    session_id: sessionId,
    ip_address: ipAddress,
    anonymous: true
  }
});
```

---

## Billing Module Structure

### Current Status

✅ **Database Schema**: Created (`subscriptions`, `usage_tracking` tables)  
✅ **Stripe Module**: Exists (`apps/api/src/stripe/`)  
⚠️ **Billing Module**: Stub only (`apps/api/src/billing/`)  
❌ **Usage Tracking Service**: Not implemented  
❌ **Cost Calculation**: Not implemented  

### What Needs to Be Implemented

1. **Usage Tracking Service** (`apps/api/src/billing/usage-tracking.service.ts`)
   - Track LLM API calls
   - Calculate costs per provider/model
   - Store in `usage_tracking` table

2. **Billing Service** (`apps/api/src/billing/billing.service.ts`)
   - Get user subscription
   - Check usage limits
   - Calculate monthly costs
   - Integrate with Stripe

3. **Cost Calculator** (`packages/ai/src/utils/cost-calculator.ts`)
   - Calculate cost per API call
   - Support all providers (OpenAI, Anthropic, Google, Grok)

---

## Usage Limits by Plan

### Free Plan
- **Conversations**: 10/month
- **Messages**: 100/month
- **Tokens**: 10,000/month
- **Models**: GPT-5-mini only

### Pro Plan
- **Conversations**: Unlimited
- **Messages**: Unlimited
- **Tokens**: 1,000,000/month
- **Models**: All models

### Team Plan
- **Conversations**: Unlimited (shared)
- **Messages**: Unlimited (shared)
- **Tokens**: 5,000,000/month (shared)
- **Models**: All models

---

## Cost Calculation Example

```typescript
// Cost per 1M tokens (example prices)
const PRICING = {
  'openai/gpt-5': { input: 10, output: 30 }, // $10/M input, $30/M output
  'openai/gpt-5-mini': { input: 0.15, output: 0.6 },
  'anthropic/claude-sonnet-4.5': { input: 3, output: 15 },
  'google/gemini-2.5-pro': { input: 1.25, output: 5 },
};

function calculateCost(model: string, inputTokens: number, outputTokens: number): number {
  const pricing = PRICING[model];
  const inputCost = (inputTokens / 1_000_000) * pricing.input;
  const outputCost = (outputTokens / 1_000_000) * pricing.output;
  return inputCost + outputCost;
}

// Example: 1000 input tokens + 500 output tokens with GPT-5-mini
const cost = calculateCost('openai/gpt-5-mini', 1000, 500);
// = (1000/1M * 0.15) + (500/1M * 0.6) = $0.00045
```

---

## Handling Anonymous Users

### Strategy Options

**Option 1: Rate Limiting (Recommended)**
- Track by IP address or session ID
- Limit: 5 requests per IP per day
- No cost tracking (free for anonymous)
- Encourages signups

**Option 2: Temporary Session**
- Generate temporary session ID
- Store in `usage_tracking` with `user_id = NULL`
- Track usage for analytics
- No billing

**Option 3: Require Signup**
- Block all anonymous API calls
- Force signup before any usage
- All usage tracked with `user_id`

---

## Implementation Checklist

- [x] ✅ Add `subscriptions` table to migration
- [x] ✅ Add `usage_tracking` table to migration
- [x] ✅ Auto-create free subscription on signup
- [ ] ⏳ Implement Usage Tracking Service
- [ ] ⏳ Implement Cost Calculator
- [ ] ⏳ Implement Billing Service
- [ ] ⏳ Add rate limiting for anonymous users
- [ ] ⏳ Integrate with Stripe webhooks
- [ ] ⏳ Add usage limit checks in API endpoints

---

## Key Points

1. **Every user gets a free subscription** automatically on signup
2. **Usage is always tracked** in `usage_tracking` table (even for anonymous users with `user_id = NULL`)
3. **Costs are calculated** per API call based on provider/model pricing
4. **Anonymous users** are rate-limited but not billed
5. **Billing module** needs to be implemented (currently just database schema exists)

---

**Document Maintained By**: Development Team  
**Last Updated**: November 2025

