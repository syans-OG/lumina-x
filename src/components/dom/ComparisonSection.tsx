"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrambleText from "@/components/dom/ScrambleText";
import ComparisonVisualizer from "./ComparisonVisualizer";
import Reveal from "@/components/dom/Reveal";
import Border from "@/components/dom/Border";

gsap.registerPlugin(ScrollTrigger);

export default function ComparisonSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [sliderValue, setSliderValue] = useState(0.5);

    // 0 = Standard (Right), 1 = Lumina (Left)
    // Buttons will animate this value.

    const handleToggle = (target: number) => {
        const start = { v: sliderValue };
        gsap.to(start, {
            v: target,
            duration: 1.2,
            ease: "power2.inOut",
            onUpdate: () => setSliderValue(start.v)
        });
    };

    // If slider > 0.5 (mostly Lumina), show Lumina stats. Else Standard.
    const isLuminaDominant = sliderValue > 0.5;

    const latencyVal = isLuminaDominant ? "15ms" : "60ms";
    const fidelityVal = isLuminaDominant ? "Lossless" : "Lossy";

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        gsap.fromTo(
            section.querySelectorAll(".anim-card-reveal"),
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 70%",
                    end: "bottom 20%",
                    toggleActions: "play reverse play reverse"
                }
            }
        );
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative min-h-[120vh] w-full flex flex-col items-center justify-center py-24 px-4 md:px-12 pointer-events-auto bg-transparent overflow-hidden"
        >
            {/* Background Grid - subtle integration */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100px_100px]" />

            {/* Vertical Connector Line */}
            <div className="absolute left-[10%] top-0 bottom-0 w-[1px] bg-gradient-to-b from-blue-500/0 via-blue-500/10 to-blue-500/0 hidden md:block" />


            <div className="container max-w-7xl mx-auto relative z-10 flex flex-col h-full">

                {/* 1. Header */}
                <div className="w-full grid grid-cols-12 mb-12 items-end relative pb-8">
                    <Border axis="horizontal" className="absolute bottom-0 left-0" />
                    <div className="col-span-12 md:col-span-8">
                        <Reveal>
                            <h2 className="text-white/40 text-sm font-mono tracking-[0.2em] uppercase mb-4">
                                Reality Check
                            </h2>
                        </Reveal>
                        <Reveal delay={0.1}>
                            <h3 className="text-5xl md:text-8xl font-display font-medium text-white tracking-tighter leading-[0.9]">
                                Signal <span className="text-white/20 italic font-serif">vs Noise</span>
                            </h3>
                        </Reveal>
                    </div>
                </div>

                {/* 2. Main Interactive Stage */}
                <div className="relative w-full h-[60vh] border border-white/10 rounded-2xl overflow-hidden bg-black/80 backdrop-blur-sm anim-card-reveal shadow-2xl">

                    {/* Visualizer Layer */}
                    <div className="absolute inset-0 z-0">
                        <ComparisonVisualizer sliderValue={sliderValue} />
                    </div>

                    {/* HUD Overlay */}
                    <div className="absolute inset-0 z-10 pointer-events-none p-8 flex flex-col justify-between">
                        <div className="flex justify-between items-start font-mono text-xs tracking-widest uppercase">
                            <span className="text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]">Lumina X (Signal)</span>
                            <span className="text-red-400/80 drop-shadow-[0_0_10px_rgba(240,80,80,0.4)]">Generic (Noise)</span>
                        </div>

                        {/* Centered Metrics (Changes based on slider) */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-12 text-center mix-blend-difference">
                            <div>
                                <div className="text-[10px] text-white/60 mb-2 font-mono uppercase">Avg Latency</div>
                                <div className="text-5xl md:text-7xl font-display text-white">
                                    <ScrambleText text={latencyVal} key={latencyVal} />
                                </div>
                            </div>
                            <div className="hidden md:block w-[1px] bg-white/20 h-full" />
                            <div>
                                <div className="text-[10px] text-white/60 mb-2 font-mono uppercase">Transmission</div>
                                <div className="text-5xl md:text-7xl font-display text-white">
                                    <ScrambleText text={fidelityVal} key={fidelityVal} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Toggle Controls */}
                    <div className="absolute bottom-12 left-0 w-full z-20 flex justify-center items-center pointer-events-auto">
                        <div className="flex items-center bg-black/50 backdrop-blur-md border border-white/10 rounded-full p-1 gap-1 shadow-2xl">
                            <button
                                onClick={() => handleToggle(1)}
                                suppressHydrationWarning
                                className={`
                                    relative px-8 py-3 rounded-full text-xs font-mono tracking-widest uppercase transition-all duration-500
                                    ${sliderValue > 0.5 ? 'text-white' : 'text-white/40 hover:text-white'}
                                `}
                            >
                                <span className="relative z-10">Lumina X</span>
                                {sliderValue > 0.5 && (
                                    <div className="absolute inset-0 bg-blue-600/20 border border-blue-500/50 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.3)]" /> // Active Glow
                                )}
                            </button>

                            <div className="w-[1px] h-4 bg-white/10 mx-2" />

                            <button
                                onClick={() => handleToggle(0)}
                                suppressHydrationWarning
                                className={`
                                    relative px-8 py-3 rounded-full text-xs font-mono tracking-widest uppercase transition-all duration-500
                                    ${sliderValue <= 0.5 ? 'text-red-400' : 'text-white/40 hover:text-white'}
                                `}
                            >
                                <span className="relative z-10">Generic</span>
                                {sliderValue <= 0.5 && (
                                    <div className="absolute inset-0 bg-red-500/10 border border-red-500/30 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.2)]" /> // Active Glow
                                )}
                            </button>
                        </div>
                    </div>

                </div>

            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 border-l border-white/10 relative overflow-hidden group hover:bg-white/5 transition-colors">
                    <h4 className="text-white font-medium mb-2 group-hover:text-blue-400 transition-colors">Phase Coherence</h4>
                    <p className="text-white/40 text-sm">Perfectly aligned waveforms ensure sound hits your ear exactly as the artist intended.</p>
                </div>
                <div className="p-6 border-l border-white/10 relative overflow-hidden group hover:bg-white/5 transition-colors">
                    <h4 className="text-white font-medium mb-2 group-hover:text-blue-400 transition-colors">Zero Noise Floor</h4>
                    <p className="text-white/40 text-sm">Dark silence when needed. Dynamic range that explodes from absolute zero.</p>
                </div>
                <div className="p-6 border-l border-white/10 relative overflow-hidden group hover:bg-white/5 transition-colors">
                    <h4 className="text-white font-medium mb-2 group-hover:text-blue-400 transition-colors">Instant Response</h4>
                    <p className="text-white/40 text-sm">Drivers react in microseconds, preserving the attack of drums and snap of strings.</p>
                </div>
            </div>

        </section>
    );
}

