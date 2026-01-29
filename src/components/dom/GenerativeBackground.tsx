"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";

function FullScreenShader() {
    const meshRef = useRef<THREE.Mesh>(null);

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uColorA: { value: new THREE.Color("#0a0a20") },
        uColorB: { value: new THREE.Color("#252550") },
        uColorC: { value: new THREE.Color("#050510") },
    }), []);

    useFrame((state) => {
        if (meshRef.current) {
            (meshRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = state.clock.elapsedTime * 0.15;
        }
    });

    return (
        <mesh ref={meshRef} scale={[10, 10, 1]}>
            <planeGeometry args={[2, 2]} />
            <shaderMaterial
                uniforms={uniforms}
                vertexShader={`
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = vec4(position, 1.0);
                    }
                `}
                fragmentShader={`
                    uniform float uTime;
                    uniform vec3 uColorA;
                    uniform vec3 uColorB;
                    uniform vec3 uColorC;
                    varying vec2 vUv;

                    float random(vec2 st) {
                        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
                    }

                    float noise(vec2 st) {
                        vec2 i = floor(st);
                        vec2 f = fract(st);
                        float a = random(i);
                        float b = random(i + vec2(1.0, 0.0));
                        float c = random(i + vec2(0.0, 1.0));
                        float d = random(i + vec2(1.0, 1.0));
                        vec2 u = f * f * (3.0 - 2.0 * f);
                        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
                    }

                    float fbm(vec2 st) {
                        float v = 0.0;
                        float a = 0.5;
                        vec2 shift = vec2(100.0);
                        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
                        for (int i = 0; i < 5; ++i) {
                            v += a * noise(st);
                            st = rot * st * 2.0 + shift;
                            a *= 0.5;
                        }
                        return v;
                    }

                    void main() {
                        vec2 st = vUv * 3.0;
                        float q = fbm(st - uTime * 0.1);
                        vec2 r = vec2(
                            fbm(st + q + uTime * 0.2 + vec2(1.7, 9.2)),
                            fbm(st + q - uTime * 0.15 + vec2(8.3, 2.8))
                        );
                        float f = fbm(st + r);

                        vec3 color = mix(uColorA, uColorB, clamp((f*f)*4.0, 0.0, 1.0));
                        color = mix(color, uColorC, clamp(length(r*0.5), 0.0, 1.0));
                        
                        float d = length(vUv - 0.5);
                        color *= 1.0 - d * 0.5;

                        gl_FragColor = vec4(color, 1.0);
                    }
                `}
                transparent={true}
                depthWrite={false}
            />
        </mesh>
    );
}

export default function GenerativeBackground() {
    return (
        <div className="fixed inset-0 w-full h-full -z-10 bg-black pointer-events-none">
            <Canvas camera={{ position: [0, 0, 1] }} resize={{ scroll: false }} dpr={[1, 1.5]}>
                <FullScreenShader />
            </Canvas>
        </div>
    );
}
