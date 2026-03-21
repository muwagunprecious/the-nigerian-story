"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { SectionDecoration, FloatingDecoration } from "@/components/ui/SectionDecoration";

const stories = [
    {
        id: 1,
        title: "The First Independence Day Parade",
        preview: "I was just a small boy when the green and white flag was hoisted for the very first time. The streets of Lagos were electric...",
        author: "Babatunde Aliyu",
        location: "Lagos, Nigeria",
        category: "Before Independence",
        color: "bg-white/80 backdrop-blur-md",
    },
    {
        id: 2,
        title: "My Grandmother's Akara Recipe",
        preview: "Every Saturday morning, the scent of palm oil and fresh ground beans would wake the entire compound up. We gathered around...",
        author: "Nneka Okafor",
        location: "Enugu, Nigeria",
        category: "Culture",
        color: "bg-brand-yellow/80 backdrop-blur-md",
    },
    {
        id: 3,
        title: "Building the Tech Hub in Yaba",
        preview: "It started with a few laptops and a generator that wouldn't stop smoking. We didn't know we were building a multi-million tech ecosystem...",
        author: "Seyi O.",
        location: "Yaba, Lagos",
        category: "Innovation",
        color: "bg-white/80 backdrop-blur-md",
    },
    {
        id: 4,
        title: "The 1999 Transition",
        preview: "Standing in the sun for hours waiting to cast my vote for the first time in years. The feeling of hope was thick in the air...",
        author: "Mohammed Sani",
        location: "Kano, Nigeria",
        category: "After Independence",
        color: "bg-white/80 backdrop-blur-md",
    },
    {
        id: 5,
        title: "Durbar Festival Memories",
        preview: "The horses were adorned in the most majestic colors I had ever seen. The sounds of the trumpets are forever etched in my mind...",
        author: "Aisha Bello",
        location: "Zaria, Kaduna",
        category: "Community",
        color: "bg-white/80 backdrop-blur-md",
    },
    {
        id: 6,
        title: "Nollywood's Golden Era",
        preview: "Renting VHS tapes from the corner store was the highlight of our Fridays. Living In Bondage changed everything for us...",
        author: "Chinedu E.",
        location: "Asaba, Delta",
        category: "Culture",
        color: "bg-brand-yellow",
    }
];

const filters = ["All", "Before Independence", "After Independence", "Culture", "Community", "Innovation"];

export default function StoryGallery() {
    return (
        <section id="gallery" className="w-full py-16 relative">
            {/* Cultural Background Decoration: Molded Pot */}
            <div className="absolute -right-12 top-0 w-64 opacity-[0.03] pointer-events-none -rotate-12 translate-y-[-20%]">
                <SectionDecoration src="/images/dashboard/pot.png" className="w-full" />
            </div>

            {/* Scattered Elements */}
            <FloatingDecoration 
                src="/images/dashboard/bus.png" 
                className="top-20 left-10 w-24 opacity-20" 
                delay={0} 
            />
            <FloatingDecoration 
                src="/images/dashboard/cowries.png" 
                className="bottom-10 right-[20%] w-20 opacity-20" 
                delay={1.5} 
            />
            <FloatingDecoration 
                src="/images/dashboard/map.png" 
                className="top-1/2 left-[5%] w-32 opacity-10" 
                delay={4} 
            />

            <div className="flex flex-col md:flex-row justify-between items-end mb-12 relative z-10">
                <div className="mb-6 md:mb-0">
                    <h2 className="font-heading font-black text-4xl md:text-5xl mb-4 text-brand-black">
                        EXPLORE THE <span className="text-brand-yellow inline-block relative">
                            STORIES
                            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0,5 Q50,10 100,0" stroke="#000" strokeWidth="4" fill="none" strokeLinecap="round" />
                            </svg>
                        </span>
                    </h2>
                    <p className="font-body text-gray-600 text-lg max-w-2xl">
                        Dive into thousands of stories that make up the rich tapestry of our nation's history.
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-12">
                {filters.map((filter, index) => (
                    <button
                        key={filter}
                        className={`font-heading font-bold px-6 py-2 rounded-full border-2 border-brand-black transition-all shadow-[2px_2px_0px_0px_#000] hover:shadow-[0px_0px_0px_0px_#000] hover:translate-y-1 ${index === 0 ? "bg-brand-yellow text-brand-black" : "bg-brand-white text-brand-black"
                            }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {stories.map((story, i) => (
                    <motion.div
                        key={story.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className={`shadow-card shadow-card-hover p-6 flex flex-col h-full ${story.color}`}
                    >
                        <div className="inline-block px-3 py-1 bg-brand-black text-brand-white text-xs font-bold uppercase tracking-wider rounded-full mb-4 w-max">
                            {story.category}
                        </div>

                        <h3 className="font-heading font-black text-2xl text-brand-black mb-3">
                            {story.title}
                        </h3>

                        <p className="font-body text-brand-black/80 mb-6 flex-grow">
                            "{story.preview}"
                        </p>

                        <div className="flex justify-between items-end mt-auto pt-6 border-t-2 border-brand-black/20">
                            <div>
                                <p className="font-heading font-bold text-brand-black">{story.author}</p>
                                <p className="font-body text-sm text-brand-black/60 flex items-center gap-1">
                                    <MapPin size={14} /> {story.location}
                                </p>
                            </div>

                            <button className="w-10 h-10 rounded-full bg-brand-black text-brand-white flex items-center justify-center hover:bg-brand-white hover:text-brand-black hover:border-2 hover:border-brand-black transition-all">
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-12 text-center">
                <button className="btn-secondary text-lg">Load More Stories</button>
            </div>
        </section>
    );
}
