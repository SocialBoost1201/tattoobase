'use client';

import { useState, useEffect } from 'react';
import { useSavedArtists } from '@/hooks/useSavedArtists';
import ArtistCardHorizontal from '@/components/cards/ArtistCardHorizontal';
import ArtistCard from '@/components/cards/ArtistCard';
import { Bookmark, Search } from 'lucide-react';
import Link from 'next/link';

export default function SavedArtistsClient() {
  const { getAllSaved, mounted } = useSavedArtists();
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mounted) return;
    
    const ids = getAllSaved();
    if (ids.length === 0) {
      setArtists([]);
      setLoading(false);
      return;
    }

    const fetchSaved = async () => {
      try {
        const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const res = await fetch(`${API}/user-api/artists?ids=${ids.join(',')}`);
        if (res.ok) {
          const data = await res.json();
          setArtists(data);
        }
      } catch (err) {
        console.error('Failed to fetch saved artists:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, [mounted, getAllSaved]);

  if (!mounted || loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin mb-4" />
        <p className="text-neutral-500 font-bold text-sm">読み込み中...</p>
      </div>
    );
  }

  if (artists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center mb-6 border border-neutral-800 shadow-2xl">
          <Bookmark className="w-8 h-8 text-neutral-600" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2 tracking-tight">保存したアーティストがいません</h2>
        <p className="text-neutral-500 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
          気になるアーティストや作品を見つけたら、ブックマークアイコンをタップして保存しましょう。
        </p>
        <Link 
          href="/search"
          className="flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold text-sm tracking-widest hover:bg-neutral-200 transition-colors shadow-2xl shadow-white/10"
        >
          <Search className="w-4 h-4" />
          アーティストを探す
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
          <Bookmark className="w-4 h-4" />
          Saved Artists
        </h2>
        <span className="text-neutral-500 text-xs font-bold">{artists.length}件</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {artists.map(artist => (
          <div key={artist.id}>
            {/* PC向けには横型、モバイル向けには縦型を表示 */}
            <div className="hidden md:block">
              <ArtistCardHorizontal artist={artist} />
            </div>
            <div className="md:hidden">
              <ArtistCard artist={artist} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
