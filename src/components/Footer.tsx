"use client";

import { Twitter, Instagram, Linkedin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";

export default function Footer() {
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        const btn = buttonRef.current;
        if (!btn) return;
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(btn, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.3,
            ease: "power2.out"
        });
    };

    const handleMouseLeave = () => {
        if (!buttonRef.current) return;
        gsap.to(buttonRef.current, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" });
    };

    return (
        <footer className="relative w-full bg-transparent text-white pt-16 pb-8 px-6 md:px-24 overflow-hidden border-t border-white/5 pointer-events-auto">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-900/10 rounded-full blur-[128px] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto flex flex-col gap-12">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
                    <div className="max-w-xl">
                        <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6">
                            Stay ahead of the <span className="text-blue-500 font-medium">curve</span>.
                        </h2>
                        <p className="text-white/50 text-lg font-light leading-relaxed">
                            Join our newsletter for exclusive updates, early access to new products, and behind-the-scenes content.
                        </p>
                    </div>

                    <div className="w-full md:w-auto flex flex-col gap-4">
                        <form className="flex gap-2">
                            <input
                                suppressHydrationWarning
                                type="email"
                                placeholder="Enter your email"
                                className="bg-white/5 border border-white/10 rounded-full px-6 py-4 w-full md:w-80 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 transition-colors backdrop-blur-sm"
                            />
                            <button
                                suppressHydrationWarning
                                ref={buttonRef}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                                className="bg-white text-black rounded-full w-14 h-14 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors duration-300 transform-gpu"
                            >
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </form>
                        <p className="text-xs text-white/30 pl-4">We respect your privacy. Unsubscribe at any time.</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/5 pt-10">
                    <div className="flex flex-col gap-6">
                        <h3 className="text-sm font-bold tracking-widest uppercase text-white/40">Product</h3>
                        <ul className="flex flex-col gap-4">
                            <li><Link href="#" className="text-white/70 hover:text-blue-400 transition-colors">Lumina X</Link></li>
                            <li><Link href="#" className="text-white/70 hover:text-blue-400 transition-colors">Accessories</Link></li>
                            <li><Link href="#" className="text-white/70 hover:text-blue-400 transition-colors">Sound Lab</Link></li>
                        </ul>
                    </div>
                    <div className="flex flex-col gap-6">
                        <h3 className="text-sm font-bold tracking-widest uppercase text-white/40">Company</h3>
                        <ul className="flex flex-col gap-4">
                            <li><Link href="#" className="text-white/70 hover:text-blue-400 transition-colors">About Us</Link></li>
                            <li><Link href="#" className="text-white/70 hover:text-blue-400 transition-colors">Careers</Link></li>
                            <li><Link href="#" className="text-white/70 hover:text-blue-400 transition-colors">Press</Link></li>
                        </ul>
                    </div>
                    <div className="flex flex-col gap-6">
                        <h3 className="text-sm font-bold tracking-widest uppercase text-white/40">Support</h3>
                        <ul className="flex flex-col gap-4">
                            <li><Link href="#" className="text-white/70 hover:text-blue-400 transition-colors">Help Center</Link></li>
                            <li><Link href="#" className="text-white/70 hover:text-blue-400 transition-colors">Warranty</Link></li>
                            <li><Link href="#" className="text-white/70 hover:text-blue-400 transition-colors">Returns</Link></li>
                        </ul>
                    </div>
                    <div className="flex flex-col gap-6">
                        <h3 className="text-sm font-bold tracking-widest uppercase text-white/40">Follow Us</h3>
                        <div className="flex gap-4">
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 group">
                                <Twitter className="w-4 h-4 text-white/60 group-hover:text-white" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all duration-300 group">
                                <Instagram className="w-4 h-4 text-white/60 group-hover:text-white" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-700 hover:text-white transition-all duration-300 group">
                                <Linkedin className="w-4 h-4 text-white/60 group-hover:text-white" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center border-t border-white/5 pt-8">
                    <h1 className="text-[12vw] leading-none font-bold text-transparent bg-clip-text bg-gradient-to-b from-white/10 to-transparent select-none pointer-events-none tracking-tighter mix-blend-overlay">
                        LUMINA
                    </h1>
                    <div className="flex flex-col md:flex-row justify-between items-center w-full mt-8 text-sm text-white/30">
                        <p>&copy; 2026 Lumina Audio by syans. All rights reserved.</p>
                        <div className="flex gap-8 mt-4 md:mt-0">
                            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
