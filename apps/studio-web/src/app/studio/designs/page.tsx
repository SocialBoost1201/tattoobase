import React from "react";

type DesignStatus = "requested" | "in_progress" | "submitted" | "approved";

interface DesignRequest {
  id: string;
  requestDate: string;
  user: string;
  style: string;
  description: string;
  assignedArtist: string | null;
  status: DesignStatus;
  budget: number;
}

const MOCK_DESIGNS: DesignRequest[] = [
  {
    id: "DR-0087",
    requestDate: "2026-05-18",
    user: "田中 美咲",
    style: "ジャパニーズ",
    description: "龍と桜のデザインを右腕に。色は赤と黒をメインに。",
    assignedArtist: "Ken Yamamoto",
    status: "in_progress",
    budget: 80000,
  },
  {
    id: "DR-0086",
    requestDate: "2026-05-17",
    user: "佐藤 翔",
    style: "ブラック&グレー",
    description: "シンプルな和柄の家紋モチーフ。肩に小さめに。",
    assignedArtist: null,
    status: "requested",
    budget: 30000,
  },
  {
    id: "DR-0085",
    requestDate: "2026-05-16",
    user: "中村 葵",
    style: "ウォーターカラー",
    description: "水彩風のカラフルな花のデザイン。足首に。",
    assignedArtist: "Hana Suzuki",
    status: "submitted",
    budget: 45000,
  },
  {
    id: "DR-0084",
    requestDate: "2026-05-15",
    user: "小林 海斗",
    style: "ジオメトリック",
    description: "幾何学模様を使ったモダンなデザイン。背中上部に。",
    assignedArtist: "Taro Nakamura",
    status: "approved",
    budget: 55000,
  },
  {
    id: "DR-0083",
    requestDate: "2026-05-14",
    user: "渡辺 花音",
    style: "ミニマリスト",
    description: "細い線で描いたシンプルな植物モチーフ。手首に。",
    assignedArtist: "Hana Suzuki",
    status: "in_progress",
    budget: 20000,
  },
  {
    id: "DR-0082",
    requestDate: "2026-05-13",
    user: "伊藤 蓮",
    style: "ネオトラディショナル",
    description: "カラフルな鶴と松のデザイン。胸に大きく。",
    assignedArtist: "Ken Yamamoto",
    status: "submitted",
    budget: 120000,
  },
  {
    id: "DR-0081",
    requestDate: "2026-05-12",
    user: "山田 彩花",
    style: "カラー",
    description: "ビビッドカラーの熱帯魚とサンゴのデザイン。ふくらはぎに。",
    assignedArtist: null,
    status: "requested",
    budget: 65000,
  },
];

function statusBadge(status: DesignStatus) {
  switch (status) {
    case "requested":   return <span className="badge-amber">依頼中</span>;
    case "in_progress": return <span className="badge-violet">制作中</span>;
    case "submitted":   return <span className="badge-blue">提出済み</span>;
    case "approved":    return <span className="badge-emerald">承認済み</span>;
  }
}

const STATUS_ICONS: Record<DesignStatus, string> = {
  requested:   "↗",
  in_progress: "✎",
  submitted:   "✓",
  approved:    "★",
};

async function getDesigns() {
  try {
    const res = await fetch(
      "http://localhost:3001/api/studio-api/designs?studioId=demo-studio-id",
      { cache: "no-store" }
    );
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch {
    // fallback
  }
  return MOCK_DESIGNS;
}

export default async function DesignsPage() {
  const designs = (await getDesigns()) as DesignRequest[];

  const counts = {
    requested:   designs.filter((d) => d.status === "requested").length,
    in_progress: designs.filter((d) => d.status === "in_progress").length,
    submitted:   designs.filter((d) => d.status === "submitted").length,
    approved:    designs.filter((d) => d.status === "approved").length,
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto pb-24 md:pb-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-1">デザイン管理</h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.875rem" }}>
            {designs.length}件のデザイン依頼
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "依頼中", count: counts.requested, badge: "badge-amber", icon: STATUS_ICONS.requested },
          { label: "制作中", count: counts.in_progress, badge: "badge-violet", icon: STATUS_ICONS.in_progress },
          { label: "提出済み", count: counts.submitted, badge: "badge-blue", icon: STATUS_ICONS.submitted },
          { label: "承認済み", count: counts.approved, badge: "badge-emerald", icon: STATUS_ICONS.approved },
        ].map((item, i) => (
          <div key={i} className="glass p-4 animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="text-2xl mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>{item.icon}</div>
            <div className="text-2xl font-extrabold text-white mb-0.5">{item.count}</div>
            <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* Design requests list */}
      <div className="flex flex-col gap-4">
        {designs.map((design, i) => (
          <div
            key={design.id}
            className="glass glass-hover p-5 animate-slide-up"
            style={{ animationDelay: `${(i + 4) * 50}ms` }}
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              {/* Left: ID + user + date */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span
                    className="text-xs font-mono font-semibold"
                    style={{ color: "rgba(165,180,252,0.8)" }}
                  >
                    {design.id}
                  </span>
                  {statusBadge(design.status)}
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                    {design.requestDate}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: "rgba(255,255,255,0.1)" }}
                  >
                    {design.user.charAt(0)}
                  </div>
                  <span className="text-sm font-semibold text-white">{design.user}</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.55)",
                    }}
                  >
                    {design.style}
                  </span>
                </div>

                <p className="text-sm leading-relaxed line-clamp-2" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {design.description}
                </p>
              </div>

              {/* Right: artist + budget */}
              <div className="flex-shrink-0 flex flex-col items-end gap-2">
                <div className="text-sm font-bold text-white">
                  ¥{design.budget.toLocaleString()}
                </div>
                {design.assignedArtist ? (
                  <div
                    className="text-xs px-3 py-1.5 rounded-xl"
                    style={{
                      background: "rgba(99,102,241,0.15)",
                      border: "1px solid rgba(99,102,241,0.2)",
                      color: "rgba(165,180,252,0.9)",
                    }}
                  >
                    {design.assignedArtist}
                  </div>
                ) : (
                  <button
                    className="text-xs px-3 py-1.5 rounded-xl transition-colors"
                    style={{
                      background: "rgba(245,158,11,0.12)",
                      border: "1px solid rgba(245,158,11,0.2)",
                      color: "#fbbf24",
                    }}
                  >
                    担当者を割り当て
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
