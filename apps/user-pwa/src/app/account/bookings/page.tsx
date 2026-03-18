import Link from 'next/link';
import { ChevronRight, CalendarDays, CheckCircle2, Clock, XCircle, Paintbrush } from 'lucide-react';

const MOCK_BOOKINGS = [
  {
    id: 'bk_001',
    artistName: '山田 彫師',
    studioName: 'Demo Tattoo Studio',
    date: '2026-04-10',
    time: '13:00',
    type: '和彫 - 新規',
    status: 'Confirmed',
  },
  {
    id: 'bk_002',
    artistName: '佐藤 アーティスト',
    studioName: 'Ink Studio Shibuya',
    date: '2026-03-25',
    time: '11:00',
    type: 'ブラックアンドグレー',
    status: 'PendingPayment',
  },
  {
    id: 'bk_003',
    artistName: '鈴木 Tattooer',
    studioName: 'TOTEM Tattoo',
    date: '2026-02-15',
    time: '14:00',
    type: 'ワンポイント',
    status: 'Completed',
  },
  {
    id: 'bk_004',
    artistName: '高橋 彫師',
    studioName: 'BlackLines Tokyo',
    date: '2026-01-20',
    time: '10:00',
    type: 'レタリング',
    status: 'CancelledByUser',
  },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  Confirmed:       { label: '予約確定', color: 'text-green-400 bg-green-900/30 border-green-800', icon: CheckCircle2 },
  PendingPayment:  { label: '支払い待ち', color: 'text-amber-400 bg-amber-900/30 border-amber-800', icon: Clock },
  RequireApproval: { label: '承認待ち', color: 'text-amber-400 bg-amber-900/30 border-amber-800', icon: Clock },
  Completed:       { label: '施術完了', color: 'text-blue-400 bg-blue-900/30 border-blue-800', icon: CheckCircle2 },
  CancelledByUser: { label: 'キャンセル', color: 'text-neutral-500 bg-neutral-800/30 border-neutral-700', icon: XCircle },
};

async function getBookings() {
  try {
    const res = await fetch(`http://localhost:3001/user-api/account/bookings?userId=user_123`, { cache: 'no-store' });
    if (!res.ok) throw new Error();
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) return data;
    return MOCK_BOOKINGS;
  } catch {
    return MOCK_BOOKINGS;
  }
}

export default async function AccountBookingsPage() {
  const bookings = await getBookings();

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="font-heading font-extrabold text-2xl text-white tracking-tight">予約履歴</h1>
        <p className="text-neutral-500 text-xs mt-1">過去・予定の予約がすべて確認できます</p>
      </div>

      {/* タブ (モック) */}
      <div className="flex border-b border-neutral-800">
        {['すべて', '今後の予約', '過去の予約'].map((tab, i) => (
          <button
            key={tab}
            className={`pb-3 px-1 mr-6 text-sm font-bold transition-colors relative ${
              i === 0 ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            {tab}
            {i === 0 && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />}
          </button>
        ))}
      </div>

      {/* 予約カード一覧 */}
      <div className="space-y-3">
        {bookings.map((b: any) => {
          const cfg = STATUS_CONFIG[b.status] ?? STATUS_CONFIG.Completed;
          const StatusIcon = cfg.icon;

          return (
            <Link
              key={b.id}
              href={`/booking/${b.id}`}
              className="group flex items-center gap-4 bg-neutral-900 border border-neutral-800 hover:border-neutral-600 rounded-2xl p-4 transition-all duration-300"
            >
              {/* 日付エリア */}
              <div className="w-14 h-14 rounded-xl bg-neutral-800 group-hover:bg-neutral-700 transition-colors flex flex-col items-center justify-center shrink-0">
                <CalendarDays className="w-5 h-5 text-neutral-400" />
                <span className="text-white text-[10px] font-bold mt-1">{b.date?.slice(5)}</span>
              </div>

              {/* 予約情報 */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm truncate">{b.artistName}</p>
                <p className="text-neutral-500 text-xs mt-0.5 truncate">{b.type}</p>
                <p className="text-neutral-600 text-[10px] mt-1 truncate">{b.studioName}</p>
              </div>

              {/* ステータス + 矢印 */}
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className={`flex items-center gap-1 px-2 py-1 rounded-full border text-[10px] font-bold ${cfg.color}`}>
                  <StatusIcon className="w-3 h-3" />{cfg.label}
                </span>
                <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-neutral-300 transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>

      {bookings.length === 0 && (
        <div className="py-20 text-center border border-neutral-900 rounded-2xl bg-neutral-900/20">
          <Paintbrush className="w-10 h-10 text-neutral-700 mx-auto mb-4" />
          <p className="text-neutral-500 font-bold">まだ予約がありません</p>
          <Link href="/search" className="inline-block mt-6 px-6 py-3 bg-white text-black text-xs font-bold tracking-widest uppercase rounded-full hover:bg-neutral-200 transition-colors">
            アーティストを探す
          </Link>
        </div>
      )}

      <Link href="/account" className="block text-center text-neutral-500 hover:text-white text-xs transition-colors">
        ← マイページに戻る
      </Link>
    </div>
  );
}

