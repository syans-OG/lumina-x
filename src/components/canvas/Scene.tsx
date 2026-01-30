"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Preload, PerspectiveCamera, CameraShake } from "@react-three/drei";
import { Suspense } from "react";
import { EffectComposer, Bloom, Noise, ChromaticAberration, Vignette, DepthOfField } from "@react-three/postprocessing";
import Experience from "./Experience";
import Particles from "./Particles";
import { useDeviceCapability } from "@/hooks/useDeviceCapability";

export default function Scene() {
    const device = useDeviceCapability();

    return (
        <Canvas
            className="absolute inset-0 w-full h-full pointer-events-auto"
            dpr={device.dpr}
            gl={{ antialias: false, powerPreference: "high-performance" }}
            eventSource={typeof document !== 'undefined' ? (document.getElementById('root') || document.body) as HTMLElement : undefined}
            eventPrefix="client"
        >
            <Suspense fallback={null}>
                <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />

                <Environment preset="studio" environmentIntensity={0.6} />
                <ambientLight intensity={0.1} />

                <spotLight
                    position={[-5, 10, 5]}
                    angle={0.3}
                    penumbra={0.2}
                    intensity={30}
                    castShadow
                    color="#ffffff"
                />

                <spotLight
                    position={[5, 0, 5]}
                    angle={0.5}
                    intensity={15}
                    color="#a0c0ff"
                />

                <spotLight
                    position={[0, 5, -10]}
                    angle={0.5}
                    intensity={40}
                    color="#ffffff"
                />

                <Particles count={device.particleCount} />
                <Experience />

                <CameraShake
                    maxPitch={0.005}
                    maxRoll={0.005}
                    maxYaw={0.005}
                    pitchFrequency={0.2}
                    rollFrequency={0.2}
                    yawFrequency={0.2}
                    intensity={0.5}
                />

                {device.enablePostProcessing && (
                    <EffectComposer multisampling={0}>
                        <Bloom
                            luminanceThreshold={0.8}
                            mipmapBlur={device.enableMipmapBlur}
                            intensity={0.4}
                            radius={0.3}
                            levels={device.bloomLevels}
                        />
                        <Noise opacity={0.05} premultiply />
                        <ChromaticAberration
                            offset={device.enableChromaticAberration ? [0.0002, 0.0002] : [0, 0]}
                            radialModulation={true}
                            modulationOffset={0.7}
                        />
                    </EffectComposer>
                )}

                <Preload all />
            </Suspense>
        </Canvas>
    );
}
