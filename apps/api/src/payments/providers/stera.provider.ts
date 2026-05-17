import { Injectable, BadRequestException } from '@nestjs/common';
import { IPaymentProvider, CreatePaymentResult, WebhookVerifyResult } from './payment-provider.interface';
import * as crypto from 'crypto';

/**
 * Stera Pack Provider — 三井住友カードの店頭端末決済
 * オンラインデポジットはStripe/PayJPで行い、Steraは来店時の最終支払い専用
 * createPaymentIntent は「端末に支払いリクエストを送る」用途
 */
@Injectable()
export class SteraProvider implements IPaymentProvider {
  readonly providerName = 'STERA';
  private apiKey: string;
  private terminalId: string;
  private webhookSecret: string;
  private apiBaseUrl: string;

  constructor() {
    this.apiKey = process.env.STERA_API_KEY || '';
    this.terminalId = process.env.STERA_TERMINAL_ID || '';
    this.webhookSecret = process.env.STERA_WEBHOOK_SECRET || '';
    this.apiBaseUrl = process.env.STERA_API_BASE_URL || 'https://api.stera.jp/v1';
  }

  async createPaymentIntent(
    amount: number,
    currency: string,
    metadata: Record<string, string>
  ): Promise<CreatePaymentResult> {
    // Stera Pack の支払いリクエスト — 端末にプッシュ通知を送る
    // 実際の API 呼び出しは Stera Pack の認証情報が必要
    const referenceId = `stera_${metadata.bookingId}_${Date.now()}`;

    if (this.apiKey && this.terminalId) {
      const body = JSON.stringify({
        amount,
        currency: 'JPY',
        referenceId,
        terminalId: this.terminalId,
        metadata,
      });

      const res = await fetch(`${this.apiBaseUrl}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body,
      });

      if (!res.ok) throw new BadRequestException(`Stera API error: ${res.status}`);
      const data = await res.json();

      return {
        providerReference: data.transactionId || referenceId,
        clientData: {
          instructions: '店頭のStera端末でお支払いください。',
          referenceId: data.transactionId || referenceId,
          amount,
          expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        },
        requiresClientAction: false,
      };
    }

    // 認証情報なし → スタブレスポンス（開発用）
    return {
      providerReference: referenceId,
      clientData: {
        instructions: '店頭のStera端末でお支払いください。',
        referenceId,
        amount,
      },
      requiresClientAction: false,
    };
  }

  async constructWebhookEvent(rawBody: Buffer, signature: string): Promise<WebhookVerifyResult> {
    if (this.webhookSecret) {
      const expected = crypto
        .createHmac('sha256', this.webhookSecret)
        .update(rawBody)
        .digest('hex');
      if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
        throw new BadRequestException('Invalid Stera webhook signature');
      }
    }

    const event = JSON.parse(rawBody.toString());

    if (event.event === 'payment.completed') {
      return {
        eventId: event.id || `stera_${Date.now()}`,
        eventType: 'payment.completed',
        bookingId: event.metadata?.bookingId || event.referenceId?.split('_')[1],
        amount: event.amount,
        currency: 'jpy',
        rawEvent: event,
      };
    }

    return {
      eventId: event.id || `stera_${Date.now()}`,
      eventType: event.event || 'unknown',
      rawEvent: event,
    };
  }
}
