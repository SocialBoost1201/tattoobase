'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const SORT_OPTIONS = [
  { value: 'new', label: '新着順' },
  { value: 'popular', label: '人気順' },
  { value: 'rating', label: '評価が高い順' },
  { value: 'price', label: '価格が低い順' },
];

export default function SortSelector({ currentSort }: { currentSort: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value && e.target.value !== 'new') {
      params.set('sort', e.target.value);
    } else {
      params.delete('sort');
    }
    router.push(`/search?${params.toString()}`);
  }

  return (
    <select
      value={currentSort || 'new'}
      onChange={handleChange}
      className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 text-xs font-bold rounded-full px-3 py-1.5 outline-none cursor-pointer transition-colors appearance-none pr-6"
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23666' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
    >
      {SORT_OPTIONS.map(opt => (
        <option key={opt.value} value={opt.value} className="bg-neutral-900 text-white">
          {opt.label}
        </option>
      ))}
    </select>
  );
}
