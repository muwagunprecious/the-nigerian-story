"use client";

import { motion } from "framer-motion";
import { Trophy, TrendingUp, Users } from "lucide-react";

export default function GuinnessRecord() {
    const currentStories = 3245;
    const goal = 100000;
    const percentage = (currentStories / goal) * 100;

    return (
        <section className="w-full py-16">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="w-full bg-brand-black text-brand-white rounded-[2rem] p-8 md:p-16 border-8 border-brand-yellow relative overflow-hidden text-center shadow-[10px_10px_0px_0px_#F5B301]"
            >
                {/* Background decorative doodles */}
                <div className="absolute top-5 left-5 opacity-20"><Trophy size={64} /></div>
                <div className="absolute bottom-5 right-5 opacity-20"><Users size={64} /></div>

                <div className="relative z-10 max-w-3xl mx-auto">
                    <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-brand-white text-brand-black font-heading font-bold rounded-full mb-6">
                        <TrendingUp size={20} className="text-brand-yellow" />
                        <span className="mt-1">Guinness World Record Attempt</span>
                    </div>

                    <h2 className="font-heading font-black text-4xl md:text-6xl mb-6">
                        THE LARGEST COLLECTION OF NIGERIAN STORIES
                    </h2>

                    <p className="font-body text-xl text-gray-300 mb-12">
                        Led by Adetunwase Adenle, we are on a mission to document the largest collection of Nigerian stories before and after independence. Be a part of history!
                    </p>

                    <div className="bg-brand-white rounded-3xl p-6 md:p-10 border-4 border-gray-200">
                        <div className="flex justify-between items-end mb-4 text-brand-black font-heading font-black">
                            <div className="text-left">
                                <span className="block text-sm md:text-lg text-gray-500 font-bold uppercase tracking-wider mb-2">Stories Collected</span>
                                <span className="text-4xl md:text-6xl text-brand-yellow" style={{ WebkitTextStroke: '2px #000' }}>{currentStories.toLocaleString()}</span>
                            </div>
                            <div className="text-right">
                                <span className="block text-sm md:text-lg text-gray-500 font-bold uppercase tracking-wider mb-2">Goal</span>
                                <span className="text-3xl md:text-4xl text-brand-black">{goal.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full h-8 bg-gray-200 rounded-full overflow-hidden border-2 border-brand-black relative">
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${percentage}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full bg-brand-yellow border-r-2 border-brand-black relative"
                            >
                                {/* Diagonal stripes for playful effect */}
                                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)' }}></div>
                            </motion.div>
                        </div>

                        <p className="text-brand-black font-body font-bold mt-6">
                            Only {(goal - currentStories).toLocaleString()} stories left to reach our goal!
                        </p>

                        <div className="mt-8">
                            <a href="#submit" className="btn-primary w-full md:w-auto text-lg md:text-xl px-12">
                                Add Your Story Now
                            </a>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
