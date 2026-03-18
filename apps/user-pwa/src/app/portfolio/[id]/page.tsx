import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import PortfolioDetailClient from './PortfolioDetailClient';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function getPortfolio(id: string) {
  try {
    const res = await fetch(`${API}/user-api/portfolios/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const item = await getPortfolio(id);
  if (!item) return { title: 'Not Found | TattooBase' };
  
  return {
    title: `${item.title || 'Portfolio'} | TattooBase`,
    description: item.description || `${item.artist?.displayName}の作品`,
  };
}

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const portfolio = await getPortfolio(id);

  if (!portfolio) {
    notFound();
  }

  return <PortfolioDetailClient portfolio={portfolio} />;
}

