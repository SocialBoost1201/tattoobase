import React from 'react';
import ArtistCard from '@/components/cards/ArtistCard';
import PortfolioCard from '@/components/cards/PortfolioCard';

const API = 'http://localhost:3000';

const GENRES = ['和彫', '洋彫', 'ブラックアンドグレー', 'トラディショナル', 'アニメ', 'ニュースクール', 'レタリング', 'ミニマル'];

async function searchArtists(genre: string) {
  const url = new URL(`${API}/user-api/artists`);
  if (genre) url.searchParams.set('genre', genre);
  const res = await fetch(url.toString(), { cache: 'no-store' });
  return res.ok ? res.json() : [];
}

async function searchPortfolios() {
  const res = await fetch(`${API}/user-api/portfolios`, { cache: 'no-store' });
  return res.ok ? res.json() : [];
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const genre = (params.genre as string) ?? '';
  const searchType = (params.type as string) ?? 'artist'; // 'artist' default, or 'portfolio'

  const isPortfolioSearch = searchType === 'portfolio';

  const artists = !isPortfolioSearch ? await searchArtists(genre) : [];
  const portfolios = isPortfolioSearch ? await searchPortfolios() : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-extrabold text-2xl text-[#0a0a0a]">
          {isPortfolioSearch ? 'WORKS' : 'ARTISTS'}
        </h1>
        <p className="text-[#6b6b6b] text-xs mt-1">
          {isPortfolioSearch ? '直近の作品からインスピレーションを探す' : 'アーティストをスタイルで絞り込む'}
        </p>
      </div>

      {/* タブとフィルター */}
      <section className="space-y-4">
        {/* Toggle between Artist/Portfolio */}
        <div className="flex border-b border-[#e0e0e0]">
          <a
            href={`/search?type=artist${genre ? `&genre=${encodeURIComponent(genre)}` : ''}`}
            className={`pb-2 px-1 mr-6 text-sm font-bold uppercase tracking-wide transition-colors ${
              !isPortfolioSearch ? 'border-b-2 border-[#0a0a0a] text-[#0a0a0a]' : 'text-[#a0a0a0] hover:text-[#0a0a0a]'
            }`}
          >
            Artists
          </a>
          <a
            href="/search?type=portfolio"
            className={`pb-2 px-1 text-sm font-bold uppercase tracking-wide transition-colors ${
              isPortfolioSearch ? 'border-b-2 border-[#0a0a0a] text-[#0a0a0a]' : 'text-[#a0a0a0] hover:text-[#0a0a0a]'
            }`}
          >
            Works
          </a>
        </div>

        {/* ジャンルフィルター (アーティスト検索時のみ) */}
        {!isPortfolioSearch && (
          <div className="flex flex-wrap gap-2">
            <a
              href={`/search?type=artist`}
              className={`px-3 py-1.5 text-xs font-semibold border transition-all rounded-sm ${
                !genre
                  ? 'bg-[#0a0a0a] text-white border-[#0a0a0a]'
                  : 'bg-white text-[#6b6b6b] border-[#e0e0e0] hover:border-[#0a0a0a] hover:text-[#0a0a0a]'
              }`}
            >
              ALL
            </a>
            {GENRES.map((g) => (
              <a
                key={g}
                href={`/search?type=artist&genre=${encodeURIComponent(g)}`}
                className={`px-3 py-1.5 text-xs font-semibold border transition-all rounded-sm ${
                  genre === g
                    ? 'bg-[#0a0a0a] text-white border-[#0a0a0a]'
                    : 'bg-white text-[#6b6b6b] border-[#e0e0e0] hover:border-[#0a0a0a] hover:text-[#0a0a0a]'
                }`}
              >
                {g}
              </a>
            ))}
          </div>
        )}
      </section>

      {/* 検索結果一覧 */}
      <section>
        {!isPortfolioSearch ? (
          /* アーティスト一覧 */
          artists.length > 0 ? (
            <>
              <p className="text-[#6b6b6b] text-xs mb-3 font-medium">{artists.length} artists</p>
              <div className="grid grid-cols-2 gap-3">
                {artists.map((a: { id: string; displayName: string; studio?: { name: string } }) => (
                  <ArtistCard key={a.id} artist={a} />
                ))}
              </div>
            </>
          ) : (
            <div className="py-16 text-center border border-[#e0e0e0] rounded-sm bg-white">
              <p className="text-[#6b6b6b] text-sm">該当するアーティストが見つかりませんでした</p>
            </div>
          )
        ) : (
          /* ポートフォリオ一覧 */
          portfolios.length > 0 ? (
            <>
              <p className="text-[#6b6b6b] text-xs mb-3 font-medium">{portfolios.length} works</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {portfolios.map((w: { id: string; mediaUrls: string[]; artistId: string; styleCategory?: string; title?: string }) => (
                  <PortfolioCard key={w.id} work={w} />
                ))}
              </div>
            </>
          ) : (
            <div className="py-16 text-center border border-[#e0e0e0] rounded-sm bg-white">
              <p className="text-[#6b6b6b] text-sm">作品が登録されていません</p>
            </div>
          )
        )}
      </section>
    </div>
  );
}
