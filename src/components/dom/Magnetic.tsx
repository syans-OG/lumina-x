"use client";

import { useRef, ReactElement, cloneElement, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface MagneticProps {
    children: ReactElement;
    strength?: number; // How far it moves (default: 0.5)
}

export default function Magnetic({ children, strength = 0.5 }: MagneticProps) {
    const magnetic = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!magnetic.current) return;

        const xTo = gsap.quickTo(magnetic.current, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
        const yTo = gsap.quickTo(magnetic.current, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

        const mouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { height, width, left, top } = magnetic.current!.getBoundingClientRect();

            // Calculate center of element
            const cx = left + width / 2;
            const cy = top + height / 2;

            // Calculate distance from center
            const x = (clientX - cx) * strength;
            const y = (clientY - cy) * strength;

            xTo(x);
            yTo(y);
        };

        const mouseLeave = () => {
            xTo(0);
            yTo(0);
        };

        magnetic.current.addEventListener("mousemove", mouseMove);
        magnetic.current.addEventListener("mouseleave", mouseLeave);

        return () => {
            if (magnetic.current) {
                magnetic.current.removeEventListener("mousemove", mouseMove);
                magnetic.current.removeEventListener("mouseleave", mouseLeave);
            }
        };
    }, { scope: magnetic });

    // Clone child to attach ref and preserve existing logic
    return cloneElement(children as any, { ref: magnetic });
}
