"use client";

import { useRef, useState, useEffect } from "react";
import { Download, Cpu, Activity, Zap, Layers, Wifi, Maximize, Droplets } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useToastStore } from "./Toast";

gsap.registerPlugin(ScrollTrigger);

type SpecItem = {
    label: string;
    value: string;
    sub?: string;
};

type SpecCategory = {
    id: string;
    title: string;
    icon: any;
    items: SpecItem[];
};

const specsData: SpecCategory[] = [
    {
        id: "audio",
        title: "Acoustic Architecture",
        icon: Activity,
        items: [
            { label: "Driver Unit", value: "40mm Bio-Cellulose", sub: "Dynamic" },
            { label: "Frequency", value: "5Hz - 50kHz", sub: "Wired Mode" },
            { label: "Sensitivity", value: "98 dB/mW", sub: "@ 1kHz" },
            { label: "THD", value: "<0.3%", sub: "100dB SPL" },
        ]
    },
    {
        id: "connectivity",
        title: "Signal Path",
        icon: Wifi,
        items: [
            { label: "Bluetooth", value: "Ver 5.4", sub: "Multipoint" },
            { label: "Codecs", value: "LDAC / AptX", sub: "Lossless" },
            { label: "Latency", value: "15ms", sub: "PhotonLink™" },
            { label: "Range", value: "50ft / 15m", sub: "Line of Sight" },
        ]
    },
    {
        id: "power",
        title: "Energy System",
        icon: Zap,
        items: [
            { label: "Battery", value: "50 Hours", sub: "ANC Off" },
            { label: "Charge", value: "15m = 5Hrs", sub: "Quick Charge" },
            { label: "Standby", value: "300 Hours", sub: "Low Power Mode" },
            { label: "Input", value: "USB-C", sub: "PD 3.0" },
        ]
    },
    {
        id: "build",
        title: "Chassis",
        icon: Layers,
        items: [
            { label: "Weight", value: "250g", sub: "Ultra-light" },
            { label: "Material", value: "Ti-6Al-4V", sub: "Grade 5 Titanium" },
            { label: "Rating", value: "IPX4", sub: "Splash Resistant" },
            { label: "Pads", value: "Memory Foam", sub: "Lambskin" },
        ]
    }
];

const HoloCard = ({ category, index }: { category: SpecCategory; index: number }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current || !glowRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        gsap.to(cardRef.current, {
            rotateX: rotateX,
            rotateY: rotateY,
            duration: 0.5,
            ease: "power2.out"
        });

        gsap.to(glowRef.current, {
            x: x,
            y: y,
            opacity: 1,
            duration: 0.1
        });
    };

    const handleMouseLeave = () => {
        if (!cardRef.current || !glowRef.current) return;

        gsap.to(cardRef.current, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.8,
            ease: "elastic.out(1, 0.5)"
        });

        gsap.to(glowRef.current, {
            opacity: 0,
            duration: 0.5
        });
    };

    return (
        <div
            className="perspective-1000 w-full"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div
                ref={cardRef}
                className="spec-card relative w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden group transform-style-3d hover:border-blue-500/30 transition-colors duration-500"
            >
                <div
                    ref={glowRef}
                    className="absolute w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 z-0"
                />

                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent h-[200%] translate-y-[-100%] group-hover:animate-scanline pointer-events-none z-0" />

                <div className="relative z-10 p-8">
                    <div className="flex items-center gap-4 mb-8 border-b border-white/5 pb-4">
                        <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
                            <category.icon className="w-5 h-5" />
                        </div>
                        <h3 className="font-display text-xl text-white tracking-wide uppercase">
                            {category.title}
                        </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                        {category.items.map((item, i) => (
                            <div key={i} className="flex flex-col">
                                <span className="text-[10px] text-white/40 font-mono uppercase tracking-widest mb-1">
                                    {item.label}
                                </span>
                                <span className="text-white font-medium tracking-tight">
                                    {item.value}
                                </span>
                                {item.sub && (
                                    <span className="text-[10px] text-blue-400 font-mono mt-1 opacity-60">
                                        {item.sub}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20" />
            </div>
        </div>
    );
};

export default function TechSpecsTable() {
    const containerRef = useRef<HTMLDivElement>(null);
    const addToast = useToastStore((state) => state.addToast);

    const handleDownload = () => {
        addToast("Downloading Datasheet PDF...", "download");
    };

    useGSAP(() => {
        const cards = gsap.utils.toArray<HTMLElement>(".spec-card");

        gsap.fromTo(cards,
            {
                y: 50,
                opacity: 0,
                rotateX: 10
            },
            {
                y: 0,
                opacity: 1,
                rotateX: 0,
                duration: 1,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play reverse play reverse"
                }
            }
        );

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative w-full py-32 px-6 md:px-12 bg-transparent overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '40px 40px',
                        maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
                    }}
                />

                <div className="absolute top-[10%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="absolute bottom-[10%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <div className="absolute left-[10%] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-blue-500/10 to-blue-500/10 hidden md:block" />

                <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="mb-20 text-center">
                    <h2 className="text-sm font-mono text-blue-400 tracking-[0.3em] uppercase mb-4">
                        /// System Architecture
                    </h2>
                    <h3 className="text-5xl md:text-7xl font-display font-medium text-white tracking-tighter">
                        Technical <span className="text-white/20">Data</span>
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {specsData.map((category, idx) => (
                        <HoloCard key={category.id} category={category} index={idx} />
                    ))}
                </div>

                <div className="mt-24 flex justify-center">
                    <button onClick={handleDownload} suppressHydrationWarning className="group relative px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all duration-300">
                        <div className="flex items-center gap-3">
                            <Download className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                            <span className="font-mono text-xs text-white uppercase tracking-widest">
                                Download Datasheet
                            </span>
                        </div>
                        <div className="absolute inset-0 rounded-full border border-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
                    </button>
                </div>
            </div>

            <style jsx global>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                .transform-style-3d {
                    transform-style: preserve-3d;
                }
            `}</style>
        </section>
    );
}
