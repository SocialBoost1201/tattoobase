"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const booking_state_machine_service_1 = require("./booking-state-machine.service");
const database_1 = require("@tattoobase/database");
const common_1 = require("@nestjs/common");
describe('BookingStateMachineService', () => {
    let service;
    let mockPrisma;
    beforeEach(() => {
        mockPrisma = {
            $transaction: jest.fn((cb) => cb(mockPrisma)),
            booking: { findUnique: jest.fn(), update: jest.fn() },
            payment: { findUnique: jest.fn(), create: jest.fn() },
            auditLog: { create: jest.fn() },
        };
        service = new booking_state_machine_service_1.BookingStateMachineService(mockPrisma);
    });
    it('Confirmed遷移時に既にConfirmedかつPaymentが存在しbookingId一致なら成功扱い(冪等)', async () => {
        mockPrisma.booking.findUnique.mockResolvedValue({ id: 'b1', status: database_1.BookingStatus.Confirmed });
        mockPrisma.payment.findUnique.mockResolvedValue({ paymentIntentId: 'pi_test', bookingId: 'b1' });
        const result = await service.transitionToConfirmed('b1', 'pi_test', 1000, 'jpy', 'req_x');
        expect(result.status).toBe(database_1.BookingStatus.Confirmed);
        expect(mockPrisma.booking.update).not.toHaveBeenCalled();
        expect(mockPrisma.auditLog.create).not.toHaveBeenCalled();
    });
    it('Confirmed遷移時に既にConfirmedだがPaymentが不一致/不在ならデータ不整合エラー', async () => {
        mockPrisma.booking.findUnique.mockResolvedValue({ id: 'b1', status: database_1.BookingStatus.Confirmed });
        mockPrisma.payment.findUnique.mockResolvedValue(null);
        await expect(service.transitionToConfirmed('b1', 'pi_err', 1000, 'jpy', 'req_y'))
            .rejects.toThrow(common_1.InternalServerErrorException);
    });
    it('PendingPayment以外からのConfirmed遷移要求は拒否される(INVALID_STATE_TRANSITION)', async () => {
        mockPrisma.booking.findUnique.mockResolvedValue({ id: 'b2', status: database_1.BookingStatus.Draft });
        await expect(service.transitionToConfirmed('b2', 'pi_err2', 1000, 'jpy', 'req_z'))
            .rejects.toThrow(common_1.BadRequestException);
    });
});
//# sourceMappingURL=booking-state-machine.service.spec.js.map