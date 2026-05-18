'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

const SUGGESTIONS = [
  '和彫', 'ブラックアンドグレー', 'ミニマル', 'ワンポイント',
  'レタリング', 'アニメ', '東京', '大阪', 'トラディショナル',
];

export default function SearchBar({ defaultValue = '' }: { defaultValue?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 外クリックで候補を閉じる
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    setOpen(false);
    router.push(`/search?type=artist&q=${encodeURIComponent(value.trim())}`);
  }

  function handleSuggestion(s: string) {
    setValue(s);
    setOpen(false);
    router.push(`/search?type=artist&q=${encodeURIComponent(s)}`);
  }

  function handleClear() {
    setValue('');
    inputRef.current?.focus();
  }

  const filtered = value.length >= 1
    ? SUGGESTIONS.filter(s => s.includes(value))
    : SUGGESTIONS;

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-3 w-full bg-neutral-900 hover:bg-neutral-800/80 border border-neutral-800 hover:border-neutral-700 focus-within:border-neutral-600 focus-within:bg-neutral-800/80 rounded-full px-4 py-2.5 transition-all group">
          <Search className="w-4 h-4 text-neutral-500 group-focus-within:text-neutral-300 transition-colors shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={e => { setValue(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder="アーティスト・スタイルを検索..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-neutral-500 outline-none"
          />
          {value && (
            <button type="button" onClick={handleClear}
              className="shrink-0 w-4 h-4 rounded-full bg-neutral-600 flex items-center justify-center hover:bg-neutral-400 transition-colors">
              <X className="w-2.5 h-2.5 text-white" />
            </button>
          )}
        </div>
      </form>

      {/* サジェスト候補 */}
      {open && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl z-50">
          <div className="px-4 py-2 border-b border-neutral-800">
            <p className="text-xs font-bold text-neutral-600 uppercase tracking-widest">
              {value ? '候補' : 'よく検索されるキーワード'}
            </p>
          </div>
          <ul>
            {filtered.slice(0, 6).map(s => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => handleSuggestion(s)}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors text-left"
                >
                  <Search className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
                  {s}
                </button>
              </li>
            ))}
          </ul>
          {value.trim() && (
            <button
              type="button"
              onClick={() => handleSuggestion(value.trim())}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-white bg-neutral-800 hover:bg-neutral-700 transition-colors border-t border-neutral-800 text-left"
            >
              <Search className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              「{value.trim()}」を検索
            </button>
          )}
        </div>
      )}
    </div>
  );
}
