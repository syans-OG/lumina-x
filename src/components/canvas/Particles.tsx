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
      
      // Organic "Breathing" movement
      float time = uTime * 0.5;
      
      // Complex wave motion (Neural Flow)
      pos.x += sin(time * 0.3 + aRandom * 10.0) * 0.2;
      pos.y += cos(time * 0.5 + aRandom * 5.0) * 0.2;
      pos.z += sin(time * 0.2 + aRandom * 2.0) * 0.2;
      
      // Gentle drift based on velocity
      pos += aVelocity * sin(time * 0.1);

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      
      // Size attenuation
      gl_Position = projectionMatrix * mvPosition;
      
      // Dynamic Size based on pulse
      float pulse = 1.0 + sin(time * 2.0 + aRandom * 20.0) * 0.3;
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
      // Circular soft particle
      // gl_PointCoord goes from (0,0) to (1,1) in the point sprite
      vec2 coord = gl_PointCoord - vec2(0.5);
      float dist = length(coord);
      
      // DISCARD corners to make it a perfect circle
      if (dist > 0.5) discard;

      // Soft glow gradient
      float strength = 1.0 - (dist * 2.0); // 1.0 at center, 0.0 at edge
      strength = pow(strength, 2.0); // Soft falloff

      // Color Palette: Neural Blue to Bio-Data White
      vec3 colorBlue = vec3(0.2, 0.6, 1.0); // Brighter Blue
      vec3 colorCyan = vec3(0.0, 1.0, 1.0); // Cyan glow
      vec3 colorWhite = vec3(1.0, 1.0, 1.0); // Core
      
      // Dynamic pulsing activity
      float activity = sin(uTime * 2.0 + vRandom * 10.0) * 0.5 + 0.5;
      
      vec3 finalColor = mix(colorBlue, colorCyan, activity);
      finalColor = mix(finalColor, colorWhite, strength * 0.5); // White core

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
