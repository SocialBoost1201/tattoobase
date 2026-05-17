import { Injectable, BadRequestException } from '@nestjs/common';
import Payjp from 'payjp';
import { IPaymentProvider, CreatePaymentResult, WebhookVerifyResult } from './payment-provider.interface';
import * as crypto from 'crypto';

@Injectable()
export class PayjpProvider implements IPaymentProvider {
  readonly providerName = 'PAYJP';
  private payjp: any;
  private webhookSecret: string;
  private publicKey: string;

  constructor() {
    this.payjp = Payjp(process.env.PAYJP_SECRET_KEY || 'sk_test_mock_payjp');
    this.webhookSecret = process.env.PAYJP_WEBHOOK_SECRET || '';
    this.publicKey = process.env.PAYJP_PUBLIC_KEY || 'pk_test_mock_payjp';
  }

  async createPaymentIntent(
    amount: number,
    _currency: string,
    metadata: Record<string, string>
  ): Promise<CreatePaymentResult> {
    // Pay.jp はカードトークンが必要なため、ここでは設定情報のみ返す
    // 実際の charge はフロントエンドがトークン作成後に /payjp-charge で実行する
    return {
      providerReference: `payjp_pending_${metadata.bookingId}`,
      clientData: {
        publicKey: this.publicKey,
        amount,
        currency: 'jpy',
      },
      requiresClientAction: true,
    };
  }

  async chargeWithToken(token: string, amount: number, metadata: Record<string, string>): Promise<string> {
    const charge = await this.payjp.charges.create({
      card: token,
      amount,
      currency: 'jpy',
      capture: true,
      metadata,
    });
    return charge.id;
  }

  async constructWebhookEvent(rawBody: Buffer, signature: string): Promise<WebhookVerifyResult> {
    // Pay.jp のWebhook署名検証
    if (this.webhookSecret) {
      const expected = crypto
        .createHmac('sha256', this.webhookSecret)
        .update(rawBody)
        .digest('hex');
      if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
        throw new BadRequestException('Invalid Pay.jp webhook signature');
      }
    }

    const event = JSON.parse(rawBody.toString());
    const eventType: string = event.type || '';

    if (eventType === 'charge.succeeded') {
      const charge = event.data;
      return {
        eventId: event.id,
        eventType,
        bookingId: charge.metadata?.bookingId,
        amount: charge.amount,
        currency: charge.currency,
        rawEvent: event,
      };
    }

    return { eventId: event.id, eventType, rawEvent: event };
  }
}
