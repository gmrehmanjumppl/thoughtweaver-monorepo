import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { LLMAdapter, LLMOptions, LLMResponse } from '../../adapters/ai-adapter.interface';

@Injectable()
export class AnthropicProvider implements LLMAdapter {
  private client: Anthropic | null = null;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('ANTHROPIC_API_KEY');
    
    if (!apiKey) {
      console.warn('Anthropic API key not found. Anthropic provider will be disabled.');
      return;
    }

    this.client = new Anthropic({
      apiKey,
    });
  }

  async generate(prompt: string, options: LLMOptions): Promise<LLMResponse> {
    if (!this.client) {
      throw new Error('Anthropic API key not configured');
    }

    try {
      const messages: Anthropic.MessageParam[] = [];

      // Use provided messages or create from prompt
      if (options.messages && options.messages.length > 0) {
        // Convert messages format
        for (const msg of options.messages) {
          if (msg.role === 'system') {
            // Anthropic handles system messages separately
            continue;
          }
          messages.push({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content,
          });
        }
      } else {
        messages.push({ role: 'user', content: prompt });
      }

      const response = await this.client.messages.create({
        model: this.mapModelName(options.model),
        messages,
        system: options.systemPrompt,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 4096,
      });

      const content = response.content[0]?.type === 'text' ? response.content[0].text : '';
      const usage = response.usage;

      const cost = this.calculateCost(
        usage.input_tokens,
        usage.output_tokens,
        options.model,
      );

      return {
        content,
        tokens: {
          prompt: usage.input_tokens,
          completion: usage.output_tokens,
          total: usage.input_tokens + usage.output_tokens,
        },
        model: response.model,
        provider: 'anthropic',
        cost,
        metadata: {
          stop_reason: response.stop_reason,
        },
      };
    } catch (error: any) {
      throw new Error(`Anthropic API error: ${error.message}`);
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
      'claude-sonnet-4.5': 'claude-sonnet-4-20250514', // Update when 4.5 is available
      'claude-haiku-4.5': 'claude-haiku-4-20250514', // Update when 4.5 is available
      'claude-opus': 'claude-opus-20240229',
      'claude-sonnet': 'claude-sonnet-20240229',
      'claude-haiku': 'claude-haiku-20240307',
    };

    return modelMap[modelName] || modelName;
  }

  private getPricing(model: string): { input: number; output: number } {
    // Pricing per 1M tokens (USD)
    const pricing: Record<string, { input: number; output: number }> = {
      'claude-sonnet-4.5': { input: 3, output: 15 }, // Estimated
      'claude-haiku-4.5': { input: 0.25, output: 1.25 }, // Estimated
      'claude-opus': { input: 15, output: 75 },
      'claude-sonnet': { input: 3, output: 15 },
      'claude-haiku': { input: 0.25, output: 1.25 },
    };

    return pricing[model] || { input: 0, output: 0 };
  }
}

