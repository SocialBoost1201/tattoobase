'use client';

/**
 * Modal — アクセシブルな共通モーダルプリミティブ
 *
 * 機能:
 *  - role="dialog" / aria-modal="true" / aria-label
 *  - フォーカストラップ (Tab / Shift+Tab)
 *  - ESC キーで閉じる
 *  - body スクロールロック (開いている間)
 *  - 閉じたとき直前のフォーカス要素へ戻す
 *  - バックドロップクリックで閉じる (closeOnBackdrop=true のとき)
 *  - createPortal で document.body に直接マウント (z-index 競合回避)
 */

import { useEffect, useRef, useCallback, ReactNode } from 'react';
import { createPortal } from 'react-dom';

const FOCUSABLE_SELECTORS =
  'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';

export interface ModalProps {
  /** モーダルの表示状態 */
  isOpen: boolean;
  /** 閉じるコールバック */
  onClose: () => void;
  /** モーダル内コンテンツ */
  children: ReactNode;
  /** aria-label (ariaLabelledBy と排他) */
  ariaLabel?: string;
  /** aria-labelledby でタイトル要素 id を参照するとき */
  ariaLabelledBy?: string;
  /**
   * オーバーレイ(backdrop) の className
   * デフォルト: "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center"
   */
  overlayClassName?: string;
  /**
   * ダイアログコンテナの className
   * デフォルト: "relative outline-none"
   */
  contentClassName?: string;
  /** バックドロップクリックで閉じるか (デフォルト: true) */
  closeOnBackdrop?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  ariaLabel,
  ariaLabelledBy,
  overlayClassName = 'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center',
  contentClassName = 'relative outline-none',
  closeOnBackdrop = true,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<Element | null>(null);

  // スクロールロック + フォーカス管理
  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement;
    document.body.style.overflow = 'hidden';

    // 最初のフォーカス可能要素 or ダイアログ自身にフォーカス
    requestAnimationFrame(() => {
      const first = dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTORS);
      (first ?? dialogRef.current)?.focus();
    });

    return () => {
      document.body.style.overflow = '';
      (previousFocusRef.current as HTMLElement | null)?.focus?.();
    };
  }, [isOpen]);

  // ESC + フォーカストラップ
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key !== 'Tab') return;

      const focusables = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS) ?? []
      );
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  // サーバーサイドレンダリング時は null
  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className={overlayClassName}
      onClick={closeOnBackdrop ? (e) => { if (e.target === e.currentTarget) onClose(); } : undefined}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        tabIndex={-1}
        className={contentClassName}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
