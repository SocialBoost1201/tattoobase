import Link from 'next/link';
import { MapPin, Palette } from 'lucide-react';

const AREAS = [
  { label: '東京', pref: '東京都', emoji: '🗼' },
  { label: '大阪', pref: '大阪府', emoji: '🏯' },
  { label: '名古屋', pref: '愛知県', emoji: '🌃' },
  { label: '福岡', pref: '福岡県', emoji: '🌉' },
  { label: '札幌', pref: '北海道', emoji: '❄️' },
  { label: '横浜', pref: '神奈川県', emoji: '🚢' },
  { label: '京都', pref: '京都府', emoji: '⛩️' },
];

const STYLE_TILES = [
  { style: '和彫', desc: '龍・鯉・花魁', color: 'from-rose-950 to-neutral-900', img: 'https://images.unsplash.com/photo-1598371839696-5e5bb00b0e59?q=80&w=300&auto=format&fit=crop' },
  { style: 'ブラックアンドグレー', desc: '陰影の芸術', color: 'from-neutral-800 to-neutral-950', img: 'https://images.unsplash.com/photo-1643916295551-40eebb40dbbe?q=80&w=300&auto=format&fit=crop' },
  { style: 'トラディショナル', desc: '王道の配色', color: 'from-amber-950 to-neutral-900', img: 'https://images.unsplash.com/photo-1589178233405-b0d3bbba1c17?q=80&w=300&auto=format&fit=crop' },
  { style: 'ミニマル', desc: 'シンプルな美学', color: 'from-zinc-800 to-neutral-950', img: 'https://images.unsplash.com/photo-1562916174-a0f12da31888?q=80&w=300&auto=format&fit=crop' },
];

export default function AreaAndStyleDiscovery() {
  return (
    <div className="space-y-8">
      {/* エリア別ショートカット */}
      <section>
        <div className="flex items-center justify-between mb-4 px-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-neutral-400" />
            <h2 className="font-heading font-extrabold text-white text-base tracking-tight">エリアから探す</h2>
          </div>
          <Link href="/search" className="text-xs font-semibold text-neutral-500 hover:text-white transition-colors uppercase tracking-widest">
            すべて →
          </Link>
        </div>
        
        <div className="flex overflow-x-auto hide-scrollbar gap-3 px-4 pb-1">
          {AREAS.map((area) => (
            <Link
              key={area.pref}
              href={`/search?pref=${encodeURIComponent(area.pref)}`}
              className="flex flex-col items-center gap-2 shrink-0 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 group-hover:border-neutral-600 flex items-center justify-center text-2xl transition-all duration-300 group-hover:scale-105 group-hover:bg-neutral-800">
                {area.emoji}
              </div>
              <span className="text-xs font-semibold text-neutral-400 group-hover:text-white transition-colors">
                {area.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* スタイル別ピックアップ */}
      <section>
        <div className="flex items-center justify-between mb-4 px-4">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-neutral-400" />
            <h2 className="font-heading font-extrabold text-white text-base tracking-tight">スタイルから探す</h2>
          </div>
          <Link href="/search?type=portfolio" className="text-xs font-semibold text-neutral-500 hover:text-white transition-colors uppercase tracking-widest">
            作品を見る →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 px-4">
          {STYLE_TILES.map((tile) => (
            <Link
              key={tile.style}
              href={`/search?type=artist&genre=${encodeURIComponent(tile.style)}`}
              className="group relative aspect-3/2 rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-neutral-600 transition-all duration-300"
            >
              {/* 背景画像 */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url(${tile.img})` }}
              />
              {/* グラデーションオーバーレイ */}
              <div className={`absolute inset-0 bg-linear-to-t ${tile.color} opacity-70 group-hover:opacity-50 transition-opacity`} />
              
              {/* テキスト */}
              <div className="absolute inset-x-0 bottom-0 p-3">
                <p className="text-white font-extrabold text-sm leading-tight">{tile.style}</p>
                <p className="text-white/60 text-xs mt-0.5">{tile.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
