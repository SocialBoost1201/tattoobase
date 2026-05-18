import React, { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ArtistCard from '@/components/cards/ArtistCard';
import ArtistCardHorizontal from '@/components/cards/ArtistCardHorizontal';
import PortfolioCard from '@/components/cards/PortfolioCard';
import SearchViewToggle from '@/components/search/SearchViewToggle';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import SortSelector from '@/components/ui/SortSelector';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const GENRES = ['和彫', '洋彫', 'ブラックアンドグレー', 'トラディショナル', 'アニメ', 'ニュースクール', 'レタリング', 'ミニマル'];
const PREFS = ['東京都', '大阪府', '愛知県', '福岡県', '神奈川県', '北海道', '京都府', '兵庫県'];

async function searchArtists(genre: string, pref: string, q: string, sort: string) {
  try {
    const url = new URL(`${API}/user-api/artists`);
    if (genre) url.searchParams.set('genre', genre);
    if (pref) url.searchParams.set('prefecture', pref);
    if (q) url.searchParams.set('q', q);
    if (sort && sort !== 'new') url.searchParams.set('sort', sort);
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

async function fetchCounts(q: string) {
  try {
    const url = new URL(`${API}/user-api/artists/counts`);
    if (q) url.searchParams.set('q', q);
    const res = await fetch(url.toString(), { cache: 'no-store' });
    if (!res.ok) return { total: 0, byGenre: [] };
    return res.json();
  } catch {
    return { total: 0, byGenre: [] };
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
  const q = (params.q as string) ?? '';
  const sort = (params.sort as string) ?? 'new';
  const searchType = (params.type as string) ?? 'artist';
  const isPortfolioSearch = searchType === 'portfolio';

  const [artists, portfolios, counts] = await Promise.all([
    !isPortfolioSearch ? searchArtists(genre, pref, q, sort) : Promise.resolve([]),
    isPortfolioSearch ? searchPortfolios() : Promise.resolve([]),
    !isPortfolioSearch ? fetchCounts(q) : Promise.resolve({ total: 0, byGenre: [] }),
  ]);

  // ジャンル別件数をMapに変換
  const genreCountMap: Record<string, number> = {};
  for (const { genre: g, count } of counts.byGenre ?? []) {
    genreCountMap[g] = count;
  }

  // パンくず構築
  const crumbs = [
    { label: isPortfolioSearch ? '作品一覧' : 'アーティスト検索', href: `/search?type=${searchType}` },
    ...(pref ? [{ label: pref }] : []),
    ...(genre ? [{ label: genre }] : []),
    ...(q ? [{ label: `「${q}」` }] : []),
  ];

  return (
    <div className="pb-20 md:pb-8">

      {/* パンくず（PCのみ） */}
      <Breadcrumbs items={crumbs} />

      {/* ===== PC: 2カラム（左サイドバーフィルター + 右コンテンツ） ===== */}
      {/* ===== Mobile: 1カラム（スティッキーチップフィルター + カードグリッド） ===== */}
      <div className="md:grid md:grid-cols-[240px_1fr] md:gap-8 md:items-start">

        {/* ===== PC 左サイドバーフィルター ===== */}
        <aside className="hidden md:block sticky top-24 space-y-6">
          {/* タブ: Artists / Works */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-1">
            <p className="text-xs font-extrabold text-neutral-600 uppercase tracking-widest mb-3">検索タイプ</p>
            {[
              { href: `/search?type=artist${genre ? `&genre=${encodeURIComponent(genre)}` : ''}${pref ? `&pref=${encodeURIComponent(pref)}` : ''}`, label: 'アーティスト', active: !isPortfolioSearch },
              { href: `/search?type=portfolio`, label: '作品・ギャラリー', active: isPortfolioSearch },
            ].map(item => (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                  item.active ? 'bg-white text-black' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}>
                {item.label}
              </Link>
            ))}
          </div>

          {!isPortfolioSearch && (
            <>
              {/* 都道府県フィルター */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-1">
                <p className="text-xs font-extrabold text-neutral-600 uppercase tracking-widest mb-3">エリア</p>
                <Link href={`/search?type=artist${genre ? `&genre=${encodeURIComponent(genre)}` : ''}`}
                  className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                    !pref ? 'bg-white/10 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}>
                  全国
                  {!pref && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </Link>
                {PREFS.map(p => (
                  <Link key={p} href={`/search?type=artist&pref=${encodeURIComponent(p)}${genre ? `&genre=${encodeURIComponent(genre)}` : ''}`}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                      pref === p ? 'bg-white/10 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                    }`}>
                    {p.replace(/都|道|府|県/, '')}
                    {pref === p && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </Link>
                ))}
              </div>

              {/* スタイルフィルター */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-1">
                <p className="text-xs font-extrabold text-neutral-600 uppercase tracking-widest mb-3">スタイル</p>
                <Link href={`/search?type=artist${pref ? `&pref=${encodeURIComponent(pref)}` : ''}`}
                  className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                    !genre ? 'bg-white/10 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}>
                  すべて
                  {!genre && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </Link>
                {GENRES.map(g => (
                  <Link key={g} href={`/search?type=artist&genre=${encodeURIComponent(g)}${pref ? `&pref=${encodeURIComponent(pref)}` : ''}`}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                      genre === g ? 'bg-white/10 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                    }`}>
                    <span>{g}</span>
                    <span className={`text-xs font-bold tabular-nums ${
                      genre === g ? 'text-white/50' : 'text-neutral-600'
                    }`}>{genreCountMap[g] ?? ''}</span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </aside>

        {/* ===== メインコンテンツ ===== */}
        <div className="space-y-5">

          {/* ページタイトル */}
          <div className="flex items-end justify-between">
            <div>
              <h1 className="font-heading font-extrabold text-3xl text-white tracking-tight">
                {isPortfolioSearch ? 'DISCOVER'
                  : q ? `「${q}」の検索結果`
                  : (genre || pref) ? `${pref ? pref.replace(/都|道|府|県/, '') : '全国'} ${genre || 'アーティスト'}`
                  : 'ARTISTS'}
              </h1>
              <p className="text-neutral-400 text-xs mt-1 font-medium">
                {isPortfolioSearch ? '直近の作品からインスピレーションを探す' : '理想のスタイルを持つアーティストに出会う'}
              </p>
            </div>
            {!isPortfolioSearch && (
              <div className="hidden md:flex items-center gap-3">
                <span className="text-neutral-600 text-xs font-bold">{artists.length}件</span>
                <Suspense><SortSelector currentSort={sort} /></Suspense>
              </div>
            )}
          </div>

          {/* ===== モバイル専用: スティッキーチップフィルター ===== */}
          <section className="md:hidden space-y-3 sticky top-[88px] bg-black/90 backdrop-blur-xl z-30 pt-2 pb-4 -mx-4 px-4 border-b border-neutral-900">
            <div className="flex items-center justify-between gap-4">
              <div className="flex gap-6">
                <Link href={`/search?type=artist${genre ? `&genre=${encodeURIComponent(genre)}` : ''}${pref ? `&pref=${encodeURIComponent(pref)}` : ''}`}
                  className={`pb-2 text-sm font-bold uppercase tracking-widest transition-colors relative ${!isPortfolioSearch ? 'text-white' : 'text-neutral-600 hover:text-neutral-300'}`}>
                  Artists
                  {!isPortfolioSearch && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />}
                </Link>
                <Link href="/search?type=portfolio"
                  className={`pb-2 text-sm font-bold uppercase tracking-widest transition-colors relative ${isPortfolioSearch ? 'text-white' : 'text-neutral-600 hover:text-neutral-300'}`}>
                  Works
                  {isPortfolioSearch && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />}
                </Link>
              </div>
              {!isPortfolioSearch && (
                <Suspense><SortSelector currentSort={sort} /></Suspense>
              )}
            </div>

            {!isPortfolioSearch && (
              <>
                <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-1 -mx-4 px-4">
                  <Link href={`/search?type=artist${genre ? `&genre=${encodeURIComponent(genre)}` : ''}`}
                    className={`px-3 py-1.5 text-xs font-bold shrink-0 rounded-full transition-all ${!pref ? 'bg-white text-black' : 'bg-transparent text-neutral-500 border border-neutral-700 hover:border-neutral-400 hover:text-white'}`}>
                    全国
                  </Link>
                  {PREFS.map(p => (
                    <Link key={p} href={`/search?type=artist&pref=${encodeURIComponent(p)}${genre ? `&genre=${encodeURIComponent(genre)}` : ''}`}
                      className={`px-3 py-1.5 text-xs font-bold shrink-0 rounded-full transition-all ${pref === p ? 'bg-white text-black' : 'bg-transparent text-neutral-500 border border-neutral-700 hover:border-neutral-400 hover:text-white'}`}>
                      {p.replace(/都|道|府|県/, '')}
                    </Link>
                  ))}
                </div>
                <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-1 -mx-4 px-4">
                  <Link href={`/search?type=artist${pref ? `&pref=${encodeURIComponent(pref)}` : ''}`}
                    className={`px-3 py-1.5 text-xs font-extrabold shrink-0 border transition-all rounded-full uppercase ${!genre ? 'bg-white text-black border-white' : 'bg-transparent text-neutral-400 border-neutral-700 hover:border-neutral-400 hover:text-white'}`}>
                    ALL
                  </Link>
                  {GENRES.map(g => (
                    <Link key={g} href={`/search?type=artist&genre=${encodeURIComponent(g)}${pref ? `&pref=${encodeURIComponent(pref)}` : ''}`}
                      className={`px-3 py-1.5 text-xs font-extrabold shrink-0 border transition-all rounded-full uppercase flex items-center gap-1.5 ${
                        genre === g ? 'bg-white text-black border-white' : 'bg-transparent text-neutral-400 border-neutral-700 hover:border-neutral-400 hover:text-white'
                      }`}>
                      {g}
                      {genreCountMap[g] !== undefined && (
                        <span className={`text-xs font-bold ${
                          genre === g ? 'text-black/50' : 'text-neutral-600'
                        }`}>{genreCountMap[g]}</span>
                      )}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </section>

          {/* ===== 検索結果 ===== */}
          <section className="pt-2">
            {!isPortfolioSearch ? (
              <>
                {/* モバイル: SearchViewToggle（リスト/地図切り替え） */}
                <div className="md:hidden">
                  <SearchViewToggle artists={artists} pref={pref} genre={genre} />
                </div>

                {/* PC: 横型カードリスト */}
                <div className="hidden md:block space-y-4">
                  {artists.length > 0 ? (
                    <>
                      <p className="text-neutral-500 text-xs font-bold tracking-widest uppercase">
                        {artists.length} artists
                        {pref && <span className="ml-2 text-neutral-600">/ {pref}</span>}
                        {genre && <span className="ml-2 text-neutral-600">/ {genre}</span>}
                      </p>
                      {artists.map((a: any) => (
                        <ArtistCardHorizontal key={a.id} artist={a} />
                      ))}
                    </>
                  ) : (
                    <div className="py-24 text-center border border-neutral-900 rounded-2xl bg-neutral-900/20">
                      <p className="text-neutral-500 text-sm font-bold">該当するアーティストが見つかりませんでした</p>
                      <Link href="/search" className="mt-4 inline-block text-xs text-neutral-500 hover:text-white underline transition-colors">
                        条件をリセット
                      </Link>
                    </div>
                  )}
                </div>
              </>
            ) : (
              portfolios.length > 0 ? (
                <>
                  <p className="text-neutral-500 text-xs uppercase font-bold tracking-widest mb-4">
                    {portfolios.length} artworks found
                  </p>
                  <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
                    {portfolios.map((w: any) => {
                      const img = w.mediaUrls?.[0];
                      if (!img) return null;
                      return (
                        <Link key={w.id} href={`/artist/${w.artistId}`}
                          className="group block relative overflow-hidden rounded-xl break-inside-avoid bg-neutral-900 transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl">
                          <Image src={img} alt="artwork" width={400} height={600}
                            className="w-full h-auto object-cover group-hover:opacity-80 transition-opacity"
                            sizes="(max-width: 768px) 50vw, 25vw" />
                          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black via-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            <span className="text-white text-xs font-bold tracking-widest uppercase">View Artist</span>
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
      </div>
    </div>
  );
}
