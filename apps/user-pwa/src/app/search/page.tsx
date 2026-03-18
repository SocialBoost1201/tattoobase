import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ArtistCard from '@/components/cards/ArtistCard';
import PortfolioCard from '@/components/cards/PortfolioCard';

const API = 'http://localhost:3000';

const GENRES = ['和彫', '洋彫', 'ブラックアンドグレー', 'トラディショナル', 'アニメ', 'ニュースクール', 'レタリング', 'ミニマル'];
const PREFS = ['東京都', '大阪府', '愛知県', '福岡県', '神奈川県', '北海道', '京都府', '兵庫県'];

async function searchArtists(genre: string, pref: string) {
  try {
    const url = new URL(`${API}/user-api/artists`);
    if (genre) url.searchParams.set('genre', genre);
    if (pref) url.searchParams.set('prefecture', pref);
    const res = await fetch(url.toString(), { cache: 'no-store' });
    return res.ok ? res.json() : [];
  } catch (e) {
    console.warn('Backend API not available:', e);
    return [];
  }
}

async function searchPortfolios() {
  try {
    const res = await fetch(`${API}/user-api/portfolios`, { cache: 'no-store' });
    return res.ok ? res.json() : [];
  } catch (e) {
    console.warn('Backend API not available:', e);
    return [];
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const genre = (params.genre as string) ?? '';
  const pref = (params.pref as string) ?? '';
  const searchType = (params.type as string) ?? 'artist';
  const isPortfolioSearch = searchType === 'portfolio';

  const artists = !isPortfolioSearch ? await searchArtists(genre, pref) : [];
  const portfolios = isPortfolioSearch ? await searchPortfolios() : [];

  return (
    <div className="space-y-5 pb-20">
      <div>
        <h1 className="font-heading font-extrabold text-3xl text-white tracking-tight">
          {isPortfolioSearch ? 'DISCOVER' : 'ARTISTS'}
        </h1>
        <p className="text-neutral-400 text-xs mt-1 font-medium">
          {isPortfolioSearch ? '直近の作品からインスピレーションを探す' : '理想のスタイルを持つアーティストに出会う'}
        </p>
      </div>

      {/* タブとフィルター (sticky) */}
      <section className="space-y-3 sticky top-[88px] bg-black/90 backdrop-blur-xl z-30 pt-2 pb-4 -mx-4 px-4 border-b border-neutral-900">
        {/* Toggle: Artist / Portfolio */}
        <div className="flex gap-6">
          <Link
            href={`/search?type=artist${genre ? `&genre=${encodeURIComponent(genre)}` : ''}${pref ? `&pref=${encodeURIComponent(pref)}` : ''}`}
            className={`pb-2 text-sm font-bold uppercase tracking-widest transition-colors relative ${
              !isPortfolioSearch ? 'text-white' : 'text-neutral-600 hover:text-neutral-300'
            }`}
          >
            Artists
            {!isPortfolioSearch && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />}
          </Link>
          <Link
            href="/search?type=portfolio"
            className={`pb-2 text-sm font-bold uppercase tracking-widest transition-colors relative ${
              isPortfolioSearch ? 'text-white' : 'text-neutral-600 hover:text-neutral-300'
            }`}
          >
            Works
            {isPortfolioSearch && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />}
          </Link>
        </div>

        {!isPortfolioSearch && (
          <>
            {/* エリア（都道府県）フィルター — 食べログ方式 */}
            <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-1 -mx-4 px-4">
              <Link
                href={`/search?type=artist${genre ? `&genre=${encodeURIComponent(genre)}` : ''}`}
                className={`px-3 py-1.5 text-[11px] font-bold shrink-0 rounded-full transition-all tracking-wider ${
                  !pref ? 'bg-white text-black' : 'bg-transparent text-neutral-500 border border-neutral-700 hover:border-neutral-400 hover:text-white'
                }`}
              >
                全国
              </Link>
              {PREFS.map((p) => (
                <Link
                  key={p}
                  href={`/search?type=artist&pref=${encodeURIComponent(p)}${genre ? `&genre=${encodeURIComponent(genre)}` : ''}`}
                  className={`px-3 py-1.5 text-[11px] font-bold shrink-0 rounded-full transition-all tracking-wider ${
                    pref === p ? 'bg-white text-black' : 'bg-transparent text-neutral-500 border border-neutral-700 hover:border-neutral-400 hover:text-white'
                  }`}
                >
                  {p.replace('都', '').replace('道', '').replace('府', '').replace('県', '')}
                </Link>
              ))}
            </div>

            {/* ジャンルフィルター */}
            <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-1 -mx-4 px-4">
              <Link
                href={`/search?type=artist${pref ? `&pref=${encodeURIComponent(pref)}` : ''}`}
                className={`px-3 py-1.5 text-[11px] font-extrabold shrink-0 border transition-all rounded-full tracking-widest uppercase ${
                  !genre
                    ? 'bg-white text-black border-white'
                    : 'bg-transparent text-neutral-400 border-neutral-700 hover:border-neutral-400 hover:text-white'
                }`}
              >
                ALL
              </Link>
              {GENRES.map((g) => (
                <Link
                  key={g}
                  href={`/search?type=artist&genre=${encodeURIComponent(g)}${pref ? `&pref=${encodeURIComponent(pref)}` : ''}`}
                  className={`px-3 py-1.5 text-[11px] font-extrabold shrink-0 border transition-all rounded-full tracking-widest uppercase ${
                    genre === g
                      ? 'bg-white text-black border-white'
                      : 'bg-transparent text-neutral-400 border-neutral-700 hover:border-neutral-400 hover:text-white'
                  }`}
                >
                  {g}
                </Link>
              ))}
            </div>
          </>
        )}
      </section>

      {/* 検索結果一覧 */}
      <section className="pt-2">
        {!isPortfolioSearch ? (
          artists.length > 0 ? (
            <>
              <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-4">
                {artists.length} artists found
                {pref && <span className="ml-2 text-neutral-600">({pref})</span>}
              </p>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {artists.map((a: any) => (
                  <ArtistCard key={a.id} artist={a} />
                ))}
              </div>
            </>
          ) : (
            <div className="py-24 text-center border border-neutral-900 rounded-2xl bg-neutral-900/20">
              <p className="text-neutral-500 text-sm font-bold">該当するアーティストが見つかりませんでした</p>
              <Link href="/search" className="mt-4 inline-block text-xs text-neutral-500 hover:text-white underline transition-colors">
                条件をリセット
              </Link>
            </div>
          )
        ) : (
          portfolios.length > 0 ? (
            <>
              <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-4">
                {portfolios.length} artworks found
              </p>
              <div className="columns-2 md:columns-3 gap-3 space-y-3">
                {portfolios.map((w: any) => {
                  const img = w.mediaUrls?.[0];
                  if (!img) return null;
                  return (
                    <Link key={w.id} href={`/artist/${w.artistId}`} className="group block relative overflow-hidden rounded-xl break-inside-avoid bg-neutral-900 transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl">
                      <Image
                        src={img}
                        alt="artwork"
                        width={400}
                        height={600}
                        className="w-full h-auto object-cover group-hover:opacity-80 transition-opacity"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black via-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <span className="text-white text-[10px] font-bold tracking-widest uppercase">View Artist</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="py-24 text-center border border-neutral-900 rounded-2xl bg-neutral-900/20">
              <p className="text-neutral-500 text-sm font-bold">作品が登録されていません</p>
            </div>
          )
        )}
      </section>
    </div>
  );
}
