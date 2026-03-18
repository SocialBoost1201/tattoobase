'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ArtistCard from '@/components/cards/ArtistCard';
import PortfolioCard from '@/components/cards/PortfolioCard';
import SplashScreen from '@/components/ui/SplashScreen';

// 新規コンポーネント
import HeroSection from '@/components/home/HeroSection';
import PopularGenres from '@/components/home/PopularGenres';
import TrustAndSafety from '@/components/home/TrustAndSafety';
import TattooFriendlyCrossSell from '@/components/home/TattooFriendlyCrossSell';
import BeginnerGuide from '@/components/home/BeginnerGuide';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

export default function HomePageClient({ artists, portfolios }: { artists: any[], portfolios: any[] }) {
  const container = useRef<HTMLDivElement>(null);
  const [isSplashDone, setIsSplashDone] = useState(false);

  useGSAP(() => {
    // スプラッシュが完了するまで本文のアニメーションは待機
    if (!isSplashDone) return;

    // 汎用フェードイン
    const fadeElems = gsap.utils.toArray('.fade-in-section');
    fadeElems.forEach((elem: any) => {
      gsap.from(elem, {
        scrollTrigger: {
          trigger: elem,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });
    });

    // ヒーローセクションのアニメーション（ヒーロー側は別コンポーネント内だが、
    // もし親で制御が必要ならここで発火させる等の連携も可能）
  }, { scope: container, dependencies: [isSplashDone] });

  return (
    <>
      <SplashScreen onComplete={() => setIsSplashDone(true)} />
      
      {/* スプラッシュスクリーンが消えるまではスクロールを抑制し、裏に隠しておく */}
      <div 
        ref={container} 
        className={`bg-black min-h-screen pb-20 -mt-6 transition-opacity duration-1000 ${
          isSplashDone ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden'
        }`}
      >
        {/* 1. Hero Section (検索バー含むファーストビュー) */}
        <HeroSection />

        {/* トップページのコンテンツは max-w-xl (+モバイルフル幅調整) の中に配置 */}
        <div className="max-w-xl mx-auto space-y-10 mt-8">
          
          {/* 2. Popular Styles / Genres (横スクロール) */}
          <div className="fade-in-section opacity-0">
            <PopularGenres />
          </div>

          {/* 3. Featured Artists (ピックアップ) */}
          {artists.length > 0 && (
            <section className="fade-in-section opacity-0 px-4 pt-2">
              <div className="flex items-baseline justify-between mb-5">
                <h2 className="font-heading font-extrabold text-white text-xl tracking-tight">FEATURED ARTISTS</h2>
                <Link href="/search?type=artist" className="text-[11px] font-semibold text-neutral-400 hover:text-white transition-colors uppercase tracking-widest">
                  すべて見る →
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {artists.slice(0, 4).map((a: any) => (
                  <ArtistCard key={a.id} artist={a} />
                ))}
              </div>
            </section>
          )}

          {/* 4. Trust & Safety (安心感の醸成) */}
          <div className="fade-in-section opacity-0">
            <TrustAndSafety />
          </div>

          {/* 5. Trending Works (タイル状ギャラリー) */}
          {portfolios.length > 0 && (
            <section className="fade-in-section opacity-0 px-4">
              <div className="flex items-baseline justify-between mb-5">
                <h2 className="font-heading font-extrabold text-white text-xl tracking-tight">TRENDING WORKS</h2>
                <Link href="/search?type=portfolio" className="text-[11px] font-semibold text-neutral-400 hover:text-white transition-colors uppercase tracking-widest">
                  すべて見る →
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                {portfolios.slice(0, 6).map((w: any) => (
                  <PortfolioCard key={w.id} work={w} />
                ))}
              </div>
            </section>
          )}

          {/* 6. Tattoo Friendly Cross Sell (温泉・サウナ) */}
          <div className="fade-in-section opacity-0">
            <TattooFriendlyCrossSell />
          </div>

          {/* 7. Beginner's Guide (コンテンツ) */}
          <div className="fade-in-section opacity-0">
            <BeginnerGuide />
          </div>
        </div>
      </div>
    </>
  );
}
