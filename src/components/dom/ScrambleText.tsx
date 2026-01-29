"use client";

import { useState, useRef, useEffect } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()";

interface ScrambleTextProps {
    text: string;
    className?: string;
    trigger?: boolean;
}

export default function ScrambleText({ text, className = "" }: ScrambleTextProps) {
    const [display, setDisplay] = useState(text);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const scramble = () => {
        let iteration = 0;
        const speed = 1 / 3;

        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            setDisplay((prev) =>
                text
                    .split("")
                    .map((letter, index) => {
                        if (index < iteration) {
                            return text[index];
                        }
                        return CHARS[Math.floor(Math.random() * CHARS.length)];
                    })
                    .join("")
            );

            if (iteration >= text.length) {
                if (intervalRef.current) clearInterval(intervalRef.current);
            }

            iteration += speed;
        }, 30);
    };

    // Auto-trigger on mount
    useEffect(() => {
        scramble();
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    return (
        <span
            className={className}
            onMouseEnter={scramble}
            style={{ display: "inline-block" }} // Ensure transform/width works if needed
        >
            {display}
        </span>
    );
}
