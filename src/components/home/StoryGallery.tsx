"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { SectionDecoration, FloatingDecoration } from "@/components/ui/SectionDecoration";

const stories = [
    {
        id: 1,
        title: "The First Independence Day Parade",
        quote: "I was just a small boy when the green and white flag was hoisted for the very first time. The streets of Lagos were electric...",
        author: "Babatunde Aliyu",
        location: "Lagos, Nigeria",
        category: "Before Independence",
        image: "/images/story-portrait-2.png",
    },
    {
        id: 2,
        title: "My Grandmother's Akara Recipe",
        quote: "Every Saturday morning, the scent of palm oil and fresh ground beans would wake the entire compound up...",
        author: "Nneka Okafor",
        location: "Enugu, Nigeria",
        category: "Culture",
        image: "/images/story-portrait-1.png",
    },
    {
        id: 3,
        title: "The Legend of the Talking Drum",
        quote: "The Gangan drum speaks a language that only the heart can truly understand. In the ancient courts of Oyo...",
        author: "Sunday Igwee",
        location: "Abuja, FCT",
        category: "Tradition",
        image: "/images/hero-leader-portrait.png",
    }
];

export default function StoryGallery() {
    return (
        <section id="gallery" className="w-full py-24 bg-black">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-16 text-left">
                    <h2 className="font-hero text-5xl md:text-7xl text-brand-yellow mb-4 uppercase">
                        Voices of Nigeria
                    </h2>
                    <p className="font-body text-gray-400 text-xl max-w-2xl">
                        Uniting a nation through the power of our shared stories.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {stories.map((story, i) => (
                        <motion.div
                            key={story.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="group relative flex flex-col bg-white/5 rounded-[2rem] overflow-hidden border border-white/10 hover:border-brand-yellow/50 transition-all"
                        >
                            {/* Portrait Image */}
                            <div className="aspect-[4/5] relative overflow-hidden">
                                <img 
                                    src={story.image} 
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100" 
                                    alt={story.author} 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                                
                                <div className="absolute bottom-6 left-6 right-6">
                                    <p className="font-heading font-black text-2xl text-white uppercase">{story.author}</p>
                                    <p className="font-body text-sm text-brand-yellow uppercase tracking-widest flex items-center gap-1">
                                        <MapPin size={14} /> {story.location}
                                    </p>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8 flex flex-col flex-grow">
                                <p className="font-body text-gray-300 text-lg mb-8 italic leading-relaxed">
                                    "{story.quote}"
                                </p>

                                <div className="mt-auto flex justify-between items-center">
                                    <button className="text-brand-yellow font-heading font-black text-sm uppercase tracking-widest hover:underline flex items-center gap-2">
                                        Read more <ArrowRight size={16} />
                                    </button>
                                    <span className="text-[10px] font-black uppercase text-gray-500 tracking-tighter">{story.category}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <button className="bg-brand-yellow text-black px-12 py-4 rounded-full font-heading font-black text-xl hover:scale-105 transition-all shadow-[6px_6px_0px_0px_#FFFFFF] uppercase">
                        Load More..
                    </button>
                </div>
            </div>
        </section>
    );
}
