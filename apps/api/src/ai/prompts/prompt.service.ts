import { Injectable } from '@nestjs/common';

@Injectable()
export class PromptService {
  /**
   * Build system prompt from assistant configuration
   */
  buildSystemPrompt(assistant: {
    systemPrompt: string;
    personality?: Record<string, any>;
  }): string {
    let prompt = assistant.systemPrompt;

    if (assistant.personality) {
      const personalityStr = this.formatPersonality(assistant.personality);
      prompt = `${prompt}\n\nPersonality Traits:\n${personalityStr}`;
    }

    return prompt;
  }

  /**
   * Build conversation context from messages
   */
  buildConversationContext(messages: Array<{ role: string; content: string }>): string {
    return messages
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join('\n\n');
  }

  /**
   * Format personality traits for prompt
   */
  private formatPersonality(personality: Record<string, any>): string {
    return Object.entries(personality)
      .map(([key, value]) => `- ${key}: ${value}`)
      .join('\n');
  }

  /**
   * Inject context into prompt
   */
  injectContext(prompt: string, context: string): string {
    if (!context) return prompt;
    return `Context:\n${context}\n\nPrompt:\n${prompt}`;
  }

  /**
   * Build prompt for workflow step
   */
  buildWorkflowPrompt(
    stepTitle: string,
    stepDescription: string,
    userPrompt: string,
  ): string {
    return `Workflow Step: ${stepTitle}\n\nDescription: ${stepDescription}\n\nUser Request: ${userPrompt}`;
  }
}

