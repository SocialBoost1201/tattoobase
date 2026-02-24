"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeWebhookController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const booking_state_machine_service_1 = require("../domain/booking-state-machine.service");
const stripe_1 = require("stripe");
let StripeWebhookController = class StripeWebhookController {
    constructor(prisma, bookingStateMachine) {
        this.prisma = prisma;
        this.bookingStateMachine = bookingStateMachine;
        this.endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test';
        this.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
            apiVersion: '2023-10-16'
        });
    }
    async handleWebhook(signature, req, res) {
        let event;
        try {
            if (!req.rawBody) {
                throw new Error('Raw body is missing');
            }
            event = this.stripe.webhooks.constructEvent(req.rawBody, signature, this.endpointSecret);
        }
        catch (err) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).send(`Webhook Error: ${err.message}`);
        }
        const now = new Date();
        const lockExpiresAt = new Date(now.getTime() + 5 * 60 * 1000);
        try {
            await this.prisma.webhookEvent.create({
                data: {
                    id: event.id,
                    type: event.type,
                    receivedAt: now,
                    processingStartedAt: now,
                    lockExpiresAt: lockExpiresAt,
                },
            });
        }
        catch (error) {
            if (error.code === 'P2002') {
                const locked = await this.prisma.webhookEvent.updateMany({
                    where: {
                        id: event.id,
                        processedAt: null,
                        OR: [
                            { lockExpiresAt: null },
                            { lockExpiresAt: { lt: now } }
                        ],
                    },
                    data: {
                        processingStartedAt: now,
                        lockExpiresAt: lockExpiresAt,
                    },
                });
                if (locked.count === 0) {
                    return res.status(common_1.HttpStatus.OK).send('Already processed or currently processing');
                }
            }
            else {
                throw error;
            }
        }
        try {
            if (event.type === 'payment_intent.succeeded') {
                const paymentIntent = event.data.object;
                const bookingId = paymentIntent.metadata?.bookingId;
                if (bookingId) {
                    const amount = paymentIntent.amount_received ?? paymentIntent.amount;
                    await this.bookingStateMachine.transitionToConfirmed(bookingId, paymentIntent.id, amount, paymentIntent.currency, req.requestId);
                }
            }
            await this.prisma.webhookEvent.update({
                where: { id: event.id },
                data: {
                    processedAt: new Date(),
                    processingStartedAt: null,
                    lockExpiresAt: null,
                    processingResultJson: { success: true },
                },
            });
            return res.status(common_1.HttpStatus.OK).send();
        }
        catch (processError) {
            await this.prisma.webhookEvent.update({
                where: { id: event.id },
                data: {
                    errorJson: { message: processError.message, stack: processError.stack },
                    processingStartedAt: null,
                    lockExpiresAt: null,
                },
            });
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).send();
        }
    }
};
exports.StripeWebhookController = StripeWebhookController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Headers)('stripe-signature')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], StripeWebhookController.prototype, "handleWebhook", null);
exports.StripeWebhookController = StripeWebhookController = __decorate([
    (0, common_1.Controller)('payments/webhook'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        booking_state_machine_service_1.BookingStateMachineService])
], StripeWebhookController);
//# sourceMappingURL=webhook.controller.js.map