import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/auth';

export default async function Header() {
  let session = null;
  try {
    session = await auth();
  } catch (e) {
    console.warn('Auth is temporarily disabled (DB not connected):', e);
  }
  const isLoggedIn = !!session?.user;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#e0e0e0]" style={{ borderTop: '3px solid #0a0a0a' }}>
      <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="TatooBase"
            width={140}
            height={36}
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>
        <nav className="flex items-center gap-3">
          <Link href="/facilities" className="text-[#6b6b6b] hover:text-[#0a0a0a] transition-colors text-sm font-medium">
            施設
          </Link>
          <Link href="/search" className="text-[#6b6b6b] hover:text-[#0a0a0a] transition-colors text-sm font-medium">
            検索
          </Link>
          {isLoggedIn ? (
            <Link href="/account"
              className="text-sm font-semibold text-[#0a0a0a] border border-[#0a0a0a] rounded px-3 py-1 hover:bg-[#0a0a0a] hover:text-white transition-all"
            >
              {session?.user?.email?.split('@')[0] || 'User'}
            </Link>
          ) : (
            <Link href="/login"
              className="text-sm font-semibold bg-[#0a0a0a] text-white rounded px-3 py-1.5 hover:opacity-80 transition-opacity"
            >
              ログイン
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
