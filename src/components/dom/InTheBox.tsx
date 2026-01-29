"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Headphones, Box, Cable, FileText, Music } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// --- Types ---
type BoxItem = {
    name: string;
    description: string;
    icon: any;
    colSpan: string;
    image?: string;
};

const SpotlightCard = ({ item, index }: { item: BoxItem; index: number }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Spotlight Gradient
        cardRef.current.style.setProperty("--mouse-x", `${x}px`);
        cardRef.current.style.setProperty("--mouse-y", `${y}px`);

        // Tilt
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -3;
        const rotateY = ((x - centerX) / centerX) * 3;

        gsap.to(cardRef.current, {
            rotateX: rotateX,
            rotateY: rotateY,
            duration: 0.5,
            ease: "power2.out"
        });

        if (contentRef.current) {
            gsap.to(contentRef.current, {
                x: (x - centerX) * 0.05,
                y: (y - centerY) * 0.05,
                duration: 0.5
            });
        }
    };

    const handleMouseLeave = () => {
        if (!cardRef.current) return;

        gsap.to(cardRef.current, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.8,
            ease: "elastic.out(1, 0.5)"
        });

        if (contentRef.current) {
            gsap.to(contentRef.current, { x: 0, y: 0, duration: 0.5 });
        }
    };

    return (
        <div
            className={`perspective-1000 ${item.colSpan}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div
                ref={cardRef}
                className="group relative h-full min-h-[300px] rounded-3xl bg-white/5 border border-white/10 overflow-hidden transform-style-3d hover:z-10 transition-colors duration-500"
                style={{
                    background: `
                        radial-gradient(
                            800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), 
                            rgba(255,255,255,0.06),
                            transparent 40%
                        ),
                        rgba(20, 20, 20, 0.6)
                    `
                }}
            >
                <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700">
                    <div className="w-full h-full bg-gradient-to-br from-blue-500/10 to-transparent" />
                </div>

                <div ref={contentRef} className="relative z-10 p-10 flex flex-col justify-between h-full transform-style-3d bg-transparent">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white mb-8 border border-white/5 shadow-lg group-hover:scale-110 transition-transform duration-500">
                        <item.icon className="w-6 h-6" />
                    </div>

                    <div>
                        <div className="text-[10px] text-white/40 font-mono tracking-widest uppercase mb-2">Item 0{index + 1}</div>
                        <h3 className="text-2xl font-display text-white mb-2">{item.name}</h3>
                        <p className="text-white/50 text-sm leading-relaxed max-w-[80%]">{item.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function InTheBox() {
    const sectionRef = useRef<HTMLDivElement>(null);

    const items: BoxItem[] = [
        {
            name: "Lumina X Headset",
            description: "The main event. Grade 5 Titanium construction with Bio-cellulose drivers.",
            icon: Headphones,
            colSpan: "md:col-span-2 md:row-span-2",
        },
        {
            name: "Travel Case",
            description: "Hard-shell ballistic nylon with soft velvet interior.",
            icon: Box,
            colSpan: "md:col-span-1",
        },
        {
            name: "Smart Cable",
            description: "USB-C to USB-C 1.5m braided cable for charging and Hi-Res audio.",
            icon: Cable,
            colSpan: "md:col-span-1",
        },
        {
            name: "3.5mm Analog",
            description: "For legacy connections and flight entertainment systems.",
            icon: Music,
            colSpan: "md:col-span-1",
        },
        {
            name: "Documentation",
            description: "Quick start guide, warranty card, and authenticity certificate.",
            icon: FileText,
            colSpan: "md:col-span-1",
        },
    ];

    useGSAP(() => {
        const section = sectionRef.current;
        if (!section) return;

        gsap.fromTo(
            section.querySelectorAll(".perspective-1000"),
            { y: 100, opacity: 0, rotateX: 10 },
            {
                y: 0,
                opacity: 1,
                rotateX: 0,
                duration: 1,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play reverse play reverse"
                }
            }
        );
    }, []);

    return (
        <section ref={sectionRef} className="relative w-full py-40 px-6 md:px-12 bg-transparent pointer-events-auto">
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Vertical Connector Line */}
                <div className="absolute left-6 md:left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-blue-500/20 via-blue-500/5 to-transparent hidden md:block" />

                <div className="mb-24 flex flex-col md:flex-row items-end justify-between gap-8 pl-0 md:pl-12">
                    <div>
                        <h2 className="text-blue-500 font-mono text-xs uppercase tracking-[0.3em] mb-4">Unboxing Experience</h2>
                        <h3 className="text-5xl md:text-7xl font-display font-medium text-white tracking-tighter">
                            Inside the <span className="text-white/20 italic font-serif">Vault</span>
                        </h3>
                    </div>
                    <p className="text-white/50 max-w-sm text-right hidden md:block">
                        A fully recyclable packaging experience designed to protect your investment.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-auto md:h-[600px]">
                    {items.map((item, idx) => (
                        <SpotlightCard key={idx} item={item} index={idx} />
                    ))}
                </div>
            </div>
        </section>
    );
}
