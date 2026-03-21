"use client";

import { motion } from "framer-motion";
import { Award, Book, Users, Droplets, Zap, School } from "lucide-react";

const records = [
    {
        year: "2010",
        title: "Largest Painting by Numbers",
        desc: "A massive artwork created by 350 volunteers to celebrate Nigeria’s 50th Independence.",
        icon: Award
    },
    {
        year: "2011",
        title: "Most Children Reading Aloud",
        desc: "Promoting literacy with 4,222 children in Lagos reading simultaneously.",
        icon: Book
    },
    {
        year: "2011",
        title: "Most People Washing Hands",
        desc: "Engaged 37,809 school children to promote personal hygiene and public health.",
        icon: Droplets
    },
    {
        year: "2016",
        title: "Largest Special Stamp",
        desc: "A 2.4sqm commemorative stamp for the 'Lagos at 50' celebration.",
        icon: Zap
    }
];

export default function ConvenerSection() {
    return (
        <section className="w-full py-24 relative overflow-hidden" id="convener">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Left: Image Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative group"
                    >
                        {/* Decorative frame */}
                        <div className="absolute -inset-4 border-4 border-brand-yellow rounded-[40px] -rotate-3 group-hover:rotate-0 transition-transform duration-500 opacity-50" />
                        <div className="absolute -inset-4 border-4 border-brand-black rounded-[40px] rotate-2 group-hover:rotate-0 transition-transform duration-500 opacity-20" />
                        
                        <div className="relative bg-brand-black rounded-[40px] border-8 border-brand-black shadow-[20px_20px_0px_0px_#F5B301] overflow-hidden">
                            <img 
                                src="/images/adetunwase_icon.png" 
                                alt="Adetunwase Adenle" 
                                className="w-full grayscale h-auto object-cover transform scale-105 group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-brand-black to-transparent">
                                <h3 className="font-heading font-black text-3xl text-brand-yellow uppercase tracking-tighter">
                                    Adetunwase <span className="text-white">Adenle</span>
                                </h3>
                                <p className="font-heading font-bold text-sm text-gray-400 uppercase tracking-widest mt-2">
                                    The "Record Breaker" / Artist / Educator
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Content */}
                    <div className="space-y-10">
                        <header className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-yellow rounded-full">
                                <Users size={14} className="text-brand-black" />
                                <span className="font-heading font-black text-[10px] uppercase text-brand-black tracking-widest">The Convener</span>
                            </div>
                            <h2 className="font-heading font-black text-5xl md:text-6xl uppercase leading-[0.9] text-brand-black">
                                THE MAN BEHIND THE <span className="text-brand-yellow italic">RECORDS</span>
                            </h2>
                            <p className="font-body text-gray-600 text-lg leading-relaxed first-letter:text-5xl first-letter:font-black first-letter:text-brand-yellow first-letter:mr-3 first-letter:float-left pt-2">
                                Adetunwase Adenle is a prominent Nigerian artist and four-time Guinness World Record holder. As the CEO of the Ecole de Dessin School of Art and co-founder of the Slum Art Foundation, his work focuses on using art as a tool for social change and environmental awareness.
                            </p>
                        </header>

                        {/* Record Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                            {records.map((record, i) => (
                                <motion.div
                                    key={record.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-6 bg-white border-2 border-brand-black rounded-3xl shadow-[6px_6px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all group"
                                >
                                    <div className="p-3 bg-brand-yellow rounded-xl inline-block mb-4 border-2 border-brand-black group-hover:scale-110 transition-transform">
                                        <record.icon size={20} className="text-brand-black" />
                                    </div>
                                    <h4 className="font-heading font-black text-xs uppercase mb-1">{record.year} - {record.title}</h4>
                                    <p className="font-body text-[10px] text-gray-500 leading-tight">{record.desc}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Mission Summary */}
                        <div className="p-8 bg-brand-black rounded-[30px] border-4 border-brand-black shadow-[8px_8px_0px_0px_#F5B301] space-y-4">
                            <div className="flex items-center gap-3">
                                <School className="text-brand-yellow" size={24} />
                                <h3 className="font-heading font-black text-lg text-white uppercase italic">Latest Initiative</h3>
                            </div>
                            <p className="font-body text-gray-400 text-sm leading-relaxed">
                                Launched the **"AI Animation Factory"** in Ijora Badia, training thousands of children in AI-assisted storytelling. Currently collaborating with **Olabisi Onabanjo University (OOU)** for a new record attempt in 2026.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background elements */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-gray-100 -z-10" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-yellow/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
        </section>
    );
}
