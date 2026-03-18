import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/auth';
import { Search, Sparkles, BookOpen, MapPin, Menu } from 'lucide-react';

const PC_NAV = [
  { href: '/search?type=artist', label: 'アーティストを探す' },
  { href: '/search?type=portfolio', label: '作品を見る' },
  { href: '/facilities', label: 'スタジオ・施設' },
  { href: '/guide/beginner', label: '初めての方へ' },
];

export default async function Header() {
  let session = null;
  try {
    session = await auth();
  } catch (e) {
    console.warn('Auth is temporarily disabled (DB not connected):', e);
  }
  const isLoggedIn = !!session?.user;

  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-neutral-900">
      {/* ===== デスクトップヘッダー ===== */}
      <div className="hidden md:block">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-8">
          {/* ロゴ */}
          <Link href="/" className="shrink-0">
            <Image
              src="/logo.png"
              alt="TattooBase"
              width={140}
              height={36}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>

          {/* PCナビゲーション */}
          <nav className="flex items-center gap-6 flex-1">
            {PC_NAV.map(item => (
              <Link key={item.href} href={item.href}
                className="text-neutral-400 hover:text-white text-sm font-semibold transition-colors whitespace-nowrap">
                {item.label}
              </Link>
            ))}
          </nav>

          {/* PC検索バー */}
          <Link
            href="/search"
            className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 rounded-full pl-4 pr-6 py-2 transition-all group w-64 shrink-0"
          >
            <Search className="w-4 h-4 text-neutral-500 group-hover:text-neutral-300 shrink-0" />
            <span className="text-neutral-500 group-hover:text-neutral-300 text-sm">アーティストを検索...</span>
          </Link>

          {/* PC ログイン / ユーザー */}
          {isLoggedIn ? (
            <Link href="/account"
              className="shrink-0 flex items-center gap-2 text-sm font-bold text-black bg-white rounded-full px-4 py-2 hover:bg-neutral-200 transition-colors">
              {session?.user?.email?.split('@')[0] || 'User'}
            </Link>
          ) : (
            <Link href="/login"
              className="shrink-0 text-sm font-bold text-black bg-white rounded-full px-4 py-2 hover:bg-neutral-200 transition-colors">
              ログイン / 新規登録
            </Link>
          )}
        </div>

        {/* PC サブナビ（エリア・スタイル早見） */}
        <div className="max-w-7xl mx-auto px-6 h-9 flex items-center gap-6 border-t border-neutral-900/60 overflow-x-auto hide-scrollbar">
          {['東京', '大阪', '愛知', '福岡', '北海道'].map(area => (
            <Link key={area} href={`/area/${area === '東京' ? 'tokyo' : area === '大阪' ? 'osaka' : area === '愛知' ? 'aichi' : area === '福岡' ? 'fukuoka' : 'hokkaido'}`}
              className="flex items-center gap-1 text-[11px] font-bold text-neutral-500 hover:text-white whitespace-nowrap transition-colors">
              <MapPin className="w-2.5 h-2.5" />{area}
            </Link>
          ))}
          <div className="w-px h-3 bg-neutral-800 mx-1" />
          {['和彫', 'ブラックアンドグレー', 'ミニマル', 'ワンポイント', 'レタリング'].map(style => (
            <Link key={style} href={`/search?type=artist&genre=${encodeURIComponent(style)}`}
              className="text-[11px] font-bold text-neutral-500 hover:text-white whitespace-nowrap transition-colors">
              {style}
            </Link>
          ))}
          <div className="flex-1" />
          <Link href="/guide/beginner"
            className="flex items-center gap-1 text-[11px] font-bold text-neutral-500 hover:text-white whitespace-nowrap transition-colors">
            <BookOpen className="w-2.5 h-2.5" />初めての方
          </Link>
        </div>
      </div>

      {/* ===== モバイルヘッダー ===== */}
      <div className="md:hidden">
        {/* 1行目: ロゴ + ナビ */}
        <div className="max-w-xl mx-auto px-4 h-12 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="TattooBase"
              width={130}
              height={32}
              className="h-7 w-auto object-contain"
              priority
            />
          </Link>
          <nav className="flex items-center gap-3">
            <Link href="/facilities" className="text-neutral-400 hover:text-white transition-colors text-xs font-semibold tracking-widest uppercase">
              施設
            </Link>
            {isLoggedIn ? (
              <Link href="/account"
                className="text-xs font-bold text-black bg-white rounded-full px-3 py-1.5 hover:bg-neutral-200 transition-colors">
                {session?.user?.email?.split('@')[0] || 'User'}
              </Link>
            ) : (
              <Link href="/login"
                className="text-xs font-bold text-black bg-white rounded-full px-3 py-1.5 hover:bg-neutral-200 transition-colors">
                ログイン
              </Link>
            )}
          </nav>
        </div>

        {/* 2行目: 検索バー */}
        <div className="max-w-xl mx-auto px-4 pb-2.5">
          <Link
            href="/search"
            className="flex items-center gap-3 w-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 rounded-full px-4 py-2.5 transition-all group"
          >
            <Search className="w-4 h-4 text-neutral-500 group-hover:text-neutral-300 transition-colors shrink-0" />
            <span className="text-neutral-500 group-hover:text-neutral-300 text-sm transition-colors">
              アーティスト・スタイルを検索...
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
