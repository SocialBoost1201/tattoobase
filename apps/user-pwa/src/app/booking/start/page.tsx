'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { UserApiClient } from '@/lib/user-api-client';
import { getSession } from 'next-auth/react';
import { MOCK_ARTISTS } from '@/lib/mock-data';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CheckoutForm } from '@/components/booking/CheckoutForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_mock');

const TIME_SLOTS = [
  { id: 'morning', label: '午前（10:00〜12:00）', labelEn: 'Morning (10:00–12:00)' },
  { id: 'afternoon', label: '午後（13:00〜17:00）', labelEn: 'Afternoon (13:00–17:00)' },
  { id: 'evening', label: '夕方（17:00〜19:00）', labelEn: 'Evening (17:00–19:00)' },
];

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 justify-center mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
            i + 1 < current
              ? 'bg-white text-black'
              : i + 1 === current
              ? 'bg-white/20 border border-white/40 text-white'
              : 'bg-white/5 border border-white/10 text-white/25'
          }`}>
            {i + 1 < current ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              i + 1
            )}
          </div>
          {i < total - 1 && (
            <div className={`w-8 h-px transition-all duration-300 ${i + 1 < current ? 'bg-white/40' : 'bg-white/10'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function BookingStartContent() {
  const searchParams = useSearchParams();
  const preselectedArtistId = searchParams.get('artistId');

  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState<string | null>(null);

  // Step 1: Artist
  const [selectedArtistId, setSelectedArtistId] = useState(preselectedArtistId ?? '');

  // Step 2: Date/Time
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');

  // Step 3: Personal info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Result
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingResult, setBookingResult] = useState<any>(null);

  const selectedArtist = MOCK_ARTISTS.find((a) => a.id === selectedArtistId);

  useEffect(() => {
    getSession().then((session) => {
      if (session?.user?.id) {
        setUserId(session.user.id);
        if (session.user.name) setName(session.user.name);
        if (session.user.email) setEmail(session.user.email);
      }
    });
    if (preselectedArtistId) setStep(2);
  }, [preselectedArtistId]);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const scheduledAtLocal = preferredDate
        ? `${preferredDate}T${preferredTime === 'morning' ? '10:00' : preferredTime === 'afternoon' ? '13:00' : '17:00'}:00`
        : undefined;

      const result = await UserApiClient.createBookingDraft({
        studioId: selectedArtist?.studio?.id ?? 'demo-studio-id',
        artistId: selectedArtistId || undefined,
        scheduledAtLocal,
        briefJson: { name, email, phone, preferredTime },
        notes: notes || undefined,
        userId: userId ?? undefined,
      });
      setBookingResult(result);
    } catch (err: any) {
      setError(err.message ?? 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  // Payment step
  if (bookingResult?.clientSecret) {
    return (
      <div className="space-y-6">
        <StepIndicator current={4} total={4} />
        <div className="text-center space-y-1 mb-6">
          <h1 className="font-heading font-extrabold text-2xl text-white">
            {bookingResult.depositRequired ? 'デポジット支払い' : 'お支払い'}
          </h1>
          <p className="text-white/50 text-sm">予約を確定してください</p>
        </div>

        {bookingResult.tier === 'MEDIUM' && (
          <div className="glass rounded-2xl p-4 border border-amber-500/20">
            <p className="text-amber-400 text-sm">お客様の履歴に基づき、デポジットのお支払いをお願いしております。</p>
          </div>
        )}

        <div className="glass rounded-2xl p-6 min-h-[300px] flex items-center justify-center">
          <Elements options={{ clientSecret: bookingResult.clientSecret, appearance: { theme: 'night' } }} stripe={stripePromise}>
            <CheckoutForm clientSecret={bookingResult.clientSecret} bookingId={bookingResult.bookingId} />
          </Elements>
        </div>

        <Link href="/" className="block text-center text-white/40 text-xs hover:text-white/70 transition-colors">
          トップに戻る
        </Link>
      </div>
    );
  }

  // No payment — approval flow
  if (bookingResult && !bookingResult.clientSecret) {
    return (
      <div className="py-12 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="font-heading font-extrabold text-xl text-white">予約リクエストを受け付けました</h2>
        <p className="text-white/50 text-sm leading-relaxed">
          スタジオの承認制にてお預かりしました。<br />ステータス: {bookingResult.status}
        </p>
        <Link href="/" className="inline-block mt-4 text-sm font-semibold text-white underline underline-offset-2">
          トップに戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StepIndicator current={step} total={3} />

      {/* Step 1: Artist selection */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h1 className="font-heading font-extrabold text-2xl text-white">アーティスト選択</h1>
            <p className="text-white/50 text-sm">担当アーティストを選んでください</p>
          </div>

          <div className="space-y-3">
            {MOCK_ARTISTS.map((artist) => (
              <button
                key={artist.id}
                onClick={() => setSelectedArtistId(artist.id)}
                className={`w-full text-left glass rounded-2xl p-4 transition-all duration-200 ${
                  selectedArtistId === artist.id
                    ? 'border border-white/30 bg-white/10'
                    : 'border border-white/8 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/8 border border-white/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-white/50">
                      {artist.displayName.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm">{artist.displayName}</p>
                    <p className="text-white/40 text-xs truncate">{artist.studio?.name}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="1.5">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <span className="text-amber-400 text-xs font-bold">{artist.avgRating.toFixed(1)}</span>
                  </div>
                  {selectedArtistId === artist.id && (
                    <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!selectedArtistId}
            className="w-full bg-white text-black font-bold py-4 rounded-2xl transition-all duration-200 hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed font-heading"
          >
            次へ →
          </button>

          <Link href="/" className="block text-center text-white/40 text-xs hover:text-white/60 transition-colors">
            キャンセル
          </Link>
        </div>
      )}

      {/* Step 2: Date/Time */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h1 className="font-heading font-extrabold text-2xl text-white">希望日時</h1>
            <p className="text-white/50 text-sm">ご希望の日程を選択してください</p>
          </div>

          {selectedArtist && (
            <div className="glass rounded-2xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/8 border border-white/10 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-white/50">
                  {selectedArtist.displayName.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-white text-sm font-semibold">{selectedArtist.displayName}</p>
                <p className="text-white/40 text-xs">{selectedArtist.studio?.name}</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-white/50 text-xs uppercase tracking-wider block">希望日</label>
            <input
              type="date"
              value={preferredDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setPreferredDate(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/25 transition-all [color-scheme:dark]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-white/50 text-xs uppercase tracking-wider block">希望時間帯</label>
            <div className="space-y-2">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => setPreferredTime(slot.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                    preferredTime === slot.id
                      ? 'bg-white/15 border border-white/30 text-white font-semibold'
                      : 'glass border border-white/8 text-white/60 hover:border-white/20 hover:text-white/80'
                  }`}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 glass border border-white/10 text-white/50 font-semibold py-4 rounded-2xl hover:bg-white/5 transition-all text-sm"
            >
              ← 戻る
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 bg-white text-black font-bold py-4 rounded-2xl transition-all duration-200 hover:bg-white/90 font-heading"
            >
              次へ →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Personal info */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h1 className="font-heading font-extrabold text-2xl text-white">お客様情報</h1>
            <p className="text-white/50 text-sm">予約に必要な情報を入力してください</p>
          </div>

          {!userId && (
            <div className="glass rounded-2xl p-4 border border-amber-500/20 flex items-center justify-between">
              <span className="text-amber-400 text-sm">予約にはログインが必要です</span>
              <Link href="/login" className="text-sm font-bold text-white underline underline-offset-2">ログイン</Link>
            </div>
          )}

          {error && (
            <div className="glass rounded-2xl p-4 border border-red-500/20">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Booking summary */}
          <div className="glass rounded-2xl p-4 space-y-2">
            {selectedArtist && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/40">アーティスト</span>
                <span className="text-white font-semibold">{selectedArtist.displayName}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/40">希望日</span>
              <span className="text-white">{preferredDate || '未定'}</span>
            </div>
            {preferredTime && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/40">希望時間帯</span>
                <span className="text-white">{TIME_SLOTS.find((s) => s.id === preferredTime)?.label}</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-white/50 text-xs uppercase tracking-wider block">お名前 *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="山田 太郎"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/25 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-white/50 text-xs uppercase tracking-wider block">メールアドレス *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tattoo@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/25 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-white/50 text-xs uppercase tracking-wider block">電話番号</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="090-1234-5678"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/25 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-white/50 text-xs uppercase tracking-wider block">ご要望・メモ（任意）</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="デザインのご要望、アレルギー情報など..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/25 transition-all resize-none"
              />
            </div>
          </div>

          <div className="glass rounded-2xl p-4">
            <p className="text-white/40 text-xs leading-relaxed">
              制作準備が進んでいる場合、キャンセル時に返金対象外となることがあります。ご了承のうえお進みください。
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="flex-1 glass border border-white/10 text-white/50 font-semibold py-4 rounded-2xl hover:bg-white/5 transition-all text-sm"
            >
              ← 戻る
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !userId || !name || !email}
              className="flex-1 bg-white text-black font-bold py-4 rounded-2xl transition-all duration-200 hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed font-heading text-sm"
            >
              {loading ? '処理中...' : '予約を送信する'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookingStartPage() {
  return (
    <Suspense fallback={
      <div className="py-20 text-center">
        <p className="text-white/40 text-sm">読み込み中...</p>
      </div>
    }>
      <BookingStartContent />
    </Suspense>
  );
}
