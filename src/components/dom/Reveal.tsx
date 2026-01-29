"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface RevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
}

export default function Reveal({
    children,
    className = "",
    delay = 0,
    duration = 0.8
}: RevealProps) {
    const elRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = elRef.current;
        const wrapper = wrapperRef.current;
        if (!el || !wrapper) return;

        // Reset state for potential re-triggers or hot reloads
        gsap.set(el, { yPercent: 100, skewY: 2, opacity: 0 });

        gsap.to(el, {
            yPercent: 0,
            skewY: 0,
            opacity: 1,
            duration: duration,
            delay: delay,
            ease: "cubic-bezier(0.19, 1, 0.22, 1)", // Editorial ease: sharp start, long smooth end
            scrollTrigger: {
                trigger: wrapper, // Use stable wrapper as trigger
                start: "top bottom", // Trigger EXACTLY when top of wrapper hits bottom of viewport
                toggleActions: "play none none reverse", // Reversible for premium feel
            }
        });

        return () => {
            ScrollTrigger.getById(el.id)?.kill();
        };
    }, [delay, duration]);

    return (
        <div ref={wrapperRef} className={`overflow-hidden ${className}`}>
            <div ref={elRef} className="will-change-transform">
                {children}
            </div>
        </div>
    );
}
