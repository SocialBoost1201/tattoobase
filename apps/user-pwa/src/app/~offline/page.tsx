import { WifiOff } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'オフライン | TattooBase',
  robots: 'noindex',
};

/**
 * オフラインフォールバックページ
 * Service Worker がネットワーク接続なしにナビゲーションを処理できない場合に表示
 */
export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-sm space-y-6">
        <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto">
          <WifiOff className="w-7 h-7 text-neutral-400" />
        </div>

        <div className="space-y-2">
          <h1 className="font-heading font-extrabold text-2xl text-white tracking-tight">
            オフラインです
          </h1>
          <p className="text-neutral-400 text-sm leading-relaxed">
            インターネット接続が確認できません。
            <br />
            接続を確認してから再度お試しください。
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-white text-black font-heading font-extrabold text-sm tracking-widest px-8 py-4 rounded-full hover:bg-neutral-200 transition-colors"
        >
          ホームに戻る
        </Link>
      </div>
    </div>
  );
}
