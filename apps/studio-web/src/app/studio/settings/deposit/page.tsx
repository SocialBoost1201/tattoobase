'use client';

import { useState, useEffect } from 'react';

const MOCK_STUDIO_ID = 'studio-1-id'; // 今回のMVPでは固定

export default function DepositSettingsPage() {
    const [requiresDeposit, setRequiresDeposit] = useState(false);
    const [depositAmount, setDepositAmount] = useState(10000);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:3001/api/studio-api/settings/deposit?studioId=${MOCK_STUDIO_ID}`)
            .then(res => res.json())
            .then(data => {
                if (data) {
                    setRequiresDeposit(data.requiresDeposit || false);
                    setDepositAmount(data.depositAmount || 10000);
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(`http://localhost:3001/api/studio-api/settings/deposit?studioId=${MOCK_STUDIO_ID}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requiresDeposit, depositAmount })
            });
            if (res.ok) {
                alert('デポジット設定を保存しました。');
            } else {
                alert('保存に失敗しました。');
            }
        } catch (err) {
            console.error(err);
            alert('エラーが発生しました。');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-neutral-400">Loading...</div>;
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">デザインデポジット設定</h1>
            <p className="text-neutral-400 mb-8 text-sm">
                予約確定時に顧客から前払い金（デポジット）を徴収するかどうかを設定します。
                徴収したデポジットは最終的な施術料金から差し引かれます。
            </p>

            <form onSubmit={handleSave} className="space-y-6 bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold">デポジットを要求する</h2>
                        <p className="text-sm text-neutral-400 mt-1">予約リクエスト承認後に支払い案内を自動送信します。</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={requiresDeposit}
                            onChange={(e) => setRequiresDeposit(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
                    </label>
                </div>

                {requiresDeposit && (
                    <div className="pt-6 border-t border-neutral-800">
                        <label className="block text-sm font-semibold mb-2">デポジット金額 (円)</label>
                        <div className="relative w-1/2">
                            <input 
                                type="number" 
                                min="100"
                                step="100"
                                value={depositAmount}
                                onChange={(e) => setDepositAmount(Number(e.target.value))}
                                className="w-full bg-black border border-neutral-800 rounded-md py-3 pl-4 pr-12 focus:outline-none focus:border-brand-500"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500">円</span>
                        </div>
                        <p className="text-xs text-neutral-500 mt-2">※現在は固定額による基本実装（MVP）です。将来的にデザインサイズ毎の価格設定も可能になります。</p>
                    </div>
                )}

                <div className="pt-6">
                    <button 
                        type="submit" 
                        disabled={saving}
                        className="bg-brand-600 hover:bg-brand-500 text-white font-semibold py-3 px-8 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {saving ? '保存中...' : '設定を保存する'}
                    </button>
                </div>
            </form>
        </div>
    );
}
