import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Search, Star } from 'lucide-react';

const PREFS = [
  { name: '東京都', slug: 'tokyo', emoji: '🗼', studios: 142, artists: 380 },
  { name: '大阪府', slug: 'osaka', emoji: '🏯', studios: 78, artists: 210 },
  { name: '愛知県', slug: 'aichi', emoji: '🌃', studios: 42, artists: 115 },
  { name: '福岡県', slug: 'fukuoka', emoji: '🌉', studios: 38, artists: 102 },
  { name: '北海道', slug: 'hokkaido', emoji: '❄️', studios: 24, artists: 68 },
  { name: '神奈川県', slug: 'kanagawa', emoji: '🚢', studios: 55, artists: 148 },
  { name: '京都府', slug: 'kyoto', emoji: '⛩️', studios: 31, artists: 84 },
  { name: '兵庫県', slug: 'hyogo', emoji: '🏰', studios: 29, artists: 78 },
];

const STYLES = ['和彫', 'ブラックアンドグレー', 'トラディショナル', 'ニュースクール', 'ミニマル', 'レタリング', 'アニメ', 'ワンポイント'];

type Params = Promise<{ slug: string }>;

function prefFromSlug(slug: string): typeof PREFS[0] | undefined {
  return PREFS.find(p => p.slug === slug);
}

export async function generateStaticParams() {
  return PREFS.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const pref = prefFromSlug(slug);
  if (!pref) return { title: 'エリア別タトゥースタジオ - TattooBase' };
  return {
    title: `${pref.name}のタトゥースタジオ・アーティスト一覧 | TattooBase`,
    description: `${pref.name}のタトゥースタジオ${pref.studios}店・アーティスト${pref.artists}名を掲載。和彫・ブラックアンドグレー・ミニマル等、全スタイル対応。口コミ・料金・空き状況をTattooBaseで確認。`,
    openGraph: {
      title: `${pref.name}のタトゥーアーティスト一覧 | TattooBase`,
      description: `${pref.name}のスタジオ${pref.studios}店・アーティスト${pref.artists}名を掲載。オンライン予約可能。`,
    },
  };
}

export default async function AreaPage({ params }: { params: Params }) {
  const { slug } = await params;
  const pref = prefFromSlug(slug);

  // JSON-LD: ItemList of local businesses
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${pref?.name ?? slug}のタトゥースタジオ一覧`,
    description: `${pref?.name ?? slug}のタトゥースタジオとアーティストを掲載。TattooBaseで口コミ・料金・空き状況を確認。`,
    url: `https://tattoobase.jp/area/${slug}`,
    numberOfItems: pref?.artists ?? 0,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      <div className="pb-20 space-y-8">
        {/* ヘッダー */}
        <div className="space-y-2">
          {/* パンくずリスト */}
          <nav className="text-xs text-neutral-500 flex items-center gap-1.5">
            <Link href="/" className="hover:text-white transition-colors">HOME</Link>
            <span>/</span>
            <Link href="/search" className="hover:text-white transition-colors">検索</Link>
            <span>/</span>
            <span className="text-neutral-300">{pref?.name ?? slug}</span>
          </nav>

          <div className="flex items-center gap-3">
            <span className="text-5xl">{pref?.emoji ?? '📍'}</span>
            <div>
              <h1 className="font-heading font-extrabold text-3xl text-white tracking-tight">
                {pref?.name ?? slug}の
                <br />タトゥーアーティスト
              </h1>
              <div className="flex items-center gap-4 mt-2 text-neutral-400 text-sm">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {pref?.studios ?? 0}スタジオ</span>
                <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5" /> {pref?.artists ?? 0}アーティスト</span>
              </div>
            </div>
          </div>
        </div>

        {/* スタイル別クイックリンク */}
        <section>
          <h2 className="font-heading font-bold text-white text-sm tracking-tight mb-3 uppercase">スタイルで絞り込む</h2>
          <div className="flex flex-wrap gap-2">
            {STYLES.map(style => (
              <Link key={style}
                href={`/search?type=artist&pref=${encodeURIComponent(pref?.name ?? slug)}&genre=${encodeURIComponent(style)}`}
                className="px-3 py-1.5 text-xs font-bold bg-neutral-900 border border-neutral-700 text-neutral-300 rounded-full hover:border-white hover:text-white transition-all">
                {style}
              </Link>
            ))}
          </div>
        </section>

        {/* アーティスト一覧へのCTA */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 text-center space-y-4">
          <p className="text-neutral-400 text-sm">
            現在 <span className="text-white font-bold">{pref?.artists ?? 0}名</span> のアーティストが登録されています
          </p>
          <Link href={`/search?type=artist&pref=${encodeURIComponent(pref?.name ?? slug)}`}
            className="inline-flex items-center gap-2 bg-white text-black font-extrabold px-8 py-3 rounded-full hover:bg-neutral-200 transition-colors">
            <Search className="w-4 h-4" />
            {pref?.name ?? slug}のアーティストを探す
          </Link>
        </section>

        {/* 他のエリアへのリンク（SEO内部リンク） */}
        <section>
          <h2 className="font-heading font-bold text-white text-sm tracking-tight mb-3 uppercase">他のエリアから探す</h2>
          <div className="grid grid-cols-2 gap-2">
            {PREFS.filter(p => p.slug !== slug).map(p => (
              <Link key={p.slug} href={`/area/${p.slug}`}
                className="flex items-center gap-3 px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl hover:border-neutral-600 transition-all group">
                <span className="text-xl">{p.emoji}</span>
                <div>
                  <p className="text-white text-sm font-bold group-hover:text-white">{p.name.replace(/都|府|道|県/, '')}</p>
                  <p className="text-neutral-600 text-xs">{p.artists}名</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
