"use client";

import { create } from "zustand";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Download } from "lucide-react";

// --- Internal Toast Store ---
interface ToastState {
    toasts: { id: string; message: string; type: "cart" | "download" }[];
    addToast: (message: string, type?: "cart" | "download") => void;
    removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
    toasts: [],
    addToast: (message, type = "cart") => {
        const id = Math.random().toString(36).substring(7);
        set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));

        // Auto dismiss
        setTimeout(() => {
            set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
        }, 3000);
    },
    removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

// --- Toast Component ---
export default function ToastContainer() {
    const toasts = useToastStore((state) => state.toasts);

    return (
        <div className="fixed top-24 right-6 z-[60] flex flex-col gap-2 pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, x: 20, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.9 }}
                        className="flex items-center gap-3 bg-black/80 backdrop-blur-md border border-white/10 px-4 py-3 rounded-xl shadow-2xl min-w-[200px]"
                    >
                        <div className={`p-1.5 rounded-full ${toast.type === "cart" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"}`}>
                            {toast.type === "cart" ? <Check size={14} strokeWidth={3} /> : <Download size={14} strokeWidth={3} />}
                        </div>
                        <span className="text-sm font-medium text-white">{toast.message}</span>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
