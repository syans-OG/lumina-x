"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ShieldCheck, Truck, RotateCcw, MessageCircle } from "lucide-react";

const Marquee = ({ items, reverse = false }: { items: string[]; reverse?: boolean }) => {
    const trackRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const track = trackRef.current;
        if (!track) return;

        // Clone items for infinite loop
        const totalWidth = track.scrollWidth / 2;

        gsap.to(track, {
            x: reverse ? totalWidth / 2 : -totalWidth / 2,
            duration: 20,
            ease: "none",
            repeat: -1,
            modifiers: {
                x: gsap.utils.unitize(x => parseFloat(x) % totalWidth) // Seamless loop logic simplified
            }
        });

        // Simpler approach for infinite marquee without plugins:
        // Just animate from 0 to -50% (if duplicated contents)
        gsap.fromTo(track,
            { x: reverse ? "-50%" : "0%" },
            {
                x: reverse ? "0%" : "-50%",
                duration: 30,
                ease: "none",
                repeat: -1
            }
        );

    }, []);

    return (
        <div className="flex overflow-hidden w-full relative group">
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-black via-transparent to-black pointer-events-none" />
            <div ref={trackRef} className="flex gap-12 whitespace-nowrap py-12 items-center will-change-transform opacity-30 group-hover:opacity-100 transition-opacity duration-500">
                {[...items, ...items, ...items, ...items].map((item, idx) => (
                    <span key={idx} className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tighter text-transparent stroke-text-white select-none">
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default function TrustGrid() {

    const trustItems = [
        {
            icon: ShieldCheck,
            title: "2-Year Warranty",
            desc: "Comprehensive coverage."
        },
        {
            icon: RotateCcw,
            title: "30-Day Trial",
            desc: "Love it or return it."
        },
        {
            icon: Truck,
            title: "Global Shipping",
            desc: "Express to 150+ countries."
        },
        {
            icon: MessageCircle,
            title: "24/7 Support",
            desc: "Real audiophile support."
        }
    ];

    const pressLogos = [
        "The Verge", "Wired", "TechCrunch", "Hypebeast", "Esquire", "GQ", "Forbes"
    ];

    // Animate Grid Items
    useGSAP(() => {
        const items = gsap.utils.toArray(".trust-item");
        gsap.fromTo(items,
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".trust-grid-container",
                    start: "top 85%",
                    end: "bottom 15%",
                    toggleActions: "play reverse play reverse"
                }
            }
        );
    }, []);

    return (
        <section className="w-full bg-transparent py-24 px-0 border-t border-white/5 overflow-hidden relative">
            {/* Vertical Connector Line */}
            <div className="absolute left-[10%] top-0 bottom-0 w-[1px] bg-gradient-to-b from-blue-500/0 via-blue-500/10 to-transparent hidden md:block" />

            {/* 1. Kinetic Marquee */}
            <div className="mb-24">
                <Marquee items={pressLogos} />
            </div>

            {/* 2. Trust Grid */}
            <div className="trust-grid-container max-w-7xl mx-auto px-6 md:px-24">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {trustItems.map((item, idx) => (
                        <div key={idx} className="trust-item relative group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-300 overflow-hidden">
                            {/* Hover Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:to-transparent transition-all duration-500" />

                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="mb-4 text-white/40 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                                    <item.icon className="w-8 h-8" />
                                </div>
                                <h4 className="text-white font-medium text-sm mb-1 uppercase tracking-wide">{item.title}</h4>
                                <p className="text-white/40 text-xs">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx global>{`
                .stroke-text-white {
                    -webkit-text-stroke: 1px rgba(255,255,255,0.4);
                    color: transparent;
                }
            `}</style>
        </section>
    );
}
