import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OpenAIProviderModule } from './providers/openai/openai.module';
import { AnthropicModule } from './providers/anthropic/anthropic.module';
import { GoogleModule } from './providers/google/google.module';
import { GrokModule } from './providers/grok/grok.module';
import { AIAdapterService } from './adapters/ai-adapter.service';
import { PromptService } from './prompts/prompt.service';
import { ModelRegistryService } from './models/model-registry.service';
import { CostCalculatorService } from './utils/cost-calculator.service';
import { ConversationAIService } from './services/conversation-ai.service';
import { AssistantsModule } from '../assistants/assistants.module';
import { ConversationsModule } from '../conversations/conversations.module';
import { MessagesModule } from '../messages/messages.module';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [
    ConfigModule,
    OpenAIProviderModule,
    AnthropicModule,
    GoogleModule,
    GrokModule,
    AssistantsModule,
    ConversationsModule,
    forwardRef(() => MessagesModule),
    SupabaseModule,
  ],
  providers: [
    AIAdapterService,
    PromptService,
    ModelRegistryService,
    CostCalculatorService,
    ConversationAIService,
  ],
  exports: [
    AIAdapterService,
    PromptService,
    ModelRegistryService,
    CostCalculatorService,
    ConversationAIService,
  ],
})
export class AIModule {}

