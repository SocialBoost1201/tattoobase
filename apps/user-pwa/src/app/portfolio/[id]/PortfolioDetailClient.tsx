'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ChevronLeft, Share2, MapPin, CalendarHeart, Maximize2, X } from 'lucide-react';
import SaveButton from '@/components/ui/SaveButton';

type Portfolio = {
  id: string;
  title: string | null;
  description: string | null;
  mediaUrls: string[];
  tags: string[];
  styleCategory: string | null;
  artist: {
    id: string;
    displayName: string;
    profileImageUrl: string | null;
  };
  studio: {
    name: string;
    prefecture: string | null;
  } | null;
};

export default function PortfolioDetailClient({ portfolio }: { portfolio: Portfolio }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const mainImage = portfolio.mediaUrls?.[0] || 'https://images.unsplash.com/photo-1611501271407-809596af55cb?q=80&w=800&auto=format&fit=crop';
  const artistInitials = portfolio.artist.displayName.slice(0, 2).toUpperCase();

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.stagger-fade', {
        y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out'
      });
    });
    // Mobile UX Audit P1-2: モーション抑制時は即可視化
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set('.stagger-fade', { opacity: 1, y: 0 });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen bg-black pb-32 md:pb-0 md:pt-24 pt-0">
      
      {/* モバイルヘッダー */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-black/50 backdrop-blur-xl z-40 border-b border-white/10 flex items-center justify-between px-4">
        <button onClick={() => window.history.back()} aria-label="戻る" className="w-11 h-11 -ml-2 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <span className="font-heading font-extrabold text-sm tracking-widest text-white/50">WORK DETAILS</span>
        <div className="w-10" />
      </header>

      <div className="max-w-7xl mx-auto px-0 md:px-6">
        <div className="flex flex-col md:flex-row md:gap-8 lg:gap-12 md:bg-neutral-900/50 md:p-6 lg:p-10 md:rounded-[2.5rem] md:border border-white/5 shadow-2xl">
          
          {/* 左カラム: メインビジュアル */}
          <div className="flex-1 w-full relative">
            {/* 戻るボタン (PC) */}
            <div className="hidden md:block mb-6 stagger-fade">
              <button onClick={() => window.history.back()} className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm font-bold">
                <ChevronLeft className="w-4 h-4" />
                <span>戻る</span>
              </button>
            </div>

            <div 
              className="relative w-full aspect-4/5 md:aspect-3/4 md:rounded-3xl overflow-hidden group cursor-zoom-in stagger-fade"
              onClick={() => setIsLightboxOpen(true)}
            >
              <Image 
                src={mainImage}
                alt={portfolio.title || 'Tattoo Work'}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              <button aria-label="全画面表示" className="absolute bottom-4 right-4 w-11 h-11 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4 text-white" />
              </button>
            </div>
            
            {/* サムネイルリスト（複数画像がある場合） */}
            {portfolio.mediaUrls?.length > 1 && (
              <div className="flex gap-2 mt-4 px-4 md:px-0 stagger-fade overflow-x-auto pb-2 scrollbar-none">
                {portfolio.mediaUrls.map((url, i) => (
                  <button 
                    key={i} 
                    onClick={() => setCurrentImageIndex(i)}
                    className={`relative w-16 h-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${currentImageIndex === i ? 'border-white opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}`}
                  >
                    <Image src={url} alt="thumbnail" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 右カラム: テキスト・アクション */}
          <div className="flex-1 px-5 py-8 md:py-16 md:px-0 flex flex-col max-w-lg mx-auto md:mx-0 w-full">
            <div className="space-y-6 flex-1">
              
              {/* スタイル & アクション */}
              <div className="flex items-start justify-between gap-4 stagger-fade">
                {portfolio.styleCategory && (
                  <span className="px-3 py-1.5 bg-white/10 text-white border border-white/20 rounded-full text-xs font-extrabold uppercase tracking-widest shrink-0">
                    {portfolio.styleCategory}
                  </span>
                )}
                <div className="flex items-center gap-2">
                  <button aria-label="共有" className="w-11 h-11 flex items-center justify-center rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <SaveButton artistId={portfolio.id} size="md" className="w-11 h-11 border-neutral-800 bg-neutral-900" />
                </div>
              </div>

              {/* タイトル & タグ */}
              <div className="stagger-fade">
                <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-4">
                  {portfolio.title || 'Untitled Work'}
                </h1>
                {portfolio.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {portfolio.tags.map(tag => (
                      <span key={tag} className="text-neutral-500 text-xs font-semibold before:content-['#']">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="h-px bg-white/10 stagger-fade" />

              {/* アーティスト情報 */}
              <Link href={`/artist/${portfolio.artist.id}`} className="group block stagger-fade">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800/50 group-hover:bg-neutral-800 group-hover:border-neutral-700 transition-all duration-300">
                  <div className="w-14 h-14 rounded-full overflow-hidden relative shrink-0 bg-neutral-800 flex items-center justify-center">
                    {portfolio.artist.profileImageUrl ? (
                      <Image src={portfolio.artist.profileImageUrl} alt="artist" fill className="object-cover" />
                    ) : (
                      <span className="text-white/50 font-heading font-extrabold">{artistInitials}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-base truncate flex items-center gap-2">
                      {portfolio.artist.displayName}
                    </h3>
                    <div className="flex items-center gap-1.5 text-neutral-500 mt-1">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-xs truncate">
                        {portfolio.studio?.name || 'Studio TBD'} 
                        {portfolio.studio?.prefecture && ` (${portfolio.studio.prefecture})`}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* 説明文 */}
              {portfolio.description && (
                <div className="stagger-fade">
                  <h4 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3">Description</h4>
                  <p className="text-neutral-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {portfolio.description}
                  </p>
                </div>
              )}

            </div>

            {/* CTAボタン (PCは右カラム下部、MobileはFloating) */}
            <div className="hidden md:block mt-12 stagger-fade">
              <Link href={`/booking/start?artistId=${portfolio.artist.id}&workId=${portfolio.id}`}
                className="w-full bg-white text-black flex items-center justify-center gap-2 py-5 rounded-full font-heading font-extrabold text-sm tracking-widest hover:bg-neutral-200 transition-colors shadow-2xl shadow-white/10">
                <CalendarHeart className="w-5 h-5 mb-0.5" />
                BOOK THIS ARTIST
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* モバイル用フローティング予約ボタン */}
      <div className="md:hidden fixed bottom-[calc(env(safe-area-inset-bottom)+20px)] left-0 right-0 px-4 z-40 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          <Link href={`/booking/start?artistId=${portfolio.artist.id}&workId=${portfolio.id}`}
            className="w-full bg-white text-black flex items-center justify-center gap-2 py-4 rounded-full font-heading font-extrabold text-sm tracking-widest shadow-2xl shadow-black">
            <CalendarHeart className="w-5 h-5 mb-0.5" />
            BOOK THIS ARTIST
          </Link>
        </div>
      </div>

      {/* ライトボックス */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-100 bg-black/95 flex items-center justify-center backdrop-blur-xl">
          <button onClick={() => setIsLightboxOpen(false)} aria-label="閉じる" className="absolute top-6 right-6 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-50">
            <X className="w-6 h-6" />
          </button>
          <div className="relative w-full h-[80vh] max-w-5xl px-4">
            <Image 
              src={portfolio.mediaUrls?.[currentImageIndex] || mainImage}
              alt="fullscreen view"
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
          {portfolio.mediaUrls?.length > 1 && (
            <div className="absolute bottom-12 left-0 right-0 flex justify-center items-center gap-8">
              <button
                onClick={() => setCurrentImageIndex(p => p > 0 ? p - 1 : portfolio.mediaUrls.length - 1)}
                aria-label="前の画像"
                className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <span className="text-white/50 font-heading font-bold text-sm tracking-widest">
                {currentImageIndex + 1} / {portfolio.mediaUrls.length}
              </span>
              <button
                onClick={() => setCurrentImageIndex(p => p < portfolio.mediaUrls.length - 1 ? p + 1 : 0)}
                aria-label="次の画像"
                className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
              >
                <ChevronLeft className="w-6 h-6 rotate-180" />
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
