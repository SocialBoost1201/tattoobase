import { auth } from '@/auth';
import { signOut } from '@/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { 
  CalendarCheck, 
  Paintbrush, 
  ShieldCheck, 
  ChevronRight, 
  LogOut, 
  Settings,
  Star
} from 'lucide-react';

const ACCOUNT_LINKS = [
  { 
    href: '/account/bookings', 
    label: '予約履歴', 
    desc: '過去・予定の予約一覧',
    icon: CalendarCheck,
    badge: '2件確定中'
  },
  { 
    href: '/account/designs', 
    label: 'デザイン依頼', 
    desc: '依頼中のデザイン確認',
    icon: Paintbrush,
    badge: null
  },
  { 
    href: '/account/risk', 
    label: 'アカウント状態', 
    desc: 'KYC・リスクステータス',
    icon: ShieldCheck,
    badge: null
  },
];

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const displayName = session.user.name ?? session.user.email?.split('@')[0] ?? 'USER';
  const initial = displayName.slice(0, 1).toUpperCase();

  return (
    <div className="space-y-6 pb-24">
      {/* ヒーロー プロフィールセクション */}
      <section className="relative -mx-4 -mt-4 px-4 pt-10 pb-6 bg-linear-to-b from-neutral-900 to-black overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative space-y-4">
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-full bg-neutral-800 border-2 border-neutral-700 flex items-center justify-center">
                <span className="text-white font-heading font-extrabold text-3xl tracking-tighter">
                  {initial}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-black" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h1 className="font-heading font-extrabold text-white text-2xl tracking-tight truncate">
                {displayName}
              </h1>
              <p className="text-neutral-500 text-xs truncate mt-0.5">{session.user.email}</p>
            </div>

            <Link href="/account/settings" className="w-9 h-9 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors shrink-0">
              <Settings className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex gap-4 pt-2">
            <div className="text-center">
              <p className="text-white font-extrabold text-xl leading-none">3</p>
              <p className="text-neutral-500 text-[10px] mt-1 font-semibold uppercase tracking-widest">Bookings</p>
            </div>
            <div className="w-px bg-neutral-800" />
            <div className="text-center">
              <p className="text-white font-extrabold text-xl leading-none">1</p>
              <p className="text-neutral-500 text-[10px] mt-1 font-semibold uppercase tracking-widest">Design</p>
            </div>
            <div className="w-px bg-neutral-800" />
            <div className="text-center">
              <p className="text-white font-extrabold text-xl leading-none">0</p>
              <p className="text-neutral-500 text-[10px] mt-1 font-semibold uppercase tracking-widest">Reviews</p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-3 py-1.5">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-amber-400 text-[10px] font-extrabold uppercase tracking-widest">Free Plan</span>
          </div>
        </div>
      </section>

      {/* メニュー一覧 */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">My Activities</h2>
        {ACCOUNT_LINKS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 bg-neutral-900 border border-neutral-800 hover:border-neutral-600 rounded-2xl px-5 py-4 transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center shrink-0 group-hover:bg-neutral-700 transition-colors">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm leading-none">{item.label}</p>
                <p className="text-neutral-500 text-xs mt-1.5">{item.desc}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {item.badge && (
                  <span className="text-[10px] font-bold px-2 py-1 bg-neutral-700 text-neutral-200 rounded-full">
                    {item.badge}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-neutral-300 transition-colors" />
              </div>
            </Link>
          );
        })}
      </section>

      {/* ログアウト */}
      <section className="pt-2">
        <form
          action={async () => {
            'use server';
            await signOut({ redirectTo: '/' });
          }}
        >
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 border border-neutral-800 hover:border-red-800 text-neutral-500 hover:text-red-400 font-semibold py-3.5 rounded-2xl text-sm transition-all duration-300 bg-neutral-900 hover:bg-red-950/20"
          >
            <LogOut className="w-4 h-4" />
            ログアウト
          </button>
        </form>
      </section>
    </div>
  );
}
