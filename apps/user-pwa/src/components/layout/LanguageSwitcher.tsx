'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const toggle = () => {
    const next = locale === 'ja' ? 'en' : 'ja';
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000`;
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className="text-xs font-bold text-white/50 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
      aria-label="Switch language"
    >
      {locale === 'ja' ? 'EN' : 'JA'}
    </button>
  );
}
