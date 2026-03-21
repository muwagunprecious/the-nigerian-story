"use client";

import { motion as m } from "framer-motion";

// Inlined decorations to resolve persistent ReferenceErrors in build/HMR
interface DecorationProps {
    src: string;
    className?: string;
    delay?: number;
    staticMode?: boolean;
    opacity?: number;
    blendMode?: "multiply" | "screen" | "overlay" | "normal";
}

const LocalSectionDecoration = ({ 
    src, 
    className = "", 
    delay = 0, 
    staticMode = true,
    opacity = 0.9,
    blendMode = "multiply"
}: DecorationProps) => (
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

const LocalFloatingDecoration = ({ 
    src, 
    className = "", 
    delay = 0,
    opacity = 0.4,
    blendMode = "multiply"
}: DecorationProps) => (
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

export default function AboutSection() {
    return (
        <section id="about" className="w-full py-16 relative overflow-visible">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                <m.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-block px-4 py-2 bg-brand-yellow text-brand-black font-heading font-bold rounded-full mb-6 border-2 border-brand-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        Who We Are
                    </div>
                    <h2 className="font-heading font-black text-5xl md:text-6xl text-brand-black mb-6 leading-none">
                        ABOUT THE <br />NIGERIA STORY
                    </h2>
                    <p className="font-body text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
                        The Nigeria Story is a bold creative initiative designed to celebrate Nigeria's culture, creativity, and collective identity through a record-breaking storytelling experience.
                    </p>
                    <p className="font-body text-lg text-gray-700 leading-relaxed">
                        Through art, design, and participation, the project invites Nigerians to contribute to a shared narrative that showcases the country's creativity to the world. We are collecting stories that document Nigeria before and after independence.
                    </p>
                </m.div>

                <m.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative"
                >
                    {/* Decorative frame */}
                    <div className="absolute top-4 -left-4 w-full h-full border-4 border-brand-black rounded-3xl -z-10 translate-x-8 translate-y-8 bg-brand-yellow"></div>

                    <div className="bg-brand-white border-4 border-brand-black rounded-3xl overflow-hidden shadow-card p-2">
                        <div className="aspect-square md:aspect-[4/3] bg-gray-200 rounded-2xl relative overflow-hidden flex items-center justify-center">
                            <img
                                src="/images/about-us.jpg"
                                alt="Danfo Bus Culture"
                                className="w-full h-full object-cover rounded-xl"
                            />
                        </div>
                    </div>

                    {/* Cultural Decoration: Nok Head */}
                    <div className="absolute -top-12 -right-12 w-32 md:w-48 hidden md:block group-hover:scale-110 transition-transform duration-700">
                        <LocalSectionDecoration src="/images/dashboard/nok.png" className="w-full" />
                    </div>

                    {/* Additional scattered elements */}
                    <LocalFloatingDecoration 
                        src="/images/dashboard/cowries.png" 
                        className="-bottom-10 -left-10 w-24 opacity-20" 
                        delay={1} 
                    />
                    <LocalFloatingDecoration 
                        src="/images/dashboard/map.png" 
                        className="top-1/2 -right-20 w-32 opacity-10" 
                        delay={0.5} 
                    />
                </m.div>
            </div>
            
            {/* Extreme Scattering (The start of the 200 images plan) */}
            <LocalFloatingDecoration src="/images/dashboard/cowries.png" className="top-0 left-[20%] w-16 opacity-10" delay={0} />
            <LocalFloatingDecoration src="/images/dashboard/nok.png" className="bottom-0 right-[30%] w-24 opacity-05" delay={2} />
            <LocalFloatingDecoration src="/images/dashboard/bus.png" className="top-[30%] left-[5%] w-20 opacity-10 -rotate-12" delay={4} />
            <LocalFloatingDecoration src="/images/dashboard/drum.png" className="bottom-[20%] left-[15%] w-28 opacity-05" delay={1} />
        </section>
    );
}
