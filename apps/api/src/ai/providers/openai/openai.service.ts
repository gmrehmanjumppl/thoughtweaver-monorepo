import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class OpenAIService {
  private client: OpenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OpenAI API key is missing');
    }

    this.client = new OpenAI({
      apiKey,
    });
  }

  async createChatCompletion(messages: any[], model: string = 'gpt-4') {
    try {
      const response = await this.client.chat.completions.create({
        model,
        messages,
        temperature: 0.7,
      });

      return {
        content: response.choices[0]?.message?.content || '',
        usage: response.usage,
        model: response.model,
      };
    } catch (error) {
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }

  async createStreamingChatCompletion(messages: any[], model: string = 'gpt-4') {
    try {
      const stream = await this.client.chat.completions.create({
        model,
        messages,
        temperature: 0.7,
        stream: true,
      });

      return stream;
    } catch (error) {
      throw new Error(`OpenAI streaming error: ${error.message}`);
    }
  }
}

