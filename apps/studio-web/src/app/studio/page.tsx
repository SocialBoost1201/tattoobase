import Link from 'next/link';
import { 
  TrendingUp, 
  Users, 
  CalendarCheck, 
  Paintbrush, 
  ArrowUpRight,
  MoreHorizontal,
  ShieldAlert
} from 'lucide-react';

// 必要データ一覧:
// - 今日の予約リスト (Today's Bookings)
// - 新規のデザイン依頼件数 (New Design Requests count)
// - アカウント・スタジオステータス (KYC Status, Stripe Connect status)
// - スタジオの売上サマリー概要 (Recent Revenue summary)

async function getDashboardData(studioId: string) {
  try {
    const res = await fetch(`http://localhost:3001/studio-api/dashboard?studioId=${studioId}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  } catch (e) {
    // API未接続時のフォールバックモックデータ
    return {
      metrics: {
        revenue: 450000,
        revenueGrowth: 12.5,
        newBookings: 24,
        activeDesigns: 8
      },
      upcomingBookings: [
        { id: 'b1', clientName: '山田 太郎', time: '10:00 - 13:00', status: 'CONFIRMED', type: '新規デザイン' },
        { id: 'b2', clientName: '佐藤 花子', time: '14:30 - 16:00', status: 'PENDING', type: 'ワンポイント' },
        { id: 'b3', clientName: '鈴木 イチロー', time: '17:00 - 20:00', status: 'CONFIRMED', type: '続き (2回目)' }
      ]
    };
  }
}

export default async function StudioDashboard() {
    const dummyStudioId = "studio_abc";
    const data = await getDashboardData(dummyStudioId);

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Overview</h1>
          <p className="text-sm text-neutral-500 mt-1">スタジオの現在の状況と本日のスケジュール</p>
        </div>

        {/* 要対応アラート (KYC等) */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
               <ShieldAlert className="w-5 h-5" />
             </div>
             <div>
               <h3 className="text-sm font-bold text-amber-900">本人確認 (KYC) が未完了です</h3>
               <p className="text-xs text-amber-700 mt-0.5">予約の受付と売上の受け取りを開始するには、身分証明書の提出が必要です。</p>
             </div>
          </div>
          <Link href="/studio/settings" className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-lg transition-colors">
            手続きを進める
          </Link>
        </div>

        {/* メトリクス・カード */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-sm font-semibold text-neutral-500">当月の売上見込</h3>
               <div className="w-8 h-8 rounded-md bg-green-50 text-green-600 flex items-center justify-center"><TrendingUp className="w-4 h-4" /></div>
             </div>
             <div className="flex items-end gap-2">
               <span className="text-2xl font-bold text-neutral-900">¥{data.metrics.revenue.toLocaleString()}</span>
               <span className="text-xs font-semibold text-green-600 flex items-center mb-1 bg-green-50 px-1.5 py-0.5 rounded"><ArrowUpRight className="w-3 h-3 mr-0.5"/> {data.metrics.revenueGrowth}%</span>
             </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-sm font-semibold text-neutral-500">新規予約リクエスト</h3>
               <div className="w-8 h-8 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center"><CalendarCheck className="w-4 h-4" /></div>
             </div>
             <div className="flex items-end gap-2">
               <span className="text-2xl font-bold text-neutral-900">{data.metrics.newBookings}</span>
               <span className="text-xs font-semibold text-neutral-500 mb-1">件 (今月)</span>
             </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-sm font-semibold text-neutral-500">進行中のデザイン</h3>
               <div className="w-8 h-8 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center"><Paintbrush className="w-4 h-4" /></div>
             </div>
             <div className="flex items-end gap-2">
               <span className="text-2xl font-bold text-neutral-900">{data.metrics.activeDesigns}</span>
               <span className="text-xs font-semibold text-neutral-500 mb-1">件</span>
             </div>
             <div className="mt-3 w-full bg-neutral-100 rounded-full h-1.5"><div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '45%' }}></div></div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-sm font-semibold text-neutral-500">プロフィール閲覧数</h3>
               <div className="w-8 h-8 rounded-md bg-orange-50 text-orange-600 flex items-center justify-center"><Users className="w-4 h-4" /></div>
             </div>
             <div className="flex items-end gap-2">
               <span className="text-2xl font-bold text-neutral-900">1,204</span>
               <span className="text-xs font-semibold text-orange-600 flex items-center mb-1 bg-orange-50 px-1.5 py-0.5 rounded"><ArrowUpRight className="w-3 h-3 mr-0.5"/> 8.2%</span>
             </div>
          </div>
        </div>

        {/* 2カラムレイアウト: 今日の予約 & 最近のアクティビティ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-neutral-900">Today's Schedule</h2>
              <Link href="/studio/bookings" className="text-sm font-semibold text-brand-600 hover:text-brand-700">すべて見る</Link>
            </div>
            
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
              {data.upcomingBookings.length > 0 ? (
                <div className="divide-y divide-neutral-100">
                  {data.upcomingBookings.map((booking: any) => (
                    <div key={booking.id} className="p-4 hover:bg-neutral-50 transition-colors flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-neutral-100 rounded-full flex flex-col items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-neutral-500">今日</span>
                          <span className="text-sm font-extrabold text-neutral-900 leading-none">{booking.time.split(' ')[0]}</span>
                        </div>
                        <div>
                          <p className="font-bold text-neutral-900">{booking.clientName}</p>
                          <p className="text-xs text-neutral-500 mt-0.5">{booking.type} • {booking.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                           booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                         }`}>
                           {booking.status}
                         </span>
                         <button className="p-2 text-neutral-400 hover:text-neutral-900 rounded-md hover:bg-neutral-100 transition-colors opacity-0 group-hover:opacity-100">
                           <MoreHorizontal className="w-5 h-5" />
                         </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-neutral-500">
                  <p className="font-semibold mb-1">本日の予約はありません</p>
                  <p className="text-sm">ゆっくり休んで、明日に備えましょう！</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-bold text-neutral-900">Recent Activity</h2>
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-5">
              <div className="relative border-l-2 border-neutral-100 ml-3 space-y-6">
                <div className="relative pl-6">
                  <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white bg-blue-500"></span>
                  <p className="text-sm font-medium text-neutral-900">新しい予約リクエスト</p>
                  <p className="text-xs text-neutral-500 mt-0.5">佐藤 花子さんが「ワンポイント」を予約しました</p>
                  <p className="text-[10px] text-neutral-400 mt-1">10分前</p>
                </div>
                <div className="relative pl-6">
                  <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white bg-green-500"></span>
                  <p className="text-sm font-medium text-neutral-900">デポジット入金完了</p>
                  <p className="text-xs text-neutral-500 mt-0.5">鈴木 イチローさんの予約が確定しました</p>
                  <p className="text-[10px] text-neutral-400 mt-1">2時間前</p>
                </div>
                <div className="relative pl-6">
                  <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white bg-purple-500"></span>
                  <p className="text-sm font-medium text-neutral-900">デザイン承認</p>
                  <p className="text-xs text-neutral-500 mt-0.5">「虎の和彫」デザインがクライアントに承認されました</p>
                  <p className="text-[10px] text-neutral-400 mt-1">昨日</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
