'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { UserApiClient } from '@/lib/user-api-client';
import { getSession } from 'next-auth/react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ChevronRight, ChevronLeft, CalendarHeart, User, CreditCard, AlertCircle, CheckCircle2 } from 'lucide-react';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CheckoutForm } from '@/components/booking/CheckoutForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_mock');

function BookingWizardInner() {
  const searchParams = useSearchParams();
  const artistId = searchParams.get('artistId') || '';

  const [step, setStep] = useState<number>(1);
  const wizardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // フォームステート
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [bodyPart, setBodyPart] = useState('');
  const [size, setSize] = useState('');
  const [healthNotes, setHealthNotes] = useState('');
  const [consents, setConsents] = useState({ isAdult: false, noContraindication: false, agreedPolicy: false });
  
  const [studioId, setStudioId] = useState('demo-studio-id'); // 将来的に artistId から取得

  // UIステート
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

  // ステップ切り替え時のアニメーション
  useGSAP(() => {
    if (!wizardRef.current) return;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(wizardRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
      );
    });
    // Mobile UX Audit P1-2: モーション抑制時は最終状態へ即固定
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(wizardRef.current, { opacity: 1, x: 0 });
    });
  }, { dependencies: [step], scope: containerRef });

  const nextStep = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(s => s + 1);
  };
  
  const prevStep = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(s => s - 1);
  };

  const submitBookingRequest = async () => {
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
        briefJson: { name, email, phone, date, time },
        userId: userId, 
        notes: `希望日時: ${date} ${time}\n要望: ${notes}`,
      });
      setBookingResult(result);
      nextStep(); // 完了ステップ(Step 4)へ
    } catch (err: any) {
      setError(err.message || 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  // 進捗バー (1: 内容, 2: お客様情報, 3: 確認・決済)
  const renderStepper = () => (
    <div className="flex items-center justify-between mb-8 relative">
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-neutral-800 -z-10 -translate-y-1/2" />
      <div className="absolute top-1/2 left-0 h-0.5 bg-white -z-10 -translate-y-1/2 transition-all duration-500" style={{ width: `${((step - 1) / 2) * 100}%` }} />
      
      {[
        { num: 1, label: 'リクエスト', icon: CalendarHeart },
        { num: 2, label: 'お客様情報', icon: User },
        { num: 3, label: '確認・決済', icon: CreditCard },
      ].map((s) => {
        const isActive = step >= s.num;
        const Icon = s.icon;
        return (
          <div key={s.num} className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${isActive ? 'bg-white text-black' : 'bg-neutral-900 border border-neutral-800 text-neutral-500'}`}>
              <Icon className="w-4 h-4" />
            </div>
            <span className={`text-xs font-extrabold tracking-widest uppercase ${isActive ? 'text-white' : 'text-neutral-500'}`}>
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="max-w-xl mx-auto pb-24" ref={containerRef}>
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/artist/${artistId}`} className="w-11 h-11 rounded-full bg-neutral-900 flex items-center justify-center text-white border border-neutral-800 hover:bg-neutral-800 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-white tracking-tight leading-none pt-1">BOOKING</h1>
          <p className="text-neutral-400 text-xs font-semibold">ご予約のリクエスト</p>
        </div>
      </div>

      {!userId && (
        <div className="bg-amber-950/30 border border-amber-900/50 text-amber-200 p-4 rounded-xl text-sm flex justify-between items-center mb-6">
          <span className="flex items-center gap-2"><AlertCircle className="w-4 h-4"/> 予約にはログインが必要です。</span>
          <Link href="/login" className="font-bold underline text-white">ログイン</Link>
        </div>
      )}

      {error && (
        <div className="bg-red-950/30 border border-red-900/50 text-red-200 p-4 rounded-xl text-sm mb-6 flex items-start gap-2">
           <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
           {error}
        </div>
      )}

      {step <= 3 && renderStepper()}

      <div ref={wizardRef}>
        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-5">
              <h2 className="text-lg font-bold text-white mb-2">デザインのご希望と日程</h2>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-neutral-400 uppercase tracking-widest block">希望日</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)}
                  className="w-full bg-black border border-neutral-800 focus:border-white/50 rounded-xl px-4 py-3 text-white text-base md:text-sm outline-none transition-colors appearance-none" required />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-neutral-400 uppercase tracking-widest block">希望時間 (目安)</label>
                <input type="time" value={time} onChange={e => setTime(e.target.value)}
                  className="w-full bg-black border border-neutral-800 focus:border-white/50 rounded-xl px-4 py-3 text-white text-base md:text-sm outline-none transition-colors appearance-none" required />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-neutral-400 uppercase tracking-widest block">希望部位</label>
                <select value={bodyPart} onChange={e => setBodyPart(e.target.value)}
                  className="w-full bg-black border border-neutral-800 focus:border-white/50 rounded-xl px-4 py-3 text-white text-base md:text-sm outline-none transition-colors appearance-none">
                  <option value="">選択してください</option>
                  {['腕（内側）', '腕（外側）', '前腕', '上腕', '肩', '背中', '胸', '脇腹', '太もも', '足首', '手・指', 'その他'].map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-neutral-400 uppercase tracking-widest block">サイズ目安</label>
                <div className="grid grid-cols-3 gap-2">
                  {['小 (5cm以下)', '中 (5〜15cm)', '大 (15cm以上)'].map(s => (
                    <button key={s} type="button" onClick={() => setSize(s)}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${size === s ? 'bg-white text-black border-white' : 'bg-black border-neutral-700 text-neutral-400 hover:border-neutral-500'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-neutral-400 uppercase tracking-widest block">タトゥーのイメージ・ご要望</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder="デザインのイメージ、参考にしたいモチーフ、スタイルなどを記入してください。"
                  rows={3} className="w-full bg-black border border-neutral-800 focus:border-white/50 rounded-xl px-4 py-3 text-white text-base md:text-sm outline-none transition-colors resize-none" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-neutral-400 uppercase tracking-widest block">アレルギー・健康上の注意</label>
                <input type="text" value={healthNotes} onChange={e => setHealthNotes(e.target.value)}
                  placeholder="特になし / ラテックスアレルギーあり 等"
                  className="w-full bg-black border border-neutral-800 focus:border-white/50 rounded-xl px-4 py-3 text-white text-base md:text-sm outline-none transition-colors" />
              </div>
            </div>

            {/* 成人確認（J-2）+ 禁忌チェック */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-white">確認事項（必須）</h3>
              {[
                { key: 'isAdult', label: '私は18歳以上であることを確認します' },
                { key: 'noContraindication', label: '施術当日は飲酒・過度な運動を控えます' },
                { key: 'agreedPolicy', label: 'キャンセルポリシーおよび利用規約に同意します' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={!!consents[key as keyof typeof consents]}
                    onChange={e => setConsents(prev => ({ ...prev, [key]: e.target.checked }))}
                    className="w-4 h-4 mt-0.5 accent-white shrink-0" />
                  <span className="text-sm text-neutral-300">{label}</span>
                </label>
              ))}
            </div>

            <button onClick={nextStep}
              disabled={!date || !time || !Object.values(consents).every(Boolean)}
              className="w-full bg-white hover:bg-neutral-200 text-black font-extrabold py-4 rounded-full transition-all duration-300 font-heading tracking-wide flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              次へ進む <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}


        {/* Step 2: お客様情報 */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-5">
               <h2 className="text-lg font-bold text-white mb-2">お客様情報の入力</h2>
               
               <div className="space-y-2">
                 <label className="text-xs font-extrabold text-neutral-400 uppercase tracking-widest block">お名前 (フルネーム)</label>
                 <input
                   type="text"
                   value={name}
                   onChange={e => setName(e.target.value)}
                   placeholder="山田 太郎"
                   className="w-full bg-black border border-neutral-800 focus:border-brand-400 rounded-xl px-4 py-3 text-white text-base md:text-sm outline-none transition-colors"
                   required
                 />
               </div>

               <div className="space-y-2">
                 <label className="text-xs font-extrabold text-neutral-400 uppercase tracking-widest block">メールアドレス</label>
                 <input
                   type="email"
                   value={email}
                   onChange={e => setEmail(e.target.value)}
                   placeholder="tattoo@example.com"
                   className="w-full bg-black border border-neutral-800 focus:border-brand-400 rounded-xl px-4 py-3 text-white text-base md:text-sm outline-none transition-colors"
                   required
                 />
                 <p className="text-[#6b6b6b] text-xs mt-1">スタジオからの連絡や予約完了メールが届きます</p>
               </div>

               <div className="space-y-2">
                 <label className="text-xs font-extrabold text-neutral-400 uppercase tracking-widest block">電話番号</label>
                 <input
                   type="tel"
                   value={phone}
                   onChange={e => setPhone(e.target.value)}
                   placeholder="090-1234-5678"
                   className="w-full bg-black border border-neutral-800 focus:border-brand-400 rounded-xl px-4 py-3 text-white text-base md:text-sm outline-none transition-colors"
                 />
               </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={prevStep}
                className="w-1/3 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-white font-extrabold py-4 rounded-full transition-all duration-300 tracking-wide"
              >
                戻る
              </button>
              <button
                onClick={nextStep}
                disabled={!name || !email}
                className="w-2/3 bg-white hover:bg-neutral-200 text-black font-extrabold py-4 rounded-full transition-all duration-300 font-heading tracking-wide flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                最終確認へ <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: 確認・決済 */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
               <h2 className="text-lg font-bold text-white border-b border-neutral-800 pb-3 mb-4 flex items-center gap-2">
                 <CheckCircle2 className="w-5 h-5 text-green-500" /> 入力内容の確認
               </h2>
               
               <dl className="space-y-4">
                 <div className="flex flex-col sm:flex-row gap-1 sm:gap-4">
                   <dt className="text-neutral-500 text-xs font-bold w-24">希望日時</dt>
                   <dd className="text-white text-sm font-medium">{date} {time}</dd>
                 </div>
                 <div className="flex flex-col sm:flex-row gap-1 sm:gap-4">
                   <dt className="text-neutral-500 text-xs font-bold w-24">お名前</dt>
                   <dd className="text-white text-sm font-medium">{name}</dd>
                 </div>
                 <div className="flex flex-col sm:flex-row gap-1 sm:gap-4">
                   <dt className="text-neutral-500 text-xs font-bold w-24">連絡先</dt>
                   <dd className="text-white text-sm font-medium">{email}<br/>{phone}</dd>
                 </div>
                 <div className="flex flex-col sm:flex-row gap-1 sm:gap-4">
                   <dt className="text-neutral-500 text-xs font-bold w-24">要望</dt>
                   <dd className="text-white text-sm font-medium whitespace-pre-wrap">{notes || 'なし'}</dd>
                 </div>
               </dl>
            </div>

            <div className="bg-[#111] border border-neutral-800 rounded-2xl p-5 text-xs text-neutral-400 leading-relaxed font-medium">
              <span className="text-brand-400 font-bold block mb-1">【注意事項】</span>
              ・本リクエスト時点では予約は確定していません。<br />
              ・スタジオから承認された後、デポジットご入金のお願いメールが届く場合があります。<br />
              ・デザイン制作進行後のキャンセルは返金対象外となることがあります。
            </div>

            <div className="flex gap-3">
              <button
                onClick={prevStep}
                disabled={loading}
                className="w-1/3 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-white font-extrabold py-4 rounded-full transition-all duration-300 tracking-wide disabled:opacity-50"
              >
                戻る
              </button>
              <button
                onClick={submitBookingRequest}
                disabled={loading || !userId}
                className="w-2/3 bg-white hover:bg-neutral-200 text-black font-extrabold py-4 rounded-full transition-all duration-300 font-heading tracking-wide flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {loading ? '処理中...' : 'リクエストを送信'}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: 結果 (決済フォーム等) */}
        {step === 4 && bookingResult && (
          <div className="space-y-6">
            {bookingResult.clientSecret ? (
              // デポジット支払いありの場合
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                <h2 className="font-heading font-extrabold text-xl text-white mb-2">
                  デポジットのお支払い
                </h2>
                {bookingResult.tier === 'MEDIUM' && (
                  <div className="bg-neutral-800 border-l-2 border-brand-400 p-4 text-xs text-neutral-300 mb-4 rounded-r-md">
                    アーティストの規定により、予約確定のためにデポジット（預かり金）のお支払いが必要です。
                  </div>
                )}
                <div className="bg-white rounded-xl p-4 min-h-[300px]">
                  <Elements options={{ clientSecret: bookingResult.clientSecret, appearance: { theme: 'stripe' } }} stripe={stripePromise}>
                    <CheckoutForm clientSecret={bookingResult.clientSecret} bookingId={bookingResult.bookingId} />
                  </Elements>
                </div>
              </div>
            ) : (
              // リクエスト完了（支払いなし）の場合
              <div className="py-20 text-center space-y-4 bg-neutral-900 border border-neutral-800 rounded-2xl">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="font-heading font-extrabold text-2xl text-white">Request Sent</h2>
                <p className="text-neutral-400 text-sm max-w-xs mx-auto">
                  予約リクエストを送信しました。<br/>
                  スタジオが内容を確認のうえ、ご登録のメールアドレスまでご連絡します。
                </p>
                <Link href="/" className="inline-block mt-8 bg-neutral-800 hover:bg-neutral-700 text-white font-bold px-8 py-3 rounded-full transition-colors">
                  トップページへ戻る
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function BookingWizardPage() {
  return (
    <Suspense fallback={<div className="max-w-xl mx-auto pb-24 min-h-screen" />}>
      <BookingWizardInner />
    </Suspense>
  );
}
