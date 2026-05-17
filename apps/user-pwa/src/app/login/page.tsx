'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await signIn('resend', { email, redirect: false, callbackUrl: '/account' });
    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4 px-4">
        <div className="w-14 h-14 bg-white/10 border border-white/20 rounded-full flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>
        <h1 className="font-heading font-extrabold text-2xl text-white">メールを確認してください</h1>
        <p className="text-white/50 text-sm leading-relaxed max-w-xs">
          <span className="font-semibold text-white">{email}</span> にログインリンクを送信しました。
        </p>
        <p className="text-white/30 text-xs mt-2">
          開発環境では、APIサーバーのコンソールにリンクが出力されます。
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex flex-col justify-center space-y-8 py-8">
      <div className="flex justify-center">
        <Image src="/logo.png" alt="TatooBase" width={180} height={48} className="h-12 w-auto object-contain brightness-0 invert" priority />
      </div>

      <div className="text-center">
        <h1 className="font-heading font-extrabold text-2xl text-white">ログイン</h1>
        <p className="text-white/45 text-sm mt-1">メールアドレスにログインリンクを送信します</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-bold text-white/50 uppercase tracking-wider block">
            メールアドレス
          </label>
          <input
            id="email" type="email" required
            value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            autoComplete="email"
            className="w-full bg-white/5 border border-white/10 focus:border-white/25 rounded-xl px-4 py-3.5 text-white text-sm placeholder-white/25 outline-none transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-white/90 disabled:opacity-40 transition-all font-heading tracking-wide"
        >
          {loading ? '送信中...' : 'ログインリンクを送信'}
        </button>
      </form>

      <p className="text-center text-white/30 text-xs">
        パスワードは不要です。メールのみでログインできます。
      </p>
    </div>
  );
}
