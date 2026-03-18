import Link from 'next/link';
import Image from 'next/image';
import { Paintbrush, CheckCircle2, Clock, AlertCircle, ArrowRight, Plus } from 'lucide-react';

const MOCK_DESIGNS = [
  {
    id: 'd_001',
    artistName: '山田 彫師',
    type: '和彫 - 龍',
    status: 'IN_PROGRESS',
    updatedAt: '2026-03-17',
    previewUrl: 'https://images.unsplash.com/photo-1598371839696-5e5bb00b0e59?q=80&w=400&auto=format&fit=crop',
    note: 'デザイン第2稿のご確認をお願いします',
  },
  {
    id: 'd_002',
    artistName: '佐藤 アーティスト',
    type: 'バラ ワンポイント',
    status: 'PENDING_REVIEW',
    updatedAt: '2026-03-10',
    previewUrl: null,
    note: 'ヒアリングシートへのご記入をお待ちしています',
  },
  {
    id: 'd_003',
    artistName: '鈴木 Tattooer',
    type: 'フクロウ × 月',
    status: 'APPROVED',
    updatedAt: '2026-02-20',
    previewUrl: 'https://images.unsplash.com/photo-1643916295551-40eebb40dbbe?q=80&w=400&auto=format&fit=crop',
    note: 'デザインが確定しました。施術日程をご確認ください。',
  },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  IN_PROGRESS:    { label: '制作中', color: 'text-purple-400 bg-purple-950/30 border-purple-800', icon: Paintbrush },
  PENDING_REVIEW: { label: '確認待ち', color: 'text-amber-400 bg-amber-950/30 border-amber-800', icon: Clock },
  APPROVED:       { label: '確定済み', color: 'text-green-400 bg-green-950/30 border-green-800', icon: CheckCircle2 },
  REJECTED:       { label: '要修正', color: 'text-red-400 bg-red-950/30 border-red-800', icon: AlertCircle },
};

async function getDesigns() {
  try {
    const res = await fetch(`http://localhost:3001/user-api/account/designs?userId=user_123`, { cache: 'no-store' });
    if (!res.ok) throw new Error();
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) return data;
    return MOCK_DESIGNS;
  } catch {
    return MOCK_DESIGNS;
  }
}

export default async function AccountDesignsPage() {
  const designs = await getDesigns();

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-white tracking-tight">デザイン依頼</h1>
          <p className="text-neutral-500 text-xs mt-1">進行中のデザイン制作の確認と承認</p>
        </div>
        <Link href="/search" className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-xs font-bold border border-neutral-800 hover:border-neutral-600 rounded-full transition-colors">
          <Plus className="w-3.5 h-3.5" /> 新規依頼
        </Link>
      </div>

      <div className="space-y-4">
        {designs.map((d: any) => {
          const cfg = STATUS_CONFIG[d.status] ?? STATUS_CONFIG.IN_PROGRESS;
          const StatusIcon = cfg.icon;

          return (
            <Link
              key={d.id}
              href={`/account/designs/${d.id}`}
              className="group block bg-neutral-900 border border-neutral-800 hover:border-neutral-600 rounded-2xl overflow-hidden transition-all duration-300"
            >
              <div className="flex gap-5 p-5">
                {/* プレビュー画像 (あれば表示) */}
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-neutral-800 shrink-0 flex items-center justify-center">
                  {d.previewUrl ? (
                    <Image 
                      src={d.previewUrl} 
                      alt={d.type} 
                      width={80} 
                      height={80} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Paintbrush className="w-6 h-6 text-neutral-600" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-white font-bold text-sm truncate">{d.type}</p>
                      <p className="text-neutral-500 text-xs mt-0.5 truncate">担当: {d.artistName}</p>
                    </div>
                    <span className={`flex items-center gap-1 px-2 py-1 rounded-full border text-[10px] font-bold whitespace-nowrap shrink-0 ${cfg.color}`}>
                      <StatusIcon className="w-3 h-3" />{cfg.label}
                    </span>
                  </div>

                  {/* アクションが必要なメモ */}
                  {d.note && (
                    <div className="mt-3 bg-neutral-800/50 rounded-lg px-3 py-2">
                      <p className="text-neutral-400 text-xs">{d.note}</p>
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-neutral-600 text-[10px]">最終更新: {d.updatedAt}</span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-neutral-500 group-hover:text-white transition-colors">
                      詳細を見る <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {designs.length === 0 && (
        <div className="py-20 text-center border border-neutral-900 rounded-2xl bg-neutral-900/20">
          <Paintbrush className="w-10 h-10 text-neutral-700 mx-auto mb-4" />
          <p className="text-neutral-500 font-bold">まだデザイン依頼がありません</p>
        </div>
      )}

      <Link href="/account" className="block text-center text-neutral-500 hover:text-white text-xs transition-colors">
        ← マイページに戻る
      </Link>
    </div>
  );
}

