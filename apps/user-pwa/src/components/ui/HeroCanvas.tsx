'use client';

import { Canvas } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';

export default function HeroCanvas() {
    return (
        <div className="absolute top-0 left-0 w-full h-[60vh] z-0 pointer-events-none opacity-50" style={{ maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <Sparkles 
                    count={150} 
                    scale={12} 
                    size={2} 
                    speed={0.2} 
                    opacity={0.4} 
                    color="#ffffff" 
                    noise={0.1}
                />
            </Canvas>
        </div>
    );
}
