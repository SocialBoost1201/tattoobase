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
    <div className="space-y-8">
      {/* プロフィール */}
      <section className="flex items-center gap-4 pt-2">
        <div className="w-12 h-12 rounded-full bg-[#0a0a0a] flex items-center justify-center shrink-0">
          <span className="text-white font-heading font-extrabold text-sm">
            {(session.user.email ?? 'U').slice(0, 1).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-heading font-extrabold text-[#0a0a0a] text-base truncate">
            {session.user.name ?? session.user.email?.split('@')[0] ?? 'USER'}
          </p>
          <p className="text-[#6b6b6b] text-xs truncate">{session.user.email}</p>
        </div>
      </section>

      <div className="h-px bg-[#e0e0e0]" />

      {/* メニュー */}
      <section className="space-y-1">
        {ACCOUNT_LINKS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center justify-between bg-white border border-[#e0e0e0] hover:border-[#0a0a0a] rounded-sm px-4 py-4 transition-all group"
          >
            <div>
              <p className="text-[#0a0a0a] font-semibold text-sm group-hover:underline">{item.label}</p>
              <p className="text-[#6b6b6b] text-xs mt-0.5">{item.desc}</p>
            </div>
            <span className="text-[#a0a0a0] group-hover:text-[#0a0a0a] transition-colors">→</span>
          </Link>
        ))}
      </section>

      {/* ログアウト */}
      <form
        action={async () => {
          'use server';
          await signOut({ redirectTo: '/' });
        }}
      >
        <button
          type="submit"
          className="w-full border border-[#e0e0e0] hover:border-[#0a0a0a] text-[#6b6b6b] hover:text-[#0a0a0a] font-medium py-3 rounded-sm text-sm transition-colors duration-200"
        >
          ログアウト
        </button>
      </form>
    </div>
  );
}
