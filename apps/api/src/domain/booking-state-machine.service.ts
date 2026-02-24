import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookingStatus, PaymentStatus, Booking, Prisma } from '@tattoobase/database';

@Injectable()
export class BookingStateMachineService {
    constructor(private readonly prisma: PrismaService) { }

    async transitionToConfirmed(
        bookingId: string,
        paymentIntentId: string,
        amount: number,
        currency: string,
        requestId: string
    ): Promise<Booking> {
        return this.prisma.$transaction(async (tx) => {
            const booking = await tx.booking.findUnique({ where: { id: bookingId } });

            if (!booking) {
                throw new BadRequestException('BOOKING_NOT_FOUND');
            }

            // 1. Confirmed冪等化の完全実装
            if (booking.status === BookingStatus.Confirmed) {
                const existingPayment = await tx.payment.findUnique({
                    where: { paymentIntentId },
                });

                // statusがConfirmedであり、対象PaymentIntentに対応するPaymentが存在し、bookingIdも一致する場合は成功扱い
                if (existingPayment && existingPayment.bookingId === bookingId) {
                    return booking;
                } else {
                    // statusがConfirmedだがPaymentが存在しない、または別Bookingの場合はデータ不整合
                    throw new InternalServerErrorException(
                        'DATA_INCONSISTENCY: Booking is Confirmed but Payment does not exist or mismatches'
                    );
                }
            }

            // 2. 正規遷移のチェック
            if (booking.status !== BookingStatus.PendingPayment) {
                throw new BadRequestException('INVALID_STATE_TRANSITION');
            }

            // 3. 正常遷移：Bookingのステータス更新
            const updatedBooking = await tx.booking.update({
                where: { id: bookingId },
                data: { status: BookingStatus.Confirmed },
            });

            // 4. Paymentレコードの作成。paymentIntentIdにより物理的にユニーク保証
            const payment = await tx.payment.create({
                data: {
                    bookingId,
                    paymentIntentId,
                    status: PaymentStatus.Succeeded,
                    amount,
                    currency,
                },
            });

            // 5. 監査ログ(Booking) - トランザクション必須
            await tx.auditLog.create({
                data: {
                    actorType: 'System',
                    actorId: 'StripeWebhook',
                    entityType: 'Booking',
                    entityId: bookingId,
                    action: 'STATE_CHANGED_TO_CONFIRMED',
                    beforeJson: booking as unknown as Prisma.InputJsonValue,
                    afterJson: updatedBooking as unknown as Prisma.InputJsonValue,
                    requestId,
                },
            });

            // 6. 監査ログ(Payment) - 同一トランザクションにて分離記録必須
            await tx.auditLog.create({
                data: {
                    actorType: 'System',
                    actorId: 'StripeWebhook',
                    entityType: 'Payment',
                    entityId: payment.id,
                    action: 'PAYMENT_CREATED',
                    beforeJson: Prisma.JsonNull,
                    afterJson: payment as unknown as Prisma.InputJsonValue,
                    requestId,
                },
            });

            return updatedBooking;
        });
    }
}
