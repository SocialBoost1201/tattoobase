import Link from 'next/link';
import PortfolioCard from '@/components/cards/PortfolioCard';
import ReviewSection from '@/components/reviews/ReviewSection';
import { API_BASE } from '@/lib/api';
import { MOCK_ARTISTS, MOCK_PORTFOLIOS } from '@/lib/mock-data';

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
  const [artist, works, reviewData] = await Promise.all([
    getArtist(id),
    getPortfolios(id),
    getReviews(id),
  ]);

  if (!artist) {
    return (
      <div className="py-16 text-center border border-[#e0e0e0] rounded-sm">
        <p className="text-[#6b6b6b] text-sm">アーティストが見つかりませんでした</p>
        <Link href="/search" className="mt-4 inline-block text-sm font-semibold text-[#0a0a0a] underline">検索に戻る</Link>
      </div>
    );
  }

  const initials = artist.displayName.slice(0, 2).toUpperCase();

  return (
    <div className="space-y-8">
      <section className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#f0f0f0] border-2 border-[#0a0a0a] flex items-center justify-center flex-shrink-0">
          <span className="text-xl font-extrabold text-[#0a0a0a] font-heading">{initials}</span>
        </div>
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-[#0a0a0a] leading-tight">{artist.displayName}</h1>
          {artist.studio && (
            <p className="text-[#6b6b6b] text-sm mt-0.5">{artist.studio.name}</p>
          )}
          {artist.specialties && artist.specialties.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {artist.specialties.map((s: string) => (
                <span key={s} className="text-[10px] font-semibold bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-sm border border-neutral-200">
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="h-px bg-[#e0e0e0]" />

      {artist.bio && (
        <p className="text-[#3b3b3b] text-sm leading-relaxed">{artist.bio}</p>
      )}

      <Link
        href={`/booking/start?artistId=${artist.id}`}
        className="block w-full bg-[#0a0a0a] hover:opacity-85 text-white font-bold text-center py-4 rounded-sm transition-opacity duration-200 font-heading tracking-wide"
      >
        予約する
      </Link>

      <section>
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="font-heading font-extrabold text-base text-[#0a0a0a] tracking-tight">WORKS</h2>
          <span className="text-xs text-[#6b6b6b]">{works.length} pieces</span>
        </div>
        {works.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {works.map((w: { id: string; mediaUrls: string[]; artistId: string }) => (
              <PortfolioCard key={w.id} work={w} />
            ))}
          </div>
        ) : (
          <div className="py-10 text-center border border-[#e0e0e0] rounded-sm">
            <p className="text-[#a0a0a0] text-sm">作品はまだ登録されていません</p>
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
