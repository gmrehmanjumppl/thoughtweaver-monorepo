import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAIProvider } from '../providers/openai/openai.provider';
import { AnthropicProvider } from '../providers/anthropic/anthropic.provider';
import { GoogleProvider } from '../providers/google/google.provider';
import { GrokProvider } from '../providers/grok/grok.provider';
import { LLMAdapter, LLMOptions, LLMResponse } from './ai-adapter.interface';

@Injectable()
export class AIAdapterService {
  private adapters: Map<string, LLMAdapter> = new Map();

  constructor(
    private configService: ConfigService,
    private openaiProvider: OpenAIProvider,
    private anthropicProvider: AnthropicProvider,
    private googleProvider: GoogleProvider,
    private grokProvider: GrokProvider,
  ) {
    // Initialize adapters (only if API keys are configured)
    if (this.configService.get<string>('OPENAI_API_KEY')) {
      this.adapters.set('openai', this.openaiProvider);
    }
    if (this.configService.get<string>('ANTHROPIC_API_KEY')) {
      this.adapters.set('anthropic', this.anthropicProvider);
    }
    if (this.configService.get<string>('GOOGLE_AI_API_KEY')) {
      this.adapters.set('google', this.googleProvider);
    }
    if (this.configService.get<string>('GROK_API_KEY')) {
      this.adapters.set('grok', this.grokProvider);
    }
  }

  /**
   * Generate AI response using specified provider and model
   * @param provider Provider name (openai, anthropic, google, grok)
   * @param model Model identifier (e.g., 'gpt-5-mini', 'claude-sonnet-4.5')
   * @param prompt User prompt
   * @param options LLM options
   * @returns LLM response with content, tokens, and cost
   */
  async generate(
    provider: string,
    model: string,
    prompt: string,
    options: LLMOptions = {},
  ): Promise<LLMResponse> {
    const adapter = this.adapters.get(provider.toLowerCase());
    
    if (!adapter) {
      throw new Error(`Unknown provider: ${provider}. Available: ${Array.from(this.adapters.keys()).join(', ')}`);
    }

    return adapter.generate(prompt, {
      ...options,
      model,
    });
  }

  /**
   * Generate AI response from conversation messages
   * @param provider Provider name
   * @param model Model identifier
   * @param messages Conversation messages
   * @param options LLM options
   * @returns LLM response
   */
  async generateFromMessages(
    provider: string,
    model: string,
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
    options: Omit<LLMOptions, 'messages'> = {},
  ): Promise<LLMResponse> {
    const adapter = this.adapters.get(provider.toLowerCase());
    
    if (!adapter) {
      throw new Error(`Unknown provider: ${provider}`);
    }

    return adapter.generate('', {
      ...options,
      model,
      messages,
    });
  }

  /**
   * Calculate cost for token usage
   */
  calculateCost(provider: string, model: string, inputTokens: number, outputTokens: number): number {
    const adapter = this.adapters.get(provider.toLowerCase());
    
    if (!adapter) {
      throw new Error(`Unknown provider: ${provider}`);
    }

    return adapter.calculateCost(inputTokens, outputTokens, model);
  }

  /**
   * Get available providers
   */
  getAvailableProviders(): string[] {
    return Array.from(this.adapters.keys());
  }

  /**
   * Check if provider is available
   */
  isProviderAvailable(provider: string): boolean {
    return this.adapters.has(provider.toLowerCase());
  }
}


