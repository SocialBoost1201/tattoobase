import HomePageClient from './HomePageClient';
import { API_BASE } from '@/lib/api';
import { MOCK_ARTISTS, MOCK_PORTFOLIOS } from '@/lib/mock-data';

async function getArtists() {
  try {
    const res = await fetch(`${API_BASE}/user-api/artists`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch {
    // API not available
  }
  return MOCK_ARTISTS;
}

async function getPortfolios() {
  try {
    const res = await fetch(`${API_BASE}/user-api/portfolios`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch {
    // API not available
  }
  return MOCK_PORTFOLIOS;
}

export default async function HomePage() {
  const [artists, portfolios] = await Promise.all([getArtists(), getPortfolios()]);

  return (
    <HomePageClient artists={artists} portfolios={portfolios} />
  );
}
