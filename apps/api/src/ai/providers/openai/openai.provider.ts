import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { LLMAdapter, LLMOptions, LLMResponse } from '../../adapters/ai-adapter.interface';

@Injectable()
export class OpenAIProvider implements LLMAdapter {
  private client: OpenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    
    if (!apiKey) {
      console.warn('OpenAI API key not found. OpenAI provider will be disabled.');
      return;
    }

    this.client = new OpenAI({
      apiKey,
    });
  }

  async generate(prompt: string, options: LLMOptions): Promise<LLMResponse> {
    if (!this.client) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

      // Add system prompt if provided
      if (options.systemPrompt) {
        messages.push({ role: 'system', content: options.systemPrompt });
      }

      // Use provided messages or create from prompt
      if (options.messages && options.messages.length > 0) {
        messages.push(...options.messages as OpenAI.Chat.ChatCompletionMessageParam[]);
      } else {
        messages.push({ role: 'user', content: prompt });
      }

      const response = await this.client.chat.completions.create({
        model: this.mapModelName(options.model),
        messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens,
      });

      const content = response.choices[0]?.message?.content || '';
      const usage = response.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };

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
        model: response.model,
        provider: 'openai',
        cost,
        metadata: {
          finish_reason: response.choices[0]?.finish_reason,
        },
      };
    } catch (error: any) {
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }

  calculateCost(inputTokens: number, outputTokens: number, model: string): number {
    const pricing = this.getPricing(model);
    const inputCost = (inputTokens / 1_000_000) * pricing.input;
    const outputCost = (outputTokens / 1_000_000) * pricing.output;
    return inputCost + outputCost;
  }

  private mapModelName(modelName: string): string {
    // Map our model names to OpenAI model names
    const modelMap: Record<string, string> = {
      'gpt-5': 'gpt-4-turbo-preview', // Placeholder - update when GPT-5 is available
      'gpt-5-mini': 'gpt-4o-mini', // Placeholder - update when GPT-5-mini is available
      'gpt-4': 'gpt-4',
      'gpt-4-turbo': 'gpt-4-turbo-preview',
      'gpt-3.5-turbo': 'gpt-3.5-turbo',
    };

    return modelMap[modelName] || modelName;
  }

  private getPricing(model: string): { input: number; output: number } {
    // Pricing per 1M tokens (USD)
    const pricing: Record<string, { input: number; output: number }> = {
      'gpt-5': { input: 10, output: 30 }, // Estimated
      'gpt-5-mini': { input: 0.15, output: 0.6 }, // Estimated
      'gpt-4-turbo': { input: 10, output: 30 },
      'gpt-4': { input: 30, output: 60 },
      'gpt-3.5-turbo': { input: 0.5, output: 1.5 },
    };

    return pricing[model] || { input: 0, output: 0 };
  }
}

