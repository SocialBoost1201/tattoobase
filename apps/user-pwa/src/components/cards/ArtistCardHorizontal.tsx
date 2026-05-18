import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Star } from 'lucide-react';
import SaveButton from '@/components/ui/SaveButton';

// PC用横型ArtistCard（食べログ・Hot Pepper方式）
const STYLE_COLORS: Record<string, string> = {
  '和彫': 'from-rose-950 to-neutral-900',
  'ブラックアンドグレー': 'from-neutral-800 to-neutral-950',
  'トラディショナル': 'from-amber-950 to-neutral-900',
  'ニュースクール': 'from-purple-950 to-neutral-900',
  'ミニマル': 'from-zinc-800 to-neutral-950',
  'レタリング': 'from-slate-800 to-neutral-950',
  'アニメ': 'from-blue-950 to-neutral-900',
};

type Artist = {
  id: string;
  displayName: string;
  studio?: { name: string };
  styles?: string[];
  prefecture?: string;
  city?: string;
  priceMin?: number;
  savedCount?: number;
  reviewCount?: number;
  rating?: number;
  portfolioThumbnail?: string;
  bio?: string;
};

export default function ArtistCardHorizontal({ artist }: { artist: Artist }) {
  const initials = artist.displayName.slice(0, 2).toUpperCase();
  const primaryStyle = artist.styles?.[0] ?? '';
  const gradientClass = STYLE_COLORS[primaryStyle] ?? 'from-neutral-800 to-neutral-950';
  const location = [artist.prefecture, artist.city].filter(Boolean).join(' · ') || (artist.studio?.name ?? '—');
  const priceLabel = artist.priceMin ? `¥${artist.priceMin.toLocaleString()}〜` : 'ワンポイントからOK';

  return (
    <Link href={`/artist/${artist.id}`} className="group block">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-600 transition-all duration-300 hover:shadow-xl hover:shadow-black/30 flex">

        {/* サムネイル（左・固定幅） */}
        <div className={`relative w-40 shrink-0 bg-linear-to-br ${gradientClass} overflow-hidden`}>
          {artist.portfolioThumbnail ? (
            <Image
              src={artist.portfolioThumbnail}
              alt={`${artist.displayName}の作品`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="160px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-extrabold text-white/20 font-heading">{initials}</span>
            </div>
          )}
          {primaryStyle && (
            <div className="absolute bottom-2 left-2">
              <span className="text-xs font-extrabold uppercase px-1.5 py-0.5 bg-black/60 text-white/70 rounded-full">
                {primaryStyle}
              </span>
            </div>
          )}
        </div>

        {/* テキスト情報（右） */}
        <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-white font-bold text-base leading-tight truncate">{artist.displayName}</h3>
              <SaveButton artistId={artist.id} size="md" />
            </div>

            <div className="flex items-center gap-1.5 mt-1 text-neutral-500">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="text-xs truncate">{location}</span>
            </div>

            {/* スタイルタグ */}
            {artist.styles && artist.styles.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {artist.styles.slice(0, 4).map(s => (
                  <span key={s} className="px-2 py-0.5 text-xs font-bold bg-neutral-800 border border-neutral-700 text-neutral-400 rounded-full">
                    {s}
                  </span>
                ))}
              </div>
            )}

            {artist.bio && (
              <p className="text-neutral-500 text-xs mt-2 line-clamp-2 leading-relaxed">
                {artist.bio}
              </p>
            )}
          </div>

          {/* フッター: 評価・価格 */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-800">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-500/70 fill-amber-500/70" />
              <span className="text-white font-bold text-xs">{artist.rating ? artist.rating.toFixed(1) : '—'}</span>
              {artist.reviewCount !== undefined && (
                <span className="text-neutral-600 text-xs">({artist.reviewCount}件)</span>
              )}
            </div>
            <span className="text-white/70 text-xs font-semibold">{priceLabel}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
