'use client';

import { useState } from 'react';
import { API_BASE } from '@/lib/api';

export default function ReportFacilityModal({ facilityId, facilityName, isOpen, onClose }: { facilityId: string; facilityName: string; isOpen: boolean; onClose: () => void }) {
  const [level, setLevel] = useState('UNKNOWN');
  const [evidenceText, setEvidenceText] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/user-api/facilities/${facilityId}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportedLevel: level, evidenceText, evidenceUrl }),
      });

      if (!res.ok) throw new Error('報告の送信に失敗しました');
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'エラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="glass rounded-2xl w-full max-w-lg p-6 my-8 border border-white/12">
        <div className="flex justify-between items-center mb-4 border-b border-white/8 pb-3">
          <h2 className="text-lg font-extrabold text-white font-heading">ポリシーを報告</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        {success ? (
          <div className="py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3">
              <svg width="20" height="20" fill="none" stroke="#34d399" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
            </div>
            <p className="font-bold text-white">報告を送信しました</p>
            <p className="text-white/40 text-sm mt-2">ご協力ありがとうございます。審査の上反映いたします。</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-white/50 text-sm">
              <strong className="text-white">{facilityName}</strong> の現在のタトゥールールをご存知でしたら教えてください。
            </p>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-white/50 uppercase tracking-wider">受け入れレベル *</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-white/25 transition-all [color-scheme:dark]"
                required
              >
                <option value="UNKNOWN">-- 選択してください --</option>
                <option value="ALLOWED">全面許可（隠す必要なし）</option>
                <option value="COVERED_ONLY">隠せば許可</option>
                <option value="PARTIAL_ONLY">ワンポイント等一部のみ可</option>
                <option value="BANNED">一切禁止（入館不可）</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-white/50 uppercase tracking-wider">体験談・目撃情報 *</label>
              <textarea
                value={evidenceText}
                onChange={(e) => setEvidenceText(e.target.value)}
                rows={3}
                placeholder="例：入口に「タトゥーお断り」と書いてあり、受付でも確認されました。"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-white/25 transition-all resize-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-white/50 uppercase tracking-wider">参考URL（任意）</label>
              <input
                type="url"
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
                placeholder="https://example.com/faq"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-white/25 transition-all"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm glass border border-red-500/20 p-3 rounded-xl">{error}</p>
            )}

            <div className="pt-4 flex justify-end gap-3 border-t border-white/8">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 glass border border-white/10 rounded-xl text-white/50 hover:text-white text-sm transition-all"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={isSubmitting || level === 'UNKNOWN' || !evidenceText}
                className="px-6 py-2.5 bg-white text-black rounded-xl font-bold text-sm hover:bg-white/90 disabled:opacity-40 transition-all"
              >
                {isSubmitting ? '送信中...' : '報告する'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
