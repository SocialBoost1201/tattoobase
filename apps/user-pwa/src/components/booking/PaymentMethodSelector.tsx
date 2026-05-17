'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { CheckoutForm } from './CheckoutForm';
import PayjpCheckoutForm from './PayjpCheckoutForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_mock');

interface PaymentMethodSelectorProps {
  bookingId: string;
  provider: string;
  paymentClientData: Record<string, any>;
  amount: number;
}

const PROVIDER_LABELS: Record<string, string> = {
  STRIPE: 'クレジットカード（Stripe）',
  PAYJP: 'クレジットカード（Pay.jp）',
  SQUARE: 'Square決済',
  LINK: '決済リンク（LINE・メール送付）',
  STERA: 'Stera Pack（店頭端末）',
};

const PROVIDER_ICONS: Record<string, string> = {
  STRIPE: '💳',
  PAYJP: '💳',
  SQUARE: '🟦',
  LINK: '🔗',
  STERA: '🏪',
};

export default function PaymentMethodSelector({
  bookingId,
  provider,
  paymentClientData,
  amount,
}: PaymentMethodSelectorProps) {
  const [copied, setCopied] = useState(false);

  const label = PROVIDER_LABELS[provider] ?? provider;
  const icon = PROVIDER_ICONS[provider] ?? '💳';

  // --- Stripe ---
  if (provider === 'STRIPE' && paymentClientData.clientSecret) {
    return (
      <div className="space-y-4">
        <ProviderBadge icon={icon} label={label} />
        <Elements
          stripe={stripePromise}
          options={{ clientSecret: paymentClientData.clientSecret, appearance: { theme: 'night' } }}
        >
          <CheckoutForm clientSecret={paymentClientData.clientSecret} bookingId={bookingId} />
        </Elements>
      </div>
    );
  }

  // --- Pay.jp ---
  if (provider === 'PAYJP') {
    return (
      <div className="space-y-4">
        <ProviderBadge icon={icon} label={label} />
        <PayjpCheckoutForm
          publicKey={paymentClientData.publicKey}
          bookingId={bookingId}
          amount={amount}
        />
      </div>
    );
  }

  // --- Link（決済リンク）---
  if (provider === 'LINK' && paymentClientData.paymentLinkUrl) {
    const url: string = paymentClientData.paymentLinkUrl;
    const handleCopy = () => {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
    return (
      <div className="space-y-4">
        <ProviderBadge icon={icon} label={label} />
        <div className="glass rounded-2xl p-5 space-y-4 border border-white/10">
          <p className="text-white/60 text-sm leading-relaxed">
            以下のリンクをLINEやメールでシェアしてお支払いください。
          </p>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
            <span className="text-white/50 text-xs truncate flex-1">{url}</span>
            <button
              onClick={handleCopy}
              className="text-xs font-bold text-white/60 hover:text-white transition-colors shrink-0"
            >
              {copied ? '✓ コピー済' : 'コピー'}
            </button>
          </div>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-white text-black font-bold text-center py-4 rounded-2xl hover:bg-white/90 transition-all font-heading"
          >
            このデバイスで支払う
          </a>
        </div>
      </div>
    );
  }

  // --- Stera Pack（店頭端末）---
  if (provider === 'STERA') {
    return (
      <div className="space-y-4">
        <ProviderBadge icon={icon} label={label} />
        <div className="glass rounded-2xl p-5 border border-white/10 space-y-3">
          <p className="text-white font-bold text-sm">店頭のStera端末でお支払いください</p>
          <div className="space-y-2 text-white/50 text-xs leading-relaxed">
            <p>① スタジオにご来店ください</p>
            <p>② スタッフにこちらの予約番号をお伝えください</p>
            <p className="font-mono text-white/70 text-sm border border-white/15 rounded-lg px-3 py-2 bg-white/3">
              #{bookingId.slice(-8).toUpperCase()}
            </p>
            <p>③ Steraの端末にカードをタッチまたは挿入してください</p>
          </div>
          {paymentClientData.instructions && (
            <p className="text-amber-400/80 text-xs border border-amber-500/20 bg-amber-500/5 rounded-xl px-3 py-2">
              {paymentClientData.instructions}
            </p>
          )}
        </div>
      </div>
    );
  }

  // --- Square ---
  if (provider === 'SQUARE') {
    return (
      <div className="space-y-4">
        <ProviderBadge icon={icon} label={label} />
        <div className="glass rounded-2xl p-5 border border-white/10">
          <p className="text-white/50 text-sm">Square Web Payments SDKで決済します。</p>
          <p className="text-white/30 text-xs mt-2">（Square SDK統合は開発中です）</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-5 border border-red-500/20">
      <p className="text-red-400 text-sm">未対応の決済プロバイダー: {provider}</p>
    </div>
  );
}

function ProviderBadge({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-white/50 text-xs">
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
}
