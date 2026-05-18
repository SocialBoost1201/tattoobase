import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Star, Bookmark } from 'lucide-react';
import SaveButton from '@/components/ui/SaveButton';

// スタイルごとのアクセントカラー（写真がない場合のグラデーション）
const STYLE_COLORS: Record<string, string> = {
  '和彫':                 'from-rose-950 to-neutral-900',
  'ブラックアンドグレー': 'from-neutral-800 to-neutral-950',
  'トラディショナル':     'from-amber-950 to-neutral-900',
  'ニュースクール':       'from-purple-950 to-neutral-900',
  'ミニマル':             'from-zinc-800 to-neutral-950',
  'レタリング':           'from-slate-800 to-neutral-950',
  'アニメ':               'from-blue-950 to-neutral-900',
};

type Artist = {
  id: string;
  displayName: string;
  studio?: { name: string };
  // リッチ情報（APIが提供しない場合はモック）
  styles?: string[];
  prefecture?: string;
  city?: string;
  priceMin?: number;
  priceMax?: number;
  savedCount?: number;
  reviewCount?: number;
  rating?: number;
  portfolioThumbnail?: string;
};

export default function ArtistCard({ artist }: { artist: Artist }) {
  const initials = artist.displayName.slice(0, 2).toUpperCase();
  const primaryStyle = artist.styles?.[0] ?? '';
  const gradientClass = STYLE_COLORS[primaryStyle] ?? 'from-neutral-800 to-neutral-950';
  const location = [artist.prefecture, artist.city].filter(Boolean).join(' · ') || (artist.studio?.name ? '詳細はプロフィールへ' : '—');
  const priceLabel = artist.priceMin
    ? `¥${artist.priceMin.toLocaleString()}〜`
    : 'ワンポイントからOK';

  return (
    <Link href={`/artist/${artist.id}`} className="group block">
      <div className="bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 hover:border-neutral-600 transition-all duration-500 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50">

        {/* サムネイル部分 */}
        <div className={`aspect-4/3 relative bg-linear-to-br ${gradientClass} overflow-hidden`}>
          {artist.portfolioThumbnail ? (
            <Image
              src={artist.portfolioThumbnail}
              alt={`${artist.displayName}の作品`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          ) : (
            /* 写真がない場合: 頭文字 + スタイルカラーグラデーション */
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <span className="text-4xl font-extrabold text-white/20 font-heading tracking-tight group-hover:text-white/30 transition-colors duration-500">
                {initials}
              </span>
              {primaryStyle && (
                <span className="text-xs font-bold text-white/30 uppercase tracking-widest">
                  {primaryStyle}
                </span>
              )}
            </div>
          )}

          {/* 保存ボタン（右上） */}
          <SaveButton
            artistId={artist.id}
            size="sm"
            className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100"
          />

          {/* スタイルバッジ（左上） */}
          {primaryStyle && (
            <div className="absolute top-2.5 left-2.5">
              <span className="text-xs font-extrabold uppercase tracking-widest px-2 py-1 bg-black/60 backdrop-blur-sm text-white/80 rounded-full">
                {primaryStyle}
              </span>
            </div>
          )}

          {/* ホバー時のオーバーレイ */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* 情報部分 */}
        <div className="p-3 space-y-2 bg-neutral-900 group-hover:bg-neutral-800/50 transition-colors duration-500">
          {/* 名前 */}
          <p className="text-white font-bold text-sm truncate leading-tight">
            {artist.displayName}
          </p>

          {/* エリア */}
          <div className="flex items-center gap-1 text-neutral-400">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="text-xs truncate">{location}</span>
          </div>

          {/* 価格帯 */}
          <p className="text-xs text-neutral-400">
            <span className="text-white/80 font-semibold">{priceLabel}</span>
          </p>

          {/* 評価 + 保存数 */}
          <div className="flex items-center justify-between pt-1 border-t border-neutral-800">
            <div className="flex items-center gap-1 text-neutral-500">
              <Star className="w-3 h-3 text-amber-500/60" />
              <span className="text-xs font-semibold">
                {artist.rating ? artist.rating.toFixed(1) : '—'}
              </span>
              {artist.reviewCount !== undefined && (
                <span className="text-xs text-neutral-600">({artist.reviewCount}件)</span>
              )}
            </div>
            {artist.savedCount !== undefined && (
              <div className="flex items-center gap-1 text-neutral-600">
                <Bookmark className="w-3 h-3" />
                <span className="text-xs">{artist.savedCount.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
