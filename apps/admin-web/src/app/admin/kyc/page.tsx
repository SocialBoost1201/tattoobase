'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type KycSubmission = {
    id: string;
    bookingId: string;
    encryptedFilePath: string;
    birthDate: string;
    status: string;
    reviewedBy?: string;
    reviewedAt?: string;
};

export default function AdminKycPage() {
    const [queue, setQueue] = useState<KycSubmission[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchQueue = async () => {
        try {
            const res = await fetch('http://localhost:3001/admin-api/kyc');
            if (res.ok) {
                const data = await res.json();
                setQueue(data);
            }
        } catch (e) {
            console.error('Failed to fetch KYC queue', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQueue();
    }, []);

    const handleProcess = async (id: string, action: 'APPROVE' | 'REJECT') => {
        if (!confirm(`この申請を ${action === 'APPROVE' ? '承認' : '却下'} しますか？`)) return;

        try {
            const res = await fetch(`http://localhost:3001/admin-api/kyc/${id}/process`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, reviewerId: 'admin-system' }) 
            });

            if (res.ok) {
                alert(`申請を ${action === 'APPROVE' ? '承認' : '却下'} しました。`);
                fetchQueue();
            } else {
                alert('処理に失敗しました');
            }
        } catch (e) {
            console.error('Failed to process KYC', e);
            alert('エラーが発生しました');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 p-8 font-sans">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Admin: KYC 審査キュー</h1>
                    <Link href="/admin" className="text-blue-600 hover:underline text-sm">Dashboardへ戻る</Link>
                </div>

                <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold">審査待ち一覧 ({queue.length})</h2>
                    </div>
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">読み込み中...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            {queue.length > 0 ? (
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-3 font-semibold text-gray-700">申請ID</th>
                                            <th className="px-6 py-3 font-semibold text-gray-700">提出書類情報</th>
                                            <th className="px-6 py-3 font-semibold text-gray-700">生年月日</th>
                                            <th className="px-6 py-3 font-semibold text-gray-700 text-right">アクション</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {queue.map(item => {
                                            const userId = item.bookingId.split('-')[1] || 'Unknown User';
                                            return (
                                                <tr key={item.id} className="hover:bg-gray-50 transition">
                                                    <td className="px-6 py-4">
                                                        <p className="font-mono text-xs text-gray-500">{item.id}</p>
                                                        <p className="font-bold text-gray-900 mt-1">User: {userId}</p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-blue-600 inline-flex items-center gap-1">
                                                            📄 {item.encryptedFilePath}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-700">
                                                        {new Date(item.birthDate).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 text-right space-x-2">
                                                        <button 
                                                            onClick={() => handleProcess(item.id, 'APPROVE')}
                                                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold text-xs"
                                                        >
                                                            承認
                                                        </button>
                                                        <button 
                                                            onClick={() => handleProcess(item.id, 'REJECT')}
                                                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold text-xs"
                                                        >
                                                            却下
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="p-8 text-center text-gray-500">現在審査待ちのKYC申請はありません。</div>
                            )}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
