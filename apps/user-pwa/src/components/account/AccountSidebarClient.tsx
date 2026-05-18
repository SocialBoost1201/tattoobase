'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { 
  CalendarCheck, 
  Paintbrush, 
  ShieldCheck, 
  LogOut, 
  Settings,
  Bookmark,
  Star
} from 'lucide-react';

const ACCOUNT_LINKS = [
  { 
    href: '/account/saved', 
    label: '保存したリスト', 
    icon: Bookmark,
  },
  { 
    href: '/account/bookings', 
    label: '予約履歴', 
    icon: CalendarCheck,
  },
  { 
    href: '/account/designs', 
    label: 'デザイン依頼', 
    icon: Paintbrush,
  },
  { 
    href: '/account/risk', 
    label: 'アカウント状態', 
    icon: ShieldCheck,
  },
];

export default function AccountSidebarClient({ session }: { session: any }) {
  const pathname = usePathname();
  const displayName = session?.user?.name ?? session?.user?.email?.split('@')[0] ?? 'USER';
  const initial = displayName.slice(0, 1).toUpperCase();

  return (
    <aside className="hidden md:flex flex-col w-72 shrink-0 border-r border-white/5 bg-black min-h-[calc(100vh-64px)] p-6 sticky top-16">
      
      {/* Profile Section */}
      <div className="mb-10 text-center flex flex-col items-center">
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center shadow-xl">
            <span className="text-white font-heading font-extrabold text-4xl tracking-tighter">
              {initial}
            </span>
          </div>
          <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-green-500 border-[3px] border-black" />
        </div>
        
        <h2 className="font-heading font-extrabold text-white text-lg tracking-tight w-full truncate px-4">
          {displayName}
        </h2>
        <p className="text-neutral-500 text-xs truncate w-full px-4 mt-1">{session?.user?.email}</p>
        
        <div className="mt-4 inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1">
          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
          <span className="text-amber-500 text-xs font-extrabold uppercase tracking-widest">Free Plan</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1">
        {ACCOUNT_LINKS.map(link => {
          const isActive = pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link 
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                isActive 
                  ? 'bg-white text-black' 
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="mt-8 pt-6 border-t border-white/5 space-y-1">
        <Link 
          href="/account/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-colors font-bold text-sm"
        >
          <Settings className="w-4 h-4" />
          設定
        </Link>
        <button 
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors font-bold text-sm"
        >
          <LogOut className="w-4 h-4" />
          ログアウト
        </button>
      </div>

    </aside>
  );
}
