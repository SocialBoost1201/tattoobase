import Link from 'next/link';
import ArtistCard from '@/components/cards/ArtistCard';
import { API_BASE } from '@/lib/api';
import { MOCK_STUDIOS, MOCK_ARTISTS } from '@/lib/mock-data';

async function getStudio(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/user-api/studios/${slug}`, { cache: 'no-store' });
    if (res.ok) return res.json();
  } catch {
    // API not available
  }
  return MOCK_STUDIOS.find((s) => s.slug === slug || s.id === slug) ?? null;
}

export default async function StudioDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const studio = await getStudio(slug);

  if (!studio) {
    return (
      <div className="py-16 text-center glass rounded-2xl space-y-4">
        <p className="text-white/40 text-sm">スタジオが見つかりませんでした</p>
        <Link href="/studios" className="inline-block text-sm font-semibold text-white underline underline-offset-2">
          スタジオ一覧に戻る
        </Link>
      </div>
    );
  }

  const artists = MOCK_ARTISTS.filter((a) => a.studio?.id === studio.id);

  return (
    <div className="space-y-7">
      {/* Header */}
      <section className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-2xl bg-white/8 border border-white/15 flex items-center justify-center shrink-0">
          <span className="text-2xl font-extrabold text-white/50 font-heading">
            {studio.name.slice(0, 2)}
          </span>
        </div>
        <div className="min-w-0">
          <h1 className="font-heading font-extrabold text-2xl text-white leading-tight">{studio.name}</h1>
          <p className="text-white/45 text-sm mt-0.5">{studio.prefecture} · {studio.city}</p>
          <div className="flex items-center gap-1 mt-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="1.5">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span className="text-amber-400 text-sm font-bold">{studio.avgRating?.toFixed(1) ?? '—'}</span>
            <span className="text-white/30 text-xs">({studio.reviewCount ?? 0}件)</span>
          </div>
        </div>
      </section>

      {/* Specialties */}
      {studio.specialties && studio.specialties.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {studio.specialties.map((s: string) => (
            <span key={s} className="text-[11px] font-semibold text-white/55 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
              {s}
            </span>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="glass rounded-2xl grid grid-cols-3 divide-x divide-white/8">
        <div className="px-3 py-4 text-center">
          <p className="text-white font-extrabold text-lg">{studio.artistCount ?? artists.length}</p>
          <p className="text-white/35 text-[10px] uppercase tracking-wider mt-0.5">所属彫師</p>
        </div>
        <div className="px-3 py-4 text-center">
          <p className="text-white font-extrabold text-lg">{studio.reviewCount ?? 0}</p>
          <p className="text-white/35 text-[10px] uppercase tracking-wider mt-0.5">レビュー</p>
        </div>
        <div className="px-3 py-4 text-center">
          <p className="text-white font-extrabold text-lg">{studio.avgRating?.toFixed(1) ?? '—'}</p>
          <p className="text-white/35 text-[10px] uppercase tracking-wider mt-0.5">平均評価</p>
        </div>
      </div>

      {studio.description && (
        <p className="text-white/55 text-sm leading-relaxed">{studio.description}</p>
      )}

      {/* Artists */}
      <section>
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="font-heading font-extrabold text-base text-white tracking-tight">ARTISTS</h2>
          <span className="text-xs text-white/35">{artists.length} 名</span>
        </div>
        {artists.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {artists.map((a) => (
              <ArtistCard key={a.id} artist={a} />
            ))}
          </div>
        ) : (
          <div className="py-10 text-center glass rounded-2xl">
            <p className="text-white/35 text-sm">所属アーティストはまだ登録されていません</p>
          </div>
        )}
      </section>

      <Link href="/studios" className="block text-center text-white/30 text-xs hover:text-white/60 transition-colors">
        ← スタジオ一覧に戻る
      </Link>
    </div>
  );
}
