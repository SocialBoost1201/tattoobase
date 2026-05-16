import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/auth';

export default async function Header() {
  let session = null;
  try {
    session = await auth();
  } catch {
    // DB not connected
  }
  const isLoggedIn = !!session?.user;

  return (
    <header className="sticky top-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/8">
      <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="TatooBase"
            width={140}
            height={36}
            className="h-8 w-auto object-contain brightness-0 invert"
            priority
          />
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            href="/facilities"
            className="text-white/60 hover:text-white transition-colors text-sm font-medium"
          >
            施設
          </Link>
          <Link
            href="/search"
            className="text-white/60 hover:text-white transition-colors text-sm font-medium"
          >
            検索
          </Link>
          {isLoggedIn ? (
            <Link
              href="/account"
              className="text-sm font-semibold glass rounded-xl px-3 py-1.5 text-white hover:bg-white/10 transition-all"
            >
              {session?.user?.email?.split('@')[0] || 'User'}
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-sm font-bold bg-white text-black rounded-xl px-3 py-1.5 hover:bg-white/90 transition-all shadow-lg shadow-white/10"
            >
              ログイン
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
