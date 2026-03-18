'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, ChevronRight } from 'lucide-react';
import ArtistCard from '@/components/cards/ArtistCard';

const STORAGE_KEY = 'tattoobase_recently_viewed';

function getRecentlyViewed(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function recordArtistView(artistId: string) {
  if (typeof window === 'undefined') return;
  const current = getRecentlyViewed().filter(id => id !== artistId);
  const updated = [artistId, ...current].slice(0, 10);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export default function RecentlyViewedArtists({ allArtists }: { allArtists: any[] }) {
  const [recentArtists, setRecentArtists] = useState<any[]>([]);

  useEffect(() => {
    const recentIds = getRecentlyViewed();
    const matched = recentIds
      .map(id => allArtists.find((a: any) => a.id === id))
      .filter(Boolean)
      .slice(0, 5);
    setRecentArtists(matched);
  }, [allArtists]);

  if (recentArtists.length === 0) return null;

  return (
    <section className="fade-in-section opacity-0 px-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-neutral-400" />
          <h2 className="font-heading font-extrabold text-white text-base tracking-tight">最近見たアーティスト</h2>
        </div>
        <Link href="/search" className="text-[10px] font-semibold text-neutral-500 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1">
          すべて <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="flex overflow-x-auto hide-scrollbar gap-3 pb-1 -mx-4 px-4">
        {recentArtists.map((artist: any) => (
          <div key={artist.id} className="w-40 shrink-0">
            <ArtistCard artist={artist} />
          </div>
        ))}
      </div>
    </section>
  );
}
