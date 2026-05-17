export interface CreatePaymentResult {
  providerReference: string;   // Stripe: paymentIntentId, PayJP: chargeId, Square: paymentId
  clientData: Record<string, any>; // returned to frontend to complete payment
  requiresClientAction: boolean;
}

export interface WebhookVerifyResult {
  eventId: string;
  eventType: string;
  bookingId?: string;
  amount?: number;
  currency?: string;
  rawEvent: any;
}

export interface IPaymentProvider {
  readonly providerName: string;

  createPaymentIntent(
    amount: number,
    currency: string,
    metadata: Record<string, string>
  ): Promise<CreatePaymentResult>;

  constructWebhookEvent(
    rawBody: Buffer,
    signature: string
  ): Promise<WebhookVerifyResult>;
}
