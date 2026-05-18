'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Plus, Circle } from 'lucide-react';

type BookingEntry = {
  id: string;
  clientName: string;
  time: string;
  duration: number; // hours
  type: string;
  status: 'CONFIRMED' | 'PENDING' | 'COMPLETED' | 'CANCELLED';
  color: string;
};

// モックデータ: 2026年3月
const MOCK_BOOKINGS: Record<number, BookingEntry[]> = {
  18: [
    { id: 'B-1005', clientName: '田中 凛', time: '10:00', duration: 2, type: 'ワンポイント', status: 'CONFIRMED', color: 'bg-green-100 border-green-300 text-green-800' },
    { id: 'B-1006', clientName: '中村 海斗', time: '14:00', duration: 3, type: '新規デザイン', status: 'PENDING', color: 'bg-amber-100 border-amber-300 text-amber-800' },
  ],
  19: [
    { id: 'B-1007', clientName: '福田 あおい', time: '11:00', duration: 4, type: 'フルスリーブ (3回目)', status: 'CONFIRMED', color: 'bg-green-100 border-green-300 text-green-800' },
  ],
  20: [
    { id: 'B-1004', clientName: '山田 太郎', time: '10:00', duration: 3, type: '新規デザイン', status: 'CONFIRMED', color: 'bg-green-100 border-green-300 text-green-800' },
    { id: 'B-1003', clientName: '佐藤 花子', time: '14:30', duration: 1.5, type: 'ワンポイント', status: 'PENDING', color: 'bg-amber-100 border-amber-300 text-amber-800' },
  ],
  21: [
    { id: 'B-1002', clientName: '鈴木 イチロー', time: '11:00', duration: 7, type: '続き (2回目)', status: 'CONFIRMED', color: 'bg-green-100 border-green-300 text-green-800' },
  ],
  22: [],
  23: [{ id: 'B-1001', clientName: '高橋 マイケル', time: '10:00', duration: 3, type: 'カバーアップ', status: 'CANCELLED', color: 'bg-neutral-100 border-neutral-300 text-neutral-500' }],
  24: [{ id: 'B-1000', clientName: '伊藤 さくら', time: '15:00', duration: 3, type: 'カバーアップ', status: 'CONFIRMED', color: 'bg-green-100 border-green-300 text-green-800' }],
  25: [],
  26: [{ id: 'B-1008', clientName: '木村 蓮', time: '13:00', duration: 4, type: '新規デザイン', status: 'CONFIRMED', color: 'bg-green-100 border-green-300 text-green-800' }],
};

const DAYS = ['月', '火', '水', '木', '金', '土', '日'];
const WEEK = [18, 19, 20, 21, 22, 23, 24]; // モック: 2026年3月第3週
const HOURS = Array.from({ length: 11 }, (_, i) => i + 9); // 9:00〜19:00

const STATUS_LABEL: Record<string, string> = {
  CONFIRMED: '確定',
  PENDING: '承認待ち',
  COMPLETED: '完了',
  CANCELLED: 'キャンセル',
};

type ViewMode = 'week' | 'month' | 'list';

export default function CalendarPage() {
  const [view, setView] = useState<ViewMode>('week');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const totalConfirmed = Object.values(MOCK_BOOKINGS).flat().filter(b => b.status === 'CONFIRMED').length;
  const totalPending = Object.values(MOCK_BOOKINGS).flat().filter(b => b.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Calendar</h1>
          <p className="text-sm text-neutral-500 mt-1">2026年3月 · {totalConfirmed}件確定 / {totalPending}件承認待ち</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-sm font-semibold rounded-lg hover:bg-neutral-800 transition-colors">
            <Plus className="w-4 h-4" /> 新規予約を追加
          </button>
        </div>
      </div>

      {/* ビュー切り替え + 月ナビゲーション */}
      <div className="bg-white border border-neutral-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5 text-neutral-600" />
          </button>
          <span className="text-sm font-bold text-neutral-800">2026年3月 第3週</span>
          <button className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors">
            <ChevronRight className="w-5 h-5 text-neutral-600" />
          </button>
        </div>

        <div className="bg-neutral-100 p-1 rounded-lg flex text-xs font-bold">
          {(['week', 'month', 'list'] as ViewMode[]).map(v => (
            <button key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-md transition-all capitalize ${view === v ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}>
              {v === 'week' ? '週' : v === 'month' ? '月' : 'リスト'}
            </button>
          ))}
        </div>
      </div>

      {/* 週ビュー */}
      {view === 'week' && (
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
          {/* 曜日ヘッダー */}
          <div className="grid border-b border-neutral-200" style={{ gridTemplateColumns: '60px repeat(7, 1fr)' }}>
            <div className="p-3 border-r border-neutral-100" />
            {WEEK.map((date, i) => {
              const hasBookings = (MOCK_BOOKINGS[date] ?? []).length > 0;
              const isToday = date === 18;
              return (
                <div key={date}
                  className={`p-3 text-center border-r border-neutral-100 last:border-r-0 cursor-pointer hover:bg-neutral-50 transition-colors ${isToday ? 'bg-neutral-900' : ''}`}
                  onClick={() => setSelectedDay(date)}>
                  <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${isToday ? 'text-neutral-400' : 'text-neutral-400'}`}>{DAYS[i]}</p>
                  <p className={`text-lg font-extrabold ${isToday ? 'text-white' : 'text-neutral-800'}`}>{date}</p>
                  {hasBookings && (
                    <div className="flex justify-center gap-0.5 mt-1">
                      {(MOCK_BOOKINGS[date] ?? []).map(b => (
                        <Circle key={b.id} className={`w-1.5 h-1.5 fill-current ${b.status === 'CONFIRMED' ? 'text-green-500' : b.status === 'PENDING' ? 'text-amber-500' : 'text-neutral-400'}`} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 時間軸グリッド */}
          <div className="overflow-y-auto max-h-[400px]">
            {HOURS.map(hour => (
              <div key={hour} className="grid border-b border-neutral-50" style={{ gridTemplateColumns: '60px repeat(7, 1fr)', minHeight: '56px' }}>
                <div className="p-2 text-right text-xs font-bold text-neutral-400 border-r border-neutral-100 pt-3 shrink-0">
                  {hour}:00
                </div>
                {WEEK.map(date => {
                  const bookingsAtHour = (MOCK_BOOKINGS[date] ?? []).filter(b => {
                    const bHour = parseInt(b.time.split(':')[0]);
                    return bHour === hour;
                  });
                  return (
                    <div key={date} className="border-r border-neutral-50 last:border-r-0 p-1 relative">
                      {bookingsAtHour.map(b => (
                        <Link key={b.id} href={`/studio/bookings/${b.id}`}
                          className={`block text-xs font-semibold px-2 py-1.5 rounded-md border mb-1 truncate hover:opacity-80 transition-opacity ${b.color}`}>
                          <span className="block font-bold truncate">{b.clientName}</span>
                          <span className="opacity-70">{b.time} · {b.type}</span>
                        </Link>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* リストビュー */}
      {view === 'list' && (
        <div className="space-y-3">
          {WEEK.map(date => {
            const dayBookings = MOCK_BOOKINGS[date] ?? [];
            return (
              <div key={date} className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-neutral-900 text-sm">3月{date}日 ({DAYS[WEEK.indexOf(date)]})</span>
                    {date === 18 && <span className="text-xs bg-neutral-900 text-white font-bold px-2 py-0.5 rounded-full">TODAY</span>}
                  </div>
                  <span className="text-xs text-neutral-500">{dayBookings.length}件</span>
                </div>
                {dayBookings.length === 0 ? (
                  <div className="px-5 py-4 text-neutral-400 text-xs">予約なし — 空き日</div>
                ) : (
                  <div className="divide-y divide-neutral-50">
                    {dayBookings.map(b => (
                      <Link key={b.id} href={`/studio/bookings/${b.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-neutral-50/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-neutral-700 text-xs">{b.clientName[0]}</div>
                          <div>
                            <p className="text-sm font-semibold text-neutral-900">{b.clientName}</p>
                            <p className="text-xs text-neutral-500">{b.time} · {b.type} · {b.duration}h</p>
                          </div>
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full border ${b.color}`}>{STATUS_LABEL[b.status]}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 月ビュー（シンプル） */}
      {view === 'month' && (
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-7 border-b border-neutral-200">
            {DAYS.map(d => (
              <div key={d} className="py-3 text-center text-xs font-bold text-neutral-500 uppercase border-r border-neutral-100 last:border-r-0">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 divide-x divide-y divide-neutral-100">
            {/* 1日〜31日（モック、1日=月曜から開始と仮定） */}
            {Array.from({ length: 35 }, (_, i) => {
              const date = i - 0; // 1日=月曜
              const dayNum = date + 1;
              const isValid = dayNum >= 1 && dayNum <= 31;
              const hasData = isValid && MOCK_BOOKINGS[dayNum];
              const count = hasData ? MOCK_BOOKINGS[dayNum].length : 0;
              const isToday = dayNum === 18;
              return (
                <div key={i} className={`min-h-[80px] p-2 ${!isValid ? 'bg-neutral-50/50' : 'hover:bg-neutral-50 cursor-pointer'} transition-colors`}>
                  {isValid && (
                    <>
                      <span className={`text-xs font-bold inline-flex w-6 h-6 rounded-full items-center justify-center mb-1 ${isToday ? 'bg-neutral-900 text-white' : 'text-neutral-700'}`}>{dayNum}</span>
                      {count > 0 && (
                        <div className="space-y-0.5">
                          {(MOCK_BOOKINGS[dayNum] ?? []).slice(0, 2).map(b => (
                            <div key={b.id} className={`text-xs font-bold px-1 py-0.5 rounded truncate border ${b.color}`}>{b.clientName}</div>
                          ))}
                          {count > 2 && <div className="text-xs text-neutral-400 font-medium">+{count - 2}件</div>}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
