import { Module } from '@nestjs/common';
import { UserApiController } from './user-api.controller';
import { UserApiBookingController } from './booking/booking.controller';
import { UserApiService } from './user-api.service';
import { PrismaModule } from '../prisma/prisma.module';
import { DomainModule } from '../domain/domain.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
    imports: [PrismaModule, DomainModule, PaymentsModule],
    controllers: [UserApiController, UserApiBookingController],
    providers: [UserApiService],
})
export class UserApiModule { }
