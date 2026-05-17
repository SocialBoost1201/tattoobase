import { Controller, Post, Headers, Req, Res, HttpStatus, Param } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { BookingStateMachineService } from '../domain/booking-state-machine.service';
import { RequestWithId } from '../middleware/request-id.middleware';
import { PaymentProviderFactory, ProviderKey } from './payment-provider.factory';

@Controller('payments/webhook')
export class MultiProviderWebhookController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bookingStateMachine: BookingStateMachineService,
    private readonly providerFactory: PaymentProviderFactory,
  ) {}

  // POST /payments/webhook/:provider  (stripe | payjp | square | link | stera)
  @Post(':provider')
  async handleWebhook(
    @Param('provider') providerParam: string,
    @Headers('stripe-signature') stripeSignature: string,
    @Headers('x-payjp-signature') payjpSignature: string,
    @Headers('x-square-hmacsha256-signature') squareSignature: string,
    @Headers('x-stera-signature') steraSignature: string,
    @Req() req: RequestWithId & { rawBody?: Buffer },
    @Res() res: Response,
  ) {
    const key = providerParam.toUpperCase() as ProviderKey;

    let provider;
    try {
      provider = this.providerFactory.get(key);
    } catch {
      return res.status(HttpStatus.NOT_FOUND).send('Unknown provider');
    }

    if (!req.rawBody) {
      return res.status(HttpStatus.BAD_REQUEST).send('Raw body missing');
    }

    // プロバイダーごとの署名ヘッダー選択
    const signatureMap: Record<ProviderKey, string> = {
      STRIPE: stripeSignature,
      LINK: stripeSignature,
      PAYJP: payjpSignature,
      SQUARE: squareSignature,
      STERA: steraSignature,
    };
    const signature = signatureMap[key] || '';

    let webhookResult;
    try {
      webhookResult = await provider.constructWebhookEvent(req.rawBody, signature);
    } catch (err: any) {
      return res.status(HttpStatus.BAD_REQUEST).send(`Webhook Error: ${err.message}`);
    }

    const { eventId, eventType, bookingId, amount, currency } = webhookResult;
    const now = new Date();
    const lockExpiresAt = new Date(now.getTime() + 5 * 60 * 1000);

    // 冪等性ロック（全プロバイダー共通）
    try {
      await this.prisma.webhookEvent.create({
        data: {
          id: eventId,
          type: eventType,
          source: key,
          receivedAt: now,
          processingStartedAt: now,
          lockExpiresAt,
        },
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        const locked = await this.prisma.webhookEvent.updateMany({
          where: {
            id: eventId,
            processedAt: null,
            OR: [{ lockExpiresAt: null }, { lockExpiresAt: { lt: now } }],
          },
          data: { processingStartedAt: now, lockExpiresAt },
        });
        if (locked.count === 0) {
          return res.status(HttpStatus.OK).send('Already processed or currently processing');
        }
      } else {
        throw error;
      }
    }

    try {
      // 支払い成功イベントでステータス遷移
      const successEvents = [
        'payment_intent.succeeded',  // Stripe
        'checkout.session.completed', // Link
        'charge.succeeded',           // PayJP
        'payment.completed',          // Square / Stera
      ];

      if (successEvents.includes(eventType) && bookingId && amount != null && currency) {
        await this.bookingStateMachine.transitionToConfirmed(
          bookingId,
          eventId,
          amount,
          currency,
          req.requestId,
        );
      }

      await this.prisma.webhookEvent.update({
        where: { id: eventId },
        data: {
          processedAt: new Date(),
          processingStartedAt: null,
          lockExpiresAt: null,
          processingResultJson: { success: true, provider: key },
        },
      });

      return res.status(HttpStatus.OK).send();
    } catch (processError: any) {
      await this.prisma.webhookEvent.update({
        where: { id: eventId },
        data: {
          errorJson: { message: processError.message, stack: processError.stack },
          processingStartedAt: null,
          lockExpiresAt: null,
        },
      });
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
    }
  }
}
