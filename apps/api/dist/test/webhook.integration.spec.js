"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("supertest");
const stripeModule = require("stripe");
describe('StripeWebhook Integration', () => {
    let app;
    let prisma;
    beforeAll(async () => {
        app = {};
        app.getHttpServer = jest.fn();
        prisma = {
            booking: { create: jest.fn(), update: jest.fn() },
            payment: { create: jest.fn(), findUnique: jest.fn(), findMany: jest.fn() },
            webhookEvent: { create: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
            auditLog: { create: jest.fn(), findMany: jest.fn() }
        };
    });
    it('並列のWebhook二重受信時、ロック奪取/排他が正常に働き副作用(決済・監査ログ)が1回だけ起こる', async () => {
        const booking = await prisma.booking.create({
            data: {
                userId: 'u_test_dup', studioId: 's_test_dup', status: 'PendingPayment',
                scheduledAtUtc: new Date(), scheduledAtLocal: new Date(), studioTz: 'Asia/Tokyo',
            },
        });
        const mockEventId = 'evt_duplicate_case';
        const mockPaymentIntentId = 'pi_duplicate_case';
        const payloadBuffer = Buffer.from(JSON.stringify({
            id: mockEventId, type: 'payment_intent.succeeded',
            data: { object: { id: mockPaymentIntentId, metadata: { bookingId: booking.id }, amount_received: 50000, currency: 'jpy' } }
        }));
        jest.spyOn(stripeModule.Stripe.prototype.webhooks, 'constructEvent').mockReturnValue(JSON.parse(payloadBuffer.toString()));
        const headers = { 'stripe-signature': 'sigMock', 'x-request-id': 'req_parallel' };
        const req1 = request(app.getHttpServer()).post('/payments/webhook').set(headers).send(payloadBuffer);
        const req2 = request(app.getHttpServer()).post('/payments/webhook').set(headers).send(payloadBuffer);
        const [res1, res2] = await Promise.all([req1, req2]);
        expect(res1.status).toBe(200);
        expect(res2.status).toBe(200);
        const payments = await prisma.payment.findMany({ where: { paymentIntentId: mockPaymentIntentId } });
        expect(payments.length).toBe(1);
        const bookingLogs = await prisma.auditLog.findMany({ where: { action: 'STATE_CHANGED_TO_CONFIRMED' } });
        const paymentLogs = await prisma.auditLog.findMany({ where: { action: 'PAYMENT_CREATED' } });
        expect(bookingLogs.length).toBe(1);
        expect(paymentLogs.length).toBe(1);
    });
    it('プロセス死などでロックが残存(lockExpiresAt超過)した場合、更新夺取して再実行できること', async () => {
        const mockEventId = 'evt_stuck_lock_test';
        const pastTime = new Date(Date.now() - 10 * 60 * 1000);
        await prisma.webhookEvent.create({
            data: {
                id: mockEventId, type: 'payment_intent.succeeded',
                receivedAt: pastTime, processingStartedAt: pastTime, lockExpiresAt: pastTime,
                processedAt: null
            }
        });
        const mockPaymentIntentId = 'pi_hijack_test';
        const booking = await prisma.booking.create({
            data: { userId: 'uHK', studioId: 'sHK', status: 'PendingPayment' }
        });
        const payloadBuffer = Buffer.from(JSON.stringify({
            id: mockEventId, type: 'payment_intent.succeeded',
            data: { object: { id: mockPaymentIntentId, metadata: { bookingId: booking.id }, amount_received: 1000, currency: 'jpy' } }
        }));
        jest.spyOn(stripeModule.Stripe.prototype.webhooks, 'constructEvent').mockReturnValue(JSON.parse(payloadBuffer.toString()));
        const res = await request(app.getHttpServer())
            .post('/payments/webhook')
            .set({ 'stripe-signature': 'sigMock', 'x-request-id': 'req_hijack' })
            .send(payloadBuffer);
        expect(res.status).toBe(200);
        const eventCheck = await prisma.webhookEvent.findUnique({ where: { id: mockEventId } });
        expect(eventCheck.processedAt).not.toBeNull();
        expect(eventCheck.lockExpiresAt).toBeNull();
        const paymentCheck = await prisma.payment.findUnique({ where: { paymentIntentId: mockPaymentIntentId } });
        expect(paymentCheck).not.toBeNull();
    });
});
//# sourceMappingURL=webhook.integration.spec.js.map