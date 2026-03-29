"use client";

import { motion } from "framer-motion";


export default function AboutSection() {
    return (
        <section id="about" className="w-full py-24 bg-brand-yellow text-black rotate-[-2deg] scale-[1.02] shadow-[20px_20px_00px_0px_rgba(255,255,255,0.1)]">
            <div className="rotate-[2deg] max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="font-hero text-6xl md:text-8xl mb-8 uppercase leading-tight">
                            What We <br /> Want to Do
                        </h2>
                        <div className="space-y-6 font-body text-xl md:text-2xl font-medium max-w-2xl">
                            <p>
                                Launching in 2026, The Nigeria Story is a historic movement to unite 1 million Nigerians through a single collaborative narrative.
                            </p>
                            <p>
                                Using AI-powered animation, we are documenting our history, culture, and future dreams to show the world the true spirit of Nigeria.
                            </p>
                        </div>
                    </div>
                    
                    <div className="bg-black/10 p-10 rounded-[3rem] border-4 border-black border-dashed">
                        <h3 className="font-heading font-black text-3xl uppercase mb-6">Our Mission</h3>
                        <ul className="space-y-4 font-body text-lg font-bold uppercase">
                            <li className="flex gap-4">
                                <span className="bg-black text-brand-yellow w-8 h-8 rounded-full flex items-center justify-center shrink-0">1</span>
                                Uniting 1 Million Nigerian Voices
                            </li>
                            <li className="flex gap-4">
                                <span className="bg-black text-brand-yellow w-8 h-8 rounded-full flex items-center justify-center shrink-0">2</span>
                                AI-Powered Cultural Animation
                            </li>
                            <li className="flex gap-4">
                                <span className="bg-black text-brand-yellow w-8 h-8 rounded-full flex items-center justify-center shrink-0">3</span>
                                Fundraising for Underserved Education
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
