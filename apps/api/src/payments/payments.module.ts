import { Module } from '@nestjs/common';
import { StripeWebhookController } from './webhook.controller';
import { DomainModule } from '../domain/domain.module';

@Module({
    imports: [DomainModule],
    controllers: [StripeWebhookController],
})
export class PaymentsModule {}