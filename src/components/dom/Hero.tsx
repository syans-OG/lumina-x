"use client";

import { useStore } from "@/store";
import { useToastStore } from "./Toast";
import { useUISound } from "@/hooks/useUISound";
import Magnetic from "./Magnetic";
import { useLenis } from "@/components/SmoothScroll";

export default function Hero() {
  const { addToCart } = useStore();
  const addToast = useToastStore((state) => state.addToast);
  const { playClick, playHover } = useUISound();
  const lenis = useLenis();

  const handleBuyNow = () => {
    addToCart();
    playClick();
    addToast("Added to Bag - Lumina X", "cart");
  };

  const handleLearnMore = () => {
    playClick();
    lenis?.scrollTo("#overview");
  };
  return (
    <div className="relative z-10 flex h-screen w-full flex-col items-center justify-center text-center pointer-events-none">
      <div className="flex flex-col gap-6 pointer-events-auto items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm shadow-[0_0_15px_-3px_rgba(37,99,235,0.4)]">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_2px_rgba(37,99,235,0.5)]"></div>
          <span className="text-xs font-bold text-blue-200 tracking-wide uppercase">New Release</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-9xl font-light tracking-tighter text-white select-none">
          LUMINA <span className="font-semibold">X</span>
        </h1>

        <p className="max-w-lg text-lg font-light tracking-wide text-white/60 md:text-xl leading-relaxed">
          The intersection of audiophile purity and industrial art.
        </p>

        <div className="flex gap-4 mt-8">
          <Magnetic strength={0.2}>
            <button
              onClick={handleBuyNow}
              onMouseEnter={playHover}
              suppressHydrationWarning
              className="rounded-full bg-white text-black px-8 py-3 text-sm font-bold tracking-wide hover:bg-blue-50 transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_20px_-5px_rgba(255,255,255,0.5)]"
            >
              Buy Now
            </button>
          </Magnetic>

          <Magnetic strength={0.2}>
            <button
              onClick={handleLearnMore}
              onMouseEnter={playHover}
              suppressHydrationWarning
              className="rounded-full border border-white/20 bg-white/5 px-8 py-3 text-sm font-medium text-white backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-blue-500/50 hover:scale-105 active:scale-95"
            >
              Learn More
            </button>
          </Magnetic>
        </div>
      </div>
    </div>
  );
}
