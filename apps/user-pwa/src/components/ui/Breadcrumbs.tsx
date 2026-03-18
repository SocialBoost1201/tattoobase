import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

type Crumb = { label: string; href?: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="パンくずリスト" className="hidden md:flex items-center gap-1.5 text-[11px] text-neutral-500 mb-6">
      <Link href="/" className="flex items-center gap-1 hover:text-white transition-colors">
        <Home className="w-3 h-3" />
        ホーム
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="w-3 h-3 text-neutral-700" />
          {item.href ? (
            <Link href={item.href} className="hover:text-white transition-colors">{item.label}</Link>
          ) : (
            <span className="text-neutral-400">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
