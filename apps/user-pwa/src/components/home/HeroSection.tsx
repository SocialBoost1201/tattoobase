'use client';

import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Search, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const container = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  useGSAP(() => {
    // ヒーローテキストと検索バーの出現アニメーション
    gsap.from('.hero-elem', {
      y: 30,
      opacity: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: 'power3.out',
      delay: 0.2
    });
  }, { scope: container });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section ref={container} className="relative w-full h-[75vh] min-h-[500px] flex flex-col justify-end pb-16 px-4 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10s] ease-out hover:scale-105"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1590241031386-8dcb926cb170?q=80&w=2670&auto=format&fit=crop")',
          }}
        />
        {/* レイヤー化されたグラデーションオーバーレイでテキストの可読性を確保 */}
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="relative z-10 max-w-xl mx-auto w-full space-y-6">
        <div className="space-y-2">
          <p className="hero-elem text-xs font-semibold text-neutral-300 tracking-[0.2em] uppercase">
            JAPAN'S PREMIER TATTOO PLATFORM
          </p>
          <h1 className="hero-elem text-4xl md:text-5xl font-extrabold text-white leading-[1.15] font-heading tracking-tight drop-shadow-lg">
            あなたのタトゥーを、<br />ここから始める。
          </h1>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hero-elem relative mt-8 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-neutral-400 group-focus-within:text-white transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-32 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all shadow-xl"
            placeholder="スタジオ・アーティスト名で検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-2 right-2 flex items-center">
            <button 
              type="button" 
              className="flex items-center gap-1.5 px-3 py-2 bg-black/40 hover:bg-black/60 rounded-xl text-xs font-bold text-white transition-colors border border-white/10"
              onClick={() => router.push('/search')}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>現在地</span>
            </button>
          </div>
        </form>

        <div className="hero-elem flex flex-wrap gap-2 pt-2">
          <span className="text-xs text-neutral-400 py-1.5 font-medium">人気の検索:</span>
          {['和彫り', '新宿', 'ワンポイント', '韓国風'].map(tag => (
            <button key={tag} onClick={() => router.push(`/search?q=${tag}`)} className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-neutral-300 transition-colors">
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
