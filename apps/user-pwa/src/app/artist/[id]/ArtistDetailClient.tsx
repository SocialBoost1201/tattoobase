'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ChevronLeft, MapPin, Star, CalendarHeart, X, Bookmark, Share2, BadgeCheck, Zap, Clock, Languages, Instagram } from 'lucide-react';
import { recordArtistView } from '@/components/home/RecentlyViewedArtists';

// キャンセルポリシー
const CANCEL_POLICY = [
  { days: '7日以上前', refund: '全額返金', color: 'text-green-400' },
  { days: '3〜6日前', refund: '50%返金', color: 'text-amber-400' },
  { days: '前日・当日', refund: '返金なし', color: 'text-red-400' },
];

// 価格帯モック（APIからstyles/priceがない場合のフォールバック）
const PRICE_MOCK = [
  { label: 'ワンポイント', price: '¥10,000〜' },
  { label: 'ハーフスリーブ', price: '¥80,000〜' },
  { label: 'フルスリーブ', price: '¥200,000〜' },
];

// 今週の空き状況モック
const AVAILABILITY_MOCK = ['水', '木', '金', '土', '日', '月', '火'].map((day, i) => ({
  day,
  available: [0, 2, 3, 5].includes(i), // 水・金・土・月が空き
}));

export default function ArtistDetailClient({ artist, works }: { artist: any; works: any[] }) {
  const [selectedWorkIndex, setSelectedWorkIndex] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const coverImage = artist.coverImage || 'https://images.unsplash.com/photo-1611501271407-809596af55cb?q=80&w=800&auto=format&fit=crop';
  const initials = artist.displayName.slice(0, 2).toUpperCase();
  const styles: string[] = artist.styles ?? ['和彫', 'ブラックアンドグレー'];

  // 閲覧履歴に記録（A-3）
  useEffect(() => {
    recordArtistView(artist.id);
  }, [artist.id]);

  useGSAP(() => {
    gsap.from('.stagger-fade', {
      y: 20, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
    });
  }, { scope: containerRef });

  useEffect(() => {
    document.body.style.overflow = selectedWorkIndex !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedWorkIndex]);

  return (
    <div ref={containerRef} className="pb-32">
      {/* 戻るボタン */}
      <div className="absolute top-4 left-4 z-40 flex gap-2">
        <Link href="/search" className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-black/70 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </Link>
      </div>
      <div className="absolute top-4 right-4 z-40 flex gap-2">
        <button onClick={() => setSaved(v => !v)} className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-black/70 transition-colors">
          <Bookmark className={`w-5 h-5 ${saved ? 'fill-white' : ''}`} />
        </button>
        <button className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-black/70 transition-colors">
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* カバー画像 */}
      <div className="-mx-4 -mt-6 h-64 relative">
        <Image src={coverImage} alt="Cover" fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
      </div>

      {/* プロフィール情報 */}
      <div className="relative -mt-12 px-2 stagger-fade">
        <div className="flex justify-between items-end mb-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-neutral-900 border-4 border-black flex items-center justify-center overflow-hidden shadow-2xl">
              {artist.avatarUrl ? (
                <Image src={artist.avatarUrl} alt="Avatar" fill className="object-cover" sizes="96px" />
              ) : (
                <span className="text-3xl font-extrabold text-white font-heading">{initials}</span>
              )}
            </div>
            {/* KYC認定バッジ */}
            {artist.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center border-2 border-black">
                <BadgeCheck className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-heading font-extrabold text-3xl text-white leading-tight">{artist.displayName}</h1>
            {artist.isVerified && <BadgeCheck className="w-5 h-5 text-blue-400" />}
          </div>

          <div className="flex items-center gap-2 text-neutral-400 text-sm font-medium">
            <MapPin className="w-4 h-4 shrink-0" />
            <span>{artist.prefecture || '東京'}{artist.city ? ` · ${artist.city}` : ''} / {artist.studio?.name || 'Private Studio'}</span>
          </div>

          {/* スタイルタグ */}
          {styles.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {styles.map(s => (
                <Link key={s} href={`/search?type=artist&genre=${encodeURIComponent(s)}`}
                  className="px-3 py-1 text-[10px] font-bold bg-neutral-900 border border-neutral-700 text-neutral-300 rounded-full hover:border-neutral-400 transition-colors uppercase tracking-wider">
                  {s}
                </Link>
              ))}
            </div>
          )}

          {/* 評価・保存数 */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-white font-bold text-sm">{artist.rating?.toFixed(1) ?? '—'}</span>
              <span className="text-neutral-500 text-xs">({artist.reviewCount ?? 0}件)</span>
            </div>
            <div className="flex items-center gap-1 text-neutral-500">
              <Bookmark className="w-3.5 h-3.5" />
              <span className="text-xs">{(artist.savedCount ?? 128).toLocaleString()}人が保存</span>
            </div>
            <div className="flex items-center gap-1 text-neutral-500">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-xs">返信: 約{artist.avgResponseHours ?? 4}時間</span>
            </div>
          </div>
        </div>

        {/* バイオ */}
        <p className="mt-4 text-sm text-neutral-300 leading-relaxed font-medium">
          {artist.bio || 'タトゥーアーティスト。詳細な経歴やスタイルは近日公開予定です。'}
        </p>

        {/* 対応言語・SNS */}
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1.5 text-neutral-500 text-xs">
            <Languages className="w-3.5 h-3.5" />
            <span>{artist.languages?.join(' / ') ?? '日本語'}</span>
          </div>
          {artist.instagramHandle && (
            <a href={`https://instagram.com/${artist.instagramHandle}`} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-1.5 text-neutral-500 hover:text-white text-xs transition-colors">
              <Instagram className="w-3.5 h-3.5" />
              <span>@{artist.instagramHandle}</span>
            </a>
          )}
        </div>
      </div>

      <div className="h-px bg-neutral-900 my-6 stagger-fade" />

      {/* 今週の空き状況（A-4） */}
      <section className="stagger-fade px-2 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-neutral-400" />
          <h2 className="font-heading font-bold text-white text-sm tracking-tight">今週の空き状況</h2>
        </div>
        <div className="flex gap-2">
          {AVAILABILITY_MOCK.map(({ day, available }) => (
            <Link
              key={day}
              href={available ? `/booking/start?artistId=${artist.id}` : '#'}
              className={`flex-1 flex flex-col items-center gap-1.5 py-2.5 rounded-xl border text-[11px] font-bold transition-all ${
                available
                  ? 'border-green-800 bg-green-950/30 text-green-400 hover:bg-green-900/40'
                  : 'border-neutral-800 bg-neutral-900/20 text-neutral-700 cursor-default'
              }`}
            >
              <span>{day}</span>
              <span className="text-base leading-none">{available ? '○' : '×'}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 価格帯（B-1） */}
      <section className="stagger-fade px-2 mb-6">
        <h2 className="font-heading font-bold text-white text-sm tracking-tight mb-3">料金の目安</h2>
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl divide-y divide-neutral-800 overflow-hidden">
          {(artist.priceTiers ?? PRICE_MOCK).map((tier: { label: string; price: string }) => (
            <div key={tier.label} className="flex items-center justify-between px-4 py-3">
              <span className="text-neutral-400 text-sm">{tier.label}</span>
              <span className="text-white font-bold text-sm">{tier.price}</span>
            </div>
          ))}
        </div>
        <p className="text-neutral-600 text-[10px] mt-2 px-1">※ デザインの複雑さやサイズにより変動します。詳細はご相談ください。</p>
      </section>

      {/* キャンセルポリシー（C-4） */}
      <section className="stagger-fade px-2 mb-6">
        <h2 className="font-heading font-bold text-white text-sm tracking-tight mb-3">キャンセルポリシー</h2>
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl divide-y divide-neutral-800 overflow-hidden">
          {CANCEL_POLICY.map(({ days, refund, color }) => (
            <div key={days} className="flex items-center justify-between px-4 py-3">
              <span className="text-neutral-400 text-sm">{days}</span>
              <span className={`font-bold text-sm ${color}`}>{refund}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="h-px bg-neutral-900 my-6 stagger-fade" />

      {/* ポートフォリオグリッド */}
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
                <button key={w.id} onClick={() => setSelectedWorkIndex(index)}
                  className="aspect-square relative group overflow-hidden bg-neutral-900 block w-full outline-none">
                  <Image src={img} alt="work" fill sizes="33vw" className="object-cover transition-transform duration-500 group-hover:scale-110" />
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

      {/* フローティング予約ボタン */}
      <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+64px)] left-0 right-0 p-4 bg-linear-to-t from-black via-black/80 to-transparent pointer-events-none z-30 flex justify-center">
        <div className="w-full max-w-xl mx-auto pointer-events-auto flex gap-3">
          <button className="w-12 h-12 bg-neutral-900 border border-neutral-700 rounded-full flex items-center justify-center text-white hover:bg-neutral-800 transition-colors shrink-0">
            <Share2 className="w-5 h-5" />
          </button>
          <Link href={`/booking/start?artistId=${artist.id}`}
            className="flex-1 bg-white hover:bg-neutral-200 text-black shadow-2xl shadow-white/10 font-extrabold text-sm text-center py-4 rounded-full transition-all duration-300 font-heading tracking-wide flex items-center justify-center gap-2">
            <CalendarHeart className="w-5 h-5 mb-0.5" />
            BOOK APPOINTMENT
          </Link>
        </div>
      </div>

      {/* Lightbox */}
      {selectedWorkIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center backdrop-blur-xl">
          <button onClick={() => setSelectedWorkIndex(null)}
            className="absolute top-6 right-6 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-60">
            <X className="w-6 h-6" />
          </button>
          <div className="relative w-full max-w-2xl flex-1 flex items-center justify-center px-4 py-20">
            {works[selectedWorkIndex].mediaUrls?.[0] && (
              <Image src={works[selectedWorkIndex].mediaUrls[0]} alt="Selected Work" fill className="object-contain" sizes="100vw" priority />
            )}
          </div>
          <div className="absolute bottom-12 left-0 right-0 flex justify-center items-center gap-12 z-60">
            <button onClick={() => setSelectedWorkIndex(prev => prev! > 0 ? prev! - 1 : works.length - 1)}
              className="p-3 font-bold text-white/50 hover:text-white transition-colors bg-white/5 rounded-full">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <span className="text-white/50 text-xs font-bold tracking-widest font-heading">
              {selectedWorkIndex + 1} / {works.length}
            </span>
            <button onClick={() => setSelectedWorkIndex(prev => prev! < works.length - 1 ? prev! + 1 : 0)}
              className="p-3 font-bold text-white/50 hover:text-white transition-colors bg-white/5 rounded-full">
              <ChevronLeft className="w-6 h-6 rotate-180" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
