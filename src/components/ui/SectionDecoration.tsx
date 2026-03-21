"use client";

import { motion as m } from "framer-motion";

interface SectionDecorationProps {
    src: string;
    className?: string;
    delay?: number;
    staticMode?: boolean;
    opacity?: number;
    blendMode?: "multiply" | "screen" | "overlay" | "normal";
}

export const SectionDecoration = ({ 
    src, 
    className = "", 
    delay = 0, 
    staticMode = true,
    opacity = 0.9,
    blendMode = "multiply"
}: SectionDecorationProps) => (
    <m.img
        src={src}
        className={`pointer-events-none select-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)] ${className}`}
        style={{ mixBlendMode: blendMode }}
        initial={staticMode ? { rotate: -5, opacity, scale: 1 } : { y: 0, rotate: 0, opacity: 0, scale: 0.8 }}
        animate={staticMode ? { 
            rotate: [-5, 5, -5]
        } : { 
            y: [-10, 10, -10],
            rotate: [-2, 2, -2],
            opacity: opacity,
            scale: 1
        }}
        transition={{ 
            duration: staticMode ? 7 : 6,
            repeat: Infinity,
            delay: delay,
            ease: "easeInOut"
        }}
        alt=""
    />
);

export const FloatingDecoration = ({ 
    src, 
    className = "", 
    delay = 0,
    opacity = 0.4,
    blendMode = "multiply"
}: SectionDecorationProps) => (
    <m.img
        src={src}
        className={`absolute pointer-events-none z-10 select-none ${className}`}
        style={{ mixBlendMode: blendMode }}
        initial={{ rotate: -2, opacity: 0 }}
        animate={{ 
            rotate: [ -2, 2, -2],
            opacity: opacity
        }}
        transition={{ 
            duration: 8,
            repeat: Infinity,
            delay: delay,
            ease: "easeInOut"
        }}
        alt=""
    />
);
