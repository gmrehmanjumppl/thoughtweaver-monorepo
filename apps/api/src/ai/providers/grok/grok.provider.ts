import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LLMAdapter, LLMOptions, LLMResponse } from '../../adapters/ai-adapter.interface';

@Injectable()
export class GrokProvider implements LLMAdapter {
  private apiKey: string | null = null;
  private baseURL: string = 'https://api.x.ai/v1';

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GROK_API_KEY');
    
    if (!apiKey) {
      console.warn('Grok API key not found. Grok provider will be disabled.');
      return;
    }

    this.apiKey = apiKey;
  }

  async generate(prompt: string, options: LLMOptions): Promise<LLMResponse> {
    if (!this.apiKey) {
      throw new Error('Grok API key not configured');
    }

    try {
      // Grok API follows OpenAI-compatible format
      const messages: Array<{ role: string; content: string }> = [];

      if (options.systemPrompt) {
        messages.push({ role: 'system', content: options.systemPrompt });
      }

      if (options.messages && options.messages.length > 0) {
        messages.push(...options.messages);
      } else {
        messages.push({ role: 'user', content: prompt });
      }

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.mapModelName(options.model),
          messages,
          temperature: options.temperature ?? 0.7,
          max_tokens: options.maxTokens,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Grok API error: ${error.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';
      const usage = data.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };

      const cost = this.calculateCost(
        usage.prompt_tokens,
        usage.completion_tokens,
        options.model,
      );

      return {
        content,
        tokens: {
          prompt: usage.prompt_tokens,
          completion: usage.completion_tokens,
          total: usage.total_tokens,
        },
        model: data.model,
        provider: 'grok',
        cost,
        metadata: {
          finish_reason: data.choices[0]?.finish_reason,
        },
      };
    } catch (error: any) {
      throw new Error(`Grok API error: ${error.message}`);
    }
  }

  calculateCost(inputTokens: number, outputTokens: number, model: string): number {
    const pricing = this.getPricing(model);
    const inputCost = (inputTokens / 1_000_000) * pricing.input;
    const outputCost = (outputTokens / 1_000_000) * pricing.output;
    return inputCost + outputCost;
  }

  private mapModelName(modelName: string): string {
    const modelMap: Record<string, string> = {
      'grok-4': 'grok-beta', // Update when Grok-4 is available
      'grok': 'grok-beta',
    };

    return modelMap[modelName] || modelName;
  }

  private getPricing(model: string): { input: number; output: number } {
    // Pricing per 1M tokens (USD) - Estimated
    const pricing: Record<string, { input: number; output: number }> = {
      'grok-4': { input: 1, output: 3 }, // Estimated
      'grok': { input: 1, output: 3 },
    };

    return pricing[model] || { input: 0, output: 0 };
  }
}

