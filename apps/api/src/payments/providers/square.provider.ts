import { Injectable, BadRequestException } from '@nestjs/common';
import { IPaymentProvider, CreatePaymentResult, WebhookVerifyResult } from './payment-provider.interface';
import * as crypto from 'crypto';

@Injectable()
export class SquareProvider implements IPaymentProvider {
  readonly providerName = 'SQUARE';
  private accessToken: string;
  private locationId: string;
  private applicationId: string;
  private webhookSignatureKey: string;
  private environment: 'sandbox' | 'production';

  constructor() {
    this.accessToken = process.env.SQUARE_ACCESS_TOKEN || 'mock_square_token';
    this.locationId = process.env.SQUARE_LOCATION_ID || 'mock_location';
    this.applicationId = process.env.SQUARE_APPLICATION_ID || 'sandbox-sq0idb-mock';
    this.webhookSignatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY || '';
    this.environment = (process.env.SQUARE_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox';
  }

  async createPaymentIntent(
    amount: number,
    currency: string,
    metadata: Record<string, string>
  ): Promise<CreatePaymentResult> {
    // Square はフロントエンドでソースID（カードトークン）を作成してからサーバーに送る
    // ここではクライアントに必要な設定情報を返す
    const idempotencyKey = crypto.randomUUID();

    return {
      providerReference: `square_pending_${idempotencyKey}`,
      clientData: {
        applicationId: this.applicationId,
        locationId: this.locationId,
        amount,
        currency,
        environment: this.environment,
        idempotencyKey,
        metadata,
      },
      requiresClientAction: true,
    };
  }

  async constructWebhookEvent(rawBody: Buffer, signature: string): Promise<WebhookVerifyResult> {
    // Square webhook 署名検証
    if (this.webhookSignatureKey) {
      const hmac = crypto
        .createHmac('sha256', this.webhookSignatureKey)
        .update(rawBody)
        .digest('base64');
      if (hmac !== signature) {
        throw new BadRequestException('Invalid Square webhook signature');
      }
    }

    const event = JSON.parse(rawBody.toString());
    const eventType: string = event.type || '';

    if (eventType === 'payment.completed') {
      const payment = event.data?.object?.payment;
      return {
        eventId: event.event_id,
        eventType,
        bookingId: payment?.reference_id,
        amount: payment?.amount_money?.amount,
        currency: payment?.amount_money?.currency?.toLowerCase(),
        rawEvent: event,
      };
    }

    return { eventId: event.event_id || event.id, eventType, rawEvent: event };
  }
}
