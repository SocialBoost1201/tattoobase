'use client';

import { ReactLenis } from '@studio-freight/react-lenis';
import { useEffect, useState } from 'react';

export default function SmoothScroller({ children }: { children: React.ReactNode }) {
    const [useLenis, setUseLenis] = useState(false);

    useEffect(() => {
        // Mobile UX Audit #12: モバイル (<768px) は常にネイティブスクロール
        // Mobile UX Audit P1-2/P1-3: prefers-reduced-motion: reduce 時も無効
        const isMobile = window.matchMedia('(max-width: 767px)');
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

        const evaluate = () => {
            setUseLenis(!isMobile.matches && !reducedMotion.matches);
        };

        evaluate();
        isMobile.addEventListener('change', evaluate);
        reducedMotion.addEventListener('change', evaluate);
        return () => {
            isMobile.removeEventListener('change', evaluate);
            reducedMotion.removeEventListener('change', evaluate);
        };
    }, []);

    if (!useLenis) {
        return <>{children}</>;
    }

    return (
        <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
            {children as any}
        </ReactLenis>
    );
}
