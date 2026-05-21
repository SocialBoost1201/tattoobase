'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ArtistCard from '@/components/cards/ArtistCard';
import PortfolioCard from '@/components/cards/PortfolioCard';
import SplashScreen from '@/components/ui/SplashScreen';

import HeroSection from '@/components/home/HeroSection';
import PopularGenres from '@/components/home/PopularGenres';
import TrustAndSafety from '@/components/home/TrustAndSafety';
import TattooFriendlyCrossSell from '@/components/home/TattooFriendlyCrossSell';
import AreaAndStyleDiscovery from '@/components/home/AreaAndStyleDiscovery';
import RecentlyViewedArtists from '@/components/home/RecentlyViewedArtists';
import BeginnerGuide from '@/components/home/BeginnerGuide';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

export default function HomePageClient({ artists, portfolios }: { artists: any[], portfolios: any[] }) {
  const container = useRef<HTMLDivElement>(null);
  const [isSplashDone, setIsSplashDone] = useState(false);

  useGSAP(() => {
    if (!isSplashDone) return;
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const fadeElems = gsap.utils.toArray('.fade-in-section');
      fadeElems.forEach((elem: any) => {
        gsap.from(elem, {
          scrollTrigger: { trigger: elem, start: 'top 85%', toggleActions: 'play none none reverse' },
          y: 40, opacity: 0, duration: 0.8, ease: 'power3.out'
        });
      });
    });

    // Mobile UX Audit P1-2: モーション抑制時は opacity-0 を打ち消して即可視化
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set('.fade-in-section', { opacity: 1, y: 0 });
    });
  }, { scope: container, dependencies: [isSplashDone] });

  return (
    <>
      <SplashScreen onComplete={() => setIsSplashDone(true)} />

      <div
        ref={container}
        className={`bg-black min-h-screen pb-20 -mt-6 transition-opacity duration-1000 ${
          isSplashDone ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden'
        }`}
      >
        {/* 1. Hero Section */}
        <HeroSection />

        {/* コンテンツエリア: モバイル1カラム / PC 2カラム (メイン + サイドバー) */}
        <div className="mt-8 space-y-10 md:space-y-0 md:grid md:grid-cols-[1fr_300px] md:gap-10 md:items-start">

          {/* ===== メインカラム ===== */}
          <div className="space-y-10">
            {/* 2. Popular Genres */}
            <div className="fade-in-section opacity-0">
              <PopularGenres />
            </div>

            {/* 2.5 エリア・スタイル発見 */}
            <div className="fade-in-section opacity-0">
              <AreaAndStyleDiscovery />
            </div>

            {/* 2.8 最近見たアーティスト */}
            <RecentlyViewedArtists allArtists={artists} />

            {/* 3. Featured Artists: モバイル2カラム / PC 3カラム */}
            {artists.length > 0 && (
              <section className="fade-in-section opacity-0">
                <div className="flex items-baseline justify-between mb-5">
                  <h2 className="font-heading font-extrabold text-white text-xl tracking-tight">FEATURED ARTISTS</h2>
                  <Link href="/search?type=artist" className="text-xs font-semibold text-neutral-400 hover:text-white transition-colors uppercase tracking-widest">
                    すべて見る →
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
                  {artists.slice(0, 6).map((a: any) => (
                    <ArtistCard key={a.id} artist={a} />
                  ))}
                </div>
              </section>
            )}

            {/* 4. Trending Works: モバイル3カラム / PC 4カラム */}
            {portfolios.length > 0 && (
              <section className="fade-in-section opacity-0">
                <div className="flex items-baseline justify-between mb-5">
                  <h2 className="font-heading font-extrabold text-white text-xl tracking-tight">TRENDING WORKS</h2>
                  <Link href="/search?type=portfolio" className="text-xs font-semibold text-neutral-400 hover:text-white transition-colors uppercase tracking-widest">
                    すべて見る →
                  </Link>
                </div>
                <div className="grid grid-cols-3 gap-2 md:grid-cols-4 md:gap-3">
                  {portfolios.slice(0, 8).map((w: any) => (
                    <PortfolioCard key={w.id} work={w} />
                  ))}
                </div>
              </section>
            )}

            {/* 5. Trust & Safety */}
            <div className="fade-in-section opacity-0">
              <TrustAndSafety />
            </div>

            {/* 6. Cross Sell */}
            <div className="fade-in-section opacity-0">
              <TattooFriendlyCrossSell />
            </div>
          </div>

          {/* ===== PCサイドバー（md以上で表示・sticky） ===== */}
          <aside className="hidden md:block sticky top-32 space-y-5">
            {/* 初心者ガイドウィジェット */}
            <div className="fade-in-section opacity-0">
              <BeginnerGuide />
            </div>

            {/* エリアリンク */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-3">
              <p className="text-xs font-extrabold text-neutral-500 uppercase tracking-widest">エリアから探す</p>
              <div className="space-y-1.5">
                {[
                  { label: '東京', href: '/area/tokyo' },
                  { label: '大阪', href: '/area/osaka' },
                  { label: '愛知', href: '/area/aichi' },
                  { label: '福岡', href: '/area/fukuoka' },
                  { label: '神奈川', href: '/area/kanagawa' },
                ].map(item => (
                  <Link key={item.href} href={item.href}
                    className="flex justify-between items-center py-1.5 text-sm text-neutral-300 hover:text-white transition-colors group">
                    <span>{item.label}のアーティスト</span>
                    <span className="text-neutral-600 group-hover:text-neutral-400 text-xs">→</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* スタイル別タグ */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-3">
              <p className="text-xs font-extrabold text-neutral-500 uppercase tracking-widest">スタイルから探す</p>
              <div className="flex flex-wrap gap-1.5">
                {['和彫', 'ブラックアンドグレー', 'ミニマル', 'ワンポイント', 'レタリング', 'アニメ'].map(style => (
                  <Link key={style} href={`/search?type=artist&genre=${encodeURIComponent(style)}`}
                    className="px-2.5 py-1 bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white hover:border-neutral-500 text-xs font-bold rounded-full transition-all">
                    {style}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* モバイルのみ BeginnerGuide を下部に表示 */}
        <div className="md:hidden mt-10 fade-in-section opacity-0">
          <BeginnerGuide />
        </div>
      </div>
    </>
  );
}
