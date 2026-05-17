'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE } from '@/lib/api';

interface PayjpCheckoutFormProps {
  publicKey: string;
  bookingId: string;
  amount: number;
}

declare global {
  interface Window {
    Payjp: any;
  }
}

export default function PayjpCheckoutForm({ publicKey, bookingId, amount }: PayjpCheckoutFormProps) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const payjpRef = useRef<any>(null);
  const cardElementRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // payjp.js を CDN から動的ロード
    if (document.getElementById('payjp-script')) {
      initPayjp();
      return;
    }
    const script = document.createElement('script');
    script.id = 'payjp-script';
    script.src = 'https://js.pay.jp/v2/pay.js';
    script.onload = initPayjp;
    document.head.appendChild(script);
  }, [publicKey]);

  function initPayjp() {
    if (!window.Payjp || !cardRef.current) return;
    payjpRef.current = window.Payjp(publicKey);
    const elements = payjpRef.current.elements();
    cardElementRef.current = elements.create('card', {
      style: {
        base: {
          color: 'rgba(255,255,255,0.8)',
          fontFamily: 'sans-serif',
          fontSize: '16px',
          '::placeholder': { color: 'rgba(255,255,255,0.25)' },
        },
      },
    });
    cardElementRef.current.mount(cardRef.current);
    setIsReady(true);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payjpRef.current || !cardElementRef.current) return;

    setIsLoading(true);
    setMessage('');

    try {
      const result = await payjpRef.current.createToken(cardElementRef.current);
      if (result.error) throw new Error(result.error.message);

      // トークンをバックエンドに送って charge を実行
      const res = await fetch(`${API_BASE}/user-api/bookings/${bookingId}/payjp-charge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: result.token.id, amount }),
      });
      if (!res.ok) throw new Error('決済に失敗しました');

      router.push(`/booking/${bookingId}?success=true`);
    } catch (err: any) {
      setMessage(err.message || '決済中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div
        ref={cardRef}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 min-h-[44px] transition-all focus-within:border-white/25"
      />
      {!isReady && (
        <p className="text-white/30 text-xs">カード入力欄を読み込み中...</p>
      )}

      {message && (
        <p className="text-red-400 text-sm border border-red-500/20 bg-red-500/5 rounded-xl px-3 py-2">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading || !isReady}
        className="w-full bg-white text-black rounded-2xl py-4 font-bold hover:bg-white/90 transition-all disabled:opacity-40 font-heading"
      >
        {isLoading ? '処理中...' : `¥${amount.toLocaleString()} を支払う`}
      </button>
    </form>
  );
}
