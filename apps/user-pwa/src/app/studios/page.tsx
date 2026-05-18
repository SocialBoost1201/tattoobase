import Link from 'next/link';
import { API_BASE } from '@/lib/api';
import { MOCK_STUDIOS } from '@/lib/mock-data';

async function getStudios() {
  try {
    const res = await fetch(`${API_BASE}/user-api/studios`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch {
    // API not available
  }
  return MOCK_STUDIOS;
}

const PREFECTURES = ['すべて', '東京都', '大阪府', '愛知県', '京都府', '福岡県'];

export default async function StudiosPage({
  searchParams,
}: {
  searchParams: Promise<{ prefecture?: string }>;
}) {
  const { prefecture } = await searchParams;
  const studios = await getStudios();

  const filtered = prefecture && prefecture !== 'すべて'
    ? studios.filter((s: { prefecture: string }) => s.prefecture === prefecture)
    : studios;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-extrabold text-2xl text-white tracking-tight">STUDIOS</h1>
        <p className="text-white/45 text-xs mt-1">全国のタトゥースタジオを探す</p>
      </div>

      {/* Prefecture filter */}
      <div className="flex gap-2 flex-wrap">
        {PREFECTURES.map((pref) => {
          const isActive = (!prefecture && pref === 'すべて') || prefecture === pref;
          return (
            <Link
              key={pref}
              href={pref === 'すべて' ? '/studios' : `/studios?prefecture=${encodeURIComponent(pref)}`}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                isActive ? 'bg-white text-black border-white' : 'glass text-white/50 hover:text-white'
              }`}
            >
              {pref}
            </Link>
          );
        })}
      </div>

      <p className="text-white/35 text-xs">{filtered.length} studios</p>

      {/* Studio list */}
      <div className="space-y-4">
        {filtered.map((studio: {
          id: string;
          name: string;
          slug: string;
          prefecture: string;
          city: string;
          description: string;
          artistCount: number;
          avgRating: number;
          reviewCount: number;
          specialties: string[];
        }) => (
          <Link key={studio.id} href={`/studios/${studio.slug}`} className="group block">
            <div className="glass glass-hover rounded-2xl p-5 space-y-3 border border-white/8 hover:border-white/20 transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <span className="text-sm font-bold text-white/40">
                      {studio.name.slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-bold text-[15px] group-hover:text-white/90">{studio.name}</p>
                    <p className="text-white/40 text-xs mt-0.5">{studio.prefecture} · {studio.city}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 justify-end">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="1.5">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <span className="text-amber-400 text-xs font-bold">{studio.avgRating.toFixed(1)}</span>
                    <span className="text-white/25 text-xs">({studio.reviewCount})</span>
                  </div>
                  <p className="text-white/30 text-[10px] mt-0.5">{studio.artistCount} artists</p>
                </div>
              </div>

              <p className="text-white/50 text-xs leading-relaxed line-clamp-2">{studio.description}</p>

              <div className="flex flex-wrap gap-1">
                {studio.specialties.slice(0, 3).map((s) => (
                  <span key={s} className="text-[9px] font-semibold text-white/35 bg-white/5 border border-white/8 px-1.5 py-0.5 rounded-md">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center glass rounded-2xl">
          <p className="text-white/40 text-sm">該当するスタジオが見つかりませんでした</p>
        </div>
      )}
    </div>
  );
}
