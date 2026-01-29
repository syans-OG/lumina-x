"use client";

import { useGLTF } from "@react-three/drei";

export default function DebugNodes() {
    const { nodes } = useGLTF("/models/headset.glb");
    const nodeNames = Object.keys(nodes);

    return (
        <div className="fixed top-0 left-0 z-[9999] bg-black/80 text-green-400 p-4 font-mono text-xs max-h-screen overflow-auto">
            <h3 className="font-bold underline mb-2">GLTF Nodes</h3>
            <ul>
                {nodeNames.map((name) => (
                    <li key={name}>{name}</li>
                ))}
            </ul>
        </div>
    );
}
