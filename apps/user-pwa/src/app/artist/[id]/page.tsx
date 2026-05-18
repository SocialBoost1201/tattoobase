import Link from 'next/link';
import PortfolioCard from '@/components/cards/PortfolioCard';
import ReviewSection from '@/components/reviews/ReviewSection';
import { API_BASE } from '@/lib/api';
import { MOCK_ARTISTS, MOCK_PORTFOLIOS } from '@/lib/mock-data';
import { getTranslations } from 'next-intl/server';

async function getArtist(id: string) {
  try {
    const res = await fetch(`${API_BASE}/user-api/artists/${id}`, { cache: 'no-store' });
    if (res.ok) return res.json();
  } catch {
    // API not available
  }
  return MOCK_ARTISTS.find((a) => a.id === id) ?? null;
}

async function getReviews(artistId: string) {
  try {
    const res = await fetch(`${API_BASE}/user-api/artists/${artistId}/reviews`, { cache: 'no-store' });
    if (res.ok) return res.json();
  } catch {
    // API not available
  }
  return { reviews: [], aggregation: null };
}

async function getPortfolios(artistId: string) {
  try {
    const res = await fetch(`${API_BASE}/user-api/portfolios`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.filter((w: { artistId: string }) => w.artistId === artistId);
      }
    }
  } catch {
    // API not available
  }
  return MOCK_PORTFOLIOS.filter((w) => w.artistId === artistId);
}

export default async function ArtistDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations('artist');
  const [artist, works, reviewData] = await Promise.all([
    getArtist(id),
    getPortfolios(id),
    getReviews(id),
  ]);

  if (!artist) {
    return (
      <div className="py-16 text-center glass rounded-2xl space-y-4">
        <p className="text-white/40 text-sm">{t('notFound')}</p>
        <Link href="/search" className="inline-block text-sm font-semibold text-white underline underline-offset-2">
          {t('backToSearch')}
        </Link>
      </div>
    );
  }

  const initials = artist.displayName.slice(0, 2).toUpperCase();

  return (
    <div className="space-y-7">
      {/* Profile header */}
      <section className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-white/8 border border-white/15 flex items-center justify-center shrink-0">
          <span className="text-2xl font-extrabold text-white/50 font-heading">{initials}</span>
        </div>
        <div className="min-w-0">
          <h1 className="font-heading font-extrabold text-2xl text-white leading-tight truncate">{artist.displayName}</h1>
          {artist.studio && (
            <p className="text-white/45 text-sm mt-0.5 truncate">{artist.studio.name}</p>
          )}
          <div className="flex items-center gap-3 mt-1.5">
            {artist.avgRating != null && (
              <div className="flex items-center gap-1">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="1.5">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span className="text-amber-400 text-sm font-bold">{artist.avgRating.toFixed(1)}</span>
                {artist.reviewCount != null && (
                  <span className="text-white/30 text-xs">({artist.reviewCount})</span>
                )}
              </div>
            )}
            {artist.prefecture && (
              <span className="text-white/40 text-xs">{artist.prefecture}</span>
            )}
          </div>
        </div>
      </section>

      {/* Specialties */}
      {artist.specialties && artist.specialties.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {artist.specialties.map((s: string) => (
            <span key={s} className="text-[11px] font-semibold text-white/55 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
              {s}
            </span>
          ))}
        </div>
      )}

      {/* Stats row */}
      <div className="glass rounded-2xl grid grid-cols-3 divide-x divide-white/8">
        <div className="px-3 py-4 text-center">
          <p className="text-white font-extrabold text-lg">{works.length}</p>
          <p className="text-white/35 text-[10px] uppercase tracking-wider mt-0.5">{t('works')}</p>
        </div>
        <div className="px-3 py-4 text-center">
          <p className="text-white font-extrabold text-lg">{artist.yearsOfExperience ?? '—'}</p>
          <p className="text-white/35 text-[10px] uppercase tracking-wider mt-0.5">{t('experience')}</p>
        </div>
        <div className="px-3 py-4 text-center">
          <p className="text-white font-extrabold text-lg">{artist.priceRange ?? '—'}</p>
          <p className="text-white/35 text-[10px] uppercase tracking-wider mt-0.5">Price</p>
        </div>
      </div>

      {artist.bio && (
        <p className="text-white/55 text-sm leading-relaxed">{artist.bio}</p>
      )}

      <Link
        href={`/booking/start?artistId=${artist.id}`}
        className="block w-full bg-white text-black font-bold text-center py-4 rounded-2xl hover:bg-white/90 transition-all font-heading tracking-wide"
      >
        {t('book')}
      </Link>

      {/* Works */}
      <section>
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="font-heading font-extrabold text-base text-white tracking-tight">WORKS</h2>
          <span className="text-xs text-white/35">{works.length} pieces</span>
        </div>
        {works.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {works.map((w: { id: string; mediaUrls: string[]; artistId: string; styleCategory?: string; title?: string }) => (
              <PortfolioCard key={w.id} work={w} />
            ))}
          </div>
        ) : (
          <div className="py-10 text-center glass rounded-2xl">
            <p className="text-white/35 text-sm">{t('noWorks')}</p>
          </div>
        )}
      </section>

      <ReviewSection
        artistId={id}
        reviews={reviewData.reviews}
        aggregation={reviewData.aggregation}
      />
    </div>
  );
}
