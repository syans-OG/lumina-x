"use client";

import { useState, useRef } from "react";
import { Plus } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const faqs = [
        {
            question: "Does it support Multipoint Bluetooth?",
            answer: "Yes, Lumina X supports Bluetooth 5.4 Multipoint, allowing you to connect to two devices simultaneously (e.g., laptop and phone) and switch seamlessly between audio sources."
        },
        {
            question: "Can I use it wired while charging?",
            answer: "Absolutely. The USB-C port handles both high-resolution digital audio (24-bit/96kHz) and charging simultaneously. We also include a 3.5mm analog cable for legacy devices."
        },
        {
            question: "Is the battery replaceable?",
            answer: "To ensure IPX4 water resistance and structural integrity of the titanium chassis, the battery is sealed. However, we offer a comprehensive battery replacement program after the warranty period."
        },
        {
            question: "What codecs are supported?",
            answer: "Lumina X supports the highest resolution wireless spectrum: LDAC, aptX Adaptive, AAC, and SBC. This ensures near-lossless wireless quality across Android and iOS devices."
        },
        {
            question: "Does ANC affect sound quality?",
            answer: "Our Adaptive ANC is tuned to be acoustically transparent to the music signal. It cancels noise without adding pressure or altering the frequency response curve, preserving the artist's intent."
        }
    ];

    useGSAP(() => {
        const items = gsap.utils.toArray(".faq-item");
        gsap.fromTo(items,
            { y: 30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.6,
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
        <section ref={containerRef} className="relative w-full py-24 px-6 md:px-24 bg-transparent pointer-events-auto overflow-hidden">
            {/* Decor - Fluid Ambient Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Moving Orbs */}
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen animate-blob" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-2000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[100px] animate-pulse" />
                {/* Vertical Connector Line */}
                <div className="absolute left-[10%] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-blue-500/10 to-transparent hidden md:block" />
            </div>

            <div className="max-w-3xl mx-auto relative z-10">
                <div className="mb-16 text-center">
                    <h2 className="text-sm font-mono text-blue-400 tracking-[0.3em] uppercase mb-4">Support</h2>
                    <h3 className="text-4xl md:text-5xl font-display font-medium text-white">
                        Common <span className="text-white/20">Questions</span>
                    </h3>
                </div>

                <div className="flex flex-col gap-4">
                    {faqs.map((faq, idx) => {
                        const isOpen = openIndex === idx;
                        return (
                            <div
                                key={idx}
                                onClick={() => setOpenIndex(isOpen ? null : idx)}
                                className={`faq-item relative group p-1 cursor-pointer transition-all duration-500 ${isOpen ? 'bg-gradient-to-b from-white/10 to-transparent' : 'bg-transparent'} rounded-2xl`}
                            >
                                {/* Border Gradient */}
                                <div className={`absolute inset-0 rounded-2xl border transition-colors duration-500 ${isOpen ? 'border-blue-500/30' : 'border-white/5 group-hover:border-white/20'}`} />

                                {/* Inner Glow */}
                                <div className={`absolute inset-0 bg-blue-500/5 blur-xl transition-opacity duration-700 ${isOpen ? 'opacity-100' : 'opacity-0'}`} />

                                <div className="relative z-10 p-6 md:p-8">
                                    <div className="flex items-center justify-between">
                                        <h4 className={`text-lg md:text-xl font-medium transition-colors duration-300 ${isOpen ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
                                            {faq.question}
                                        </h4>
                                        <div className={`relative flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-500 ${isOpen ? 'border-blue-500 bg-blue-500 text-white rotate-45' : 'border-white/20 text-white/40 group-hover:border-white group-hover:text-white'}`}>
                                            <Plus className="w-5 h-5" />
                                        </div>
                                    </div>

                                    <div
                                        className={`grid transition-[grid-template-rows] duration-500 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                                    >
                                        <div className="overflow-hidden">
                                            <div className="mt-4 pt-4 border-t border-white/5 text-white/60 leading-relaxed text-sm md:text-base">
                                                {faq.answer}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
