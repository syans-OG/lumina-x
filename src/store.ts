import { create } from 'zustand';

interface State {
    activeColor: string;
    setColor: (color: string) => void;
    allowRotation: boolean;
    setAllowRotation: (allow: boolean) => void;

    // Commerce
    cartCount: number;
    addToCart: () => void;
    decrementCart: () => void;
    clearCart: () => void;
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
}

export const useStore = create<State>((set) => ({
    activeColor: "#1a1a1a", // Default: Midnight Black
    setColor: (color) => set({ activeColor: color }),
    allowRotation: false,
    setAllowRotation: (allow) => set({ allowRotation: allow }),

    cartCount: 0,
    addToCart: () => set((state) => ({ cartCount: state.cartCount + 1, isCartOpen: true })),
    decrementCart: () => set((state) => ({ cartCount: Math.max(0, state.cartCount - 1) })),
    clearCart: () => set({ cartCount: 0 }),
    isCartOpen: false,
    setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
}));
