'use client';

import { Bookmark } from 'lucide-react';
import { useSavedArtists } from '@/hooks/useSavedArtists';

type Props = {
  artistId: string;
  /** compact: 小さいカード内ボタン。false: 詳細ページ用 */
  size?: 'sm' | 'md';
  className?: string;
};

export default function SaveButton({ artistId, size = 'sm', className = '' }: Props) {
  const { isSaved, toggle, mounted } = useSavedArtists();
  const saved = mounted && isSaved(artistId);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggle(artistId);
  }

  if (size === 'sm') {
    return (
      <button
        onClick={handleClick}
        aria-label={saved ? '保存を解除' : '保存する'}
        className={`relative z-10 flex items-center justify-center rounded-full transition-all duration-200 ${
          saved
            ? 'bg-white text-black'
            : 'bg-black/50 backdrop-blur-sm text-white hover:bg-black/80'
        } w-7 h-7 ${className}`}
      >
        <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-black' : ''}`} />
      </button>
    );
  }

  // md: 横型カード or アーティスト詳細用
  return (
    <button
      onClick={handleClick}
      aria-label={saved ? '保存を解除' : '保存する'}
      className={`flex items-center justify-center rounded-full border transition-all duration-200 w-7 h-7 ${
        saved
          ? 'bg-white border-white text-black'
          : 'border-neutral-700 text-neutral-500 hover:text-white hover:border-neutral-400'
      } ${className}`}
    >
      <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-black' : ''}`} />
    </button>
  );
}
