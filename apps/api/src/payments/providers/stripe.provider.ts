import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { IPaymentProvider, CreatePaymentResult, WebhookVerifyResult } from './payment-provider.interface';

@Injectable()
export class StripeProvider implements IPaymentProvider {
  readonly providerName = 'STRIPE';
  private stripe: Stripe;
  private webhookSecret: string;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
      apiVersion: '2023-10-16',
    });
    this.webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test';
  }

  async createPaymentIntent(
    amount: number,
    currency: string,
    metadata: Record<string, string>
  ): Promise<CreatePaymentResult> {
    const intent = await this.stripe.paymentIntents.create({
      amount,
      currency,
      metadata,
      payment_method_types: ['card'],
    });

    return {
      providerReference: intent.id,
      clientData: { clientSecret: intent.client_secret },
      requiresClientAction: true,
    };
  }

  async constructWebhookEvent(rawBody: Buffer, signature: string): Promise<WebhookVerifyResult> {
    const event = this.stripe.webhooks.constructEvent(rawBody, signature, this.webhookSecret);

    if (event.type === 'payment_intent.succeeded') {
      const pi = event.data.object as Stripe.PaymentIntent;
      return {
        eventId: event.id,
        eventType: event.type,
        bookingId: pi.metadata?.bookingId,
        amount: pi.amount_received ?? pi.amount,
        currency: pi.currency,
        rawEvent: event,
      };
    }

    return { eventId: event.id, eventType: event.type, rawEvent: event };
  }
}
