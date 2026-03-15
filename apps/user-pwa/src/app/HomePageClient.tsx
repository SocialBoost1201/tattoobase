'use client';

import { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroCanvas from '@/components/ui/HeroCanvas';
import ArtistCard from '@/components/cards/ArtistCard';
import PortfolioCard from '@/components/cards/PortfolioCard';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

const ENTRY_CARDS = [
  { href: '/search', label: 'エリアで探す', desc: '近くのスタジオを検索' },
  { href: '/search?type=artist', label: 'アーティストで探す', desc: 'スタイル・ジャンルで絞り込み' },
  { href: '/search?type=portfolio', label: '作品から探す', desc: '気になる作品からアーティストへ' },
];

export default function HomePageClient({ artists, portfolios }: { artists: any[], portfolios: any[] }) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // ヒーローセクションのフェードイン＆下からのスライド
    gsap.from('.hero-text', {
      y: 30,
      opacity: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: 'power3.out',
      delay: 0.1
    });

    // 検索導線カードのスタッガーアニメーション
    gsap.from('.entry-card', {
      y: 20,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out',
      delay: 0.6
    });

    // スクロール連動のアニメーション (Artists)
    gsap.from('.section-artists', {
      scrollTrigger: {
        trigger: '.section-artists',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      y: 40,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });

    // スクロール連動のアニメーション (Works)
    gsap.from('.section-works', {
      scrollTrigger: {
        trigger: '.section-works',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      y: 40,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });
  }, { scope: container });

  return (
    <>
      <HeroCanvas />
      <div ref={container} className="space-y-12 relative z-10 pt-2">
        {/* ヒーロー */}
        <section className="pt-8 pb-4">
        <p className="hero-text text-xs font-semibold text-neutral-400 tracking-widest uppercase mb-3">
          Find Your Artist. Book Your Ink.
        </p>
        <h1 className="hero-text text-4xl font-extrabold text-white leading-[1.15] font-heading tracking-tight">
          あなたの<br />タトゥーを、<br />ここから始める。
        </h1>
        <div className="hero-text mt-5 h-[2px] w-12 bg-white" />
      </section>

      {/* 検索導線 */}
      <section className="space-y-3">
        {ENTRY_CARDS.map((card, i) => (
          <Link key={card.href} href={card.href}
            className="entry-card flex items-center justify-between bg-neutral-900 border border-neutral-800 hover:border-neutral-600 rounded-xl px-5 py-4 transition-all duration-300 group"
          >
            <div>
              <p className="font-semibold text-white text-[15px] group-hover:underline">{card.label}</p>
              <p className="text-neutral-400 text-xs mt-1">{card.desc}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-neutral-600 font-heading">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-white transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
        ))}
      </section>

      {/* Featured Artists */}
      {artists.length > 0 && (
        <section className="section-artists pt-4">
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="font-heading font-extrabold text-white text-xl tracking-tight">ARTISTS</h2>
            <Link href="/search" className="text-[11px] font-semibold text-neutral-400 hover:text-white transition-colors uppercase tracking-widest">
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

      {/* Recent Works */}
      {portfolios.length > 0 && (
        <section className="section-works pt-4">
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="font-heading font-extrabold text-white text-xl tracking-tight">WORKS</h2>
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
    </div>
    </>
  );
}
