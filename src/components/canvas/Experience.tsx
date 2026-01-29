"use client";

import { useLayoutEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import Model from "./Model";
import { Center } from "@react-three/drei";

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
    // Outer group for SCROLL movement
    const outerRef = useRef<THREE.Group>(null);
    // Inner group for IDLE float (Neural Move)
    const innerRef = useRef<THREE.Group>(null);

    const { viewport } = useThree();

    // Neural Float Animation (Organic/Biological Feel)
    useFrame((state) => {
        if (!innerRef.current) return;
        const t = state.clock.elapsedTime;
        // Complex interactions of sines for "floating in fluid" feel
        innerRef.current.position.y = Math.sin(t * 0.5) * 0.15 + Math.sin(t * 1.5) * 0.05;
        innerRef.current.position.x = Math.sin(t * 0.3) * 0.1;
        innerRef.current.rotation.z = Math.sin(t * 0.2) * 0.05;
        innerRef.current.rotation.x = Math.cos(t * 0.3) * 0.05;
    });

    useLayoutEffect(() => {
        const group = outerRef.current;
        if (!group) return;

        // Access the meshes/materials if needed for holographic effect
        const realisticMesh = group.getObjectByName("realistic") as THREE.Mesh;
        const wireframeMesh = group.getObjectByName("wireframe") as THREE.Mesh;

        if (realisticMesh?.material instanceof THREE.Material) {
            realisticMesh.material.transparent = true;
            realisticMesh.material.needsUpdate = true;
        }

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: document.getElementById("immersive-wrapper"), // Use direct DOM element to avoid scope lookup in Three.js group
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1.5,
                },
            });

            // --- FLUID CINEMATIC TIMELINE ---
            // Designed to feel like a continuous camera shot

            // 1. "Precision Sound" (0 -> 2.5)
            // Move: Left (To make room for Right-aligned text)
            // Look: Right
            tl.to(group.position, {
                x: -viewport.width * 0.25, // Move LEFT
                y: -0.5,
                z: 0.5,
                duration: 2,
                ease: "power2.inOut"
            }, 0);
            tl.to(group.rotation, {
                y: Math.PI / 5, // Look Right
                x: 0.1,
                duration: 2,
                ease: "power2.inOut"
            }, 0);
            tl.to(group.scale, {
                x: 1.5, y: 1.5, z: 1.5, // Macro zoom
                duration: 2
            }, 0);


            // 2. Precision Audio -> Titanium Build (Sec 2)
            // Move: Left -> Right (To make room for Left-aligned text)
            tl.to(group.position, {
                x: viewport.width * 0.25, // Move RIGHT
                y: 0.5,
                z: -1,
                duration: 2.5,
                ease: "power1.inOut"
            }, 2);
            tl.to(group.rotation, {
                y: -Math.PI / 5, // Look Left
                x: -0.2,
                duration: 2.5,
                ease: "power1.inOut"
            }, 2);
            tl.to(group.scale, {
                x: 1.1, y: 1.1, z: 1.1, // Normal zoom
                duration: 2.5
            }, 2);


            // 3. Titanium Build -> Specs (Sec 3)
            // Move: Center (Data Stream around it)
            // Effect: Holographic scan
            tl.to(group.position, {
                x: 0,
                y: 0,
                z: 0,
                duration: 2.5,
                ease: "power2.inOut"
            }, 4.5);
            tl.to(group.rotation, {
                y: Math.PI * 2, // Full spin
                x: 0,
                duration: 3,
                ease: "power2.inOut"
            }, 4.5);
            tl.to(group.scale, {
                x: 0.9, y: 0.9, z: 0.9, // Float state
                duration: 2.5
            }, 4.5);




            // --- HOLOGRAPHIC PULSE (Titanium Section) ---
            if (realisticMesh && wireframeMesh) {
                // Pulse wireframe during the "Titanium" to "Specs" transition
                tl.to(realisticMesh.material, { opacity: 0.2, duration: 0.5 }, 3.5);
                tl.to(wireframeMesh.material, { opacity: 1, duration: 0.5 }, 3.5);

                tl.to(realisticMesh.material, { opacity: 1, duration: 0.5 }, 6);
                tl.to(wireframeMesh.material, { opacity: 0, duration: 0.5 }, 6);
            }

        }, outerRef);

        return () => ctx.revert();
    }, [viewport.width]);

    // Custom Interaction Rig (Nested Gimbal Pattern)
    const interactionRef = useRef<THREE.Group>(null);
    const allowRotation = useStore((state) => state.allowRotation);
    const isDragging = useRef(false);
    const previousPointer = useRef({ x: 0, y: 0 });

    const handlePointerDown = (e: any) => {
        if (!allowRotation) return;
        e.stopPropagation(); // Prevent event bubbling
        isDragging.current = true;
        // Capture initial pointer position
        previousPointer.current = { x: e.clientX, y: e.clientY };

        // Optional: Pause auto-float or other animations if needed
        if (document.body) document.body.style.cursor = "grabbing";
    };

    const handlePointerMove = (e: any) => {
        if (!isDragging.current || !interactionRef.current || !allowRotation) return;
        e.stopPropagation();

        const deltaX = e.clientX - previousPointer.current.x;
        const deltaY = e.clientY - previousPointer.current.y;

        // Apply rotation (Sensitivity factor 0.005)
        interactionRef.current.rotation.y += deltaX * 0.005;
        interactionRef.current.rotation.x += deltaY * 0.005;

        previousPointer.current = { x: e.clientX, y: e.clientY };
    };

    const resetSpringBack = () => {
        if (!interactionRef.current) return;
        // Elastic Snap-Back
        gsap.to(interactionRef.current.rotation, {
            x: 0,
            y: 0,
            z: 0,
            duration: 1.2,
            ease: "elastic.out(1, 0.5)",
            overwrite: true
        });
    };

    const handlePointerUp = () => {
        if (!isDragging.current) return;
        isDragging.current = false;
        if (document.body) document.body.style.cursor = "auto";
        resetSpringBack();
    };

    return (
        <Center>
            <group ref={outerRef}>
                <group ref={innerRef}>
                    {/* Interaction Rig: Rotates independently of Scroll Rig */}
                    {/* Invisible Hitbox for easier grabbing */}
                    <mesh
                        visible={false}
                        scale={[3, 3, 3]} // Large hitbox
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerLeave={handlePointerUp} // Safety reset if mouse leaves mesh
                    >
                        <sphereGeometry args={[1, 16, 16]} />
                        <meshBasicMaterial />
                    </mesh>

                    <group ref={interactionRef}>
                        <Model scale={0.4} />
                    </group>
                </group>
            </group>
        </Center>
    );
}

import { useStore } from "@/store";
