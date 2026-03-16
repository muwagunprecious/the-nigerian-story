"use client";

import { motion } from "framer-motion";
import { Star, ArrowUpRight, Sparkles, Smile } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative w-full py-20 md:py-40 flex flex-col items-center justify-center text-center overflow-hidden bg-brand-black">
            {/* Image Wrapper with Overlay */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: 'url("/images/hero-bg.jpg")' }}
                />
                {/* Black Overlay Wrapper */}
                <div className="absolute inset-0 bg-black/70 ring-inset ring-brand-black" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-brand-black" />
            </div>

            {/* Decorative Doodles (Subtle) */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-10 left-10 md:left-32 text-brand-yellow hidden md:block opacity-10"
            >
                <Star size={48} strokeWidth={3} />
            </motion.div>
            <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 right-10 md:right-32 text-white hidden md:block opacity-5"
            >
                <Sparkles size={56} strokeWidth={2} />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="z-10 max-w-4xl px-6"
            >
                <h1 className="font-heading font-black text-6xl md:text-8xl lg:text-9xl tracking-tight leading-[0.9] text-white mb-6">
                    THE NIGERIA<br />
                    <span className="text-brand-yellow relative inline-block">
                        STORY
                        <svg className="absolute -bottom-4 left-0 w-full" viewBox="0 0 200 20" preserveAspectRatio="none">
                            <path d="M0,10 Q100,20 200,5" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" />
                        </svg>
                    </span>
                </h1>

                <p className="font-heading font-bold text-2xl md:text-3xl text-gray-200 mb-8 mt-12 px-4">
                    Breaking Boundaries, Uniting a Nation
                </p>

                <p className="font-body text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-12 px-4">
                    Join the record-breaking storytelling experience led by Adetunwase Adenle. Share your personal journey, celebrate our culture, and help us build the largest collection of Nigerian stories before and after independence.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                    <a href="#submit" className="btn-primary w-full sm:w-auto text-xl">
                        Submit Your Story <ArrowUpRight className="ml-2" size={24} />
                    </a>
                    <a href="#gallery" className="btn-secondary w-full sm:w-auto text-xl">
                        Explore Stories
                    </a>
                </div>
            </motion.div>
        </section>
    );
}
