'use client';

import { usePathname } from 'next/navigation';
import { Bell, Search } from 'lucide-react';

export default function StudioHeader() {
  const pathname = usePathname();
  
  // Breadcrumb（パンくず）作成の簡易ロジック
  const paths = pathname.split('/').filter(p => p !== '');
  const titleMap: Record<string, string> = {
    'studio': 'Dashboard',
    'bookings': 'Bookings',
    'portfolio': 'Portfolio',
    'artists': 'Artists',
    'risk': 'Risk Control',
    'settings': 'Settings',
  };

  const currentSection = paths.length > 1 ? paths[1] : paths[0];
  const title = titleMap[currentSection] || currentSection;

  return (
    <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center font-semibold text-sm">
         <span className="text-neutral-400">Studio</span>
         <span className="mx-2 text-neutral-300">/</span>
         <span className="text-neutral-800 capitalize">{title}</span>
      </div>

      <div className="flex items-center gap-4">
        {/* 検索 (モック) */}
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input 
            type="text" 
            placeholder="Search bookings..." 
            className="pl-9 pr-4 py-1.5 bg-neutral-100 border-transparent focus:bg-white focus:border-neutral-300 focus:ring-2 focus:ring-neutral-200 rounded-md text-sm outline-none transition-all w-64"
          />
        </div>

        {/* 通知 (モック) */}
        <button className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-500 hover:bg-neutral-100 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
}
