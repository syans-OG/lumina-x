"use client";

import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShoppingBag, Menu, X } from "lucide-react";
import Link from "next/link";
import { useUISound } from "@/hooks/useUISound";
import Magnetic from "./Magnetic";
import { useStore } from "@/store";
import { useToastStore } from "./Toast";
import { useLenis } from "@/components/SmoothScroll";
import { AnimatePresence, motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

export default function StickyNav() {
    const navRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const { playHover, playClick } = useUISound();
    const { cartCount, addToCart, setIsCartOpen } = useStore();
    const addToast = useToastStore((state) => state.addToast);
    const lenis = useLenis();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const scrollToSection = (id: string) => {
        setIsMobileMenuOpen(false);
        if (lenis) {
            lenis.scrollTo(`#${id}`);
            playClick();
        }
    };

    const handlePreOrder = () => {
        addToCart();
        playClick();
        addToast("Added to Bag - Lumina X", "cart");
    };

    return (
        <nav
            ref={navRef}
            className="fixed top-0 left-0 w-full z-50 py-4 px-6 md:px-12"
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between p-4 rounded-full bg-black/60 backdrop-blur-md border border-white/10 shadow-2xl pointer-events-auto transition-all duration-300 hover:bg-black/80">

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => { lenis?.scrollTo(0); playClick(); }}
                        className="group flex items-center gap-2"
                        suppressHydrationWarning
                    >
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-300">
                            <div className="w-3 h-3 bg-black rounded-full" />
                        </div>
                        <span className="font-display font-medium text-white tracking-widest uppercase text-sm group-hover:text-blue-400 transition-colors">
                            Lumina X
                        </span>
                    </button>
                </div>

                <div className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-widest text-white/50">
                    <Magnetic>
                        <button suppressHydrationWarning onMouseEnter={playHover} onClick={() => scrollToSection('overview')} className="hover:text-white transition-colors p-2">Overview</button>
                    </Magnetic>
                    <Magnetic>
                        <button suppressHydrationWarning onMouseEnter={playHover} onClick={() => scrollToSection('specs')} className="hover:text-white transition-colors p-2">Specs</button>
                    </Magnetic>
                    <Magnetic>
                        <button suppressHydrationWarning onMouseEnter={playHover} onClick={() => scrollToSection('compare')} className="hover:text-white transition-colors p-2">Compare</button>
                    </Magnetic>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden md:block text-right">
                        <span className="block text-white text-sm font-medium">$399.00</span>
                        <span className="block text-green-400 text-[10px] uppercase tracking-wider">In Stock</span>
                    </div>

                    <Magnetic strength={0.2}>
                        <button suppressHydrationWarning onMouseEnter={playHover} onClick={handlePreOrder} className="hidden md:block bg-white text-black px-6 py-2 rounded-full font-medium text-sm hover:bg-blue-500 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)]">
                            Pre-order
                        </button>
                    </Magnetic>

                    <Magnetic strength={0.3}>
                        <button suppressHydrationWarning onMouseEnter={playHover} onClick={() => { setIsCartOpen(true); playClick(); }} className="relative w-10 h-10 flex items-center justify-center rounded-full border border-white/10 hover:bg-white/10 transition-colors group">
                            <ShoppingBag className="w-4 h-4 text-white group-hover:text-blue-400 transition-colors" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-[8px] font-bold">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </Magnetic>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-white/70 hover:text-white"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-24 left-6 right-6 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col gap-4 md:hidden shadow-2xl"
                    >
                        <button onClick={() => scrollToSection('overview')} className="text-left text-white/70 hover:text-white py-2 border-b border-white/5">Overview</button>
                        <button onClick={() => scrollToSection('specs')} className="text-left text-white/70 hover:text-white py-2 border-b border-white/5">Specs</button>
                        <button onClick={() => scrollToSection('compare')} className="text-left text-white/70 hover:text-white py-2 border-b border-white/5">Compare</button>
                        <button onClick={handlePreOrder} className="mt-4 bg-white text-black w-full py-3 rounded-full font-bold uppercase tracking-widest text-xs">
                            Pre-order - $399
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
