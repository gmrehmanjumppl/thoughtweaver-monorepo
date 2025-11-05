import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { LLMAdapter, LLMOptions, LLMResponse } from '../../adapters/ai-adapter.interface';

@Injectable()
export class GoogleProvider implements LLMAdapter {
  private client: GoogleGenerativeAI | null = null;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GOOGLE_AI_API_KEY');
    
    if (!apiKey) {
      console.warn('Google AI API key not found. Google provider will be disabled.');
      return;
    }

    this.client = new GoogleGenerativeAI(apiKey);
  }

  async generate(prompt: string, options: LLMOptions): Promise<LLMResponse> {
    if (!this.client) {
      throw new Error('Google AI API key not configured');
    }

    try {
      const model = this.client.getGenerativeModel({
        model: this.mapModelName(options.model),
        systemInstruction: options.systemPrompt,
        generationConfig: {
          temperature: options.temperature ?? 0.7,
          maxOutputTokens: options.maxTokens,
        },
      });

      // Build prompt from messages or single prompt
      let fullPrompt = prompt;
      if (options.messages && options.messages.length > 0) {
        fullPrompt = options.messages
          .map((msg) => `${msg.role}: ${msg.content}`)
          .join('\n\n');
      }

      const result = await model.generateContent(fullPrompt);
      const response = result.response;
      const content = response.text();
      const usage = result.response.usageMetadata || { promptTokenCount: 0, candidatesTokenCount: 0 };

      const cost = this.calculateCost(
        usage.promptTokenCount || 0,
        usage.candidatesTokenCount || 0,
        options.model,
      );

      return {
        content,
        tokens: {
          prompt: usage.promptTokenCount || 0,
          completion: usage.candidatesTokenCount || 0,
          total: (usage.promptTokenCount || 0) + (usage.candidatesTokenCount || 0),
        },
        model: options.model,
        provider: 'google',
        cost,
        metadata: {
          finish_reason: response.candidates?.[0]?.finishReason,
        },
      };
    } catch (error: any) {
      throw new Error(`Google AI API error: ${error.message}`);
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
      'gemini-2.5-pro': 'gemini-2.0-flash-exp', // Update when 2.5 Pro is available
      'gemini-2.5-flash': 'gemini-2.0-flash-exp', // Update when 2.5 Flash is available
      'gemini-pro': 'gemini-pro',
      'gemini-flash': 'gemini-flash-1.5',
    };

    return modelMap[modelName] || modelName;
  }

  private getPricing(model: string): { input: number; output: number } {
    // Pricing per 1M tokens (USD)
    const pricing: Record<string, { input: number; output: number }> = {
      'gemini-2.5-pro': { input: 1.25, output: 5 }, // Estimated
      'gemini-2.5-flash': { input: 0.075, output: 0.3 }, // Estimated
      'gemini-pro': { input: 1.25, output: 5 },
      'gemini-flash': { input: 0.075, output: 0.3 },
    };

    return pricing[model] || { input: 0, output: 0 };
  }
}

