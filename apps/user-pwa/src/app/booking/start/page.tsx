'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserApiClient } from '@/lib/user-api-client';
import { getSession } from 'next-auth/react';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CheckoutForm } from '@/components/booking/CheckoutForm';

// Make sure to call loadStripe outside of a component's render to avoid recreating the Stripe object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_mock');

export default function BookingStartPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  // API送信用ダミーデータ（Phase2等で店舗詳細画面から受け取る想定）
  const [studioId, setStudioId] = useState('demo-studio-id');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingResult, setBookingResult] = useState<any>(null);

  useEffect(() => {
    getSession().then(session => {
      if (session?.user?.id) {
        setUserId(session.user.id);
        if (session.user.name) setName(session.user.name);
        if (session.user.email) setEmail(session.user.email);
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!userId) {
      setError('ログインが必要です。ログインしてから再度お試しください。');
      setLoading(false);
      return;
    }

    try {
      const result = await UserApiClient.createBookingDraft({
        studioId,
        briefJson: { name, email, phone },
        userId: userId, 
        notes: 'Requested via BookingStartPage',
      });
      console.log('Booking Result:', result);
      setBookingResult(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (bookingResult && bookingResult.clientSecret) {
    const appearance = {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#0a0a0a',
      },
    };
    const options = {
      clientSecret: bookingResult.clientSecret,
      appearance,
    };

    return (
      <div className="py-10 space-y-6">
        <h2 className="font-heading font-extrabold text-xl text-[#0a0a0a]">
          {bookingResult.depositRequired ? 'デザインデポジットのお支払い' : 'ご予約の確定 (お支払い)'}
        </h2>
        
        {bookingResult.tier === 'MEDIUM' && (
          <div className="bg-[#f0f0f0] border border-brand-300 p-4 text-sm text-[#0a0a0a]">
            お客様の過去の予約履歴に基づき、今回はデポジットのお支払いをお願いしております。
          </div>
        )}
        
        <p className="text-neutral-600 text-sm">
          以下の決済を完了することで、予約が <strong>Confirmed</strong> (確定) となります。
        </p>

        <div className="border border-neutral-300 rounded-sm p-6 bg-white min-h-[300px] flex items-center justify-center">
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm clientSecret={bookingResult.clientSecret} bookingId={bookingResult.bookingId} />
          </Elements>
        </div>

        <Link href="/" className="block mt-6 text-sm font-semibold text-[#0a0a0a] underline text-center">
          トップに戻る
        </Link>
      </div>
    );
  }

  if (bookingResult && !bookingResult.clientSecret) {
     return (
        <div className="py-20 text-center space-y-4">
          <div className="w-12 h-12 bg-[#0a0a0a] rounded-full flex items-center justify-center mx-auto">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2 className="font-heading font-extrabold text-xl text-[#0a0a0a]">予約のリクエストを受け付けました</h2>
          <p className="text-neutral-600 text-sm">
            本予約はスタジオの<b>承認制</b>にてお預かりしました。<br/>ステータス: {bookingResult.status}
          </p>
          <Link href="/" className="block mt-6 text-sm font-semibold text-[#0a0a0a] underline">
            トップに戻る
          </Link>
        </div>
     );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading font-extrabold text-2xl text-[#0a0a0a]">BOOKING</h1>
        <p className="text-neutral-600 text-sm mt-1">必要事項を入力してください</p>
        <div className="mt-3 h-[3px] w-8 bg-[#0a0a0a]" />
      </div>

      {!userId && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-sm text-sm flex justify-between items-center">
          <span>予約にはログインが必要です。</span>
          <Link href="/login" className="font-bold underline">ログイン</Link>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-sm text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#0a0a0a] uppercase tracking-wider block" htmlFor="name">お名前</label>
          <input
            id="name" type="text" required
            onChange={(e) => setName(e.target.value)}
            defaultValue={name}
            placeholder="山田 太郎"
            className="w-full bg-white border border-neutral-300 focus:border-[#0a0a0a] rounded-sm px-4 py-3 text-[#0a0a0a] text-sm placeholder-[#c0c0c0] outline-none transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#0a0a0a] uppercase tracking-wider block" htmlFor="email">メールアドレス</label>
          <input
            id="email" type="email" required
            onChange={(e) => setEmail(e.target.value)}
            defaultValue={email}
            placeholder="tattoo@example.com"
            className="w-full bg-white border border-neutral-300 focus:border-[#0a0a0a] rounded-sm px-4 py-3 text-[#0a0a0a] text-sm placeholder-[#c0c0c0] outline-none transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#0a0a0a] uppercase tracking-wider block" htmlFor="phone">電話番号</label>
          <input
            id="phone" type="tel"
            onChange={(e) => setPhone(e.target.value)}
            defaultValue={phone}
            placeholder="090-1234-5678"
            className="w-full bg-white border border-neutral-300 focus:border-[#0a0a0a] rounded-sm px-4 py-3 text-[#0a0a0a] text-sm placeholder-[#c0c0c0] outline-none transition-colors"
          />
        </div>

        <div className="bg-[#f5f5f5] border border-neutral-300 rounded-sm p-4 text-xs text-neutral-600 leading-relaxed">
          制作準備が進んでいる場合、キャンセル時に返金対象外となることがあります。ご了承のうえお進みください。
        </div>

        <button
          type="submit"
          disabled={loading || !userId}
          className="w-full bg-[#0a0a0a] hover:opacity-85 text-white font-bold py-4 rounded-sm transition-opacity duration-200 font-heading tracking-wide disabled:opacity-50"
        >
          {loading ? '処理中...' : '予約内容を確認する'}
        </button>
      </form>

      <Link href="/" className="block text-center text-brand-400 text-xs hover:text-[#0a0a0a] transition-colors">
        キャンセル
      </Link>
    </div>
  );
}
