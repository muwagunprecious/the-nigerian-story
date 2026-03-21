"use client";

import { motion as m } from "framer-motion";
import { useEffect, useState } from "react";

const assets = [
    "/images/dashboard/cowries.png",
    "/images/dashboard/nok.png",
    "/images/dashboard/pot.png",
    "/images/dashboard/drum.png",
    "/images/dashboard/hat.png",
    "/images/dashboard/mask.png",
    "/images/dashboard/bus.png",
    "/images/dashboard/map.png",
    "/images/dashboard/calabash.png",
    "/images/dashboard/attire.png",
    "/images/dashboard/palm.png"
];

interface DecorativeItem {
    id: number;
    src: string;
    left: string;
    top: string;
    size: number;
    rotation: number;
    delay: number;
    duration: number;
    opacity: number;
    isLeader?: boolean;
}

export default function BackgroundWall() {
    const [items, setItems] = useState<DecorativeItem[]>([]);

    useEffect(() => {
        // Generate ~80-100 items for a "saturated" look
        const newItems: DecorativeItem[] = [];
        for (let i = 0; i < 100; i++) {
            const isMask = Math.random() > 0.85; // ~15% are masks (leaders)
            newItems.push({
                id: i,
                src: isMask ? "/images/dashboard/mask.png" : assets[Math.floor(Math.random() * assets.length)],
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                size: Math.random() * 100 + 40, // 40-140px
                rotation: Math.random() * 360,
                delay: Math.random() * 5,
                duration: 10 + Math.random() * 20,
                opacity: Math.random() * 0.3 + 0.2, // 20-50% opacity for guaranteed visibility
                isLeader: isMask
            });
        }
        setItems(newItems);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-white">
            {/* Base Pattern Overlay */}
            <div 
                className="absolute inset-0 opacity-[0.03]" 
                style={{ 
                    backgroundImage: 'url("/images/dashboard/pattern.png")',
                    backgroundSize: '300px',
                    backgroundRepeat: 'repeat'
                }} 
            />

            {/* Scattered Cultural Items */}
            {items.map((item) => (
                <m.img
                    key={item.id}
                    src={item.src}
                    className="absolute"
                    style={{
                        width: item.size,
                        left: item.left,
                        top: item.top,
                        mixBlendMode: "multiply",
                        opacity: item.opacity
                    }}
                    initial={{ 
                        rotate: item.rotation,
                        scale: 0.8,
                        opacity: item.opacity
                    }}
                    animate={{
                        y: [0, Math.random() * 40 - 20, 0],
                        x: [0, Math.random() * 40 - 20, 0],
                        rotate: item.isLeader ? [item.rotation - 10, item.rotation + 10, item.rotation - 10] : item.rotation,
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        duration: item.duration,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            ))}
            
            {/* Extra Darkening/Vignette to reduce white */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-yellow/5 to-transparent opacity-20" />
        </div>
    );
}
