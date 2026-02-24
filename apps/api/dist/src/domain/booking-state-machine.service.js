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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingStateMachineService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const database_1 = require("@tattoobase/database");
let BookingStateMachineService = class BookingStateMachineService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async transitionToConfirmed(bookingId, paymentIntentId, amount, currency, requestId) {
        return this.prisma.$transaction(async (tx) => {
            const booking = await tx.booking.findUnique({ where: { id: bookingId } });
            if (!booking) {
                throw new common_1.BadRequestException('BOOKING_NOT_FOUND');
            }
            if (booking.status === database_1.BookingStatus.Confirmed) {
                const existingPayment = await tx.payment.findUnique({
                    where: { paymentIntentId },
                });
                if (existingPayment && existingPayment.bookingId === bookingId) {
                    return booking;
                }
                else {
                    throw new common_1.InternalServerErrorException('DATA_INCONSISTENCY: Booking is Confirmed but Payment does not exist or mismatches');
                }
            }
            if (booking.status !== database_1.BookingStatus.PendingPayment) {
                throw new common_1.BadRequestException('INVALID_STATE_TRANSITION');
            }
            const updatedBooking = await tx.booking.update({
                where: { id: bookingId },
                data: { status: database_1.BookingStatus.Confirmed },
            });
            const payment = await tx.payment.create({
                data: {
                    bookingId,
                    paymentIntentId,
                    status: database_1.PaymentStatus.Succeeded,
                    amount,
                    currency,
                },
            });
            await tx.auditLog.create({
                data: {
                    actorType: 'System',
                    actorId: 'StripeWebhook',
                    entityType: 'Booking',
                    entityId: bookingId,
                    action: 'STATE_CHANGED_TO_CONFIRMED',
                    beforeJson: booking,
                    afterJson: updatedBooking,
                    requestId,
                },
            });
            await tx.auditLog.create({
                data: {
                    actorType: 'System',
                    actorId: 'StripeWebhook',
                    entityType: 'Payment',
                    entityId: payment.id,
                    action: 'PAYMENT_CREATED',
                    beforeJson: database_1.Prisma.JsonNull,
                    afterJson: payment,
                    requestId,
                },
            });
            return updatedBooking;
        });
    }
};
exports.BookingStateMachineService = BookingStateMachineService;
exports.BookingStateMachineService = BookingStateMachineService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookingStateMachineService);
//# sourceMappingURL=booking-state-machine.service.js.map