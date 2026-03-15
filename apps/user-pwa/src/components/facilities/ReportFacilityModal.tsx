'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
      const res = await fetch(`/api/user-api/facilities/${facilityId}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportedLevel: level,
          evidenceText,
          evidenceUrl,
        }),
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 my-8">
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h2 className="text-xl font-bold">施設のタトゥーポリシーを報告</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        {success ? (
          <div className="py-8 text-center text-green-700">
            <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            <p className="font-bold text-lg">報告を送信しました！</p>
            <p className="text-sm mt-2 opacity-80">ご協力ありがとうございます。審査の上反映いたします。</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <p className="text-sm text-gray-600">
              <strong className="text-black">{facilityName}</strong> の現在のタトゥーに関するルールをご存知でしたら教えてください。
            </p>

            <div>
              <label className="block text-sm font-bold mb-1">受け入れレベル <span className="text-red-500">*</span></label>
              <select 
                value={level} 
                onChange={(e) => setLevel(e.target.value)}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-amber-500"
                required
              >
                <option value="UNKNOWN">-- 選択してください --</option>
                <option value="ALLOWED">全面許可（隠す必要なし）</option>
                <option value="COVERED_ONLY">シールやラッシュガードで隠せば許可</option>
                <option value="PARTIAL_ONLY">ワンポイント等一部のみ可</option>
                <option value="BANNED">一切禁止（入館不可）</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">体験談・目撃情報など <span className="text-red-500">*</span></label>
              <textarea 
                value={evidenceText}
                onChange={(e) => setEvidenceText(e.target.value)}
                rows={3}
                placeholder="例：入口に「タトゥーお断り」と書いてあり、受付でも確認されました。 / シールで隠せばOKとのことでした。"
                className="w-full border p-2 rounded focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">参考URL（公式サイトの規約など） <span className="text-gray-400 text-xs font-normal">任意</span></label>
              <input 
                type="url"
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
                placeholder="https://example.com/faq"
                className="w-full border p-2 rounded focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {error && <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</p>}

            <div className="pt-4 flex justify-end gap-3 border-t">
              <button 
                type="button" 
                onClick={onClose}
                className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting || level === 'UNKNOWN' || !evidenceText}
                className="px-6 py-2 bg-black text-white rounded font-bold hover:bg-gray-800 disabled:opacity-50"
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
