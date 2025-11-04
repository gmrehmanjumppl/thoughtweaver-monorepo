import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AIModule } from './providers/openai/openai.module';
import { AnthropicModule } from './providers/anthropic/anthropic.module';
import { GoogleModule } from './providers/google/google.module';
import { GrokModule } from './providers/grok/grok.module';
import { AIAdapterService } from './adapters/ai-adapter.service';
import { PromptService } from './prompts/prompt.service';
import { ModelRegistryService } from './models/model-registry.service';

@Module({
  imports: [
    ConfigModule,
    AIModule,
    AnthropicModule,
    GoogleModule,
    GrokModule,
  ],
  providers: [
    AIAdapterService,
    PromptService,
    ModelRegistryService,
  ],
  exports: [
    AIAdapterService,
    PromptService,
    ModelRegistryService,
  ],
})
export class AIModule {}

