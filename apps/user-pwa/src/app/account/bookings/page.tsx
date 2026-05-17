import Link from 'next/link';
import { API_BASE } from '@/lib/api';

const STATUS_COLORS: Record<string, string> = {
  Confirmed:         'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  Completed:         'text-blue-400 border-blue-500/30 bg-blue-500/10',
  InProgress:        'text-amber-400 border-amber-500/30 bg-amber-500/10',
  RequireApproval:   'text-amber-400 border-amber-500/30 bg-amber-500/10',
  PendingPayment:    'text-amber-400 border-amber-500/30 bg-amber-500/10',
  CancelledByUser:   'text-white/30 border-white/10 bg-white/5',
  CancelledByStudio: 'text-white/30 border-white/10 bg-white/5',
};

const STATUS_LABELS: Record<string, string> = {
  Draft: '下書き',
  PendingPayment: '支払い待ち',
  RequireApproval: '承認待ち',
  Confirmed: '予約確定',
  InProgress: '施術中',
  Completed: '完了',
  CancelledByUser: 'キャンセル済み',
  CancelledByStudio: 'スタジオ都合キャンセル',
};

const MOCK_BOOKINGS = [
  { id: 'mock-bk-1', status: 'Confirmed', artistName: 'HORI SHIN', studioName: 'IREZUMI TOKYO', scheduledAtLocal: '2026-06-12T13:00:00' },
  { id: 'mock-bk-2', status: 'Completed', artistName: 'SAKURA', studioName: 'SEOUL STYLE TOKYO', scheduledAtLocal: '2026-03-20T10:00:00' },
  { id: 'mock-bk-3', status: 'RequireApproval', artistName: 'MIKA INK', studioName: 'PASTEL STUDIO NAGOYA', scheduledAtLocal: null },
];

async function getBookings() {
  try {
    const res = await fetch(`${API_BASE}/user-api/account/bookings?userId=user_123`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch {
    // API not available
  }
  return MOCK_BOOKINGS;
}

export default async function AccountBookingsPage() {
  const bookings = await getBookings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-extrabold text-2xl text-white tracking-tight">予約履歴</h1>
        <p className="text-white/45 text-xs mt-1">予定・過去の予約一覧</p>
      </div>

      {bookings.length === 0 ? (
        <div className="py-16 text-center glass rounded-2xl space-y-3">
          <p className="text-white/40 text-sm">予約はまだありません</p>
          <Link href="/search" className="inline-block text-sm font-semibold text-white underline underline-offset-2">
            アーティストを探す
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b: {
            id: string;
            status: string;
            artistName?: string;
            studioName?: string;
            artist?: { displayName: string };
            studio?: { name: string };
            scheduledAtLocal?: string | null;
          }) => {
            const artistName = b.artistName ?? b.artist?.displayName ?? '—';
            const studioName = b.studioName ?? b.studio?.name ?? '';
            const statusColor = STATUS_COLORS[b.status] ?? 'text-white/40 border-white/10 bg-white/5';
            const statusLabel = STATUS_LABELS[b.status] ?? b.status;
            return (
              <Link key={b.id} href={`/booking/${b.id}`} className="group block">
                <div className="glass glass-hover border border-white/8 hover:border-white/20 rounded-2xl p-4 transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{artistName}</p>
                      {studioName && <p className="text-white/40 text-xs mt-0.5 truncate">{studioName}</p>}
                      <p className="text-white/50 text-xs mt-2">
                        {b.scheduledAtLocal
                          ? new Date(b.scheduledAtLocal).toLocaleString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short', hour: '2-digit', minute: '2-digit' })
                          : '日程未定'}
                      </p>
                    </div>
                    <span className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-lg border ${statusColor}`}>
                      {statusLabel}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
