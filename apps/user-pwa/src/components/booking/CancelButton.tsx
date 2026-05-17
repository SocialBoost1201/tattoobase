'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE } from '@/lib/api';

export default function CancelButton({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCancel = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/user-api/bookings/${bookingId}/cancel`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('キャンセルに失敗しました');
      router.refresh();
    } catch (e: any) {
      setError(e.message || 'エラーが発生しました');
      setIsLoading(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="glass rounded-2xl border border-red-500/20 p-5 space-y-4">
        <div>
          <p className="text-white font-bold text-sm mb-1">予約をキャンセルしますか？</p>
          <p className="text-white/40 text-xs leading-relaxed">
            この操作は取り消せません。制作準備が進んでいる場合、返金対象外となることがあります。
          </p>
        </div>

        {error && (
          <p className="text-red-400 text-xs border border-red-500/20 bg-red-500/5 rounded-xl px-3 py-2">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => setShowConfirm(false)}
            disabled={isLoading}
            className="flex-1 glass border border-white/10 rounded-xl py-3 text-white/50 hover:text-white text-sm font-medium transition-all disabled:opacity-40"
          >
            戻る
          </button>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1 bg-red-500/15 border border-red-500/30 hover:bg-red-500/25 rounded-xl py-3 text-red-400 hover:text-red-300 text-sm font-bold transition-all disabled:opacity-40"
          >
            {isLoading ? 'キャンセル中...' : 'キャンセルする'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="w-full glass border border-white/10 hover:border-red-500/30 text-white/40 hover:text-red-400 font-medium py-3.5 rounded-2xl text-sm transition-all duration-200"
    >
      予約をキャンセルする
    </button>
  );
}
