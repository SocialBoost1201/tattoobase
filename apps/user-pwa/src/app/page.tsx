import HomePageClient from './HomePageClient';

const API = 'http://localhost:3000';

async function getArtists() {
  try {
    const res = await fetch(`${API}/user-api/artists`, { cache: 'no-store' });
    return res.ok ? res.json() : [];
  } catch (e) {
    console.warn('Backend API not available:', e);
    return [];
  }
}

async function getPortfolios() {
  try {
    const res = await fetch(`${API}/user-api/portfolios`, { cache: 'no-store' });
    return res.ok ? res.json() : [];
  } catch (e) {
    return [];
  }
}

export default async function HomePage() {
  const [artists, portfolios] = await Promise.all([getArtists(), getPortfolios()]);

  return (
    <HomePageClient artists={artists} portfolios={portfolios} />
  );
}
