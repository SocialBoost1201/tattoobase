'use client';

import { useState } from 'react';
import Link from 'next/link';

const PREFECTURES = [
  '北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県',
  '茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県',
  '新潟県','富山県','石川県','福井県','山梨県','長野県','岐阜県',
  '静岡県','愛知県','三重県','滋賀県','京都府','大阪府','兵庫県',
  '奈良県','和歌山県','鳥取県','島根県','岡山県','広島県','山口県',
  '徳島県','香川県','愛媛県','高知県','福岡県','佐賀県','長崎県',
  '熊本県','大分県','宮崎県','鹿児島県','沖縄県',
];

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

type Step = 1 | 2 | 3;

export default function RegisterPage() {
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<{ studioId: string; slug: string } | null>(null);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    studioName: '',
    ownerName: '',
    email: '',
    phoneNumber: '',
    prefecture: '',
    city: '',
    address: '',
    description: '',
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const next = () => setStep((s) => Math.min(s + 1, 3) as Step);
  const back = () => setStep((s) => Math.max(s - 1, 1) as Step);

  const submit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/auth/studio-register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || '登録に失敗しました');
      }
      const data = await res.json();
      localStorage.setItem('studioId', data.studioId);
      setDone(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0d0d1a] via-[#0a0a0a] to-[#1a0a0f] flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">登録完了！</h2>
            <p className="text-white/50 text-sm">スタジオ「{form.studioName}」の登録が完了しました。<br />まずはアーティストを追加しましょう。</p>
          </div>
          <Link
            href="/studio/artists"
            className="block w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-white/90 transition-all"
          >
            ダッシュボードへ →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d0d1a] via-[#0a0a0a] to-[#1a0a0f] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <p className="text-white/40 text-xs tracking-widest uppercase mb-2">TattooBase for Studios</p>
          <h1 className="text-3xl font-extrabold text-white">スタジオ登録</h1>
          <p className="text-white/40 text-sm mt-2">最初の6ヶ月間、完全無料でご利用いただけます</p>
        </div>

        {/* ステップインジケーター */}
        <div className="flex items-center gap-2 mb-8 px-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
                step === s
                  ? 'bg-white text-black border-white'
                  : step > s
                  ? 'bg-emerald-500/30 text-emerald-300 border-emerald-500/50'
                  : 'bg-white/5 text-white/30 border-white/10'
              }`}>
                {step > s ? '✓' : s}
              </div>
              {s < 3 && <div className={`flex-1 h-px transition-all ${step > s ? 'bg-emerald-500/50' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        {/* フォームカード */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-5">
          {step === 1 && (
            <>
              <h2 className="text-white font-bold text-lg">スタジオ基本情報</h2>
              <Field label="スタジオ名 *" placeholder="例: INK COLLECTIVE TOKYO" value={form.studioName} onChange={set('studioName')} />
              <Field label="オーナー名 *" placeholder="例: 山田 太郎" value={form.ownerName} onChange={set('ownerName')} />
              <Field label="メールアドレス *" type="email" placeholder="studio@example.com" value={form.email} onChange={set('email')} />
              <Field label="電話番号" type="tel" placeholder="03-0000-0000" value={form.phoneNumber} onChange={set('phoneNumber')} />
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-white font-bold text-lg">所在地・紹介文</h2>
              <div className="space-y-1">
                <label className="text-white/60 text-xs font-semibold uppercase tracking-wider">都道府県</label>
                <select
                  value={form.prefecture}
                  onChange={set('prefecture')}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 focus:bg-white/8 transition-all appearance-none"
                >
                  <option value="" className="bg-neutral-900">選択してください</option>
                  {PREFECTURES.map((p) => <option key={p} value={p} className="bg-neutral-900">{p}</option>)}
                </select>
              </div>
              <Field label="市区町村" placeholder="例: 渋谷区" value={form.city} onChange={set('city')} />
              <Field label="番地・建物名" placeholder="例: 道玄坂1-1-1 TBビル3F" value={form.address} onChange={set('address')} />
              <div className="space-y-1">
                <label className="text-white/60 text-xs font-semibold uppercase tracking-wider">スタジオ紹介文</label>
                <textarea
                  value={form.description}
                  onChange={set('description')}
                  rows={3}
                  placeholder="スタジオのコンセプトや得意なスタイルなどを入力してください"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-white/30 focus:bg-white/8 transition-all resize-none"
                />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-white font-bold text-lg">入力内容の確認</h2>
              <div className="space-y-3">
                {[
                  { label: 'スタジオ名', value: form.studioName },
                  { label: 'オーナー名', value: form.ownerName },
                  { label: 'メール', value: form.email },
                  { label: '電話番号', value: form.phoneNumber || '未入力' },
                  { label: '所在地', value: [form.prefecture, form.city, form.address].filter(Boolean).join(' ') || '未入力' },
                  { label: '紹介文', value: form.description || '未入力' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex gap-3">
                    <span className="text-white/40 text-xs w-24 shrink-0 pt-0.5">{label}</span>
                    <span className="text-white text-sm">{value}</span>
                  </div>
                ))}
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white/50 leading-relaxed">
                登録後、6ヶ月〜1年間は完全無料でTattooBaseをご利用いただけます。その後は掲載プランに応じた月額料金が発生します。
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
            </>
          )}
        </div>

        {/* ナビゲーションボタン */}
        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <button
              onClick={back}
              className="flex-1 border border-white/15 text-white/70 font-semibold py-3.5 rounded-2xl hover:bg-white/5 transition-all"
            >
              戻る
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={next}
              disabled={step === 1 && (!form.studioName || !form.ownerName || !form.email)}
              className="flex-1 bg-white text-black font-bold py-3.5 rounded-2xl hover:bg-white/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              次へ →
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={loading}
              className="flex-1 bg-white text-black font-bold py-3.5 rounded-2xl hover:bg-white/90 transition-all disabled:opacity-50"
            >
              {loading ? '登録中...' : '登録する'}
            </button>
          )}
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          すでにアカウントをお持ちの方は{' '}
          <Link href="/login" className="text-white/60 underline hover:text-white">ログイン</Link>
        </p>
      </div>
    </div>
  );
}

function Field({
  label, placeholder, value, onChange, type = 'text',
}: {
  label: string; placeholder: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-white/60 text-xs font-semibold uppercase tracking-wider">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-white/30 focus:bg-white/8 transition-all"
      />
    </div>
  );
}
