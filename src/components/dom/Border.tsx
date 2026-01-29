"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface BorderProps {
    className?: string;
    axis?: "horizontal" | "vertical";
    delay?: number;
    duration?: number;
}

export default function Border({
    className = "",
    axis = "horizontal",
    delay = 0,
    duration = 1.0
}: BorderProps) {
    const elRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = elRef.current;
        if (!el) return;

        if (axis === "horizontal") {
            gsap.set(el, { scaleX: 0, transformOrigin: "center" });
        } else {
            gsap.set(el, { scaleY: 0, transformOrigin: "center" });
        }

        gsap.to(el, {
            scaleX: axis === "horizontal" ? 1 : 1,
            scaleY: axis === "vertical" ? 1 : 1,
            duration: duration,
            delay: delay,
            ease: "power2.inOut",
            scrollTrigger: {
                trigger: el,
                start: "top 95%",
                toggleActions: "play none none reverse",
            }
        });

        return () => {
            ScrollTrigger.getById(el.id)?.kill();
        };
    }, [axis, delay, duration]);

    return (
        <div
            ref={elRef}
            className={`${className} bg-white/20 ${axis === "horizontal" ? "h-[1px] w-full" : "w-[1px] h-full"}`}
        />
    );
}
