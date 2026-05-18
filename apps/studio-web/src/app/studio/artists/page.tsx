import React from "react";
import Link from "next/link";

interface Artist {
  id: string;
  name: string;
  initials: string;
  specialties: string[];
  bookingCount: number;
  rating: number;
  experience: number;
  status: "active" | "away";
  gradient: string;
}

const MOCK_ARTISTS: Artist[] = [
  {
    id: "artist-01",
    name: "Ken Yamamoto",
    initials: "KY",
    specialties: ["ブラック&グレー", "ジャパニーズ", "ネオトラディショナル"],
    bookingCount: 142,
    rating: 4.9,
    experience: 8,
    status: "active",
    gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  },
  {
    id: "artist-02",
    name: "Ryu Tanaka",
    initials: "RT",
    specialties: ["ジャパニーズ", "ブラック&グレー", "トライバル"],
    bookingCount: 97,
    rating: 4.7,
    experience: 5,
    status: "active",
    gradient: "linear-gradient(135deg, #0ea5e9, #2563eb)",
  },
  {
    id: "artist-03",
    name: "Hana Suzuki",
    initials: "HS",
    specialties: ["ウォーターカラー", "ミニマリスト", "カラー"],
    bookingCount: 81,
    rating: 4.8,
    experience: 4,
    status: "away",
    gradient: "linear-gradient(135deg, #ec4899, #f43f5e)",
  },
  {
    id: "artist-04",
    name: "Taro Nakamura",
    initials: "TN",
    specialties: ["ジオメトリック", "ドットワーク", "ブラック&グレー"],
    bookingCount: 63,
    rating: 4.6,
    experience: 3,
    status: "active",
    gradient: "linear-gradient(135deg, #10b981, #059669)",
  },
];

async function getArtists() {
  try {
    const res = await fetch(
      "http://localhost:3001/api/studio-api/artists?studioId=demo-studio-id",
      { cache: "no-store" }
    );
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch {
    // fallback
  }
  return MOCK_ARTISTS;
}

export default async function ArtistsPage() {
  const artists = (await getArtists()) as Artist[];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto pb-24 md:pb-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-1">アーティスト</h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.875rem" }}>
            {artists.length}名のアーティストが所属中
          </p>
        </div>
        <button className="btn-primary self-start sm:self-auto">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          アーティストを追加
        </button>
      </div>

      {/* Artists grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {artists.map((artist, i) => (
          <Link
            key={artist.id}
            href={`/studio/artists/${artist.id}`}
            className="glass-hover glow-white group block animate-slide-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {/* Avatar area */}
            <div className="p-6 pb-4 flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-extrabold shadow-lg"
                  style={{ background: artist.gradient }}
                >
                  {artist.initials}
                </div>
                {/* Status dot */}
                <span
                  className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border-2"
                  style={{
                    background: artist.status === "active" ? "#10b981" : "#f59e0b",
                    borderColor: "rgba(10,15,30,0.9)",
                  }}
                />
              </div>

              <h3 className="text-base font-bold text-white mb-1">{artist.name}</h3>
              <p className="text-xs mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>
                経験 {artist.experience}年
              </p>

              {/* Specialty tags */}
              <div className="flex flex-wrap gap-1 justify-center">
                {artist.specialties.slice(0, 2).map((s) => (
                  <span
                    key={s}
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.6)",
                    }}
                  >
                    {s}
                  </span>
                ))}
                {artist.specialties.length > 2 && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      color: "rgba(255,255,255,0.3)",
                    }}
                  >
                    +{artist.specialties.length - 2}
                  </span>
                )}
              </div>
            </div>

            {/* Stats */}
            <div
              className="grid grid-cols-2 divide-x"
              style={{
                borderTop: "1px solid rgba(255,255,255,0.07)",
                borderColor: "transparent",
              }}
            >
              <div
                className="px-4 py-3 text-center"
                style={{ borderRight: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="text-lg font-extrabold text-white">{artist.bookingCount}</div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>予約数</div>
              </div>
              <div className="px-4 py-3 text-center">
                <div className="text-lg font-extrabold text-white">★ {artist.rating}</div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>評価</div>
              </div>
            </div>

            {/* Status pill */}
            <div className="px-4 pb-4 pt-3 flex items-center justify-between">
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{
                  background: artist.status === "active"
                    ? "rgba(16,185,129,0.15)"
                    : "rgba(245,158,11,0.15)",
                  color: artist.status === "active" ? "#34d399" : "#fbbf24",
                }}
              >
                {artist.status === "active" ? "稼働中" : "休暇中"}
              </span>
              <span
                className="text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: "rgba(165,180,252,0.8)" }}
              >
                詳細 →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
