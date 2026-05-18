import React from "react";
import Link from "next/link";

const API = "http://localhost:3001/api";

async function getDashboard(studioId: string) {
  try {
    const res = await fetch(`${API}/studio-api/dashboard?studioId=${studioId}`, {
      cache: "no-store",
    });
    return res.ok ? res.json() : null;
  } catch {
    return null;
  }
}

async function getBookings(studioId: string) {
  try {
    const res = await fetch(`${API}/studio-api/bookings?studioId=${studioId}`, {
      cache: "no-store",
    });
    return res.ok ? res.json() : null;
  } catch {
    return null;
  }
}

// Mock data fallback
const MOCK_STATS = {
  bookingsThisMonth: 24,
  revenue: 480000,
  artistCount: 3,
  averageRating: 4.8,
  bookingsTrend: "+12%",
  revenueTrend: "+8%",
};

const MOCK_BOOKINGS = [
  {
    id: "bk001",
    date: "2026-05-18",
    time: "14:00",
    customer: "田中 さくら",
    artist: "Kenji Mori",
    status: "confirmed",
    amount: 25000,
  },
  {
    id: "bk002",
    date: "2026-05-18",
    time: "16:30",
    customer: "山田 太郎",
    artist: "Aoi Tanaka",
    status: "pending",
    amount: 18000,
  },
  {
    id: "bk003",
    date: "2026-05-19",
    time: "11:00",
    customer: "鈴木 美香",
    artist: "Riku Sato",
    status: "completed",
    amount: 42000,
  },
  {
    id: "bk004",
    date: "2026-05-20",
    time: "13:00",
    customer: "佐藤 健一",
    artist: "Kenji Mori",
    status: "confirmed",
    amount: 30000,
  },
  {
    id: "bk005",
    date: "2026-05-21",
    time: "15:00",
    customer: "中村 裕子",
    artist: "Aoi Tanaka",
    status: "cancelled",
    amount: 0,
  },
];

type StatusKey = "confirmed" | "pending" | "completed" | "cancelled";

const STATUS_CONFIG: Record<StatusKey, { label: string; badge: string }> = {
  confirmed: { label: "確定", badge: "badge-emerald" },
  pending: { label: "審査中", badge: "badge-amber" },
  completed: { label: "完了", badge: "badge-blue" },
  cancelled: { label: "キャンセル", badge: "badge-gray" },
};

function StatCard({
  label,
  value,
  trend,
  sub,
  accent,
}: {
  label: string;
  value: string;
  trend?: string;
  sub?: string;
  accent?: string;
}) {
  const trendUp = trend?.startsWith("+");
  return (
    <div
      className="glass glow-white rounded-2xl p-6 flex flex-col gap-3 animate-slide-up"
      style={{ borderColor: accent ? `${accent}22` : undefined }}
    >
      <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>
        {label}
      </span>
      <div className="flex items-end gap-3">
        <span className="text-3xl font-extrabold text-white tracking-tight">{value}</span>
        {trend && (
          <span
            className="text-sm font-bold mb-0.5"
            style={{ color: trendUp ? "#6ee7b7" : "#f87171" }}
          >
            {trend}
          </span>
        )}
      </div>
      {sub && (
        <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
          {sub}
        </span>
      )}
    </div>
  );
}

export default async function StudioDashboard() {
  const STUDIO_ID = "demo-studio-id";
  const [dashData, bookingData] = await Promise.all([
    getDashboard(STUDIO_ID),
    getBookings(STUDIO_ID),
  ]);

  const stats = dashData?.stats ?? MOCK_STATS;
  const recentBookings: typeof MOCK_BOOKINGS =
    bookingData && bookingData.length > 0 ? bookingData : MOCK_BOOKINGS;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Welcome bar */}
      <div className="mb-8 animate-fade-in">
        <h2 className="text-2xl font-extrabold text-white mb-1">
          おはようございます、Ink & Soul Tokyo 🎨
        </h2>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
          2026年5月18日（月）— 今日の予約は 3件 あります
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="今月の予約数"
          value={`${stats.bookingsThisMonth ?? 24}件`}
          trend={stats.bookingsTrend ?? "+12%"}
          sub="先月比"
        />
        <StatCard
          label="今月の売上"
          value={`¥${(stats.revenue ?? 480000).toLocaleString()}`}
          trend={stats.revenueTrend ?? "+8%"}
          sub="先月比"
        />
        <StatCard
          label="在籍アーティスト"
          value={`${stats.artistCount ?? 3}名`}
          sub="全員アクティブ"
        />
        <StatCard
          label="レビュー平均"
          value={`★ ${stats.averageRating ?? 4.8}`}
          sub="直近30件の評価"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent bookings */}
        <div
          className="lg:col-span-2 glass rounded-2xl overflow-hidden glow-white"
        >
          <div
            className="px-6 py-4 flex items-center justify-between"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
          >
            <h3 className="font-bold text-white">直近の予約</h3>
            <Link
              href="/studio/bookings"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors btn-glass"
              style={{ fontSize: "0.75rem" }}
            >
              すべて見る →
            </Link>
          </div>

          <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            {recentBookings.map((b) => {
              const cfg = STATUS_CONFIG[b.status as StatusKey] ?? STATUS_CONFIG.pending;
              return (
                <div
                  key={b.id}
                  className="px-6 py-4 flex items-center gap-4 hover:bg-white/[0.03] transition-colors"
                >
                  <div className="hidden sm:block w-20 text-xs font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {b.date.slice(5)}<br />{b.time}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white text-sm truncate">{b.customer}</div>
                    <div className="text-xs mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.4)" }}>
                      担当: {b.artist}
                    </div>
                  </div>
                  <span className={cfg.badge}>{cfg.label}</span>
                  <div className="text-sm font-semibold text-white w-20 text-right">
                    {b.amount > 0 ? `¥${b.amount.toLocaleString()}` : "—"}
                  </div>
                  <Link
                    href={`/studio/bookings/${b.id}`}
                    className="text-xs font-semibold"
                    style={{ color: "#93b8ff" }}
                  >
                    詳細
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex flex-col gap-4">
          <div className="glass rounded-2xl p-6 glow-white animate-slide-up">
            <h3 className="font-bold text-white mb-4 text-sm">クイックアクション</h3>
            <div className="flex flex-col gap-2">
              <Link
                href="/studio/artists"
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all glass-hover"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                }}
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                新規アーティスト追加
              </Link>
              <Link
                href="/studio/designs"
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all glass-hover"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                }}
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                デザイン依頼確認
              </Link>
              <Link
                href="/studio/settings"
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all glass-hover"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                }}
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                スタジオ設定
              </Link>
            </div>
          </div>

          {/* Mini activity */}
          <div className="glass rounded-2xl p-6 glow-white animate-slide-up">
            <h3 className="font-bold text-white mb-4 text-sm">最近のアクティビティ</h3>
            <ul className="space-y-3">
              {[
                { text: "田中さくらさんが予約を確定しました", time: "2分前", dot: "#6ee7b7" },
                { text: "新しいデザイン依頼が届きました", time: "18分前", dot: "#fcd34d" },
                { text: "山田太郎さんからレビューが届きました ★5", time: "1時間前", dot: "#93c5fd" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: item.dot }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
                      {item.text}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                      {item.time}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
