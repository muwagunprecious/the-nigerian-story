"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { BookOpen, Calendar, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

interface Story {
    id: string;
    created_at: string;
    title: string;
    content: string;
    location: string;
    era: string;
    category: string;
}

export default function MyStories() {
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/login");
                return;
            }

            const { data, error } = await supabase
                .from("stories")
                .select("*")
                .eq("user_id", session.user.id)
                .order("created_at", { ascending: false });

            if (error) throw error;
            setStories(data || []);
        } catch (err) {
            console.error("Error fetching stories:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-yellow"></div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-12">
            <div className="max-w-6xl mx-auto space-y-12">
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <BookOpen className="text-brand-yellow" size={32} />
                        <h1 className="font-heading font-black text-5xl uppercase text-brand-black">My <span className="text-brand-yellow italic">Stories</span></h1>
                    </div>
                    <span className="font-heading font-bold text-gray-400 italic text-xl">{stories.length} Total</span>
                </header>

                {stories.length === 0 ? (
                    <div className="bg-white py-24 rounded-3xl border-4 border-dashed border-gray-100 text-center">
                        <p className="font-body text-gray-400 text-xl">You haven't submitted any stories yet.</p>
                        <button
                            onClick={() => router.push("/#submit")}
                            className="mt-4 text-brand-yellow font-heading font-bold hover:underline text-lg"
                        >
                            Start your first story →
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {stories.map((story) => (
                            <motion.div
                                key={story.id}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white p-8 rounded-3xl border-2 border-brand-black shadow-[8px_8px_0px_0px_#000] group"
                            >
                                <div className="flex flex-wrap gap-3 mb-4">
                                    <span className="px-3 py-1 bg-yellow-50 text-brand-black text-xs font-bold rounded-full border border-brand-yellow">
                                        {story.category}
                                    </span>
                                    <span className="flex items-center gap-1 text-xs text-gray-400">
                                        <Calendar size={12} /> {new Date(story.created_at).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center gap-1 text-xs text-gray-400">
                                        <MapPin size={12} /> {story.location}
                                    </span>
                                </div>
                                <h3 className="font-heading font-black text-2xl uppercase mb-3 group-hover:text-brand-yellow transition-colors">
                                    {story.title}
                                </h3>
                                <p className="font-body text-gray-600 line-clamp-4">
                                    {story.content}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
