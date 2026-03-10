"use client";

import { motion } from "framer-motion";

export default function AboutSection() {
    return (
        <section id="about" className="w-full py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div
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
                </motion.div>

                <motion.div
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
                            {/* Fallback image placeholder to match playful design */}
                            <div className="absolute inset-0 bg-brand-yellow/20 flex items-center justify-center">
                                <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 0C50 0 0 50 0 100C0 150 50 200 100 200C150 200 200 150 200 100" fill="#F5B301" />
                                    <circle cx="65" cy="85" r="15" fill="#000000" />
                                    <circle cx="135" cy="85" r="15" fill="#000000" />
                                    <path d="M60 130C60 130 80 160 100 160C120 160 140 130 140 130" stroke="#000000" strokeWidth="10" strokeLinecap="round" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute -top-8 -right-8 animate-bounce delay-150 hidden md:block">
                        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M30 0L38.4526 21.5474L60 30L38.4526 38.4526L30 60L21.5474 38.4526L0 30L21.5474 21.5474L30 0Z" fill="#F5B301" stroke="#000" strokeWidth="3" />
                        </svg>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
