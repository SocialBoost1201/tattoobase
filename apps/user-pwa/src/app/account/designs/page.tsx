import Link from 'next/link';
import { API_BASE } from '@/lib/api';

const STATUS_COLORS: Record<string, string> = {
  Pending:  'text-amber-400 border-amber-500/30 bg-amber-500/10',
  Quoted:   'text-blue-400 border-blue-500/30 bg-blue-500/10',
  Accepted: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  Rejected: 'text-white/30 border-white/10 bg-white/5',
};

const STATUS_LABELS: Record<string, string> = {
  Pending: '見積待ち',
  Quoted: '見積提示',
  Accepted: '承認済み',
  Rejected: 'お断り',
};

const MOCK_DESIGNS = [
  { id: 'mock-dn-1', status: 'Quoted', artistName: 'HORI SHIN', title: '龍の和彫り（背中）', targetDate: '2026-07-01' },
  { id: 'mock-dn-2', status: 'Pending', artistName: 'Yuki Tanaka', title: 'ポートレート（腕）', targetDate: null },
];

async function getDesigns() {
  try {
    const res = await fetch(`${API_BASE}/user-api/account/designs?userId=user_123`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch {
    // API not available
  }
  return MOCK_DESIGNS;
}

export default async function AccountDesignsPage() {
  const designs = await getDesigns();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-extrabold text-2xl text-white tracking-tight">デザイン依頼</h1>
        <p className="text-white/45 text-xs mt-1">依頼中のデザインと見積もり状況</p>
      </div>

      {designs.length === 0 ? (
        <div className="py-16 text-center glass rounded-2xl space-y-3">
          <p className="text-white/40 text-sm">デザイン依頼はまだありません</p>
          <Link href="/search" className="inline-block text-sm font-semibold text-white underline underline-offset-2">
            アーティストを探す
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {designs.map((d: {
            id: string;
            status: string;
            artistName?: string;
            title?: string;
            targetDate?: string | null;
          }) => {
            const statusColor = STATUS_COLORS[d.status] ?? 'text-white/40 border-white/10 bg-white/5';
            const statusLabel = STATUS_LABELS[d.status] ?? d.status;
            return (
              <div key={d.id} className="glass border border-white/8 rounded-2xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-white font-semibold text-sm">{d.title ?? 'デザイン依頼'}</p>
                    <p className="text-white/40 text-xs mt-0.5">{d.artistName ?? '—'}</p>
                    <p className="text-white/50 text-xs mt-2">
                      希望日: {d.targetDate ?? '未定'}
                    </p>
                  </div>
                  <span className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-lg border ${statusColor}`}>
                    {statusLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
