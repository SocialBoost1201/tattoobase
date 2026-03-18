import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

type Crumb = { label: string; href?: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  // JSON-LD作成
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'ホーム',
        item: process.env.NEXT_PUBLIC_APP_URL || 'https://tattoobase.jp',
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.label,
        item: item.href 
          ? `${process.env.NEXT_PUBLIC_APP_URL || 'https://tattoobase.jp'}${item.href}`
          : undefined,
      })),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="パンくずリスト" className="hidden md:flex flex-wrap items-center gap-1.5 text-[11px] text-neutral-500 mb-6">
        <Link href="/" className="flex items-center gap-1 hover:text-white transition-colors">
          <Home className="w-3 h-3" />
          ホーム
        </Link>
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <ChevronRight className="w-3 h-3 text-neutral-700" />
            {item.href ? (
              <Link href={item.href} className="hover:text-white transition-colors whitespace-nowrap">{item.label}</Link>
            ) : (
              <span className="text-neutral-400 whitespace-nowrap">{item.label}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
