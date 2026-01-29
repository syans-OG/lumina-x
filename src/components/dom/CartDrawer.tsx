"use client";

import { useStore } from "@/store";
import { X, Minus, Plus, ShoppingBag, ArrowRight, Loader2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Magnetic from "./Magnetic";
import { useToastStore } from "./Toast";

export default function CartDrawer() {
    const { isCartOpen, setIsCartOpen, cartCount, activeColor, addToCart, decrementCart, clearCart } = useStore();
    const addToast = useToastStore((state) => state.addToast);
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const handleCheckout = () => {
        if (isCheckingOut) return;
        setIsCheckingOut(true);

        setTimeout(() => {
            setIsCheckingOut(false);
            setIsCartOpen(false);
            clearCart();
            addToast("Order Placed Successfully!", "cart");
        }, 2000);
    };

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsCartOpen(false);
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [setIsCartOpen]);

    const getColorName = (color: string) => {
        switch (color) {
            case "#1a1a1a": return "Midnight Black";
            case "#C0C0C0": return "Titanium Silver";
            case "#E0F7FA": return "Nebula Blue";
            default: return "Custom Color";
        }
    };

    const activeColorName = getColorName(activeColor);

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    <div
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 z-[90] bg-transparent"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.9, y: 10, filter: "blur(10px)" }}
                        transition={{ type: "spring", damping: 30, stiffness: 400 }}
                        className="fixed top-24 right-6 md:right-12 w-[calc(100vw-3rem)] md:w-[380px] bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_20px_40px_-5px_rgba(0,0,0,0.5)] z-[100] flex flex-col overflow-hidden"
                    >
                        <div className="flex items-center justify-between p-5 border-b border-white/5 bg-white/5">
                            <span className="font-display font-medium text-sm text-white tracking-widest uppercase">
                                Shopping Bag
                            </span>
                            <span className="font-mono text-xs text-blue-400">
                                {cartCount} Item(s)
                            </span>
                        </div>

                        <div className="p-5 max-h-[60vh] overflow-y-auto">
                            {cartCount === 0 ? (
                                <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 opacity-50">
                                    <ShoppingBag className="w-8 h-8 text-white/20" />
                                    <p className="text-white/60 text-sm font-light">Your bag is empty.</p>
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    <div className="flex gap-4">
                                        <div className="w-16 h-16 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center shrink-0 shadow-inner">
                                            <div className="w-8 h-8 rounded-full shadow-lg" style={{ backgroundColor: activeColor }}></div>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-display font-medium text-white text-sm tracking-wide">
                                                    Lumina X
                                                </h3>
                                                <span className="font-mono text-xs text-white/90">$399.00</span>
                                            </div>
                                            <p className="text-xs text-white/50 mb-3">{activeColorName}</p>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3 bg-black/40 rounded-full px-2 py-1 border border-white/5">
                                                    <button onClick={decrementCart} className="text-white/40 hover:text-white transition-colors p-1"><Minus className="w-2.5 h-2.5" /></button>
                                                    <span className="font-mono text-[10px] text-white w-2 text-center">{cartCount}</span>
                                                    <button onClick={addToCart} className="text-white/40 hover:text-white transition-colors p-1"><Plus className="w-2.5 h-2.5" /></button>
                                                </div>
                                                <button onClick={clearCart} className="text-[10px] text-red-400 hover:text-red-300 transition-colors">
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-sm text-white/60">Subtotal</span>
                                        <span className="font-mono text-lg text-white font-medium">${cartCount * 399}.00</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-black/40 border-t border-white/5">
                            <Magnetic strength={0.2}>
                                <button onClick={handleCheckout} disabled={isCheckingOut} className="w-full bg-white text-black py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-blue-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] disabled:opacity-70 disabled:pointer-events-none">
                                    {isCheckingOut ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            Checkout
                                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </Magnetic>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
