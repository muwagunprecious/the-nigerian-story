"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Play, BookOpen, Clock, Lock, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Module {
    id: string;
    title: string;
    description: string;
    thumbnail_url: string;
    order_index: number;
}

export default function AcademyPage() {
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchModules();
    }, []);

    const fetchModules = async () => {
        setLoading(true);
        const isMock = typeof window !== "undefined" && localStorage.getItem("NIGERIA_STORY_MOCK_MODE") === "true";

        if (isMock) {
            setModules([
                {
                    id: "mock-m1",
                    title: "2D Animation Fundamentals",
                    description: "Learn the 12 principles of animation and start your journey into the world of 2D storytelling.",
                    thumbnail_url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
                    order_index: 0
                },
                {
                    id: "mock-m2",
                    title: "Storyboarding for Nigeria",
                    description: "Visualizing our oral traditions. Master the art of the storyboard to plan your animated masterpieces.",
                    thumbnail_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
                    order_index: 1
                },
                {
                    id: "mock-m3",
                    title: "Character Design & Folklore",
                    description: "Bringing Sango, Eyo, and other legends to life through modern character design techniques.",
                    thumbnail_url: "https://images.unsplash.com/photo-1544652478-6653ae047d64?auto=format&fit=crop&w=800&q=80",
                    order_index: 2
                }
            ]);
            setLoading(false);
            return;
        }

        const { data, error } = await supabase
            .from("lms_modules")
            .select("*")
            .order("order_index", { ascending: true });
        
        if (!error && data) setModules(data);
        setLoading(false);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-yellow"></div>
        </div>
    );

    return (
        <div className="min-h-screen p-8 space-y-12">
            <header className="space-y-4">
                <h1 className="font-heading font-black text-5xl uppercase text-brand-black">
                    Animation <span className="text-brand-yellow italic">Academy</span>
                </h1>
                <p className="font-body text-gray-600 text-lg max-w-2xl text-balance">
                    Master the art of storytelling through animation. Learn from the best and bring the pieces of the Nigeria Story to life.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {modules.map((mod, i) => (
                    <motion.div
                        key={mod.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group bg-white rounded-[40px] border-4 border-brand-black overflow-hidden shadow-[12px_12px_0px_0px_#000] hover:shadow-[16px_16px_0px_0px_#000] hover:-translate-y-2 transition-all flex flex-col"
                    >
                        <div className="aspect-video bg-brand-yellow relative overflow-hidden border-b-4 border-brand-black">
                            {mod.thumbnail_url ? (
                                <img src={mod.thumbnail_url} className="w-full h-full object-cover" alt={mod.title} />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center opacity-20">
                                    <BookOpen size={80} strokeWidth={1} />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-brand-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Link 
                                    href={`/dashboard/academy/${mod.id}`}
                                    className="w-16 h-16 bg-brand-yellow rounded-full border-4 border-brand-black flex items-center justify-center shadow-[4px_4px_0px_0px_#000] group-hover:scale-110 transition-transform"
                                >
                                    <Play fill="black" size={32} />
                                </Link>
                            </div>
                        </div>

                        <div className="p-8 flex-grow space-y-4">
                            <h3 className="font-heading font-black text-2xl uppercase leading-tight group-hover:text-brand-yellow transition-colors">
                                {mod.title}
                            </h3>
                            <p className="font-body text-gray-600 line-clamp-3">
                                {mod.description}
                            </p>
                        </div>

                        <div className="p-8 pt-0 mt-auto flex justify-between items-center border-t-2 border-brand-black/5">
                            <span className="font-heading font-bold text-sm uppercase flex items-center gap-2">
                                <Clock size={16} /> 4.5 Hours
                            </span>
                            <Link 
                                href={`/dashboard/academy/${mod.id}`}
                                className="font-heading font-black text-sm uppercase text-brand-black flex items-center gap-2 group-hover:translate-x-2 transition-transform"
                            >
                                Start Learning <ArrowRight size={18} />
                            </Link>
                        </div>
                    </motion.div>
                ))}

                {modules.length === 0 && (
                    <div className="col-span-full py-24 text-center bg-white rounded-[40px] border-4 border-dashed border-gray-200">
                        <BookOpen size={80} className="mx-auto text-gray-200 mb-6" />
                        <h3 className="font-heading font-black text-2xl uppercase text-gray-400">The Academy is coming soon</h3>
                        <p className="font-body text-gray-500 mt-2">Our instructors are busy animating the first modules for you!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
