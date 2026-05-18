'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Bookmark, User, Zap } from 'lucide-react';

const NAV_ITEMS_LEFT = [
  { href: '/', label: 'ホーム', icon: Home },
  { href: '/search', label: '検索', icon: Search },
];

const NAV_ITEMS_RIGHT = [
  { href: '/account/saved', label: '保存', icon: Bookmark },
  { href: '/account', label: 'アカウント', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-neutral-900 safe-area-pb">
      <div className="max-w-xl mx-auto flex items-center h-16">
        
        {/* 左2タブ */}
        {NAV_ITEMS_LEFT.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center gap-1 py-2 transition-colors"
            >
              <Icon
                className={`w-5 h-5 transition-colors ${active ? 'text-white' : 'text-neutral-600'}`}
                strokeWidth={active ? 2.5 : 1.5}
              />
              <span className={`text-xs font-semibold transition-colors ${active ? 'text-white' : 'text-neutral-600'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* 中央 CTA ボタン（Hot Pepper方式） */}
        <div className="flex-1 flex flex-col items-center -mt-4">
          <Link
            href="/search"
            className="w-14 h-14 rounded-full bg-white flex flex-col items-center justify-center shadow-lg shadow-white/10 hover:bg-neutral-100 active:scale-95 transition-all duration-200 group"
            aria-label="今すぐ探す"
          >
            <Zap className="w-6 h-6 text-black group-hover:scale-110 transition-transform" />
          </Link>
          <span className="text-xs font-bold text-neutral-500 mt-1 tracking-wider uppercase">今すぐ</span>
        </div>

        {/* 右2タブ */}
        {NAV_ITEMS_RIGHT.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center gap-1 py-2 transition-colors"
            >
              <Icon
                className={`w-5 h-5 transition-colors ${active ? 'text-white' : 'text-neutral-600'}`}
                strokeWidth={active ? 2.5 : 1.5}
              />
              <span className={`text-xs font-semibold transition-colors ${active ? 'text-white' : 'text-neutral-600'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
