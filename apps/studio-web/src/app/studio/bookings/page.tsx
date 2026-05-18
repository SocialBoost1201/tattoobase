"use client";

import React, { useState } from "react";
import Link from "next/link";

type BookingStatus = "confirmed" | "pending" | "completed" | "cancelled";

interface Booking {
  id: string;
  date: string;
  time: string;
  customer: string;
  artist: string;
  style: string;
  status: BookingStatus;
  amount: number;
}

const MOCK_BOOKINGS: Booking[] = [
  { id: "BK-1024", date: "2026-05-19", time: "14:00", customer: "田中 美咲", artist: "Ken Yamamoto", style: "ブラック&グレー", status: "confirmed", amount: 35000 },
  { id: "BK-1023", date: "2026-05-18", time: "11:30", customer: "佐藤 翔", artist: "Ryu Tanaka", style: "ジャパニーズ", status: "pending", amount: 28000 },
  { id: "BK-1022", date: "2026-05-17", time: "16:00", customer: "中村 葵", artist: "Ken Yamamoto", style: "ネオトラディショナル", status: "completed", amount: 52000 },
  { id: "BK-1021", date: "2026-05-16", time: "13:00", customer: "小林 海斗", artist: "Hana Suzuki", style: "ミニマリスト", status: "completed", amount: 44000 },
  { id: "BK-1020", date: "2026-05-15", time: "10:00", customer: "渡辺 花音", artist: "Ryu Tanaka", style: "ブラック&グレー", status: "cancelled", amount: 31000 },
  { id: "BK-1019", date: "2026-05-14", time: "15:30", customer: "伊藤 蓮", artist: "Hana Suzuki", style: "ジャパニーズ", status: "confirmed", amount: 68000 },
  { id: "BK-1018", date: "2026-05-13", time: "12:00", customer: "山田 彩花", artist: "Ken Yamamoto", style: "カラー", status: "completed", amount: 41000 },
  { id: "BK-1017", date: "2026-05-12", time: "09:30", customer: "加藤 陽斗", artist: "Ryu Tanaka", style: "ジオメトリック", status: "pending", amount: 24000 },
  { id: "BK-1016", date: "2026-05-11", time: "14:30", customer: "中島 柚希", artist: "Hana Suzuki", style: "ウォーターカラー", status: "completed", amount: 59000 },
  { id: "BK-1015", date: "2026-05-10", time: "11:00", customer: "松本 大翔", artist: "Ken Yamamoto", style: "トライバル", status: "cancelled", amount: 33000 },
  { id: "BK-1014", date: "2026-05-09", time: "16:30", customer: "藤田 莉子", artist: "Ryu Tanaka", style: "ブラック&グレー", status: "confirmed", amount: 47000 },
  { id: "BK-1013", date: "2026-05-08", time: "13:30", customer: "岡田 颯", artist: "Hana Suzuki", style: "ネオトラディショナル", status: "completed", amount: 38000 },
];

const FILTER_TABS = [
  { label: "全て", value: "all" },
  { label: "確定", value: "confirmed" },
  { label: "審査中", value: "pending" },
  { label: "完了", value: "completed" },
  { label: "キャンセル", value: "cancelled" },
] as const;

type FilterValue = (typeof FILTER_TABS)[number]["value"];

function statusBadge(status: BookingStatus) {
  switch (status) {
    case "confirmed": return <span className="badge-emerald">確定</span>;
    case "pending":   return <span className="badge-amber">審査中</span>;
    case "completed": return <span className="badge-blue">完了</span>;
    case "cancelled": return <span className="badge-gray">キャンセル</span>;
  }
}

export default function BookingsPage() {
  const [filter, setFilter] = useState<FilterValue>("all");
  const [search, setSearch] = useState("");

  const filtered = MOCK_BOOKINGS.filter((b) => {
    const matchesFilter = filter === "all" || b.status === filter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      b.customer.includes(q) ||
      b.artist.toLowerCase().includes(q) ||
      b.id.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto pb-24 md:pb-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-1">予約管理</h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.875rem" }}>
            {MOCK_BOOKINGS.length}件の予約
          </p>
        </div>
        <button className="btn-primary self-start sm:self-auto">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          新規予約
        </button>
      </div>

      {/* Filter + search bar */}
      <div className="glass mb-6 p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Filter tabs */}
          <div className="flex gap-1 flex-wrap">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: filter === tab.value ? "rgba(255,255,255,0.12)" : "transparent",
                  color: filter === tab.value ? "#ffffff" : "rgba(255,255,255,0.4)",
                  border: filter === tab.value
                    ? "1px solid rgba(255,255,255,0.18)"
                    : "1px solid transparent",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-xs sm:ml-auto">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "rgba(255,255,255,0.3)" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              className="input-glass pl-9"
              placeholder="顧客名 / アーティストで検索"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Bookings list */}
      <div className="glass overflow-hidden">
        {/* Table header */}
        <div
          className="hidden md:grid grid-cols-6 gap-4 px-6 py-3 text-xs font-semibold uppercase tracking-wider"
          style={{
            color: "rgba(255,255,255,0.3)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <span>予約番号</span>
          <span>日時</span>
          <span>顧客名</span>
          <span>アーティスト</span>
          <span>ステータス</span>
          <span className="text-right">金額</span>
        </div>

        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center" style={{ color: "rgba(255,255,255,0.3)" }}>
            <svg className="w-12 h-12 mx-auto mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            <p className="font-semibold">予約が見つかりません</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            {filtered.map((b) => (
              <Link
                key={b.id}
                href={`/studio/bookings/${b.id}`}
                className="flex flex-col md:grid md:grid-cols-6 gap-2 md:gap-4 px-6 py-4 transition-colors hover:bg-white/5 group"
              >
                {/* ID */}
                <span className="text-xs font-mono font-semibold" style={{ color: "rgba(165,180,252,0.8)" }}>
                  {b.id}
                </span>
                {/* Date/time */}
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {b.date} {b.time}
                </span>
                {/* Customer */}
                <span className="text-sm font-semibold text-white">{b.customer}</span>
                {/* Artist */}
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {b.artist}
                </span>
                {/* Status */}
                <span>{statusBadge(b.status)}</span>
                {/* Amount */}
                <span
                  className="text-sm font-bold text-white md:text-right group-hover:text-indigo-300 transition-colors"
                >
                  ¥{b.amount.toLocaleString()}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {filtered.length > 0 && (
        <p className="mt-4 text-sm text-center" style={{ color: "rgba(255,255,255,0.25)" }}>
          {filtered.length}件表示中
        </p>
      )}
    </div>
  );
}
