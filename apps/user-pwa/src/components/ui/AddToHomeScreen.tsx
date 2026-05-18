'use client';

import { useEffect, useState } from 'react';
import { X, Download } from 'lucide-react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

export default function AddToHomeScreen() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // すでに却下済みならスキップ
    if (sessionStorage.getItem('pwa-dismissed')) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // 3秒後に表示（UX: 即表示より少し待つ）
      setTimeout(() => setIsVisible(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setIsVisible(false);
  };

  const handleDismiss = () => {
    sessionStorage.setItem('pwa-dismissed', '1');
    setIsVisible(false);
    setIsDismissed(true);
  };

  if (!isVisible || isDismissed) return null;

  return (
    <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+72px)] left-4 right-4 z-50 max-w-sm mx-auto">
      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-4 shadow-2xl flex items-center gap-3">
        {/* アイコン */}
        <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center shrink-0 border border-neutral-800">
          <span className="font-extrabold text-white text-sm font-mono">TB</span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm">TattooBaseをインストール</p>
          <p className="text-neutral-400 text-xs mt-0.5">ホーム画面に追加してアプリとして使えます</p>
        </div>

        <div className="flex flex-col gap-1.5 shrink-0">
          <button onClick={handleInstall}
            className="flex items-center gap-1 bg-white text-black text-xs font-bold px-3 py-1.5 rounded-full hover:bg-neutral-200 transition-colors">
            <Download className="w-3 h-3" /> 追加
          </button>
          <button onClick={handleDismiss}
            className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors text-center">
            後で
          </button>
        </div>
      </div>
    </div>
  );
}
