import { auth } from '@/auth';
import { signOut } from '@/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const ACCOUNT_LINKS = [
  { href: '/account/bookings', label: '予約履歴', desc: '過去・予定の予約一覧' },
  { href: '/account/designs', label: 'デザイン依頼', desc: '依頼中のデザイン確認' },
  { href: '/account/risk', label: 'アカウント状態', desc: 'リスク・KYC ステータス' },
];

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  return (
    <div className="space-y-7">
      {/* Profile */}
      <section className="flex items-center gap-4 pt-2">
        <div className="w-14 h-14 rounded-full bg-white/8 border border-white/15 flex items-center justify-center shrink-0">
          <span className="text-white/60 font-heading font-extrabold text-base">
            {(session.user.email ?? 'U').slice(0, 1).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-heading font-extrabold text-white text-lg truncate">
            {session.user.name ?? session.user.email?.split('@')[0] ?? 'USER'}
          </p>
          <p className="text-white/40 text-xs truncate">{session.user.email}</p>
        </div>
      </section>

      <div className="h-px bg-white/8" />

      {/* Menu */}
      <section className="space-y-2">
        {ACCOUNT_LINKS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-center justify-between glass glass-hover border border-white/8 hover:border-white/20 rounded-2xl px-4 py-4 transition-all"
          >
            <div>
              <p className="text-white font-semibold text-sm group-hover:text-white/90">{item.label}</p>
              <p className="text-white/40 text-xs mt-0.5">{item.desc}</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </Link>
        ))}
      </section>

      {/* Logout */}
      <form
        action={async () => {
          'use server';
          await signOut({ redirectTo: '/' });
        }}
      >
        <button
          type="submit"
          className="w-full glass border border-white/10 hover:border-red-500/30 text-white/40 hover:text-red-400 font-medium py-3.5 rounded-2xl text-sm transition-all duration-200"
        >
          ログアウト
        </button>
      </form>
    </div>
  );
}
