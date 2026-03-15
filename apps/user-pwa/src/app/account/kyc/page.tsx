'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

// === MVP 用にセッションをモック ===
const MOCK_USER_ID = 'user_001';

export default function KycUploadPage() {
    const router = useRouter();

    const [kycStatus, setKycStatus] = useState<string>('LOADING');
    const [submitting, setSubmitting] = useState(false);
    const [birthDate, setBirthDate] = useState('1990-01-01');

    useEffect(() => {
        // MVP: 常に MOCK_USER_ID でステータスを取得
        fetch(`http://localhost:3001/api/user-api/account?userId=${MOCK_USER_ID}`)
            .then(res => res.json())
            .then(profile => {
                setKycStatus(profile?.kycStatus || 'UNSUBMITTED');
            })
            .catch(err => {
                console.error(err);
                setKycStatus('UNSUBMITTED');
            });
    }, []);

    const handleKycSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch(`http://localhost:3001/api/user-api/account/kyc?userId=${MOCK_USER_ID}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    encryptedFilePath: 'dummy_s3_key_12345.jpg',
                    birthDate,
                })
            });
            if (!res.ok) throw new Error('Failed');
            
            setKycStatus('PENDING');
            alert('本人確認書類を提出しました。審査をお待ちください。');
        } catch (error) {
            console.error('Failed to submit kyc', error);
            alert('エラーが発生しました。時間を置いて再度お試しください。');
        } finally {
            setSubmitting(false);
        }
    };

    if (kycStatus === 'LOADING') {
        return <div className="p-8 text-center text-neutral-400">Loading...</div>;
    }

    return (
        <div className="max-w-xl mx-auto p-4 sm:p-8">
            <h1 className="text-2xl font-bold mb-6">本人確認 (KYC)</h1>

            {kycStatus === 'PENDING' && (
                <div className="p-6 bg-yellow-900/20 border border-yellow-700 rounded-lg text-yellow-500 mb-6">
                    <p className="font-semibold mb-2">審査中です</p>
                    <p className="text-sm">ご提出いただいた本人確認書類を審査しています。通常1〜2営業日で完了します。</p>
                </div>
            )}

            {kycStatus === 'APPROVED' && (
                <div className="p-6 bg-green-900/20 border border-green-700 rounded-lg text-green-500 mb-6">
                    <p className="font-semibold mb-2">本人確認完了</p>
                    <p className="text-sm">本人確認は審査を通過しました。すべての機能をご利用いただけます。</p>
                </div>
            )}

            {kycStatus === 'REJECTED' && (
                <div className="p-6 bg-red-900/20 border border-red-700 rounded-lg text-red-500 mb-6">
                    <p className="font-semibold mb-2">審査に通過しませんでした</p>
                    <p className="text-sm">ご提出いただいた書類に不備が見つかりました。お手数ですが、再度ご提出をお願いします。</p>
                </div>
            )}

            {(kycStatus === 'UNSUBMITTED' || kycStatus === 'REJECTED') && (
                <form onSubmit={handleKycSubmit} className="space-y-6">
                    <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-lg">
                        <h2 className="text-lg font-medium mb-4">書類のアップロード</h2>
                        <p className="text-sm text-neutral-400 mb-6">
                            運転免許証、マイナンバーカード、またはパスポートの画像（表面のみ）をアップロードしてください。
                        </p>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">生年月日</label>
                                <input 
                                    type="date" 
                                    value={birthDate}
                                    onChange={(e) => setBirthDate(e.target.value)}
                                    className="w-full bg-black border border-neutral-800 rounded-md px-4 py-3 focus:outline-none focus:border-brand-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">身分証明書の画像</label>
                                <div className="border-2 border-dashed border-neutral-700 rounded-lg p-8 text-center bg-black/50 hover:bg-neutral-900 transition-colors cursor-pointer">
                                    <p className="text-neutral-400 text-sm">クリックして画像を選択</p>
                                    <p className="text-xs text-neutral-600 mt-2">※現在はMVP期間のため、実際に画像を選択しなくてもダミーデータが送信されます。</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={submitting}
                        className="w-full bg-brand-600 text-white rounded-md py-4 font-semibold hover:bg-brand-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? '送信中...' : '提出する'}
                    </button>
                </form>
            )}
        </div>
    );
}
