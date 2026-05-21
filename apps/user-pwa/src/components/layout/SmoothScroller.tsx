'use client';

import { ReactLenis } from '@studio-freight/react-lenis';
import { useEffect, useState } from 'react';

export default function SmoothScroller({ children }: { children: React.ReactNode }) {
    const [reduced, setReduced] = useState(false);

    // Mobile UX Audit P1-2/P1-3: reduce-motion 時は Lenis を使わずネイティブスクロール
    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReduced(mq.matches);
        const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
    }, []);

    if (reduced) {
        return <>{children}</>;
    }

    return (
        <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
            {children as any}
        </ReactLenis>
    );
}
