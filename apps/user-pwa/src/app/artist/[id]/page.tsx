import type { Metadata } from 'next';
import Link from 'next/link';
import ArtistDetailClient from './ArtistDetailClient';

const API = 'http://localhost:3000';

async function getArtist(id: string) {
  try {
    const res = await fetch(`${API}/user-api/artists/${id}`, { cache: 'no-store' });
    return res.ok ? res.json() : null;
  } catch { return null; }
}
async function getPortfolios() {
  try {
    const res = await fetch(`${API}/user-api/portfolios`, { cache: 'no-store' });
    return res.ok ? res.json() : [];
  } catch { return []; }
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const artist = await getArtist(id);
  if (!artist) return { title: 'TattooBase' };
  const styles = artist.styles?.join('・') ?? '';
  const location = [artist.prefecture, artist.city].filter(Boolean).join(' ');
  return {
    title: `${artist.displayName} | タトゥーアーティスト - TattooBase`,
    description: `${artist.displayName}の施術実績・口コミ・料金・空き状況はTattooBaseで確認できます。${styles ? `${styles}が得意。` : ''}${location ? `${location}のスタジオ。` : ''}`,
    openGraph: {
      title: `${artist.displayName} | TattooBase`,
      description: `${artist.displayName}のポートフォリオと予約はこちら`,
      images: artist.avatarUrl ? [artist.avatarUrl] : [],
      type: 'profile',
    },
    twitter: { card: 'summary_large_image' },
  };
}

export default async function ArtistDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let artist = null;
  let allPortfolios = [];
  
  try {
    const [artistData, portfoliosData] = await Promise.all([getArtist(id), getPortfolios()]);
    artist = artistData;
    allPortfolios = portfoliosData;
  } catch (e) {
    console.error('Failed to fetch data', e);
  }

  if (!artist) {
    return (
      <div className="py-20 text-center border-2 border-dashed border-neutral-800 rounded-xl bg-neutral-900/50">
        <p className="text-neutral-400 font-bold mb-4">アーティストが見つかりませんでした</p>
        <Link href="/search" className="inline-block px-6 py-3 bg-white text-black text-sm font-bold rounded-full hover:bg-neutral-200 transition-colors">
          検索に戻る
        </Link>
      </div>
    );
  }

  const works = allPortfolios.filter((w: { artistId: string }) => w.artistId === id);

  // JSON-LD 構造化データ（Schema.org Person）
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: artist.displayName,
    jobTitle: 'Tattoo Artist',
    image: artist.avatarUrl,
    worksFor: artist.studio ? { '@type': 'LocalBusiness', name: artist.studio.name } : undefined,
    address: artist.prefecture ? { '@type': 'PostalAddress', addressRegion: artist.prefecture, addressLocality: artist.city } : undefined,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArtistDetailClient artist={artist} works={works} />
    </>
  );
}
