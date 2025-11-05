// Base interfaces and types for AI adapters
export interface LLMOptions {
  model: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  messages?: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
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
  metadata?: Record<string, any>;
}

export interface LLMAdapter {
  generate(prompt: string, options: LLMOptions): Promise<LLMResponse>;
  stream?(prompt: string, options: LLMOptions): AsyncGenerator<string>;
  calculateCost(inputTokens: number, outputTokens: number, model: string): number;
}

export interface ProviderConfig {
  apiKey: string;
  baseURL?: string;
}

