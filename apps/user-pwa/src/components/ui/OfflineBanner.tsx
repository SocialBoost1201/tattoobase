'use client';

import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

/**
 * Mobile UX Audit P0-3: Offline state banner.
 *
 * 接続が切れている間だけ Header の上に細いバナーを表示する。
 * - `navigator.onLine` で初期状態を判定
 * - `online` / `offline` イベントで状態を更新
 * - オンライン時は何もレンダリングしない（DOM/レイアウト影響ゼロ）
 * - 非 fixed: オフライン中のみ自然なフローで高さを取り、後続要素を押し下げる
 *   → スクロール中に発生してもレイアウトシフトは限定的、Lenis 配下でも安全
 */
export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // SSR 時は navigator が無いので、マウント後に初期反映
    setIsOffline(!navigator.onLine);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full bg-red-950/95 backdrop-blur-xl border-b border-red-900/60 text-red-100"
    >
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-2 text-xs font-bold">
        <WifiOff className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span>オフライン中です。一部の機能が利用できない可能性があります。</span>
      </div>
    </div>
  );
}
