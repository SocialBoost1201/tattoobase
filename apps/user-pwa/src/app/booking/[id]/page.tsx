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

const STATUS_STYLES: Record<string, string> = {
  Confirmed:          'bg-[#f0f7f0] text-[#2a7a2a] border-[#b0d8b0]',
  Completed:          'bg-[#f0f4ff] text-[#2a4aaa] border-[#b0c8f0]',
  InProgress:         'bg-[#fffbf0] text-[#8a6a00] border-[#e0d080]',
  RequireApproval:    'bg-amber-50 text-amber-700 border-amber-200',
  PendingPayment:     'bg-amber-50 text-amber-700 border-amber-200',
  CancelledByUser:    'bg-[#f5f5f5] text-neutral-600 border-neutral-300',
  CancelledByStudio:  'bg-[#f5f5f5] text-neutral-600 border-neutral-300',
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
  } catch (error) {
    console.error(error);
  }

  if (!booking) {
    return (
      <div className="py-16 text-center border border-neutral-300 rounded-sm">
        <p className="text-neutral-600 text-sm">予約が見つかりませんでした</p>
        <Link href="/account/bookings" className="mt-4 inline-block text-sm font-semibold text-[#0a0a0a] underline">予約一覧に戻る</Link>
      </div>
    );
  }

  const statusLabel = STATUS_LABELS[booking.status] ?? booking.status;
  const statusStyle = STATUS_STYLES[booking.status] ?? 'bg-[#f5f5f5] text-neutral-600 border-neutral-300';
  const isCancellable = ['Draft', 'PendingPayment', 'Confirmed', 'RequireApproval'].includes(booking.status);

  return (
    <div className="space-y-6">
      {success === 'true' && (
        <div className="py-6 text-center space-y-4">
          <div className="w-12 h-12 bg-[#0a0a0a] rounded-full flex items-center justify-center mx-auto">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2 className="font-heading font-extrabold text-xl text-[#0a0a0a]">決済が完了しました</h2>
          <p className="text-neutral-600 text-sm">
            {booking.status === 'Confirmed' 
              ? 'ご予約が完了しました。スタジオからの連絡をお待ちください。' 
              : 'ステータスの同期をお待ちください（処理に数秒かかる場合があります）。'}
          </p>
        </div>
      )}

      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading font-extrabold text-xl text-[#0a0a0a]">BOOKING</h1>
          <p className="text-neutral-600 text-xs mt-0.5">予約 #{id.slice(-6).toUpperCase()}</p>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-sm border ${statusStyle}`}>
          {statusLabel}
        </span>
      </div>

      <div className="h-px bg-neutral-300" />

      {/* 予約情報 */}
      <div className="divide-y divide-neutral-300 border border-neutral-300 rounded-sm">
        {booking.artist && (
          <div className="px-4 py-3 flex justify-between items-center">
            <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Artist</span>
            <span className="text-[#0a0a0a] text-sm font-semibold">{booking.artist.displayName}</span>
          </div>
        )}
        {booking.studio && (
          <div className="px-4 py-3 flex justify-between items-center">
            <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Studio</span>
            <span className="text-[#0a0a0a] text-sm">{booking.studio.name}</span>
          </div>
        )}
        {booking.scheduledAtLocal ? (
          <div className="px-4 py-3 flex justify-between items-center">
            <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Date</span>
            <span className="text-[#0a0a0a] text-sm">{new Date(booking.scheduledAtLocal).toLocaleString('ja-JP')}</span>
          </div>
        ) : (
          <div className="px-4 py-3 flex justify-between items-center">
            <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Date</span>
            <span className="text-[#0a0a0a] text-sm">日程未定</span>
          </div>
        )}
      </div>

      {/* キャンセル */}
      {isCancellable && (
        <div className="space-y-3">
          <p className="text-neutral-600 text-xs leading-relaxed">
            制作準備が進んでいる場合、キャンセル時に返金対象外となることがあります。
          </p>
          <button className="w-full border border-neutral-300 hover:border-[#cc0000] text-neutral-600 hover:text-[#cc0000] font-medium py-3 rounded-sm text-sm transition-colors duration-200">
            予約をキャンセルする
          </button>
        </div>
      )}

      <Link href="/account/bookings" className="block text-center text-brand-400 text-xs hover:text-[#0a0a0a] transition-colors">
        ← 予約一覧に戻る
      </Link>
    </div>
  );
}
