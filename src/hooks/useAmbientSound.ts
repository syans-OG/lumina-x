"use client";

import { useEffect, useRef, useCallback } from "react";

export function useAmbientSound() {
    const audioContext = useRef<AudioContext | null>(null);
    const filterRef = useRef<BiquadFilterNode | null>(null);
    const gainRef = useRef<GainNode | null>(null);
    const isPlaying = useRef(false);

    // Initialize Audio Engine
    const initAudio = useCallback(() => {
        if (isPlaying.current || audioContext.current) return;

        const Ctx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new Ctx();
        audioContext.current = ctx;

        // --- ETHEREAL WIND GRAPH ---
        // White Noise Buffer -> LowPass Filter -> Gain -> Destination
        // Result: soft "Air" texture that opens up when moving

        const bufferSize = ctx.sampleRate * 2; // 2 seconds of noise
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        // Generate Pink-ish Noise (softer than white)
        // Simple IIR filter approximation or just random
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            data[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = data[i];
            data[i] *= 3.5; // Compensate for gain loss
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.Q.value = 0.5; // Soft knee, no resonance
        filter.frequency.value = 150; // Start very deep (subtle rumble)

        const gain = ctx.createGain();
        gain.gain.value = 0; // Start silent

        // Connect
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        // Start
        noise.start();

        // Store refs
        filterRef.current = filter;
        gainRef.current = gain;
        isPlaying.current = true;

        // Fade In slower and quieter
        gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 4);

    }, []);

    // Toggle Play/Pause based on visibility or user interaction
    let lastOut = 0;

    useEffect(() => {
        const handleInteraction = () => {
            if (!audioContext.current) {
                initAudio();
            } else if (audioContext.current.state === "suspended") {
                audioContext.current.resume();
            }
        };

        window.addEventListener("click", handleInteraction, { once: true });
        window.addEventListener("scroll", handleInteraction, { once: true });

        return () => {
            window.removeEventListener("click", handleInteraction);
            window.removeEventListener("scroll", handleInteraction);
        };
    }, [initAudio]);

    // Modulate Filter based on Scroll Velocity
    const updateScroll = useCallback((velocity: number) => {
        if (!filterRef.current || !audioContext.current) return;

        const ctx = audioContext.current;
        const speed = Math.min(Math.abs(velocity), 4000); // Cap max speed input

        // Smoother mapping:
        // 0 speed -> 150Hz
        // Max speed -> 600Hz (Avoids high pitch "hissing")
        // The frequency change is now much narrower = less "cartoon slide whistle"
        const targetFreq = 150 + (speed * 0.15);

        // Use a much longer time constant (0.5s instead of 0.1s)
        // This makes the sound "lag" behind the scroll, feeling like heavy momentum
        filterRef.current.frequency.setTargetAtTime(targetFreq, ctx.currentTime, 0.4);

    }, []);

    return { updateScroll };
}
