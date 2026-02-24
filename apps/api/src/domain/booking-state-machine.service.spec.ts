import { BookingStateMachineService } from './booking-state-machine.service';
import { BookingStatus } from '@tattoobase/database';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';

describe('BookingStateMachineService', () => {
    let service: BookingStateMachineService;
    let mockPrisma: any;

    beforeEach(() => {
        mockPrisma = {
            $transaction: jest.fn((cb) => cb(mockPrisma)),
            booking: { findUnique: jest.fn(), update: jest.fn() },
            payment: { findUnique: jest.fn(), create: jest.fn() },
            auditLog: { create: jest.fn() },
        };
        service = new BookingStateMachineService(mockPrisma);
    });

    it('Confirmed遷移時に既にConfirmedかつPaymentが存在しbookingId一致なら成功扱い(冪等)', async () => {
        mockPrisma.booking.findUnique.mockResolvedValue({ id: 'b1', status: BookingStatus.Confirmed });
        mockPrisma.payment.findUnique.mockResolvedValue({ paymentIntentId: 'pi_test', bookingId: 'b1' });

        const result = await service.transitionToConfirmed('b1', 'pi_test', 1000, 'jpy', 'req_x');
        expect(result.status).toBe(BookingStatus.Confirmed);
        expect(mockPrisma.booking.update).not.toHaveBeenCalled();
        expect(mockPrisma.auditLog.create).not.toHaveBeenCalled();
    });

    it('Confirmed遷移時に既にConfirmedだがPaymentが不一致/不在ならデータ不整合エラー', async () => {
        mockPrisma.booking.findUnique.mockResolvedValue({ id: 'b1', status: BookingStatus.Confirmed });
        mockPrisma.payment.findUnique.mockResolvedValue(null);

        await expect(service.transitionToConfirmed('b1', 'pi_err', 1000, 'jpy', 'req_y'))
            .rejects.toThrow(InternalServerErrorException);
    });

    it('PendingPayment以外からのConfirmed遷移要求は拒否される(INVALID_STATE_TRANSITION)', async () => {
        mockPrisma.booking.findUnique.mockResolvedValue({ id: 'b2', status: BookingStatus.Draft });

        await expect(service.transitionToConfirmed('b2', 'pi_err2', 1000, 'jpy', 'req_z'))
            .rejects.toThrow(BadRequestException);
    });
});
