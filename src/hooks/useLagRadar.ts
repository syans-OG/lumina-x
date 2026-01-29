"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface LagRadarOptions {
    skewFactor?: number;
    blurFactor?: number;
    maxSkew?: number;
    maxBlur?: number;
    lerp?: number;
}

export function useLagRadar(
    ref: React.RefObject<HTMLElement | null>,
    options: LagRadarOptions = {}
) {
    const {
        skewFactor = 0.15,
        blurFactor = 0.02,
        maxSkew = 5,
        maxBlur = 3,
        lerp = 0.1
    } = options;

    const state = useRef({
        y: 0,
        lastY: 0,
        skew: 0,
        blur: 0
    });

    useEffect(() => {
        // Initialize state
        state.current.y = window.scrollY;
        state.current.lastY = window.scrollY;

        const handleScroll = () => {
            state.current.y = window.scrollY;
        };
        window.addEventListener("scroll", handleScroll, { passive: true });

        const update = () => {
            if (!ref.current) return;

            const diff = state.current.y - state.current.lastY;

            // Lerp the skew/blur values for smoothness
            // Target skew is diff * factor
            const targetSkew = Math.min(Math.max(diff * skewFactor, -maxSkew), maxSkew);
            const targetBlur = Math.min(Math.abs(diff) * blurFactor, maxBlur);

            // Interpolate
            state.current.skew += (targetSkew - state.current.skew) * lerp;
            state.current.blur += (targetBlur - state.current.blur) * lerp;
            state.current.lastY += (state.current.y - state.current.lastY) * lerp; // Soft follow for velocity calc? 
            // Actually better to just track velocity directly:
            // velocity = current - last
            // smoothedVelocity += (velocity - smoothedVelocity) * lerp

            // Let's refine the physics:
            // 1. Instant velocity
            const velocity = state.current.y - state.current.lastY;

            // 2. We actually want to lerp the EFFECT, not the input position, to avoid laggy scrolling feeling.
            // But we can't get velocity without tracking last frame.

            // Standard approach:
            // On each frame:
            // currentScroll = window.scrollY
            // velocity = currentScroll - lastFrameScroll
            // smoothedSkew += (velocity * skewFactor - smoothedSkew) * lerp
            // ref.style.transform = ...
            // lastFrameScroll = currentScroll
        };

        // GSAP Ticker is better than rAF for syncing with ScrollTrigger
        const render = () => {
            if (!ref.current) return;

            const currentY = window.scrollY;
            const velocity = currentY - state.current.lastY;
            state.current.lastY = currentY;

            const targetSkew = velocity * skewFactor;
            const targetBlur = Math.abs(velocity) * blurFactor;

            // Smooth the effect
            state.current.skew += (targetSkew - state.current.skew) * lerp;
            state.current.blur += (targetBlur - state.current.blur) * lerp;

            // Clamp
            const finalSkew = Math.min(Math.max(state.current.skew, -maxSkew), maxSkew);
            const finalBlur = Math.min(state.current.blur, maxBlur);

            // Apply
            // Using will-change in CSS is recommended
            if (Math.abs(finalSkew) > 0.01 || finalBlur > 0.01) {
                gsap.set(ref.current, {
                    skewY: finalSkew,
                    filter: `blur(${finalBlur}px)`,
                    force3D: true
                });
            } else {
                // Reset strictly to avoid sub-pixel blur
                gsap.set(ref.current, {
                    skewY: 0,
                    filter: "blur(0px)",
                    force3D: true
                });
            }
        };

        gsap.ticker.add(render);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            gsap.ticker.remove(render);
        };
    }, [skewFactor, blurFactor, maxSkew, maxBlur, lerp]);
}
