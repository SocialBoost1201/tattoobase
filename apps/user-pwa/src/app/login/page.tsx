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
        <div className="w-12 h-12 bg-[#0a0a0a] rounded-full flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>
        <h1 className="font-heading font-extrabold text-2xl text-[#0a0a0a]">メールを確認してください</h1>
        <p className="text-[#6b6b6b] text-sm leading-relaxed max-w-xs">
          <span className="font-semibold text-[#0a0a0a]">{email}</span> にログインリンクを送信しました。
        </p>
        <p className="text-[#a0a0a0] text-xs mt-2">
          開発環境では、APIサーバーのコンソールにリンクが出力されます。
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex flex-col justify-center space-y-8 py-8">
      {/* ロゴ */}
      <div className="flex justify-center">
        <Image src="/logo.png" alt="TatooBase" width={180} height={48} className="h-12 w-auto object-contain" priority />
      </div>

      <div className="text-center">
        <h1 className="font-heading font-extrabold text-2xl text-[#0a0a0a]">ログイン</h1>
        <p className="text-[#6b6b6b] text-sm mt-1">メールアドレスにログインリンクを送信します</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-bold text-[#0a0a0a] uppercase tracking-wider block">
            メールアドレス
          </label>
          <input
            id="email" type="email" required
            value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            autoComplete="email"
            className="w-full bg-white border border-[#e0e0e0] focus:border-[#0a0a0a] rounded-sm px-4 py-3.5 text-[#0a0a0a] text-sm placeholder-[#c0c0c0] outline-none transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0a0a0a] hover:opacity-85 disabled:opacity-40 text-white font-bold py-4 rounded-sm transition-opacity duration-200 font-heading tracking-wide"
        >
          {loading ? '送信中...' : 'ログインリンクを送信'}
        </button>
      </form>

      <p className="text-center text-[#a0a0a0] text-xs">
        パスワードは不要です。メールのみでログインできます。
      </p>
    </div>
  );
}
