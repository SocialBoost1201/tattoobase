'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_BASE } from '@/lib/api';

const MOCK_USER_ID = 'user_001';

export default function KycUploadPage() {
  const [kycStatus, setKycStatus] = useState<string>('LOADING');
  const [submitting, setSubmitting] = useState(false);
  const [birthDate, setBirthDate] = useState('1990-01-01');

  useEffect(() => {
    fetch(`${API_BASE}/user-api/account?userId=${MOCK_USER_ID}`)
      .then((res) => res.json())
      .then((profile) => setKycStatus(profile?.kycStatus || 'UNSUBMITTED'))
      .catch(() => setKycStatus('UNSUBMITTED'));
  }, []);

  const handleKycSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/user-api/account/kyc?userId=${MOCK_USER_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ encryptedFilePath: 'dummy_s3_key_12345.jpg', birthDate }),
      });
      if (!res.ok) throw new Error('Failed');
      setKycStatus('PENDING');
    } catch {
      setKycStatus('ERROR');
    } finally {
      setSubmitting(false);
    }
  };

  if (kycStatus === 'LOADING') {
    return <div className="py-20 text-center text-white/40 text-sm">読み込み中...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-extrabold text-2xl text-white tracking-tight">本人確認 (KYC)</h1>
        <p className="text-white/45 text-xs mt-1">安全なご利用のための本人確認</p>
      </div>

      {kycStatus === 'PENDING' && (
        <div className="glass rounded-2xl p-5 border border-amber-500/20">
          <p className="text-amber-400 font-bold text-sm mb-1">審査中です</p>
          <p className="text-white/45 text-xs leading-relaxed">ご提出いただいた書類を審査しています。通常1〜2営業日で完了します。</p>
        </div>
      )}

      {kycStatus === 'APPROVED' && (
        <div className="glass rounded-2xl p-5 border border-emerald-500/20">
          <p className="text-emerald-400 font-bold text-sm mb-1">本人確認完了</p>
          <p className="text-white/45 text-xs leading-relaxed">審査を通過しました。すべての機能をご利用いただけます。</p>
        </div>
      )}

      {kycStatus === 'ERROR' && (
        <div className="glass rounded-2xl p-5 border border-red-500/20">
          <p className="text-red-400 font-bold text-sm">エラーが発生しました。時間を置いて再度お試しください。</p>
        </div>
      )}

      {(kycStatus === 'UNSUBMITTED' || kycStatus === 'REJECTED' || kycStatus === 'ERROR') && (
        <form onSubmit={handleKycSubmit} className="space-y-5">
          {kycStatus === 'REJECTED' && (
            <div className="glass rounded-2xl p-5 border border-red-500/20">
              <p className="text-red-400 font-bold text-sm mb-1">審査に通過しませんでした</p>
              <p className="text-white/45 text-xs leading-relaxed">書類に不備が見つかりました。お手数ですが再度ご提出ください。</p>
            </div>
          )}

          <div className="glass rounded-2xl p-5 space-y-4">
            <div>
              <h2 className="text-white font-bold text-sm mb-1">書類のアップロード</h2>
              <p className="text-white/40 text-xs leading-relaxed">
                運転免許証、マイナンバーカード、またはパスポートの画像（表面のみ）をアップロードしてください。
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-white/50 uppercase tracking-wider">生年月日</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/25 transition-all [color-scheme:dark]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-white/50 uppercase tracking-wider">身分証明書の画像</label>
              <div className="border-2 border-dashed border-white/15 rounded-xl p-8 text-center hover:border-white/25 hover:bg-white/3 transition-all cursor-pointer">
                <p className="text-white/40 text-sm">クリックして画像を選択</p>
                <p className="text-white/25 text-xs mt-2">※MVP期間中はダミーデータが送信されます。</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-white text-black rounded-2xl py-4 font-bold hover:bg-white/90 transition-all disabled:opacity-40 font-heading"
          >
            {submitting ? '送信中...' : '提出する'}
          </button>
        </form>
      )}

      <Link href="/account" className="block text-center text-white/30 text-xs hover:text-white/60 transition-colors">
        ← アカウントに戻る
      </Link>
    </div>
  );
}
