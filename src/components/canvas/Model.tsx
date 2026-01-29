import { useGLTF } from "@react-three/drei";
import { forwardRef, useMemo, useLayoutEffect } from "react";
import * as THREE from "three";
import { useStore } from "@/store";
import gsap from "gsap";

const Model = forwardRef<THREE.Group, any>((props, ref) => {
    const { scene } = useGLTF("/models/headset.glb");
    const activeColor = useStore((state) => state.activeColor);

    // Auto-discover the geometry from the scene
    const { geometry, material } = useMemo(() => {
        let foundGeom: THREE.BufferGeometry | null = null;
        let foundMat: THREE.Material | null = null;

        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh && !foundGeom) {
                foundGeom = (child as THREE.Mesh).geometry;
                foundMat = (child as THREE.Mesh).material as THREE.Material;
            }
        });

        // Clone material so we can modify it without affecting the cached original if needed
        // but for now, we will apply the color prop directly to the mesh component
        // or clone it here. Let's clone it to be safe.
        const clonedMat = foundMat ? (foundMat as THREE.MeshStandardMaterial).clone() : new THREE.MeshStandardMaterial();

        return { geometry: foundGeom, material: clonedMat };
    }, [scene]);

    // Animate color change
    useLayoutEffect(() => {
        if (material && (material as any).color) {
            gsap.to((material as any).color, {
                r: new THREE.Color(activeColor).r,
                g: new THREE.Color(activeColor).g,
                b: new THREE.Color(activeColor).b,
                duration: 1,
                ease: "power2.out"
            });
        }
    }, [activeColor, material]);

    if (!geometry) return null;

    return (
        <group ref={ref} {...props}>
            {/* 1. Realistic Mesh */}
            <mesh
                name="realistic"
                geometry={geometry}
                material={material}
            />

            {/* 2. Holographic Wireframe Mesh */}
            <mesh
                name="wireframe"
                geometry={geometry}
                position={[0, 0, 0]}
            >
                <meshStandardMaterial
                    color="#ffffff"
                    emissive="#ffffff"
                    emissiveIntensity={2}
                    wireframe={true}
                    transparent={true}
                    opacity={0} // Start invisible
                />
            </mesh>
        </group>
    );
});

Model.displayName = "Model";

export default Model;

useGLTF.preload("/models/headset.glb");
