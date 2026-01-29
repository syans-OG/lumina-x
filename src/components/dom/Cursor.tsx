"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function Cursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const followerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Hide default cursor
        document.body.style.cursor = "none";

        // QuickTo for performant mouse tracking
        const xTo = gsap.quickTo(cursorRef.current, "x", { duration: 0.1, ease: "power3.out" });
        const yTo = gsap.quickTo(cursorRef.current, "y", { duration: 0.1, ease: "power3.out" });

        const xFollow = gsap.quickTo(followerRef.current, "x", { duration: 0.6, ease: "power3.out" });
        const yFollow = gsap.quickTo(followerRef.current, "y", { duration: 0.6, ease: "power3.out" });

        const onMouseMove = (e: MouseEvent) => {
            xTo(e.clientX);
            yTo(e.clientY);
            xFollow(e.clientX);
            yFollow(e.clientY);
        };

        // Magnetic effect logic
        const onMouseEnter = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === "BUTTON" || target.tagName === "A" || target.closest("button") || target.closest("a")) {
                gsap.to(followerRef.current, { scale: 3, opacity: 0.2, duration: 0.3 });
                gsap.to(cursorRef.current, { scale: 0, duration: 0.3 }); // Hide center dot
            }
        }

        const onMouseLeave = () => {
            gsap.to(followerRef.current, { scale: 1, opacity: 0.5, duration: 0.3 });
            gsap.to(cursorRef.current, { scale: 1, duration: 0.3 });
        }

        window.addEventListener("mousemove", onMouseMove);

        // Attach listeners to interactive elements globally (simple delegate or just global listener)
        // For simplicity and performance, we'll just check hovering within mousemove or a global listener
        // Better: Global delegation

        document.addEventListener("mouseover", onMouseEnter, true);
        document.addEventListener("mouseout", onMouseLeave, true);

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseover", onMouseEnter, true);
            document.removeEventListener("mouseout", onMouseLeave, true);
            document.body.style.cursor = "auto";
        };
    }, { scope: cursorRef });

    return (
        <>
            {/* Main tiny dot */}
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 w-3 h-3 bg-white rounded-full z-[9999] pointer-events-none mix-blend-difference -translate-x-1/2 -translate-y-1/2"
            />
            {/* Trailing follower */}
            <div
                ref={followerRef}
                className="fixed top-0 left-0 w-8 h-8 border border-white/50 rounded-full z-[9998] pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 opacity-50"
            />
        </>
    );
}
