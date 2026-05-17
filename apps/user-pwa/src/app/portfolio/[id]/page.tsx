import Link from 'next/link';
import Image from 'next/image';
import { API_BASE } from '@/lib/api';
import { MOCK_PORTFOLIOS, MOCK_ARTISTS } from '@/lib/mock-data';

async function getPortfolio(id: string) {
  try {
    const res = await fetch(`${API_BASE}/user-api/portfolios/${id}`, { cache: 'no-store' });
    if (res.ok) return res.json();
  } catch {
    // API not available
  }
  return MOCK_PORTFOLIOS.find((p) => p.id === id) ?? null;
}

async function getRelated(artistId: string, excludeId: string) {
  try {
    const res = await fetch(`${API_BASE}/user-api/portfolios`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0)
        return data.filter((p: { artistId: string; id: string }) => p.artistId === artistId && p.id !== excludeId).slice(0, 6);
    }
  } catch {
    // API not available
  }
  return MOCK_PORTFOLIOS.filter((p) => p.artistId === artistId && p.id !== excludeId).slice(0, 6);
}

export default async function PortfolioDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const work = await getPortfolio(id);

  if (!work) {
    return (
      <div className="py-16 text-center space-y-4">
        <p className="text-white/40 text-sm">作品が見つかりませんでした</p>
        <Link href="/search?type=portfolio" className="text-sm font-semibold text-white underline underline-offset-2">
          作品一覧に戻る
        </Link>
      </div>
    );
  }

  const artist = MOCK_ARTISTS.find((a) => a.id === work.artistId);
  const related = await getRelated(work.artistId, id);
  const imageUrl = work.mediaUrls?.[0] ?? null;

  return (
    <div className="space-y-6 -mt-2">
      {/* Main image */}
      <div className="aspect-square rounded-2xl overflow-hidden border border-white/8 relative">
        {imageUrl ? (
          <Image src={imageUrl} alt={work.title ?? 'Tattoo work'} fill className="object-cover" sizes="(max-width: 640px) 100vw, 640px" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white/4">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5">
              <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
          </div>
        )}
        {work.styleCategory && (
          <div className="absolute top-3 left-3">
            <span className="text-xs font-bold bg-black/60 backdrop-blur-sm text-white/80 px-2.5 py-1 rounded-xl border border-white/10">
              {work.styleCategory}
            </span>
          </div>
        )}
      </div>

      {/* Title + meta */}
      <div className="space-y-1">
        {work.title && <h1 className="font-heading font-extrabold text-xl text-white">{work.title}</h1>}
        {work.styleCategory && <p className="text-white/40 text-sm">{work.styleCategory}</p>}
      </div>

      {/* Artist card */}
      {artist && (
        <Link href={`/artist/${artist.id}`} className="group block">
          <div className="glass rounded-2xl p-4 flex items-center gap-4 hover:border-white/20 border border-white/8 transition-all">
            <div className="w-12 h-12 rounded-full bg-white/8 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <span className="text-base font-bold text-white/50">
                {artist.displayName.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm">{artist.displayName}</p>
              {artist.studio && <p className="text-white/40 text-xs mt-0.5 truncate">{artist.studio.name}</p>}
              {artist.specialties && (
                <div className="flex gap-1 mt-1.5 flex-wrap">
                  {artist.specialties.slice(0, 3).map((s) => (
                    <span key={s} className="text-[9px] font-semibold text-white/35 bg-white/5 border border-white/8 px-1.5 py-0.5 rounded-md">{s}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="shrink-0">
              {artist.avgRating != null && (
                <div className="flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="1.5">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <span className="text-amber-400 text-xs font-bold">{artist.avgRating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        </Link>
      )}

      {/* Book button */}
      {artist && (
        <Link
          href={`/booking/start?artistId=${artist.id}`}
          className="block w-full bg-white text-black font-bold text-center py-4 rounded-2xl hover:bg-white/90 transition-all font-heading tracking-wide"
        >
          このアーティストに予約する
        </Link>
      )}

      {/* Related works */}
      {related.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-heading font-extrabold text-base text-white tracking-tight">同じアーティストの作品</h2>
          <div className="grid grid-cols-3 gap-2">
            {related.map((w: { id: string; mediaUrls: string[]; artistId: string; styleCategory?: string; title?: string }) => (
              <Link key={w.id} href={`/portfolio/${w.id}`} className="group block">
                <div className="aspect-square rounded-xl overflow-hidden border border-white/8 hover:border-white/20 transition-all relative">
                  {w.mediaUrls?.[0] ? (
                    <Image src={w.mediaUrls[0]} alt={w.title ?? 'work'} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="150px" />
                  ) : (
                    <div className="w-full h-full bg-white/4" />
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Link href="/search?type=portfolio" className="block text-center text-white/30 text-xs hover:text-white/60 transition-colors">
        ← 作品一覧に戻る
      </Link>
    </div>
  );
}
