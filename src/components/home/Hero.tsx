"use client";

import { motion as m } from "framer-motion";
import { Star } from "lucide-react";
import { SectionDecoration, FloatingDecoration } from "@/components/ui/SectionDecoration";

export default function Hero() {
    return (
        <section className="relative w-full py-20 md:py-40 flex flex-col items-center justify-center text-center overflow-hidden bg-brand-black">
            {/* Image Wrapper with Overlay */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 grayscale"
                    style={{ backgroundImage: 'url("/images/hero-bg.jpg")' }}
                />
                {/* Black Overlay Wrapper */}
                <div className="absolute inset-0 bg-brand-black/80 ring-inset ring-brand-black" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-brand-black" />
            </div>

            {/* Cultural Decorations (Extreme Scatter) */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {/* Cowries scattered around */}
                <FloatingDecoration src="/images/dashboard/cowries_black.png" className="top-[15%] left-[10%] w-24 opacity-20" delay={0} blendMode="screen" />
                <FloatingDecoration src="/images/dashboard/cowries_black.png" className="bottom-[20%] right-[15%] w-32 opacity-15" delay={2} blendMode="screen" />
                <FloatingDecoration src="/images/dashboard/cowries_black.png" className="top-[40%] right-[5%] w-20 opacity-10" delay={4} blendMode="screen" />
                <FloatingDecoration src="/images/dashboard/cowries_black.png" className="top-[60%] left-[5%] w-16 opacity-10" delay={1} blendMode="screen" />
                <FloatingDecoration src="/images/dashboard/cowries_black.png" className="bottom-[10%] left-[20%] w-24 opacity-05" delay={3} blendMode="screen" />

                {/* 'Leader' Faces: Benin Masks with unique 'looking' animations */}
                <m.div 
                    animate={{ rotate: [-15, 15, -15], scale: [1, 1.05, 1] }} 
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[10%] left-[5%] w-48 opacity-20"
                >
                    <SectionDecoration src="/images/dashboard/mask.png" className="w-full grayscale brightness-0 invert" blendMode="screen" />
                </m.div>
                
                <m.div 
                    animate={{ rotate: [10, -10, 10], scale: [1, 1.1, 1] }} 
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-[20%] right-[5%] w-56 opacity-[0.25]"
                >
                    <SectionDecoration src="/images/dashboard/mask.png" className="w-full grayscale brightness-0 invert" blendMode="screen" />
                </m.div>

                {/* Primary Hero Decoration: Traditional Palm */}
                <div className="absolute bottom-[-5%] left-[-5%] w-80 md:w-[500px] opacity-10 -rotate-12 translate-y-20">
                    <SectionDecoration 
                        src="/images/dashboard/palm.png" 
                        className="w-full grayscale brightness-0 invert" 
                        blendMode="screen"
                    />
                </div>

                {/* Doodles (Keeping some for mix) */}
                <m.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute top-[20%] left-[25%] text-brand-yellow opacity-20"
                >
                    <Star size={40} fill="currentColor" />
                </m.div>
            </div>

            <m.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="z-10 max-w-4xl px-6 flex flex-col items-center"
            >
                {/* 3-Row Stacked Logo - Tighter Spacing & Deeper Shadows */}
                <div className="flex flex-col items-center mb-6">
                    <m.span 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="font-hero text-4xl md:text-5xl lg:text-6xl text-white drop-shadow-[5px_5px_0px_#000] rotate-[-5deg] mb-[-1rem] z-20"
                    >
                        THE
                    </m.span>
                    
                    <m.h1 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="font-hero text-8xl md:text-[10rem] lg:text-[12rem] text-white leading-[0.75] drop-shadow-[12px_12px_0px_#000] relative z-10"
                    >
                        NIGERIA
                        {/* More Scattered Doodle Dots */}
                        <div className="absolute top-[20%] right-[-5%] flex gap-1 items-end pointer-events-none opacity-80">
                            <span className="w-3 h-3 bg-brand-yellow rounded-full" />
                            <span className="w-2 h-2 bg-brand-yellow rounded-full" />
                        </div>
                        <span className="absolute top-[10%] left-[15%] w-4 h-4 bg-brand-yellow rounded-full opacity-60 pointer-events-none" />
                    </m.h1>

                    <m.h1 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="font-hero text-8xl md:text-[10rem] lg:text-[12rem] text-white leading-[0.75] drop-shadow-[12px_12px_0px_#000] mt-[-0.5rem] relative z-0"
                    >
                        STORY
                        <div className="absolute bottom-[20%] left-[-10%] flex gap-2 pointer-events-none opacity-80">
                            <span className="w-4 h-4 bg-brand-yellow rounded-full" />
                            <span className="w-3 h-3 bg-brand-yellow rounded-full" />
                        </div>
                        <span className="absolute top-[30%] right-[10%] w-3 h-3 bg-brand-yellow rounded-full opacity-60 pointer-events-none" />
                    </m.h1>
                </div>

                <div className="font-hero text-xl md:text-3xl mt-4 mb-2 tracking-wide drop-shadow-[2px_2px_0px_#000]">
                    <span className="text-brand-yellow">Breaking</span>
                    <span className="text-white ml-2">Boundaries, Uniting a Nation</span>
                </div>

                <p className="font-body text-base md:text-lg text-gray-400 max-w-2xl mx-auto my-8 opacity-70 italic">
                    Share your personal journey. Be part of the record-breaking storytelling experience.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-4">
                    <a href="#submit" className="btn-primary w-full sm:w-auto text-xl px-12 py-5 font-black uppercase shadow-[10px_10px_0px_0px_#000] hover:shadow-none transition-all">
                        Submit Your Story
                    </a>
                    <a href="#gallery" className="btn-secondary w-full sm:w-auto text-xl px-12 py-5 font-black uppercase shadow-[10px_10px_0px_0px_#000] hover:shadow-none transition-all">
                        Explore Stories
                    </a>
                </div>
            </m.div>
        </section>
    );
}
