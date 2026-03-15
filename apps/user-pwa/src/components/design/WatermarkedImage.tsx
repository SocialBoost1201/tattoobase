'use client';

import React, { useRef, useEffect, useState } from 'react';

/**
 * WatermarkedImage Component
 * 
 * 独自の透かし(Watermark)を画像上に描画し、無断利用や他店への持ち込みを抑止するためのコンポーネントです。
 * - 右クリック保存 (contextmenu) を禁止
 * - ドラッグ&ドロップを禁止
 * - キャンバスまたはCSSオーバーレイを用いて「Studio Name」や「Date」を印字
 */

interface WatermarkedImageProps {
  src: string;
  alt: string;
  watermarkText: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function WatermarkedImage({
  src,
  alt,
  watermarkText,
  width,
  height,
  className = ''
}: WatermarkedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // 右クリックやドラッグを防止するハンドラ
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };
  
  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div 
      className={`relative overflow-hidden select-none bg-neutral-900 flex items-center justify-center ${className}`}
      onContextMenu={handleContextMenu}
      onDragStart={handleDragStart}
      style={{ width: width ? `${width}px` : '100%', height: height ? `${height}px` : '100%' }}
    >
      {/* 実際の画像 */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={`object-contain max-w-full max-h-full transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setIsLoaded(true)}
      />

      {/* 透かし（CSS Overlay） */}
      {isLoaded && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
          {/* 繰り返しパターンや斜めのテキストなどでカバー */}
          <div className="transform -rotate-45 text-white/30 font-bold text-4xl sm:text-6xl tracking-widest leading-loose text-center mix-blend-overlay">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="whitespace-nowrap mb-8">
                {watermarkText} · {watermarkText} · {watermarkText}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Transparent overlay blocks interactions on the img tag */}
      <div className="absolute inset-0 z-10 bg-transparent"></div>
    </div>
  );
}
