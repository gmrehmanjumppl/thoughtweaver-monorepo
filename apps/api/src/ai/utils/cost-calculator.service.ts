import { Injectable } from '@nestjs/common';
import { ModelRegistryService } from '../models/model-registry.service';

@Injectable()
export class CostCalculatorService {
  constructor(private modelRegistry: ModelRegistryService) {}

  /**
   * Calculate cost for token usage
   */
  calculateCost(
    modelId: string,
    inputTokens: number,
    outputTokens: number,
  ): number {
    const model = this.modelRegistry.getModel(modelId);
    
    if (!model) {
      console.warn(`Model ${modelId} not found in registry`);
      return 0;
    }

    if (!model.costPerInputToken || !model.costPerOutputToken) {
      return 0;
    }

    const inputCost = (inputTokens / 1_000_000) * model.costPerInputToken;
    const outputCost = (outputTokens / 1_000_000) * model.costPerOutputToken;

    return inputCost + outputCost;
  }

  /**
   * Calculate estimated cost before API call
   */
  estimateCost(modelId: string, estimatedInputTokens: number, estimatedOutputTokens: number): number {
    return this.calculateCost(modelId, estimatedInputTokens, estimatedOutputTokens);
  }

  /**
   * Get pricing for model
   */
  getPricing(modelId: string): { input: number; output: number } | null {
    const model = this.modelRegistry.getModel(modelId);
    
    if (!model) {
      return null;
    }

    return {
      input: model.costPerInputToken || 0,
      output: model.costPerOutputToken || 0,
    };
  }
}


