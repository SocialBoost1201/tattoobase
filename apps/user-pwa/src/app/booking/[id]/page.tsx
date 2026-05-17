import Link from 'next/link';
import { UserApiClient } from '@/lib/user-api-client';

const STATUS_LABELS: Record<string, string> = {
  Draft: '下書き',
  PendingPolicyAgree: 'ポリシー同意待ち',
  PendingPayment: '支払い待ち',
  RequireApproval: '承認待ち',
  Confirmed: '予約確定',
  InProgress: '施術中',
  Completed: '完了',
  CancelledByUser: 'キャンセル済み',
  CancelledByStudio: 'スタジオ都合キャンセル',
};

const STATUS_COLORS: Record<string, string> = {
  Confirmed:         'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  Completed:         'text-blue-400 border-blue-500/30 bg-blue-500/10',
  InProgress:        'text-amber-400 border-amber-500/30 bg-amber-500/10',
  RequireApproval:   'text-amber-400 border-amber-500/30 bg-amber-500/10',
  PendingPayment:    'text-amber-400 border-amber-500/30 bg-amber-500/10',
  CancelledByUser:   'text-white/30 border-white/10 bg-white/5',
  CancelledByStudio: 'text-white/30 border-white/10 bg-white/5',
};

export default async function BookingDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string }>;
}) {
  const { id } = await params;
  const { success } = await searchParams;

  let booking = null;
  try {
    booking = await UserApiClient.getBookingDetail(id);
  } catch {
    // API not available
  }

  if (!booking) {
    return (
      <div className="py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-30">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <p className="text-white/40 text-sm">予約が見つかりませんでした</p>
        <Link href="/account/bookings" className="inline-block text-sm font-semibold text-white underline underline-offset-2">
          予約一覧に戻る
        </Link>
      </div>
    );
  }

  const statusLabel = STATUS_LABELS[booking.status] ?? booking.status;
  const statusColor = STATUS_COLORS[booking.status] ?? 'text-white/40 border-white/10 bg-white/5';
  const isCancellable = ['Draft', 'PendingPayment', 'Confirmed', 'RequireApproval'].includes(booking.status);

  return (
    <div className="space-y-6">
      {/* Payment success banner */}
      {success === 'true' && (
        <div className="glass rounded-2xl p-5 border border-emerald-500/20 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <p className="text-emerald-400 font-bold text-sm">決済が完了しました</p>
              <p className="text-white/40 text-xs mt-0.5">
                {booking.status === 'Confirmed'
                  ? 'ご予約が確定しました。スタジオからのご連絡をお待ちください。'
                  : 'ステータス同期中（数秒かかる場合があります）'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-white tracking-tight">BOOKING</h1>
          <p className="text-white/30 text-xs mt-0.5 tracking-wider">#{id.slice(-6).toUpperCase()}</p>
        </div>
        <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${statusColor}`}>
          {statusLabel}
        </span>
      </div>

      <div className="h-px bg-white/8" />

      {/* Booking details */}
      <div className="glass rounded-2xl overflow-hidden divide-y divide-white/8">
        {booking.artist && (
          <div className="px-4 py-3.5 flex justify-between items-center">
            <span className="text-white/40 text-xs uppercase tracking-wider">Artist</span>
            <span className="text-white text-sm font-semibold">{booking.artist.displayName}</span>
          </div>
        )}
        {booking.studio && (
          <div className="px-4 py-3.5 flex justify-between items-center">
            <span className="text-white/40 text-xs uppercase tracking-wider">Studio</span>
            <span className="text-white/70 text-sm">{booking.studio.name}</span>
          </div>
        )}
        <div className="px-4 py-3.5 flex justify-between items-center">
          <span className="text-white/40 text-xs uppercase tracking-wider">Date</span>
          <span className="text-white/70 text-sm">
            {booking.scheduledAtLocal
              ? new Date(booking.scheduledAtLocal).toLocaleString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short', hour: '2-digit', minute: '2-digit' })
              : '日程未定'}
          </span>
        </div>
        <div className="px-4 py-3.5 flex justify-between items-center">
          <span className="text-white/40 text-xs uppercase tracking-wider">Status</span>
          <span className="text-white/70 text-sm">{statusLabel}</span>
        </div>
      </div>

      {/* Cancel */}
      {isCancellable && (
        <div className="space-y-3">
          <div className="glass rounded-2xl p-4">
            <p className="text-white/35 text-xs leading-relaxed">
              制作準備が進んでいる場合、キャンセル時に返金対象外となることがあります。
            </p>
          </div>
          <button className="w-full glass border border-white/10 hover:border-red-500/30 text-white/40 hover:text-red-400 font-medium py-3.5 rounded-2xl text-sm transition-all duration-200">
            予約をキャンセルする
          </button>
        </div>
      )}

      <Link href="/account/bookings" className="block text-center text-white/30 text-xs hover:text-white/60 transition-colors">
        ← 予約一覧に戻る
      </Link>
    </div>
  );
}
