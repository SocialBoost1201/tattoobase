import Link from 'next/link';
import ArtistDetailClient from './ArtistDetailClient';

const API = 'http://localhost:3000';

async function getArtist(id: string) {
  const res = await fetch(`${API}/user-api/artists/${id}`, { cache: 'no-store' });
  return res.ok ? res.json() : null;
}
async function getPortfolios() {
  const res = await fetch(`${API}/user-api/portfolios`, { cache: 'no-store' });
  return res.ok ? res.json() : [];
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

  return <ArtistDetailClient artist={artist} works={works} />;
}
