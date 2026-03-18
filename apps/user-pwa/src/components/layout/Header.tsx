import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/auth';
import { Search } from 'lucide-react';

export default async function Header() {
  let session = null;
  try {
    session = await auth();
  } catch (e) {
    console.warn('Auth is temporarily disabled (DB not connected):', e);
  }
  const isLoggedIn = !!session?.user;

  return (
    <header className="sticky top-0 z-50 bg-black border-b border-neutral-900">
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
              className="text-xs font-bold text-black bg-white rounded-full px-3 py-1.5 hover:bg-neutral-200 transition-colors"
            >
              {session?.user?.email?.split('@')[0] || 'User'}
            </Link>
          ) : (
            <Link href="/login"
              className="text-xs font-bold text-black bg-white rounded-full px-3 py-1.5 hover:bg-neutral-200 transition-colors"
            >
              ログイン
            </Link>
          )}
        </nav>
      </div>

      {/* 2行目: 検索バー（Hot Pepper方式 — 全ページ固定） */}
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
    </header>
  );
}
