import { Controller, Post, Headers, Req, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { BookingStateMachineService } from '../domain/booking-state-machine.service';
import { RequestWithId } from '../middleware/request-id.middleware';
import Stripe from 'stripe';

@Controller('payments/webhook')
export class StripeWebhookController {
    private stripe: Stripe;
    // テスト時やローカル環境でのフォールバック
    private endpointSecret: string = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test';

    constructor(
        private readonly prisma: PrismaService,
        private readonly bookingStateMachine: BookingStateMachineService,
    ) {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
            apiVersion: '2023-10-16'
        });
    }

    @Post()
    async handleWebhook(
        @Headers('stripe-signature') signature: string,
        @Req() req: RequestWithId & { rawBody?: Buffer },
        @Res() res: Response
    ) {
        let event: Stripe.Event;

        try {
            if (!req.rawBody) {
                throw new Error('Raw body is missing');
            }
            // 署名検証 (raw bodyのみ許可)
            event = this.stripe.webhooks.constructEvent(req.rawBody, signature, this.endpointSecret);
        } catch (err: any) {
            return res.status(HttpStatus.BAD_REQUEST).send(`Webhook Error: ${err.message}`);
        }

        const now = new Date();
        // ロック有効期限設定: プロセススタック対策として5分後に有効期限切れとする
        const lockExpiresAt = new Date(now.getTime() + 5 * 60 * 1000);

        try {
            // 1. 初回受信：イベントをCreateしつつ、自身で排他ロック(processingStartedAt)も獲得する
            await this.prisma.webhookEvent.create({
                data: {
                    id: event.id,
                    type: event.type,
                    receivedAt: now,
                    processingStartedAt: now,
                    lockExpiresAt: lockExpiresAt,
                },
            });
        } catch (error: any) {
            if (error.code === 'P2002') {
                // 2. 二重受信時 (Unique制約違反): すでにEventが存在する場合のロック奪取戦略
                const locked = await this.prisma.webhookEvent.updateMany({
                    where: {
                        id: event.id,
                        processedAt: null, // 未完了
                        OR: [
                            { lockExpiresAt: null }, // 処理が開始されていない、もしくは失敗して解放された
                            { lockExpiresAt: { lt: now } } // 処理開始後プロセスが死に、ロックが期限切れ
                        ],
                    },
                    data: {
                        processingStartedAt: now,
                        lockExpiresAt: lockExpiresAt,
                    },
                });

                // 該当レコードをUpdateできなかった場合＝すでに完了済か、他スレッドが正常にロック中
                if (locked.count === 0) {
                    // 相手を妨害しないため再試行せず即座に200 OK
                    return res.status(HttpStatus.OK).send('Already processed or currently processing');
                }
            } else {
                throw error;
            }
        }

        // --- ロック取得成功範囲ここから ---
        try {
            if (event.type === 'payment_intent.succeeded') {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                const bookingId = paymentIntent.metadata?.bookingId;

                if (bookingId) {
                    // 金額は確定取得額(amount_received)を優先、通貨はStripes設定を正とする
                    const amount = paymentIntent.amount_received ?? paymentIntent.amount;
                    await this.bookingStateMachine.transitionToConfirmed(
                        bookingId,
                        paymentIntent.id,
                        amount,
                        paymentIntent.currency,
                        req.requestId
                    );
                }
            }

            // 処理成功：processedAtを記録し、ロック(StartedAt, lockExpiresAt)を解放する
            await this.prisma.webhookEvent.update({
                where: { id: event.id },
                data: {
                    processedAt: new Date(),
                    processingStartedAt: null,
                    lockExpiresAt: null,
                    processingResultJson: { success: true },
                },
            });

            return res.status(HttpStatus.OK).send();
        } catch (processError: any) {
            // 処理失敗時：再試行できるよう、StartedAtおよびロック期限をnullへ戻し解放する
            await this.prisma.webhookEvent.update({
                where: { id: event.id },
                data: {
                    errorJson: { message: processError.message, stack: processError.stack },
                    processingStartedAt: null,
                    lockExpiresAt: null,
                },
            });
            // 異常終了し、Stripeに再送を要求
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
        }
    }
}
