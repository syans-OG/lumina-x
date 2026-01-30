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
    const outerRef = useRef<THREE.Group>(null);
    const innerRef = useRef<THREE.Group>(null);

    const { viewport } = useThree();

    let frameCount = 0;
    useFrame((state) => {
        if (!innerRef.current) return;

        frameCount++;
        if (frameCount % 2 !== 0) return;

        const t = state.clock.elapsedTime;
        innerRef.current.position.y = Math.sin(t * 0.5) * 0.15 + Math.sin(t * 1.5) * 0.05;
        innerRef.current.position.x = Math.sin(t * 0.3) * 0.1;
        innerRef.current.rotation.z = Math.sin(t * 0.2) * 0.05;
        innerRef.current.rotation.x = Math.cos(t * 0.3) * 0.05;
    });

    useLayoutEffect(() => {
        const group = outerRef.current;
        if (!group) return;

        const realisticMesh = group.getObjectByName("realistic") as THREE.Mesh;
        const wireframeMesh = group.getObjectByName("wireframe") as THREE.Mesh;

        if (realisticMesh?.material instanceof THREE.Material) {
            realisticMesh.material.transparent = true;
            realisticMesh.material.needsUpdate = true;
        }

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: document.getElementById("immersive-wrapper"),
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 0.8,
                    fastScrollEnd: true,
                },
            });

            tl.to(group.position, {
                x: -viewport.width * 0.25,
                y: -0.5,
                z: 0.5,
                duration: 2,
                ease: "power2.inOut"
            }, 0);
            tl.to(group.rotation, {
                y: Math.PI / 5,
                x: 0.1,
                duration: 2,
                ease: "power2.inOut"
            }, 0);
            tl.to(group.scale, {
                x: 1.5, y: 1.5, z: 1.5,
                duration: 2
            }, 0);

            tl.to(group.position, {
                x: viewport.width * 0.25,
                y: 0.5,
                z: -1,
                duration: 2.5,
                ease: "power1.inOut"
            }, 2);
            tl.to(group.rotation, {
                y: -Math.PI / 5,
                x: -0.2,
                duration: 2.5,
                ease: "power1.inOut"
            }, 2);
            tl.to(group.scale, {
                x: 1.1, y: 1.1, z: 1.1,
                duration: 2.5
            }, 2);

            tl.to(group.position, {
                x: 0,
                y: 0,
                z: 0,
                duration: 2.5,
                ease: "power2.inOut"
            }, 4.5);
            tl.to(group.rotation, {
                y: Math.PI * 2,
                x: 0,
                duration: 3,
                ease: "power2.inOut"
            }, 4.5);
            tl.to(group.scale, {
                x: 0.9, y: 0.9, z: 0.9,
                duration: 2.5
            }, 4.5);

            if (realisticMesh && wireframeMesh) {
                tl.to(realisticMesh.material, { opacity: 0.2, duration: 0.5 }, 3.5);
                tl.to(wireframeMesh.material, { opacity: 1, duration: 0.5 }, 3.5);

                tl.to(realisticMesh.material, { opacity: 1, duration: 0.5 }, 6);
                tl.to(wireframeMesh.material, { opacity: 0, duration: 0.5 }, 6);
            }

        }, outerRef);

        return () => ctx.revert();
    }, [viewport.width]);

    const interactionRef = useRef<THREE.Group>(null);
    const allowRotation = useStore((state) => state.allowRotation);
    const isDragging = useRef(false);
    const previousPointer = useRef({ x: 0, y: 0 });

    const handlePointerDown = (e: any) => {
        if (!allowRotation) return;
        e.stopPropagation();
        isDragging.current = true;
        previousPointer.current = { x: e.clientX, y: e.clientY };

        if (document.body) document.body.style.cursor = "grabbing";
    };

    const handlePointerMove = (e: any) => {
        if (!isDragging.current || !interactionRef.current || !allowRotation) return;
        e.stopPropagation();

        const deltaX = e.clientX - previousPointer.current.x;
        const deltaY = e.clientY - previousPointer.current.y;

        interactionRef.current.rotation.y += deltaX * 0.005;
        interactionRef.current.rotation.x += deltaY * 0.005;

        previousPointer.current = { x: e.clientX, y: e.clientY };
    };

    const resetSpringBack = () => {
        if (!interactionRef.current) return;
        gsap.to(interactionRef.current.rotation, {
            x: 0,
            y: 0,
            z: 0,
            duration: 1.2,
            ease: "elastic.out(1, 0.5)",
            overwrite: true,
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
                    <mesh
                        visible={false}
                        scale={[3, 3, 3]}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerLeave={handlePointerUp}
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
