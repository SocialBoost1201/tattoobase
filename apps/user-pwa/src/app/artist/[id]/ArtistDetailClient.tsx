'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ChevronLeft, MapPin, Star, CalendarHeart, X } from 'lucide-react';

export default function ArtistDetailClient({ artist, works }: { artist: any, works: any[] }) {
  const [selectedWorkIndex, setSelectedWorkIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const coverImage = artist.coverImage || "https://images.unsplash.com/photo-1611501271407-809596af55cb?q=80&w=800&auto=format&fit=crop";
  const initials = artist.displayName.slice(0, 2).toUpperCase();

  useGSAP(() => {
    gsap.from('.stagger-fade', {
      y: 20,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
    });
  }, { scope: containerRef });

  useEffect(() => {
    // Lightboxオープン時はスクロールをロック
    if (selectedWorkIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedWorkIndex]);

  return (
    <div ref={containerRef} className="pb-24">
      {/* 画面上部の戻るボタン */}
      <div className="absolute top-4 left-4 z-40">
         <Link href="/search" className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-black/70 transition-colors">
           <ChevronLeft className="w-6 h-6" />
         </Link>
      </div>

      {/* カバー画像 (フル幅) */}
      <div className="-mx-4 -mt-6 h-64 relative">
        <Image src={coverImage} alt="Cover" fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
      </div>

      {/* プロフィール情報 */}
      <div className="relative -mt-12 px-2 stagger-fade">
        <div className="flex justify-between items-end mb-4">
          <div className="w-24 h-24 rounded-full bg-neutral-900 border-4 border-black flex items-center justify-center shrink-0 relative overflow-hidden shadow-2xl">
            {artist.avatarUrl ? (
              <Image src={artist.avatarUrl} alt="Avatar" fill className="object-cover" sizes="96px" />
            ) : (
              <span className="text-3xl font-extrabold text-white font-heading">{initials}</span>
            )}
          </div>
          
          <div className="flex gap-2">
            <button className="h-10 px-4 rounded-full bg-neutral-800 text-white text-sm font-bold border border-neutral-700 hover:bg-neutral-700 transition-colors">
              Message
            </button>
            <button className="w-10 h-10 rounded-full bg-neutral-800 text-white flex items-center justify-center border border-neutral-700 hover:bg-neutral-700 transition-colors">
              <Star className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div>
          <h1 className="font-heading font-extrabold text-3xl text-white leading-tight mb-1">{artist.displayName}</h1>
          <div className="flex items-center gap-2 text-neutral-400 text-sm font-medium">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="line-clamp-1">{artist.studio?.name || 'Private Studio'}</span>
          </div>
        </div>

        {/* バイオグラフィ */}
        <p className="mt-4 text-sm text-neutral-300 leading-relaxed font-medium">
          {artist.bio || 'タトゥーアーティスト。詳細な経歴やスタイルは近日公開予定です。'}
        </p>
      </div>

      <div className="h-px bg-neutral-900 my-8 stagger-fade" />

      {/* ポートフォリオグリッド (ギャラリー) */}
      <section className="stagger-fade relative z-10 px-1">
        <div className="flex items-baseline justify-between mb-4 px-1">
          <h2 className="font-heading font-extrabold text-lg text-white tracking-tight">WORKS</h2>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{works.length} pieces</span>
        </div>

        {works.length > 0 ? (
          <div className="grid grid-cols-3 gap-1 md:gap-2">
            {works.map((w: any, index: number) => {
              const img = w.mediaUrls?.[0];
              if (!img) return null;
              return (
                <button
                  key={w.id}
                  onClick={() => setSelectedWorkIndex(index)}
                  className="aspect-square relative group overflow-hidden bg-neutral-900 block w-full outline-none"
                >
                  <Image
                    src={img}
                    alt="work"
                    fill
                    sizes="33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                </button>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center border border-neutral-900 bg-neutral-900/10 rounded-xl mx-1">
            <p className="text-neutral-500 font-bold text-sm">作品が登録されていません</p>
          </div>
        )}
      </section>

      {/* スクロール追従型の予約ボタン (Floating Bottom Bar) */}
      {/* 下部のBottomNavの裏に隠れないよう、bottom値やz-indexを調整 */}
      <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+60px)] md:bottom-6 left-0 right-0 p-4 bg-linear-to-t from-black via-black/80 to-transparent pointer-events-none z-30 flex justify-center">
        <div className="w-full max-w-xl mx-auto pointer-events-auto flex">
          <Link
            href={`/booking/start?artistId=${artist.id}`}
            className="flex-1 bg-white hover:bg-neutral-200 text-black shadow-2xl shadow-white/10 outline-1 outline-white/20 font-extrabold text-sm text-center py-4 rounded-full transition-all duration-300 font-heading tracking-wide flex items-center justify-center gap-2"
          >
            <CalendarHeart className="w-5 h-5 mb-0.5" />
            BOOK APPOINTMENT
          </Link>
        </div>
      </div>

      {/* Lightbox Overlay */}
      {selectedWorkIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center backdrop-blur-xl">
          <button 
            onClick={() => setSelectedWorkIndex(null)}
            className="absolute top-6 right-6 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-60"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="relative w-full max-w-2xl flex-1 flex items-center justify-center px-4 py-20">
            {works[selectedWorkIndex].mediaUrls?.[0] && (
              <Image 
                src={works[selectedWorkIndex].mediaUrls[0]} 
                alt="Selected Work"
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            )}
          </div>
          
          <div className="absolute bottom-12 left-0 right-0 flex justify-center items-center gap-12 z-60">
             <button 
               onClick={() => setSelectedWorkIndex(prev => prev! > 0 ? prev! - 1 : works.length - 1)}
               className="p-3 font-bold text-white/50 hover:text-white transition-colors bg-white/5 rounded-full"
             >
               <ChevronLeft className="w-6 h-6" />
             </button>
             <span className="text-white/50 text-xs font-bold tracking-widest font-heading">
               {selectedWorkIndex + 1} / {works.length}
             </span>
             <button 
               onClick={() => setSelectedWorkIndex(prev => prev! < works.length - 1 ? prev! + 1 : 0)}
               className="p-3 font-bold text-white/50 hover:text-white transition-colors bg-white/5 rounded-full"
             >
               <ChevronLeft className="w-6 h-6 rotate-180" />
             </button>
          </div>
        </div>
      )}
    </div>
  );
}
