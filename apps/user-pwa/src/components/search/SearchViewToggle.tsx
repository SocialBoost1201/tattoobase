'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { LayoutGrid, Map } from 'lucide-react';
import ArtistCard from '@/components/cards/ArtistCard';
import Link from 'next/link';
import type { ArtistPin } from '@/components/map/ArtistMap';

// LeafletはSSRで動かないためdynamic importで回避
const ArtistMap = dynamic(() => import('@/components/map/ArtistMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[60vh] w-full rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
      <div className="text-neutral-500 text-sm font-bold animate-pulse">地図を読み込み中...</div>
    </div>
  ),
});

// アーティストデータにモック座標を付与（APIが緯度経度を返すまでの仮データ）
const PREF_CENTER: Record<string, [number, number]> = {
  '東京都': [35.6762, 139.6503],
  '大阪府': [34.6937, 135.5023],
  '愛知県': [35.1802, 136.9066],
  '福岡県': [33.5904, 130.4017],
  '北海道': [43.0642, 141.3469],
  '神奈川県': [35.4478, 139.6425],
  '京都府': [35.0116, 135.7681],
  '兵庫県': [34.6913, 135.1830],
};

function toArtistPins(artists: any[]): ArtistPin[] {
  return artists.map((a, i) => {
    const base = PREF_CENTER[a.prefecture ?? '東京都'] ?? [35.6762, 139.6503];
    // ランダム散布（APIが実座標を返すまでのモック）
    const lat = a.lat ?? (base[0] + (Math.random() - 0.5) * 0.08);
    const lng = a.lng ?? (base[1] + (Math.random() - 0.5) * 0.12);
    return { ...a, lat, lng };
  });
}

type Props = {
  artists: any[];
  pref: string;
  genre: string;
};

export default function SearchViewToggle({ artists, pref, genre }: Props) {
  const [view, setView] = useState<'list' | 'map'>('list');

  // フィルター変更時はリストに戻す
  useEffect(() => { setView('list'); }, [pref, genre]);

  const mapCenter: [number, number] = PREF_CENTER[pref] ?? [35.6762, 139.6503];
  const pins = toArtistPins(artists);

  return (
    <div className="space-y-4">
      {/* リスト/マップ切り替えバー */}
      <div className="flex items-center justify-between">
        <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest">
          {artists.length} artists found
          {pref && <span className="ml-2 text-neutral-600">({pref})</span>}
        </p>

        <div className="bg-neutral-900 border border-neutral-800 p-1 rounded-xl flex gap-1">
          <button
            onClick={() => setView('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              view === 'list' ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            リスト
          </button>
          <button
            onClick={() => setView('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              view === 'map' ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            地図
          </button>
        </div>
      </div>

      {/* リストビュー */}
      {view === 'list' && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 md:gap-4">
          {artists.map((a: any) => (
            <ArtistCard key={a.id} artist={a} />
          ))}
        </div>
      )}

      {/* 地図ビュー */}
      {view === 'map' && (
        <div className="space-y-3">
          <ArtistMap artists={pins} center={mapCenter} height="65vh" />
          <p className="text-neutral-600 text-[10px] text-center">
            ピンをタップするとアーティスト情報が表示されます
          </p>
        </div>
      )}

      {/* 結果0件 */}
      {artists.length === 0 && (
        <div className="py-24 text-center border border-neutral-900 rounded-2xl bg-neutral-900/20">
          <p className="text-neutral-500 text-sm font-bold">該当するアーティストが見つかりませんでした</p>
          <Link href="/search" className="mt-4 inline-block text-xs text-neutral-500 hover:text-white underline transition-colors">
            条件をリセット
          </Link>
        </div>
      )}
    </div>
  );
}
