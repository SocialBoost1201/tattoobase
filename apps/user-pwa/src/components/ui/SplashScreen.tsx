'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const container = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setIsVisible(false);
        onComplete();
      }
    });

    // 少し待ってからロゴをフェードイン
    tl.to('.splash-logo', {
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out',
      delay: 0.2
    })
    // 1.5秒ほど表示してから背景ごとフェードアウト
    .to(container.current, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut',
      delay: 1.2
    });

  }, { scope: container });

  if (!isVisible) return null;

  return (
    <div 
      ref={container} 
      className="fixed inset-0 z-100 flex items-center justify-center bg-white"
    >
      <div className="splash-logo opacity-0">
        <Image
          src="/logo.png"
          alt="TattooBase"
          width={240}
          height={60}
          className="h-12 w-auto object-contain"
          priority
        />
      </div>
    </div>
  );
}
