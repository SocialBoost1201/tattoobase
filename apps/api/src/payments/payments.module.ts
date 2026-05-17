import { Module } from '@nestjs/common';
import { MultiProviderWebhookController } from './webhook.controller';
import { DomainModule } from '../domain/domain.module';
import { PaymentProviderFactory } from './payment-provider.factory';
import { StripeProvider } from './providers/stripe.provider';
import { PayjpProvider } from './providers/payjp.provider';
import { SquareProvider } from './providers/square.provider';
import { LinkProvider } from './providers/link.provider';
import { SteraProvider } from './providers/stera.provider';

const PROVIDERS = [StripeProvider, PayjpProvider, SquareProvider, LinkProvider, SteraProvider];

@Module({
  imports: [DomainModule],
  controllers: [MultiProviderWebhookController],
  providers: [...PROVIDERS, PaymentProviderFactory],
  exports: [PaymentProviderFactory, ...PROVIDERS],
})
export class PaymentsModule {}
