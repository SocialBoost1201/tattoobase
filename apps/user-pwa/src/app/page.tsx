import HomePageClient from './HomePageClient';

const API = 'http://localhost:3000';

async function getArtists() {
  const res = await fetch(`${API}/user-api/artists`, { cache: 'no-store' });
  return res.ok ? res.json() : [];
}

async function getPortfolios() {
  const res = await fetch(`${API}/user-api/portfolios`, { cache: 'no-store' });
  return res.ok ? res.json() : [];
}

export default async function HomePage() {
  const [artists, portfolios] = await Promise.all([getArtists(), getPortfolios()]);

  return (
    <HomePageClient artists={artists} portfolios={portfolios} />
  );
}
