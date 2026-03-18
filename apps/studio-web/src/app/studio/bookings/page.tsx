import Link from 'next/link';
import { Search, Filter, MoreHorizontal, Download, Calendar } from 'lucide-react';

const bookingsData = [
  { id: 'B-1004', clientName: '山田 太郎', date: '2026-03-20', time: '10:00 - 13:00', type: '新規デザイン', status: 'CONFIRMED', price: '¥35,000' },
  { id: 'B-1003', clientName: '佐藤 花子', date: '2026-03-20', time: '14:30 - 16:00', type: 'ワンポイント', status: 'PENDING', price: '¥15,000' },
  { id: 'B-1002', clientName: '鈴木 イチロー', date: '2026-03-21', time: '11:00 - 18:00', type: '続き (2回目)', status: 'COMPLETED', price: '¥60,000' },
  { id: 'B-1001', clientName: '高橋 マイケル', date: '2026-03-23', time: '10:00 - 13:00', type: '新規デザイン', status: 'CANCELLED', price: '-' },
  { id: 'B-1000', clientName: '伊藤 さくら', date: '2026-03-24', time: '15:00 - 18:00', type: 'カバーアップ', status: 'CONFIRMED', price: '¥45,000' },
];

export default function BookingsPage() {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-700 border-green-200';
      case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'COMPLETED': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'CANCELLED': return 'bg-neutral-100 text-neutral-600 border-neutral-200';
      default: return 'bg-neutral-100 text-neutral-600 border-neutral-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Bookings</h1>
          <p className="text-sm text-neutral-500 mt-1">予約の確認、ステータス変更、カレンダー管理</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 text-neutral-700 text-sm font-semibold rounded-lg hover:bg-neutral-50 transition-colors">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-sm font-semibold rounded-lg hover:bg-neutral-800 transition-colors">
            <Calendar className="w-4 h-4" /> New Booking
          </button>
        </div>
      </div>

      {/* ツールバー (検索・フィルタ) */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search by name or ID..." 
              className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-brand-400 focus:ring-1 focus:ring-brand-400 rounded-lg text-sm outline-none transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-neutral-50 border border-neutral-200 text-neutral-700 text-sm font-semibold rounded-lg hover:bg-neutral-100 transition-colors shrink-0">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
        
        {/* 会計用タブ (モック) */}
        <div className="bg-neutral-100 p-1 rounded-lg flex text-sm font-semibold w-full sm:w-auto">
           <button className="px-4 py-1.5 bg-white text-neutral-900 rounded-md shadow-sm">All</button>
           <button className="px-4 py-1.5 text-neutral-500 hover:text-neutral-700">Upcoming</button>
           <button className="px-4 py-1.5 text-neutral-500 hover:text-neutral-700">Past</button>
        </div>
      </div>

      {/* データグリッド (テーブル) */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm text-neutral-600">
          <thead className="bg-neutral-50 border-b border-neutral-200 text-xs uppercase font-bold text-neutral-500">
            <tr>
              <th className="px-6 py-4">Booking ID</th>
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Date & Time</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {bookingsData.map((b) => (
              <tr key={b.id} className="hover:bg-neutral-50/50 transition-colors group">
                <td className="px-6 py-4 font-medium text-neutral-900">{b.id}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs uppercase">
                      {b.clientName.slice(0, 1)}
                    </div>
                    <span className="font-semibold text-neutral-900">{b.clientName}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="block font-medium text-neutral-900">{b.date}</span>
                  <span className="text-xs text-neutral-500">{b.time}</span>
                </td>
                <td className="px-6 py-4">{b.type}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border tracking-wider uppercase ${getStatusColor(b.status)}`}>
                    {b.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium">{b.price}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                     <Link href={`/studio/bookings/${b.id}`} className="px-3 py-1.5 text-xs font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                        View
                     </Link>
                     <button className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-md hover:bg-neutral-100 transition-colors">
                       <MoreHorizontal className="w-4 h-4" />
                     </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* ページネーション (モック) */}
        <div className="p-4 border-t border-neutral-200 flex items-center justify-between text-sm text-neutral-500">
          <span>Showing 1 to 5 of 24 results</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-neutral-200 rounded disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 bg-neutral-900 text-white rounded">1</button>
            <button className="px-3 py-1 border border-neutral-200 rounded hover:bg-neutral-50">2</button>
            <button className="px-3 py-1 border border-neutral-200 rounded hover:bg-neutral-50">3</button>
            <button className="px-3 py-1 border border-neutral-200 rounded hover:bg-neutral-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
