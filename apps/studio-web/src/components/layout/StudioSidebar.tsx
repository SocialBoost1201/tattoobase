'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  CalendarDays,
  CalendarRange,
  Image as ImageIcon, 
  Users, 
  ShieldAlert, 
  Settings, 
  LogOut 
} from 'lucide-react';

const navItems = [
  { href: '/studio', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/studio/bookings', label: 'Bookings', icon: CalendarDays },
  { href: '/studio/calendar', label: 'Calendar', icon: CalendarRange },
  { href: '/studio/portfolio', label: 'Portfolio', icon: ImageIcon },
  { href: '/studio/artists', label: 'Artists', icon: Users },
  { href: '/studio/risk', label: 'Risk Control', icon: ShieldAlert },
  { href: '/studio/settings', label: 'Settings', icon: Settings },
];


export default function StudioSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-neutral-900 border-r border-neutral-800 text-white flex flex-col h-screen fixed left-0 top-0 overflow-y-auto">
      {/* ロゴエリア */}
      <div className="h-16 flex items-center px-6 border-b border-neutral-800 shrink-0">
        <Link href="/studio" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="w-8 h-8 bg-white text-black font-extrabold flex items-center justify-center rounded-md font-heading tracking-tighter">
            TB
          </div>
          <span className="font-heading font-extrabold text-lg tracking-tight">TattooBase <span className="text-neutral-500 font-medium text-sm">Studio</span></span>
        </Link>
      </div>

      {/* メインメニュー */}
      <nav className="p-4 space-y-1.5 flex-1">
        <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest px-2 pb-2 mb-2">Main Menu</div>
        {navItems.map((item) => {
          const isActive = item.exact 
            ? pathname === item.href 
            : pathname.startsWith(item.href);
            
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                isActive 
                  ? 'bg-neutral-800 text-white' 
                  : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* ボトムエリア */}
      <div className="p-4 border-t border-neutral-800 shrink-0">
        <div className="flex items-center gap-3 px-2 py-3 mb-2">
          <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-xs uppercase">D</span>
          </div>
          <div className="flex-1 min-w-0">
             <p className="text-sm font-bold text-white truncate">Demo Studio</p>
             <p className="text-[10px] text-neutral-400 truncate">Pro Plan</p>
          </div>
        </div>
        
        <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-neutral-400 hover:bg-neutral-800/50 hover:text-white transition-colors duration-200">
          <LogOut className="w-4 h-4 shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
