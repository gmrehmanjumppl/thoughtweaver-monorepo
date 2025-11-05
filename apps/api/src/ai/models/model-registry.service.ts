import { Injectable } from '@nestjs/common';

export interface LLMModel {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'google' | 'grok';
  description: string;
  enabled: boolean;
  config: {
    temperature: number;
    maxTokens: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
  };
  costPerInputToken?: number; // per 1M tokens
  costPerOutputToken?: number; // per 1M tokens
}

@Injectable()
export class ModelRegistryService {
  private models: Map<string, LLMModel> = new Map();

  constructor() {
    this.initializeModels();
  }

  private initializeModels() {
    // OpenAI Models
    this.models.set('openai/gpt-5', {
      id: 'openai/gpt-5',
      name: 'GPT-5',
      provider: 'openai',
      description: 'Most capable GPT-5 model',
      enabled: true,
      config: {
        temperature: 0.7,
        maxTokens: 4096,
      },
      costPerInputToken: 10,
      costPerOutputToken: 30,
    });

    this.models.set('openai/gpt-5-mini', {
      id: 'openai/gpt-5-mini',
      name: 'GPT-5 Mini',
      provider: 'openai',
      description: 'Fast and efficient GPT-5 model',
      enabled: true,
      config: {
        temperature: 0.7,
        maxTokens: 16384,
      },
      costPerInputToken: 0.15,
      costPerOutputToken: 0.6,
    });

    // Anthropic Models
    this.models.set('anthropic/claude-sonnet-4.5', {
      id: 'anthropic/claude-sonnet-4.5',
      name: 'Claude Sonnet 4.5',
      provider: 'anthropic',
      description: 'Balanced performance and capability',
      enabled: true,
      config: {
        temperature: 0.7,
        maxTokens: 4096,
      },
      costPerInputToken: 3,
      costPerOutputToken: 15,
    });

    this.models.set('anthropic/claude-haiku-4.5', {
      id: 'anthropic/claude-haiku-4.5',
      name: 'Claude Haiku 4.5',
      provider: 'anthropic',
      description: 'Fast and cost-effective',
      enabled: true,
      config: {
        temperature: 0.7,
        maxTokens: 4096,
      },
      costPerInputToken: 0.25,
      costPerOutputToken: 1.25,
    });

    // Google Models
    this.models.set('google/gemini-2.5-pro', {
      id: 'google/gemini-2.5-pro',
      name: 'Gemini 2.5 Pro',
      provider: 'google',
      description: 'Most capable Gemini model',
      enabled: true,
      config: {
        temperature: 0.7,
        maxTokens: 8192,
      },
      costPerInputToken: 1.25,
      costPerOutputToken: 5,
    });

    this.models.set('google/gemini-2.5-flash', {
      id: 'google/gemini-2.5-flash',
      name: 'Gemini 2.5 Flash',
      provider: 'google',
      description: 'Fast and efficient Gemini model',
      enabled: true,
      config: {
        temperature: 0.7,
        maxTokens: 8192,
      },
      costPerInputToken: 0.075,
      costPerOutputToken: 0.3,
    });

    // Grok Models
    this.models.set('grok/grok-4', {
      id: 'grok/grok-4',
      name: 'Grok-4',
      provider: 'grok',
      description: 'Most capable Grok model',
      enabled: true,
      config: {
        temperature: 0.7,
        maxTokens: 4096,
      },
      costPerInputToken: 1,
      costPerOutputToken: 3,
    });
  }

  /**
   * Get model by ID
   */
  getModel(modelId: string): LLMModel | undefined {
    return this.models.get(modelId);
  }

  /**
   * Get all models
   */
  getAllModels(): LLMModel[] {
    return Array.from(this.models.values());
  }

  /**
   * Get models by provider
   */
  getModelsByProvider(provider: string): LLMModel[] {
    return Array.from(this.models.values()).filter(
      (model) => model.provider === provider,
    );
  }

  /**
   * Get enabled models only
   */
  getEnabledModels(): LLMModel[] {
    return Array.from(this.models.values()).filter((model) => model.enabled);
  }

  /**
   * Check if model exists
   */
  hasModel(modelId: string): boolean {
    return this.models.has(modelId);
  }

  /**
   * Parse model ID to provider and model name
   */
  parseModelId(modelId: string): { provider: string; modelName: string } {
    const [provider, ...modelParts] = modelId.split('/');
    return {
      provider,
      modelName: modelParts.join('/'),
    };
  }
}

