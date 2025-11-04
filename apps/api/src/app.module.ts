import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

// Configuration
import { AppConfigModule } from './config/config.module';

// Supabase Integration
import { SupabaseModule } from './supabase/supabase.module';

// External APIs
import { AIModule } from './ai/ai.module';
import { StripeModule } from './stripe/stripe.module';

// Authentication
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

// Business Modules
import { UsersModule } from './users/users.module';
import { ConversationsModule } from './conversations/conversations.module';
import { AssistantsModule } from './assistants/assistants.module';
import { WorkflowsModule } from './workflows/workflows.module';
import { MessagesModule } from './messages/messages.module';
import { ProjectsModule } from './projects/projects.module';
import { TeamsModule } from './teams/teams.module';
import { BillingModule } from './billing/billing.module';

// Health Check
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    // Configuration (loads first)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    AppConfigModule,

    // Supabase Integration
    SupabaseModule,

    // External APIs
    AIModule,
    StripeModule,

    // Authentication
    AuthModule,

    // Business Modules
    UsersModule,
    ConversationsModule,
    AssistantsModule,
    WorkflowsModule,
    MessagesModule,
    ProjectsModule,
    TeamsModule,
    BillingModule,

    // Health Check
    HealthModule,
  ],
  providers: [
    // Global JWT Auth Guard (applies to all routes by default)
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}

