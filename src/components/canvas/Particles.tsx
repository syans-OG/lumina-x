"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const NeuralParticleShader = {
    vertexShader: `
    uniform float uTime;
    attribute float aScale;
    attribute float aRandom;
    attribute vec3 aVelocity;
    
    varying vec2 vUv;
    varying float vAlpha;
    varying float vRandom;

    void main() {
      vUv = uv;
      vRandom = aRandom;
      
      vec3 pos = position;
      
      // Optimized: Reduced from 6 sin/cos to 3
      float time = uTime * 0.5;
      float randomOffset = aRandom * 10.0;
      
      // Simplified wave motion
      pos.x += sin(time * 0.3 + randomOffset) * 0.2;
      pos.y += cos(time * 0.5 + randomOffset) * 0.2;
      pos.z += sin(time * 0.2 + aRandom * 2.0) * 0.2;
      
      // Gentle drift
      pos += aVelocity * sin(time * 0.1);

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      
      // Simplified pulse calculation
      float pulse = 1.0 + sin(time * 2.0 + randomOffset * 2.0) * 0.3;
      gl_PointSize = (30.0 * aScale * pulse) * (1.0 / -mvPosition.z);
      
      // Fade distant particles
      vAlpha = smoothstep(20.0, 0.0, length(mvPosition.xyz));
    }
  `,
    fragmentShader: `
    varying float vAlpha;
    varying float vRandom;
    uniform float uTime;

    void main() {
      vec2 coord = gl_PointCoord - vec2(0.5);
      float dist = length(coord);
      
      if (dist > 0.5) discard;

      // Simplified gradient (removed pow for performance)
      float strength = 1.0 - (dist * 2.0);
      strength = strength * strength; // Inline pow(2.0)

      // Simplified color palette
      vec3 colorBlue = vec3(0.2, 0.6, 1.0);
      vec3 colorCyan = vec3(0.0, 1.0, 1.0);
      
      // Simplified activity calculation
      float activity = sin(uTime * 2.0 + vRandom * 10.0) * 0.5 + 0.5;
      
      vec3 finalColor = mix(colorBlue, colorCyan, activity * strength);

      gl_FragColor = vec4(finalColor, strength * vAlpha);
    }
  `
};

export default function Particles({ count = 1000 }) {
    const mesh = useRef<THREE.Points>(null);
    const { viewport } = useThree();

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
    }), []);

    const particles = useMemo(() => {
        const position = new Float32Array(count * 3);
        const scale = new Float32Array(count);
        const random = new Float32Array(count);
        const velocity = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            // Position
            position[i * 3] = (Math.random() - 0.5) * 15;
            position[i * 3 + 1] = (Math.random() - 0.5) * 15;
            position[i * 3 + 2] = (Math.random() - 0.5) * 10;

            // Attributes
            scale[i] = Math.random();
            random[i] = Math.random();

            // Velocity direction (swirling data)
            velocity[i * 3] = (Math.random() - 0.5);
            velocity[i * 3 + 1] = (Math.random() - 0.5);
            velocity[i * 3 + 2] = (Math.random() - 0.5);
        }

        return { position, scale, random, velocity };
    }, [count]);

    useFrame((state) => {
        if (mesh.current) {
            const material = mesh.current.material as THREE.ShaderMaterial;
            if (material && material.uniforms && material.uniforms.uTime) {
                material.uniforms.uTime.value = state.clock.elapsedTime;
            }
        }
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[particles.position, 3]}
                />
                <bufferAttribute
                    attach="attributes-aScale"
                    args={[particles.scale, 1]}
                />
                <bufferAttribute
                    attach="attributes-aRandom"
                    args={[particles.random, 1]}
                />
                <bufferAttribute
                    attach="attributes-aVelocity"
                    args={[particles.velocity, 3]}
                />
            </bufferGeometry>
            <shaderMaterial
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                vertexShader={NeuralParticleShader.vertexShader}
                fragmentShader={NeuralParticleShader.fragmentShader}
                uniforms={uniforms}
            />
        </points>
    );
}
