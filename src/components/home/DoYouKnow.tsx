"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { SectionDecoration, FloatingDecoration } from "@/components/ui/SectionDecoration";

const facts = [
    {
        id: 1,
        title: "Nigeria is home to over 250 unique ethnic groups.",
        description: "Each group carries a distinct lineage of stories, traditions, and wisdom. This project is our collective attempt to bridge these voices.",
        stats: [
            { label: "Ethnic Groups", value: "250+" },
            { label: "Languages", value: "500+" }
        ],
        image: "/images/do-you-know.png"
    },
    {
        id: 2,
        title: "Nigeria has the largest economy and population in Africa.",
        description: "Known as the 'Giant of Africa', our stories aren't just local—they're global. We are documenting the resilience and innovation of our people.",
        stats: [
            { label: "Population", value: "230M+" },
            { label: "GDP growth", value: "3.2%+" }
        ],
        image: "/images/do-you-know-2.png"
    },
    {
        id: 3,
        title: "Lagos is the fastest-growing tech hub in West Africa.",
        description: "From Yaba-con Valley to global fintech giants, our digital stories are rewriting the future of the continent.",
        stats: [
            { label: "Startups", value: "400+" },
            { label: "Tech Talent", value: "Global" }
        ],
        image: "/images/do-you-know-3.png"
    },
    {
        id: 4,
        title: "The Zuma Rock is a massive natural monolith in Niger State.",
        description: "Standing at 725 meters, it's often called the 'Gateway to Abuja' and is a sacred symbol of our geographical majesty.",
        stats: [
            { label: "Height", value: "725m" },
            { label: "Location", value: "Niger" }
        ],
        image: "/images/do-you-know-4.png"
    },
    {
        id: 5,
        title: "Adire is a centuries-old indigo-dyed textile tradition.",
        description: "Our fashion isn't just clothing; it's a visual language. Every pattern tells a story of heritage and hand-crafted excellence.",
        stats: [
            { label: "Craft", value: "Hand-dyed" },
            { label: "Heritage", value: "Yoruba" }
        ],
        image: "/images/do-you-know-5.png"
    },
    {
        id: 6,
        title: "Afrobeats has become a global cultural phenomenon.",
        description: "From Fela Kuti to Davido, our rhythm is the heartbeat of the world, uniting millions through the power of sound.",
        stats: [
            { label: "Streams", value: "Billions" },
            { label: "Influence", value: "Global" }
        ],
        image: "/images/do-you-know-6.png"
    },
    {
        id: 7,
        title: "Nigerian literature is celebrated worldwide.",
        description: "With giants like Chinua Achebe and Wole Soyinka, our written stories have shaped global discourse for decades.",
        stats: [
            { label: "Nobel Prize", value: "1" },
            { label: "Authors", value: "World-class" }
        ],
        image: "/images/do-you-know-7.png"
    },
    {
        id: 8,
        title: "The Super Eagles are a symbol of national unity.",
        description: "Football is more than a sport in Nigeria—it's a shared passion that brings 200 million people together as one.",
        stats: [
            { label: "AFCON Wins", value: "3" },
            { label: "Spirit", value: "Unstoppable" }
        ],
        image: "/images/do-you-know-8.png"
    },
    {
        id: 9,
        title: "Nigerian Jollof is arguably the best in the world.",
        description: "Our cuisine is a masterclass in spice and soul. Join the 'Jollof Wars' and celebrate the flavors that define our gatherings.",
        stats: [
            { label: "Rating", value: "Elite" },
            { label: "Culture", value: "Social" }
        ],
        image: "/images/do-you-know-9.png"
    },
    {
        id: 10,
        title: "Nollywood is the second largest film industry globally.",
        description: "Producing thousands of films annually, Nollywood is our digital lens into the daily lives, dramas, and dramas of Nigeria.",
        stats: [
            { label: "Output", value: "2500+/yr" },
            { label: "Market", value: "Worldwide" }
        ],
        image: "/images/do-you-know-10.png"
    }
];

export default function DoYouKnow() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            handleNext();
        }, 3000);
        return () => clearInterval(timer);
    }, [currentIndex]);

    const handleNext = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % facts.length);
    };

    const handlePrev = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + facts.length) % facts.length);
    };

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 500 : -500,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 500 : -500,
            opacity: 0
        })
    };

    return (
        <section className="w-full py-16 relative group overflow-hidden">
            {/* Cultural Background Decoration: Calabash */}
            <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-96 opacity-[0.03] pointer-events-none rotate-12">
                <SectionDecoration src="/images/dashboard/calabash.png" className="w-full" />
            </div>

            {/* Scattered Cowries and Attire */}
            <FloatingDecoration 
                src="/images/dashboard/cowries.png" 
                className="top-10 right-[10%] w-20 opacity-20" 
                delay={2} 
            />
            <FloatingDecoration 
                src="/images/dashboard/attire.png" 
                className="bottom-20 left-[5%] w-32 opacity-10" 
                delay={3} 
            />
            <FloatingDecoration 
                src="/images/dashboard/nok.png" 
                className="top-40 left-[15%] w-24 opacity-10 -rotate-12" 
                delay={1} 
            />

            <div className="bg-brand-black rounded-[3rem] border-4 border-brand-black overflow-hidden shadow-[12px_12px_0px_0px_#F5B301] min-h-[500px] relative">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        className="flex flex-col lg:flex-row h-full min-h-[500px]"
                    >
                        {/* Image Content */}
                        <div className="lg:w-1/2 relative min-h-[300px] lg:min-h-[500px]">
                            <img
                                src={facts[currentIndex].image}
                                alt="Nigerian Storytelling"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-brand-black/40 to-transparent" />
                        </div>

                        {/* Text Content */}
                        <div className="lg:w-1/2 p-8 md:p-16 flex flex-col justify-center text-white relative">
                            <div className="absolute top-8 right-8 text-brand-yellow/10">
                                <HelpCircle size={150} strokeWidth={1} />
                            </div>

                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-yellow text-brand-black font-heading font-bold rounded-full mb-6">
                                    <Sparkles size={20} />
                                    <span>Did You Know?</span>
                                </div>

                                <h2 className="font-heading font-black text-4xl md:text-5xl lg:text-4xl xl:text-5xl uppercase leading-[0.9] mb-8">
                                    {facts[currentIndex].title.split(" ").map((word, i) => (
                                        word === "250" || word === "230M+" || word === "Giant" || word === "second" || word === "largest" || word === "best" ?
                                            <span key={i} className="text-brand-yellow italic mr-2">{word} </span> :
                                            <span key={i} className="mr-2">{word}</span>
                                    ))}
                                </h2>

                                <p className="font-body text-xl text-gray-400 mb-8 leading-relaxed">
                                    {facts[currentIndex].description}
                                </p>

                                <div className="flex flex-wrap gap-4">
                                    {facts[currentIndex].stats.map((stat, i) => (
                                        <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                                            <span className="text-brand-yellow font-black">{stat.value}</span>
                                            <span className="text-sm font-bold uppercase text-gray-500">{stat.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Controls */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 bg-brand-black/50 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
                    <button
                        onClick={handlePrev}
                        className="p-2 bg-white/5 hover:bg-brand-yellow hover:text-brand-black rounded-full transition-all border border-white/10"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex gap-1.5">
                        {facts.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all ${i === currentIndex ? "w-6 bg-brand-yellow" : "w-1.5 bg-white/20"}`}
                            />
                        ))}
                    </div>
                    <button
                        onClick={handleNext}
                        className="p-2 bg-white/5 hover:bg-brand-yellow hover:text-brand-black rounded-full transition-all border border-white/10"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </section>
    );
}
