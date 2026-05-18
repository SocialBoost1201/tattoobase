import React from 'react';
import ArtistCard from '@/components/cards/ArtistCard';
import PortfolioCard from '@/components/cards/PortfolioCard';
import { API_BASE } from '@/lib/api';
import { MOCK_ARTISTS, MOCK_PORTFOLIOS } from '@/lib/mock-data';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

const GENRES = ['和彫', 'ブラックアンドグレー', 'ミニマル', 'トラディショナル', 'ファインライン', 'レタリング', 'ニュースクール', 'ジオメトリック'];
const PREFECTURES = ['東京都', '大阪府', '愛知県', '京都府', '福岡県'];

type SortOption = 'recommended' | 'rating' | 'price_asc' | 'price_desc';

async function searchArtists(
  genre: string,
  prefecture: string,
  q: string,
  gender: string,
  sameDay: boolean,
  sort: SortOption,
) {
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
  let results = MOCK_ARTISTS as typeof MOCK_ARTISTS;
  if (genre) results = results.filter((a) => a.specialties.some((s) => s.includes(genre)));
  if (prefecture) results = results.filter((a) => a.prefecture === prefecture);
  if (q) {
    const lower = q.toLowerCase();
    results = results.filter((a) =>
      a.displayName.toLowerCase().includes(lower) ||
      a.specialties.some((s) => s.toLowerCase().includes(lower)) ||
      (a.studio?.name ?? '').toLowerCase().includes(lower)
    );
  }
  if (gender === 'female') results = results.filter((a) => a.isFemaleArtist === true);
  if (gender === 'male') results = results.filter((a) => a.isFemaleArtist === false);
  if (sameDay) results = results.filter((a) => a.acceptsSameDayBooking === true);
  if (sort === 'rating') {
    results = [...results].sort((a, b) => (b.avgRating ?? 0) - (a.avgRating ?? 0));
  } else if (sort === 'price_asc') {
    results = [...results].sort((a, b) => (a.priceRange ?? '').localeCompare(b.priceRange ?? ''));
  } else if (sort === 'price_desc') {
    results = [...results].sort((a, b) => (b.priceRange ?? '').localeCompare(a.priceRange ?? ''));
  }
  return results;
}

async function searchPortfolios(q: string) {
  try {
    const res = await fetch(`${API_BASE}/user-api/portfolios`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch {
    // API not available
  }
  if (!q) return MOCK_PORTFOLIOS;
  const lower = q.toLowerCase();
  return MOCK_PORTFOLIOS.filter(
    (p) =>
      (p.title ?? '').toLowerCase().includes(lower) ||
      (p.styleCategory ?? '').toLowerCase().includes(lower)
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const t = await getTranslations('search');
  const params = await searchParams;
  const genre = (params.genre as string) ?? '';
  const prefecture = (params.prefecture as string) ?? '';
  const q = (params.q as string) ?? '';
  const searchType = (params.type as string) ?? 'artist';
  const isPortfolioSearch = searchType === 'portfolio';
  const gender = (params.gender as string) ?? '';
  const sameDayParam = (params.sameDay as string) ?? '';
  const sameDay = sameDayParam === 'true';
  const sortParam = (params.sort as string) ?? '';
  const sort: SortOption =
    sortParam === 'rating' || sortParam === 'price_asc' || sortParam === 'price_desc'
      ? sortParam
      : 'recommended';

  const artists = !isPortfolioSearch ? await searchArtists(genre, prefecture, q, gender, sameDay, sort) : [];
  const portfolios = isPortfolioSearch ? await searchPortfolios(q) : [];

  const buildUrl = (overrides: Record<string, string>) => {
    const next: Record<string, string> = {
      type: searchType,
      genre,
      prefecture,
      q,
      gender,
      sameDay: sameDay ? 'true' : '',
      sort: sort === 'recommended' ? '' : sort,
      ...overrides,
    };
    const qs = Object.entries(next)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join('&');
    return `/search${qs ? `?${qs}` : ''}`;
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-heading font-extrabold text-2xl text-white">
          {isPortfolioSearch ? 'WORKS' : 'ARTISTS'}
        </h1>
        <p className="text-white/45 text-xs mt-1">
          {isPortfolioSearch ? t('worksSubtitle') : t('artistSubtitle')}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10">
        <Link
          href={buildUrl({ type: 'artist' })}
          className={`pb-2 px-1 mr-6 text-sm font-bold uppercase tracking-wide transition-colors ${
            !isPortfolioSearch ? 'border-b-2 border-white text-white' : 'text-white/35 hover:text-white'
          }`}
        >
          Artists
        </Link>
        <Link
          href={buildUrl({ type: 'portfolio' })}
          className={`pb-2 px-1 text-sm font-bold uppercase tracking-wide transition-colors ${
            isPortfolioSearch ? 'border-b-2 border-white text-white' : 'text-white/35 hover:text-white'
          }`}
        >
          Works
        </Link>
      </div>

      {/* Text search */}
      <form method="GET" action="/search">
        <input type="hidden" name="type" value={searchType} />
        {genre && <input type="hidden" name="genre" value={genre} />}
        {prefecture && <input type="hidden" name="prefecture" value={prefecture} />}
        {gender && <input type="hidden" name="gender" value={gender} />}
        {sameDay && <input type="hidden" name="sameDay" value="true" />}
        {sort !== 'recommended' && <input type="hidden" name="sort" value={sort} />}
        <div className="relative">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder={isPortfolioSearch ? t('worksPlaceholder') : t('artistPlaceholder')}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/25 focus:outline-none focus:border-white/25 transition-all"
          />
        </div>
      </form>

      {/* Filters — artists only */}
      {!isPortfolioSearch && (
        <div className="space-y-3">
          {/* Genre chips */}
          <div className="flex gap-2 flex-wrap">
            <Link href={buildUrl({ genre: '' })} className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${!genre ? 'bg-white text-black border-white' : 'glass text-white/50 hover:text-white border-white/15'}`}>
              ALL
            </Link>
            {GENRES.map((g) => (
              <Link key={g} href={buildUrl({ genre: g })} className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${genre === g ? 'bg-white text-black border-white' : 'glass text-white/50 hover:text-white border-white/15'}`}>
                {g}
              </Link>
            ))}
          </div>

          {/* Prefecture filter */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <Link href={buildUrl({ prefecture: '' })} className={`flex-none px-3 py-1.5 text-[11px] font-semibold rounded-lg border transition-all ${!prefecture ? 'bg-white/15 text-white border-white/25' : 'text-white/35 border-white/10 hover:text-white/60'}`}>
              全国
            </Link>
            {PREFECTURES.map((pref) => (
              <Link key={pref} href={buildUrl({ prefecture: pref })} className={`flex-none px-3 py-1.5 text-[11px] font-semibold rounded-lg border transition-all ${prefecture === pref ? 'bg-white/15 text-white border-white/25' : 'text-white/35 border-white/10 hover:text-white/60'}`}>
                {pref}
              </Link>
            ))}
          </div>

          {/* Gender filter */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <Link href={buildUrl({ gender: '' })} className={`flex-none px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${!gender ? 'bg-white text-black border-white' : 'glass text-white/50 hover:text-white border-white/15'}`}>
              {t('allGenders')}
            </Link>
            <Link href={buildUrl({ gender: 'female' })} className={`flex-none px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${gender === 'female' ? 'bg-white text-black border-white' : 'glass text-white/50 hover:text-white border-white/15'}`}>
              {t('femaleArtist')}
            </Link>
            <Link href={buildUrl({ gender: 'male' })} className={`flex-none px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${gender === 'male' ? 'bg-white text-black border-white' : 'glass text-white/50 hover:text-white border-white/15'}`}>
              {t('maleArtist')}
            </Link>
          </div>

          {/* Same-day booking toggle */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <Link
              href={buildUrl({ sameDay: sameDay ? '' : 'true' })}
              className={`flex-none px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${sameDay ? 'bg-white text-black border-white' : 'glass text-white/50 hover:text-white border-white/15'}`}
            >
              {t('sameDayOK')}
            </Link>
          </div>

          {/* Sort chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <Link href={buildUrl({ sort: '' })} className={`flex-none px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${sort === 'recommended' ? 'bg-white text-black border-white' : 'glass text-white/50 hover:text-white border-white/15'}`}>
              {t('sortRecommended')}
            </Link>
            <Link href={buildUrl({ sort: 'rating' })} className={`flex-none px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${sort === 'rating' ? 'bg-white text-black border-white' : 'glass text-white/50 hover:text-white border-white/15'}`}>
              {t('sortRating')}
            </Link>
            <Link href={buildUrl({ sort: 'price_asc' })} className={`flex-none px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${sort === 'price_asc' ? 'bg-white text-black border-white' : 'glass text-white/50 hover:text-white border-white/15'}`}>
              {t('sortPriceAsc')}
            </Link>
            <Link href={buildUrl({ sort: 'price_desc' })} className={`flex-none px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${sort === 'price_desc' ? 'bg-white text-black border-white' : 'glass text-white/50 hover:text-white border-white/15'}`}>
              {t('sortPriceDesc')}
            </Link>
          </div>
        </div>
      )}

      {/* Results */}
      <section>
        {!isPortfolioSearch ? (
          artists.length > 0 ? (
            <>
              <p className="text-white/35 text-xs mb-3">{artists.length}件のアーティスト</p>
              <div className="grid grid-cols-2 gap-3">
                {artists.map((a: { id: string; displayName: string; studio?: { name: string }; avgRating?: number; reviewCount?: number; specialties?: string[]; prefecture?: string; priceRange?: string }) => (
                  <ArtistCard key={a.id} artist={a} />
                ))}
              </div>
            </>
          ) : (
            <div className="py-16 text-center glass rounded-2xl">
              <p className="text-white/45 text-sm">{t('noResults')}</p>
              {(genre || prefecture || q || gender || sameDay) && (
                <Link href="/search?type=artist" className="block mt-3 text-xs text-white/40 hover:text-white underline underline-offset-2">{t('resetFilters')}</Link>
              )}
            </div>
          )
        ) : (
          portfolios.length > 0 ? (
            <>
              <p className="text-white/35 text-xs mb-3">{portfolios.length} works</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {portfolios.map((w: { id: string; mediaUrls: string[]; artistId: string; styleCategory?: string; title?: string }) => (
                  <PortfolioCard key={w.id} work={w} />
                ))}
              </div>
            </>
          ) : (
            <div className="py-16 text-center glass rounded-2xl">
              <p className="text-white/45 text-sm">{t('noWorks')}</p>
            </div>
          )
        )}
      </section>
    </div>
  );
}
