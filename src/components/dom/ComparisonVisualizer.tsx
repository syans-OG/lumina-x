"use client";

import { useEffect, useRef } from "react";

interface ComparisonVisualizerProps {
    sliderValue: number; // 0 to 1
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    phase: number;
    baseColor: string;
}

export default function ComparisonVisualizer({ sliderValue }: ComparisonVisualizerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particleSystem = useRef<Particle[]>([]);
    const animationRef = useRef<number>(0);
    const sliderRef = useRef(sliderValue);

    // Sync slider ref for animation loop
    useEffect(() => {
        sliderRef.current = sliderValue;
    }, [sliderValue]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = canvas.width = canvas.offsetWidth;
        let height = canvas.height = canvas.offsetHeight;
        const particleCount = 200;

        // Initialize Particles
        if (particleSystem.current.length === 0) {
            for (let i = 0; i < particleCount; i++) {
                particleSystem.current.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    size: Math.random() * 2 + 1,
                    phase: Math.random() * Math.PI * 2,
                    baseColor: "rgba(255,255,255,0.5)"
                });
            }
        }

        const animate = () => {
            if (!ctx) return;
            // Clear with trail effect
            ctx.fillStyle = "rgba(0,0,0,0.2)";
            ctx.fillRect(0, 0, width, height);

            const splitX = width * sliderRef.current;
            const time = performance.now() * 0.001;

            // Draw Split Line
            ctx.beginPath();
            ctx.moveTo(splitX, 0);
            ctx.lineTo(splitX, height);
            ctx.strokeStyle = "rgba(255,255,255,0.5)";
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]); // Dashed line
            ctx.stroke();
            ctx.setLineDash([]); // Reset

            // Add Glow to Split Line
            const gradient = ctx.createLinearGradient(splitX - 20, 0, splitX + 20, 0);
            gradient.addColorStop(0, "rgba(59, 130, 246, 0)");
            gradient.addColorStop(0.5, "rgba(59, 130, 246, 0.4)");
            gradient.addColorStop(1, "rgba(255, 50, 50, 0)");
            ctx.fillStyle = gradient;
            ctx.fillRect(splitX - 20, 0, 40, height);


            particleSystem.current.forEach(p => {
                const isLuminaSide = p.x < splitX;

                if (isLuminaSide) {
                    // --- LUMINA BEHAVIOR (Left) ---
                    // Smooth, Wave-like, Connected
                    const speed = 1.5;
                    const waveY = Math.sin(p.x * 0.005 + time + p.phase) * 20; // Amplitude

                    // Target velocity towards wave pattern
                    const targetVy = Math.cos(p.x * 0.005 + time) * 0.5;
                    const targetVx = speed;

                    p.vx += (targetVx - p.vx) * 0.1;
                    p.vy += (targetVy - p.vy) * 0.1;

                    // Color: Blue/Cyan
                    ctx.fillStyle = `rgba(59, 130, 246, ${0.4 + Math.sin(time * 2 + p.phase) * 0.3})`;
                } else {
                    // --- STANDARD BEHAVIOR (Right) ---
                    // Chaotic, Jittery, Static Noise

                    // Random jitter velocity
                    if (Math.random() > 0.8) {
                        p.vx = (Math.random() - 0.5) * 10;
                        p.vy = (Math.random() - 0.5) * 10;
                    }

                    // Friction to keep them somewhat contained but jerky
                    p.vx *= 0.9;
                    p.vy *= 0.9;

                    // Color: White/Red/Grey Noise
                    const noise = Math.random();
                    if (noise > 0.9) ctx.fillStyle = "rgba(255, 50, 50, 0.8)"; // Red glitch
                    else if (noise > 0.6) ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; // White
                    else ctx.fillStyle = "rgba(100, 100, 100, 0.3)"; // Grey
                }

                // Update Position
                p.x += p.vx;
                p.y += p.vy;

                // Wrap Around
                if (p.x > width) p.x = 0;
                if (p.x < 0) p.x = width;
                if (p.y > height) p.y = 0;
                if (p.y < 0) p.y = height;

                // Draw Particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, isLuminaSide ? p.size : p.size * Math.random(), 0, Math.PI * 2);
                ctx.fill();

                // Connectivity (Lumina Only)
                if (isLuminaSide) {
                    // Connect to nearby particles also on Lumina side
                    // Optimization: check just a few randos or map? 
                    // Simple check:
                    for (let j = 0; j < 5; j++) { // Check 5 random neighbors 
                        const p2 = particleSystem.current[Math.floor(Math.random() * particleCount)];
                        if (p2.x < splitX) {
                            const dx = p.x - p2.x;
                            const dy = p.y - p2.y;
                            const dist = Math.sqrt(dx * dx + dy * dy);
                            if (dist < 80) {
                                ctx.beginPath();
                                ctx.strokeStyle = `rgba(59, 130, 246, ${0.15 * (1 - dist / 80)})`;
                                ctx.lineWidth = 0.5;
                                ctx.moveTo(p.x, p.y);
                                ctx.lineTo(p2.x, p2.y);
                                ctx.stroke();
                            }
                        }
                    }
                }
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        const handleResize = () => {
            if (canvasRef.current) {
                width = canvasRef.current.width = canvasRef.current.offsetWidth;
                height = canvasRef.current.height = canvasRef.current.offsetHeight;
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            window.removeEventListener('resize', handleResize);
        }

    }, []);

    return <canvas ref={canvasRef} className="w-full h-full block" />;
}
