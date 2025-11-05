import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OpenAIProviderModule } from './providers/openai/openai.module';
import { AnthropicModule } from './providers/anthropic/anthropic.module';
import { GoogleModule } from './providers/google/google.module';
import { GrokModule } from './providers/grok/grok.module';
import { AIAdapterService } from './adapters/ai-adapter.service';
import { PromptService } from './prompts/prompt.service';
import { ModelRegistryService } from './models/model-registry.service';
import { CostCalculatorService } from './utils/cost-calculator.service';

@Module({
  imports: [
    ConfigModule,
    OpenAIProviderModule,
    AnthropicModule,
    GoogleModule,
    GrokModule,
  ],
  providers: [
    AIAdapterService,
    PromptService,
    ModelRegistryService,
    CostCalculatorService,
  ],
  exports: [
    AIAdapterService,
    PromptService,
    ModelRegistryService,
    CostCalculatorService,
  ],
})
export class AIModule {}

