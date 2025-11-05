import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// Stripe package not installed - commenting out for now
// import Stripe from 'stripe';

@Injectable()
export class StripeService {
  // Stripe implementation not completed yet
  // Uncomment when stripe package is installed: npm install stripe
  // private stripe: Stripe;

  constructor(private configService: ConfigService) {
    // const apiKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    // if (!apiKey) {
    //   throw new Error('Stripe secret key is missing');
    // }
    // this.stripe = new Stripe(apiKey, {
    //   apiVersion: '2024-11-20.acacia',
    // });
  }

  async createCustomer(email: string, name?: string) {
    throw new Error('Stripe not implemented yet');
  }

  async createSubscription(customerId: string, priceId: string) {
    throw new Error('Stripe not implemented yet');
  }

  async cancelSubscription(subscriptionId: string) {
    throw new Error('Stripe not implemented yet');
  }

  async getSubscription(subscriptionId: string) {
    throw new Error('Stripe not implemented yet');
  }
}

