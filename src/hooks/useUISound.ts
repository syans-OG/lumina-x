"use client";

import { useCallback, useEffect, useRef } from "react";

export function useUISound() {
    const audioContext = useRef<AudioContext | null>(null);

    useEffect(() => {
        // Initialize AudioContext on first user interaction to handle autoplay policies
        const initAudio = () => {
            if (!audioContext.current) {
                audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            if (audioContext.current?.state === "suspended") {
                audioContext.current.resume();
            }
        };

        window.addEventListener("click", initAudio, { once: true });
        return () => window.removeEventListener("click", initAudio);
    }, []);

    // 1. HOVER CLICK: airy, high-tech, subtle
    const playHover = useCallback(() => {
        if (!audioContext.current) return;
        const ctx = audioContext.current;
        const t = ctx.currentTime;

        // --- LAYER 1: White Noise Burst (Air) ---
        const bufferSize = ctx.sampleRate * 0.1; // 0.1s duration
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = "highpass";
        noiseFilter.frequency.setValueAtTime(8000, t); // Only high crisp air

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.05, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noise.start(t);

        // --- LAYER 2: High Sine Ping (Glassy) ---
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(2000, t);
        osc.frequency.exponentialRampToValueAtTime(3000, t + 0.1);

        gain.gain.setValueAtTime(0.02, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.1);

    }, []);

    // 2. ACTIVE CLICK: Tactile, deep, punchy
    const playClick = useCallback(() => {
        if (!audioContext.current) return;
        const ctx = audioContext.current;
        const t = ctx.currentTime;

        // --- LAYER 1: Low Thud (Body) ---
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine"; // Sine gives cleanest bass
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.exponentialRampToValueAtTime(40, t + 0.15); // Quick pitch drop = heavy feeling

        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.2);

        // --- LAYER 2: Crisp Click (Attack) ---
        const clickOsc = ctx.createOscillator();
        const clickGain = ctx.createGain();

        clickOsc.type = "triangle";
        clickOsc.frequency.setValueAtTime(3000, t);
        clickOsc.frequency.exponentialRampToValueAtTime(100, t + 0.1);

        clickGain.gain.setValueAtTime(0.1, t);
        clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

        clickOsc.connect(clickGain);
        clickGain.connect(ctx.destination);
        clickOsc.start(t);
        clickOsc.stop(t + 0.1);

    }, []);

    return { playHover, playClick };
}
