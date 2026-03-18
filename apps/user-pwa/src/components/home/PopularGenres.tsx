'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const GENRES = [
  { name: '和彫り', count: '124', image: 'https://images.unsplash.com/photo-1568515387631-8b650a34644a?q=80&w=800&auto=format&fit=crop' },
  { name: 'ブラックアンドグレー', count: '89', image: 'https://images.unsplash.com/photo-1611501275019-9b5cda99408b?q=80&w=800&auto=format&fit=crop' },
  { name: 'ミニマル', count: '56', image: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?q=80&w=800&auto=format&fit=crop' },
  { name: 'アメリカン・トラディショナル', count: '42', image: 'https://images.unsplash.com/photo-1550686906-c1d43ebfe3f4?q=80&w=800&auto=format&fit=crop' },
  { name: 'レタリング', count: '38', image: 'https://images.unsplash.com/photo-1612450410756-3bb8cce8b335?q=80&w=800&auto=format&fit=crop' },
];

export default function PopularGenres() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-6 overflow-hidden">
      <div className="flex items-baseline justify-between mb-4 px-2">
        <h2 className="font-heading font-extrabold text-white text-xl tracking-tight">POPULAR STYLES</h2>
        <Link href="/search?type=artist" className="text-[11px] font-semibold text-neutral-400 hover:text-white transition-colors uppercase tracking-widest">
          すべて見る →
        </Link>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar px-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {GENRES.map((g, i) => (
          <Link 
            key={i} 
            href={`/search?type=artist&genre=${encodeURIComponent(g.name)}`}
            className="relative flex-none w-[140px] h-[180px] rounded-2xl overflow-hidden snap-start group"
          >
            <Image 
              src={g.image} 
              alt={g.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="140px"
            />
            <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/20 to-black/80" />
            <div className="absolute inset-x-0 bottom-0 p-3 flex flex-col justify-end">
              <span className="text-white font-bold text-sm leading-tight drop-shadow-md">{g.name}</span>
              <span className="text-neutral-300 text-[10px] mt-0.5">{g.count} Artists</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
