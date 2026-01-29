"use client";

import dynamic from "next/dynamic";

const Scene = dynamic(() => import("@/components/canvas/Scene"), { ssr: false });

export default function SceneContainer({ className = "w-full h-full" }: { className?: string }) {
    return (
        <div className={className}>
            <Scene />
        </div>
    );
}
