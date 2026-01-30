"use client";

import dynamic from "next/dynamic";

// Lazy load the 3D scene with SSR disabled
const Scene = dynamic(() => import("@/components/canvas/Scene"), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-black" />,
});

export default function SceneContainer({ className }: { className?: string }) {
    return (
        <div className={className}>
            <Scene />
        </div>
    );
}
