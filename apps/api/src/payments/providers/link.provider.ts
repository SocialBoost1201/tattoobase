import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { IPaymentProvider, CreatePaymentResult, WebhookVerifyResult } from './payment-provider.interface';

/**
 * Link Provider — Stripe Payment Links を使ったシェア可能な決済URL生成
 * ユーザーに LINE / メールで送付できる一回限りの決済リンク
 */
@Injectable()
export class LinkProvider implements IPaymentProvider {
  readonly providerName = 'LINK';
  private stripe: Stripe;
  private webhookSecret: string;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
      apiVersion: '2023-10-16',
    });
    this.webhookSecret = process.env.STRIPE_LINK_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test';
  }

  async createPaymentIntent(
    amount: number,
    currency: string,
    metadata: Record<string, string>
  ): Promise<CreatePaymentResult> {
    // Stripe Price オブジェクトを一時作成してから Payment Link を生成
    const price = await this.stripe.prices.create({
      unit_amount: amount,
      currency,
      product_data: {
        name: metadata.description || 'タトゥーデポジット',
        metadata,
      },
    });

    const paymentLink = await this.stripe.paymentLinks.create({
      line_items: [{ price: price.id, quantity: 1 }],
      metadata,
      after_completion: {
        type: 'redirect',
        redirect: {
          url: `${process.env.APP_BASE_URL || 'https://tattoobase.vercel.app'}/booking/${metadata.bookingId}?success=true`,
        },
      },
    });

    return {
      providerReference: paymentLink.id,
      clientData: {
        paymentLinkUrl: paymentLink.url,
        paymentLinkId: paymentLink.id,
      },
      requiresClientAction: false,
    };
  }

  // Payment Links のイベントは checkout.session.completed で受信
  async constructWebhookEvent(rawBody: Buffer, signature: string): Promise<WebhookVerifyResult> {
    const event = this.stripe.webhooks.constructEvent(rawBody, signature, this.webhookSecret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      return {
        eventId: event.id,
        eventType: event.type,
        bookingId: session.metadata?.bookingId,
        amount: session.amount_total ?? 0,
        currency: session.currency ?? 'jpy',
        rawEvent: event,
      };
    }

    return { eventId: event.id, eventType: event.type, rawEvent: event };
  }
}
