"use client";

import { motion } from "framer-motion";
import { SectionDecoration, FloatingDecoration } from "@/components/ui/SectionDecoration";

const leaders = [
    {
        name: "Shehu Shagari",
        role: "1st Executive President",
        years: "1979 - 1983",
        image: "/images/presidents/shagari.png",
        bio: "The first democratically elected President of Nigeria after the transfer of power by the military regime of Olusegun Obasanjo."
    },
    {
        name: "Obafemi Awolowo",
        role: "Founding Father / Premier",
        years: "1954 - 1960",
        image: "/images/presidents/awolowo.png",
        bio: "A key figure in Nigeria's independence movement and the first Premier of the Western Region, known for his visionary social policies."
    },
    {
        name: "Umaru Musa Yar'Adua",
        role: "13th President",
        years: "2007 - 2010",
        image: "/images/presidents/yaradua.png",
        bio: "A leader known for his integrity and the 'Seven-Point Agenda', focused on power, security, and wealth creation."
    },
    {
        name: "Sani Abacha",
        role: "Military Head of State",
        years: "1993 - 1998",
        image: "/images/presidents/abacha.png",
        bio: "A powerful military leader who oversaw a period of significant economic centralization and political transition."
    },
    {
        name: "Bola Ahmed Tinubu",
        role: "16th President",
        years: "2023 - Present",
        image: "/images/presidents/tinubu.png",
        bio: "The current President of Nigeria, leading the 'Renewed Hope' agenda to transform the national economy and infrastructure."
    }
];

export default function HistorySection() {
    return (
        <section id="history" className="w-full py-32 bg-black relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
                <img src="/images/dashboard/pattern.png" className="w-full h-full object-cover invert" alt="" />
            </div>
            
            <FloatingDecoration 
                src="/images/dashboard/mask.png" 
                className="top-20 left-10 w-48 opacity-10 -rotate-12" 
                delay={0} 
            />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <header className="mb-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-2 bg-brand-yellow text-black font-heading font-bold rounded-full mb-6 transform rotate-2 uppercase tracking-tighter"
                    >
                        Foundation of a Nation
                    </motion.div>
                    <h2 className="font-hero text-6xl md:text-8xl text-brand-yellow uppercase leading-none tracking-tighter drop-shadow-[4px_4px_0px_#FFF]">
                        THE <span className="text-white">LEGENDS</span>
                    </h2>
                    <p className="font-body text-gray-400 text-xl max-w-2xl mx-auto mt-8 italic">
                        Honoring the figures who shaped our past and continue to define our shared journey into the future.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
                    {leaders.map((leader, i) => (
                        <motion.div
                            key={leader.name}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.6 }}
                            className="group relative flex flex-col bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10 hover:border-brand-yellow/50 transition-all overflow-hidden"
                        >
                            {/* Portrait Image Container */}
                            <div className="aspect-[3/4] relative overflow-hidden">
                                <img 
                                    src={leader.image} 
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100" 
                                    alt={leader.name} 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                                
                                <div className="absolute bottom-6 left-6 right-6">
                                    <div className="bg-brand-yellow/90 backdrop-blur-sm text-black px-3 py-1 rounded-full w-fit mb-3 transform -rotate-2">
                                        <p className="font-heading font-black text-[10px] uppercase tracking-tighter">{leader.years}</p>
                                    </div>
                                    <h3 className="font-hero text-3xl text-white uppercase leading-none tracking-tighter">{leader.name}</h3>
                                    <p className="font-heading font-bold text-[10px] text-brand-yellow uppercase tracking-widest mt-2">{leader.role}</p>
                                </div>
                            </div>

                            {/* Bio Content (Hidden initially, showed on hover if desired or just kept static) */}
                            <div className="p-8 group-hover:bg-brand-yellow/5 transition-colors">
                                <p className="font-body text-gray-400 text-sm leading-relaxed line-clamp-3 italic">
                                    "{leader.bio}"
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-24 text-center">
                    <div className="p-12 border-4 border-dashed border-brand-yellow/20 rounded-[4rem] relative group">
                        <div className="absolute -top-10 -right-10 w-32 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                            <SectionDecoration src="/images/dashboard/drum.png" className="w-full" />
                        </div>
                        <h3 className="font-hero text-4xl text-white uppercase mb-4 tracking-tighter">Every Story counts.</h3>
                        <p className="font-body text-gray-400 text-xl max-w-2xl mx-auto italic">
                            These leaders made history. Now it's your turn to record yours in the Great Nigerian Story.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
