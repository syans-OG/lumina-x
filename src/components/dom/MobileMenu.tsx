"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { X } from "lucide-react";
import { useRef } from "react";
import { useUISound } from "@/hooks/useUISound";

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);
    const { playHover, playClick } = useUISound();

    useGSAP(() => {
        if (isOpen) {
            // Open Animation
            gsap.set(menuRef.current, { yPercent: -100, autoAlpha: 1 });

            const tl = gsap.timeline();

            tl.to(menuRef.current, {
                yPercent: 0,
                duration: 0.8,
                ease: "power4.out",
            })
                .fromTo(".mobile-link",
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" },
                    "-=0.4"
                );

        } else {
            // Close Animation
            gsap.to(menuRef.current, {
                yPercent: -100,
                duration: 0.6,
                ease: "power4.in",
                onComplete: () => { gsap.set(menuRef.current, { autoAlpha: 0 }); }
            });
        }
    }, [isOpen]);

    return (
        <div
            ref={menuRef}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center invisible h-screen w-screen"
        >
            {/* Close Button */}
            <button
                onClick={() => { playClick(); onClose(); }}
                className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
                aria-label="Close Menu"
            >
                <X className="w-8 h-8" />
            </button>

            {/* Links */}
            <nav className="flex flex-col gap-8 text-center">
                <button
                    onClick={() => { playClick(); onClose(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="mobile-link text-4xl font-display font-medium text-white hover:text-blue-500 transition-colors uppercase tracking-tighter"
                    onMouseEnter={playHover}
                >
                    Overview
                </button>
                <button
                    onClick={() => { playClick(); onClose(); window.scrollTo({ top: window.innerHeight, behavior: 'smooth' }); }}
                    className="mobile-link text-4xl font-display font-medium text-white hover:text-blue-500 transition-colors uppercase tracking-tighter"
                    onMouseEnter={playHover}
                >
                    Specs
                </button>
                <div className="w-12 h-[1px] bg-white/20 mx-auto mobile-link my-4" />
                <button
                    onClick={() => { playClick(); onClose(); }}
                    className="mobile-link text-2xl font-mono text-white/50 hover:text-white transition-colors uppercase tracking-widest"
                    onMouseEnter={playHover}
                >
                    Login
                </button>
            </nav>

            {/* Decorative Footer */}
            <div className="absolute bottom-12 text-center mobile-link">
                <p className="text-[10px] text-white/20 font-mono tracking-[0.5em] uppercase">
                    Lumina X Series
                </p>
            </div>
        </div>
    );
}
