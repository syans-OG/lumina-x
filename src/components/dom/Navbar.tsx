"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Menu } from "lucide-react";
import { useUISound } from "@/hooks/useUISound";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
    const { playHover, playClick } = useUISound();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-7xl px-4 animate-text-card">
                <div className="relative flex items-center justify-between bg-black/50 backdrop-blur-xl border border-white/10 rounded-full px-8 py-4 shadow-2xl transition-all duration-300 hover:border-white/20 hover:bg-black/60">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="text-white font-bold tracking-widest text-lg flex items-center gap-2 group z-10"
                        onMouseEnter={playHover}
                        onClick={playClick}
                    >
                        <div className="w-2 h-2 bg-blue-500 rounded-full group-hover:scale-150 transition-transform duration-300" />
                        LUMINA X
                    </Link>

                    {/* Desktop Links (Hidden on Mobile) */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-12 hidden md:flex">
                        <button
                            onClick={() => { playClick(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            onMouseEnter={playHover}
                            className="text-sm text-white/70 hover:text-white transition-colors uppercase tracking-widest font-medium"
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => { playClick(); window.scrollTo({ top: window.innerHeight, behavior: 'smooth' }); }}
                            onMouseEnter={playHover}
                            className="text-sm text-white/70 hover:text-white transition-colors uppercase tracking-widest font-medium"
                        >
                            Specs
                        </button>
                    </div>

                    <div className="flex items-center gap-4 z-10">
                        {/* CTA */}
                        <button
                            className="bg-white text-black px-6 py-2 rounded-full text-sm font-bold tracking-wide hover:scale-105 transition-transform duration-300 flex items-center gap-2 group hidden md:flex"
                            onMouseEnter={playHover}
                            onClick={playClick}
                        >
                            <span>Buy</span>
                            <ShoppingBag className="w-4 h-4 group-hover:fill-black transition-colors" />
                        </button>

                        {/* Mobile Hamburger (Hidden on Desktop) */}
                        <button
                            className="md:hidden text-white hover:text-blue-500 transition-colors"
                            onClick={() => { playClick(); setIsMenuOpen(true); }}
                            aria-label="Open Menu"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </>
    );
}
