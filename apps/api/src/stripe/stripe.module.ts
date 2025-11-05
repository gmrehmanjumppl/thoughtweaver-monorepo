import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StripeService } from './stripe.service';
// Stripe controller and webhook service not implemented yet
// import { StripeController } from './stripe.controller';
// import { WebhookService } from './webhooks/webhook.service';

@Module({
  imports: [ConfigModule],
  // controllers: [StripeController],
  providers: [StripeService],
  // providers: [StripeService, WebhookService],
  exports: [StripeService],
})
export class StripeModule {}

