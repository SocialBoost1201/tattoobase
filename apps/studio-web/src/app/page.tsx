import React from "react";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Booking {
  id: string;
  date: string;
  customer: string;
  artist: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  amount: number;
}

// ---------------------------------------------------------------------------
// Mock data (fallback)
// ---------------------------------------------------------------------------
const MOCK_BOOKINGS: Booking[] = [
  { id: "BK-1024", date: "2026-05-19", customer: "田中 美咲", artist: "Ken Yamamoto", status: "confirmed", amount: 35000 },
  { id: "BK-1023", date: "2026-05-18", customer: "佐藤 翔", artist: "Ryu Tanaka", status: "pending", amount: 28000 },
  { id: "BK-1022", date: "2026-05-17", customer: "中村 葵", artist: "Ken Yamamoto", status: "completed", amount: 52000 },
  { id: "BK-1021", date: "2026-05-16", customer: "小林 海斗", artist: "Hana Suzuki", status: "completed", amount: 44000 },
  { id: "BK-1020", date: "2026-05-15", customer: "渡辺 花音", artist: "Ryu Tanaka", status: "cancelled", amount: 31000 },
];

// ---------------------------------------------------------------------------
// Status badge helper
// ---------------------------------------------------------------------------
const statusBadge = (status: Booking["status"]) => {
  switch (status) {
    case "confirmed":
      return <span className="badge-emerald">確定</span>;
    case "pending":
      return <span className="badge-amber">審査中</span>;
    case "completed":
      return <span className="badge-blue">完了</span>;
    case "cancelled":
      return <span className="badge-gray">キャンセル</span>;
  }
};

// ---------------------------------------------------------------------------
// Page (server component — try API, fallback to mock)
// ---------------------------------------------------------------------------
async function getData() {
  try {
    const res = await fetch("http://localhost:3001/api/studio-api/dashboard?studioId=demo-studio-id", {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      return { bookings: data.recentBookings ?? MOCK_BOOKINGS, fromApi: true };
    }
  } catch {
    // fallback silently
  }
  return { bookings: MOCK_BOOKINGS, fromApi: false };
}

export default async function StudioDashboard() {
  const { bookings } = await getData();

  const stats = [
    {
      label: "今月の予約数",
      value: "24件",
      trend: "↑12%",
      trendUp: true,
      sub: "先月比",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      ),
    },
    {
      label: "売上",
      value: "¥480,000",
      trend: "↑8%",
      trendUp: true,
      sub: "先月比",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
        </svg>
      ),
    },
    {
      label: "アーティスト数",
      value: "3名",
      trend: "→ 変化なし",
      trendUp: null,
      sub: "稼働中",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      ),
    },
    {
      label: "レビュー平均",
      value: "★ 4.8",
      trend: "↑0.2",
      trendUp: true,
      sub: "過去30日",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto pb-24 md:pb-8">

      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-1">
          ダッシュボード
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.875rem" }}>
          2026年5月 — 今月の状況
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="glass glow-white p-5 animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-start justify-between mb-3">
              <div style={{ color: "rgba(255,255,255,0.35)" }}>{stat.icon}</div>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{
                  background: stat.trendUp === true
                    ? "rgba(16,185,129,0.15)"
                    : stat.trendUp === false
                    ? "rgba(239,68,68,0.15)"
                    : "rgba(255,255,255,0.06)",
                  color: stat.trendUp === true
                    ? "#34d399"
                    : stat.trendUp === false
                    ? "#f87171"
                    : "rgba(255,255,255,0.4)",
                }}
              >
                {stat.trend}
              </span>
            </div>
            <div className="text-2xl md:text-3xl font-extrabold text-white mb-0.5">{stat.value}</div>
            <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{stat.label}</div>
            <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Recent bookings table — 2/3 width */}
        <div className="xl:col-span-2 glass glow-white overflow-hidden">
          <div
            className="px-6 py-4 flex items-center justify-between"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
          >
            <h2 className="font-bold text-white text-lg">最近の予約</h2>
            <Link
              href="/studio/bookings"
              className="text-sm font-semibold"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              すべて見る →
            </Link>
          </div>

          {/* Table header */}
          <div
            className="hidden md:grid grid-cols-5 gap-4 px-6 py-3 text-xs font-semibold uppercase tracking-wider"
            style={{
              color: "rgba(255,255,255,0.3)",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <span>日付</span>
            <span>顧客</span>
            <span>アーティスト</span>
            <span>ステータス</span>
            <span className="text-right">金額</span>
          </div>

          <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            {(bookings as Booking[]).slice(0, 5).map((b) => (
              <Link
                key={b.id}
                href={`/studio/bookings/${b.id}`}
                className="flex flex-col md:grid md:grid-cols-5 gap-1 md:gap-4 px-6 py-4 transition-colors hover:bg-white/5"
              >
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {b.date}
                </span>
                <span className="text-sm font-semibold text-white">{b.customer}</span>
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {b.artist}
                </span>
                <span>{statusBadge(b.status)}</span>
                <span className="text-sm font-bold text-white md:text-right">
                  ¥{b.amount.toLocaleString()}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick actions — 1/3 width */}
        <div className="flex flex-col gap-4">
          <div className="glass glow-white p-6">
            <h2 className="font-bold text-white text-lg mb-4">クイックアクション</h2>
            <div className="flex flex-col gap-3">
              <Link
                href="/studio/artists"
                className="btn-glass text-sm py-3 px-4 justify-start"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                新規アーティスト追加
              </Link>
              <Link
                href="/studio/designs"
                className="btn-glass text-sm py-3 px-4 justify-start"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                </svg>
                デザイン依頼確認
              </Link>
              <Link
                href="/studio/settings"
                className="btn-glass text-sm py-3 px-4 justify-start"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                設定
              </Link>
            </div>
          </div>

          {/* Plan banner */}
          <div
            className="rounded-2xl p-5 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(99,102,241,0.3) 0%, rgba(124,58,237,0.2) 100%)",
              border: "1px solid rgba(99,102,241,0.3)",
            }}
          >
            <div
              className="absolute inset-0 opacity-20"
              style={{
                background: "radial-gradient(circle at 70% 30%, rgba(99,102,241,0.6), transparent 60%)",
              }}
            />
            <div className="relative">
              <div className="text-xs font-semibold mb-2" style={{ color: "rgba(165,180,252,0.9)" }}>
                現在のプラン
              </div>
              <div className="text-white font-bold text-xl mb-1">スタンダード</div>
              <div className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>
                ¥4,980<span className="text-xs">/月</span>
              </div>
              <Link href="/studio/billing" className="btn-primary text-xs py-2 px-4 rounded-lg">
                プランを変更
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
