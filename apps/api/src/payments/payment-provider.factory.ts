import { Injectable } from '@nestjs/common';
import { StripeProvider } from './providers/stripe.provider';
import { PayjpProvider } from './providers/payjp.provider';
import { SquareProvider } from './providers/square.provider';
import { LinkProvider } from './providers/link.provider';
import { SteraProvider } from './providers/stera.provider';
import { IPaymentProvider } from './providers/payment-provider.interface';

export type ProviderKey = 'STRIPE' | 'PAYJP' | 'SQUARE' | 'LINK' | 'STERA';

@Injectable()
export class PaymentProviderFactory {
  private readonly providers: Map<ProviderKey, IPaymentProvider>;

  constructor(
    private readonly stripe: StripeProvider,
    private readonly payjp: PayjpProvider,
    private readonly square: SquareProvider,
    private readonly link: LinkProvider,
    private readonly stera: SteraProvider,
  ) {
    this.providers = new Map<ProviderKey, IPaymentProvider>([
      ['STRIPE', stripe],
      ['PAYJP', payjp],
      ['SQUARE', square],
      ['LINK', link],
      ['STERA', stera],
    ]);
  }

  get(key: ProviderKey): IPaymentProvider {
    const provider = this.providers.get(key);
    if (!provider) throw new Error(`Unknown payment provider: ${key}`);
    return provider;
  }

  getAll(): ProviderKey[] {
    return Array.from(this.providers.keys());
  }
}
