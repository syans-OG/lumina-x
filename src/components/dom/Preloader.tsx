"use client";

import { useProgress } from "@react-three/drei";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

export default function Preloader() {
    const { progress } = useProgress();
    const [started, setStarted] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const progresstextRef = useRef<HTMLHeadingElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        // Animate progress text
        if (progresstextRef.current) {
            progresstextRef.current.innerText = `${Math.round(progress)}%`;
        }

        if (progress === 100) {
            // Show button when loaded
            gsap.to(buttonRef.current, {
                opacity: 1,
                y: 0,
                duration: 1,
                scale: 1,
                ease: "power3.out",
                pointerEvents: "auto"
            });

            // Hide progress text
            gsap.to(progresstextRef.current, {
                opacity: 0,
                y: -20,
                duration: 0.5
            });
        }
    }, [progress]);

    const onEnter = () => {
        setStarted(true);

        // Luxurious Exit Animation
        const tl = gsap.timeline({
            onComplete: () => {
                if (containerRef.current) {
                    containerRef.current.style.display = "none";
                }
            }
        });

        // 1. Explode/Scale out elements
        tl.to(buttonRef.current, {
            scale: 1.5,
            opacity: 0,
            duration: 0.5,
            ease: "power2.in"
        })
            .to(progresstextRef.current, {
                y: 50,
                opacity: 0,
                duration: 0.5
            }, "<")
            .to(".preloader-logo", {
                scale: 10,
                opacity: 0,
                duration: 1.2,
                ease: "power3.inOut"
            }, "-=0.3")

            // 2. Curtain Open / Fade out container
            .to(containerRef.current, {
                opacity: 0,
                duration: 0.8,
                ease: "power2.inOut"
            }, "-=0.8");
    };

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black text-white pointer-events-auto"
        >
            <div className="relative flex flex-col items-center">
                {/* Logo or Title */}
                <h1 className="preloader-logo text-4xl md:text-6xl font-light tracking-[0.2em] mb-8 animate-pulse text-white/80">
                    LUMINA X
                </h1>

                {/* Progress Text */}
                <h2
                    ref={progresstextRef}
                    className="text-white/50 text-xl font-mono tracking-widest absolute top-24"
                >
                    0%
                </h2>

                {/* Enter Button (Hidden initially) */}
                <button
                    ref={buttonRef}
                    onClick={onEnter}
                    className="opacity-0 translate-y-10 scale-90 pointer-events-none absolute top-24 px-8 py-3 border border-white/20 rounded-full text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300"
                >
                    Enter Experience
                </button>
            </div>
        </div>
    );
}
