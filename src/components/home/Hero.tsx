"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { SectionDecoration, FloatingDecoration } from "@/components/ui/SectionDecoration";

export default function Hero() {
    return (
        <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black text-white">
            {/* Main Hero Banner: AI Stylized Portrait */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="/images/presidents/tinubu.png" 
                    className="w-full h-full object-cover object-top opacity-60"
                    alt="The Nigeria Story Leader"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
            </div>

            <div className="relative z-10 w-full max-w-7xl px-6 pt-20 md:pt-40 flex flex-col items-center text-center">
                {/* Social Proof Badge */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center gap-2"
                >
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-brand-yellow flex items-center justify-center font-bold text-[10px] text-black">
                                {String.fromCharCode(64 + i)}
                            </div>
                        ))}
                    </div>
                    <span className="text-sm font-bold uppercase tracking-widest text-brand-yellow">257,000 Joined</span>
                </motion.div>

                {/* Headline */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                >
                    <h1 className="font-hero text-6xl md:text-8xl lg:text-9xl text-brand-yellow leading-tight drop-shadow-[4px_4px_0px_#000]">
                        TELL YOUR <br /> NIGERIA STORY
                    </h1>
                </motion.div>

                {/* CTA Button */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-12"
                >
                    <a 
                        href="#submit" 
                        className="bg-brand-yellow text-black px-12 py-5 rounded-full font-heading font-black text-2xl md:text-3xl hover:scale-105 transition-all shadow-[8px_8px_0px_0px_#FFFFFF] uppercase"
                    >
                        Submit your story on mobile app
                    </a>
                </motion.div>

                {/* Guinness Record Logo & Social Link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-24 flex flex-col md:flex-row items-center gap-12"
                >
                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                        <div className="p-3 bg-brand-yellow rounded-xl shadow-[2px_2px_0px_0px_#000]">
                            <Star className="text-black" size={32} />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] font-black uppercase text-gray-400">Official Attempt</p>
                            <p className="font-heading font-black text-sm uppercase">Guinness World Records</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
