import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PREFECTURES, getPrefectureById } from '@/lib/prefectures';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ArtistCard from '@/components/cards/ArtistCard';
import { Search } from 'lucide-react';
import Link from 'next/link';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tattoobase.jp';

// NOTE: This usually comes from the actual user-api endpoint
// Example: NEXT_PUBLIC_API_URL/user-api/artists?prefecture={name}
const fetchArtistsByPrefecture = async (prefectureName: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/user-api/artists?prefecture=${encodeURIComponent(prefectureName)}`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error('Failed to fetch artists:', error);
    return [];
  }
}

type Props = {
  params: {
    prefecture: string;
  };
};

export async function generateStaticParams() {
  return PREFECTURES.map(p => ({ prefecture: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pref = getPrefectureById(params.prefecture);
  if (!pref) return { title: 'Not Found' };

  const title = `${pref.name}のタトゥースタジオ・彫り師一覧 | TattooBase`;
  const description = `${pref.name}（${pref.region}）で活動するおすすめのタトゥーアーティスト・スタジオ一覧です。得意なスタイルや料金、口コミを確認して予約しましょう。`;

  return {
    title,
    description,
    openGraph: {
      title: `${pref.name}のタトゥーアーティスト一覧 | TattooBase`,
      description: `${pref.name}（${pref.region}）のタトゥースタジオ・アーティストを掲載。オンライン予約可能。`,
    },
  };
}

export default async function PrefectureAreaPage({ params }: Props) {
  const pref = getPrefectureById(params.prefecture);
  if (!pref) {
    notFound();
  }

  const artists = await fetchArtistsByPrefecture(pref.name);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${pref.name}のタトゥースタジオ一覧`,
    description: `${pref.name}のタトゥースタジオとアーティストを掲載。TattooBaseで口コミ・料金・空き状況を確認。`,
    url: `${BASE_URL}/area/${pref.id}`,
    numberOfItems: artists.length,
  };

  const breadcrumbs = [
    { label: 'エリア一覧', href: '/area' },
    { label: pref.name }, // Current page
  ];

  return (
    <div className="min-h-screen bg-black pb-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-7xl mx-auto px-4 pt-24">
        <Breadcrumbs items={breadcrumbs} />

        <div className="mb-10 lg:mb-16 text-center max-w-2xl mx-auto">
          <h1 className="font-heading font-extrabold text-3xl md:text-5xl text-white tracking-tight leading-tight mb-4">
            <span className="text-neutral-500 text-xl md:text-2xl block mb-2">{pref.region}</span>
            {pref.name}のタトゥースタジオ・彫り師一覧
          </h1>
          <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
            {pref.name}を拠点に活動する人気のタトゥーアーティストを探すことができます。気になるアーティストのポートフォリオをチェックして、理想のタトゥーを予約しましょう。
          </p>
        </div>

        {artists.length === 0 ? (
          <div className="py-24 text-center border border-white/5 rounded-3xl bg-neutral-900/30">
            <h2 className="text-xl font-bold text-white mb-2 tracking-tight">このエリアにはまだ登録がありません</h2>
            <p className="text-neutral-500 text-sm mb-6">
              現在、{pref.name}のタトゥーアーティストを募集中です。<br/>別のアリアから検索をお試しください。
            </p>
            <Link href="/area" className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold text-sm hover:bg-neutral-200 transition-colors">
              <Search className="w-4 h-4" />
              エリア一覧に戻る
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {artists.map((artist: any) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
