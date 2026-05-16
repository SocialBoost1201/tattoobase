import React from 'react';
import ArtistCard from '@/components/cards/ArtistCard';
import PortfolioCard from '@/components/cards/PortfolioCard';
import { API_BASE } from '@/lib/api';
import { MOCK_ARTISTS, MOCK_PORTFOLIOS } from '@/lib/mock-data';

const GENRES = ['和彫', '洋彫', 'ブラックアンドグレー', 'トラディショナル', 'アニメ', 'ニュースクール', 'レタリング', 'ミニマル'];

async function searchArtists(genre: string) {
  try {
    const url = new URL(`${API_BASE}/user-api/artists`);
    if (genre) url.searchParams.set('genre', genre);
    const res = await fetch(url.toString(), { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch {
    // API not available
  }
  if (genre) {
    return MOCK_ARTISTS.filter((a) =>
      a.specialties.some((s) => s.includes(genre))
    );
  }
  return MOCK_ARTISTS;
}

async function searchPortfolios() {
  try {
    const res = await fetch(`${API_BASE}/user-api/portfolios`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch {
    // API not available
  }
  return MOCK_PORTFOLIOS;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const genre = (params.genre as string) ?? '';
  const searchType = (params.type as string) ?? 'artist';

  const isPortfolioSearch = searchType === 'portfolio';

  const artists = !isPortfolioSearch ? await searchArtists(genre) : [];
  const portfolios = isPortfolioSearch ? await searchPortfolios() : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-extrabold text-2xl text-white">
          {isPortfolioSearch ? 'WORKS' : 'ARTISTS'}
        </h1>
        <p className="text-white/45 text-xs mt-1">
          {isPortfolioSearch ? '直近の作品からインスピレーションを探す' : 'アーティストをスタイルで絞り込む'}
        </p>
      </div>

      <section className="space-y-4">
        <div className="flex border-b border-white/10">
          <a
            href={`/search?type=artist${genre ? `&genre=${encodeURIComponent(genre)}` : ''}`}
            className={`pb-2 px-1 mr-6 text-sm font-bold uppercase tracking-wide transition-colors ${
              !isPortfolioSearch ? 'border-b-2 border-white text-white' : 'text-white/35 hover:text-white'
            }`}
          >
            Artists
          </a>
          <a
            href="/search?type=portfolio"
            className={`pb-2 px-1 text-sm font-bold uppercase tracking-wide transition-colors ${
              isPortfolioSearch ? 'border-b-2 border-white text-white' : 'text-white/35 hover:text-white'
            }`}
          >
            Works
          </a>
        </div>

        {!isPortfolioSearch && (
          <div className="flex flex-wrap gap-2">
            <a
              href="/search?type=artist"
              className={`px-3 py-1.5 text-xs font-semibold border transition-all rounded-xl ${
                !genre
                  ? 'bg-white text-black border-white'
                  : 'glass text-white/50 hover:text-white'
              }`}
            >
              ALL
            </a>
            {GENRES.map((g) => (
              <a
                key={g}
                href={`/search?type=artist&genre=${encodeURIComponent(g)}`}
                className={`px-3 py-1.5 text-xs font-semibold border transition-all rounded-xl ${
                  genre === g
                    ? 'bg-white text-black border-white'
                    : 'glass text-white/50 hover:text-white'
                }`}
              >
                {g}
              </a>
            ))}
          </div>
        )}
      </section>

      <section>
        {!isPortfolioSearch ? (
          artists.length > 0 ? (
            <>
              <p className="text-white/45 text-xs mb-3 font-medium">{artists.length} artists</p>
              <div className="grid grid-cols-2 gap-3">
                {artists.map((a: { id: string; displayName: string; studio?: { name: string } }) => (
                  <ArtistCard key={a.id} artist={a} />
                ))}
              </div>
            </>
          ) : (
            <div className="py-16 text-center glass rounded-2xl">
              <p className="text-white/45 text-sm">該当するアーティストが見つかりませんでした</p>
            </div>
          )
        ) : (
          portfolios.length > 0 ? (
            <>
              <p className="text-white/45 text-xs mb-3 font-medium">{portfolios.length} works</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {portfolios.map((w: { id: string; mediaUrls: string[]; artistId: string; styleCategory?: string; title?: string }) => (
                  <PortfolioCard key={w.id} work={w} />
                ))}
              </div>
            </>
          ) : (
            <div className="py-16 text-center glass rounded-2xl">
              <p className="text-white/45 text-sm">作品が登録されていません</p>
            </div>
          )
        )}
      </section>
    </div>
  );
}
