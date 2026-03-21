"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Play, CheckCircle2, ChevronLeft, BookOpen, Clock, Video, List, Star } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

interface Lesson {
    id: string;
    module_id: string;
    title: string;
    description: string;
    video_url: string;
    duration: string;
    order_index: number;
}

interface Module {
    id: string;
    title: string;
    description: string;
}

export default function ModulePlayer() {
    const { moduleId } = useParams();
    const router = useRouter();
    const [module, setModule] = useState<Module | null>(null);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
    const [completedLessons, setCompletedLessons] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (moduleId) fetchData();
    }, [moduleId]);

    const fetchData = async () => {
        setLoading(true);
        const isMock = typeof window !== "undefined" && localStorage.getItem("NIGERIA_STORY_MOCK_MODE") === "true";

        if (isMock) {
            // Provide mock data for the selected module
            setModule({
                id: moduleId as string,
                title: "2D Animation Fundamentals",
                description: "Master the core principles of animation, from squash and stretch to timing and anticipation. This module covers everything you need to start creating fluid, professional 2D movements."
            });

            const mockLessons: Lesson[] = [
                {
                    id: "mock-l1",
                    module_id: moduleId as string,
                    title: "Introduction to Squash & Stretch",
                    description: "The most important principle. Learn how to give your animations weight and flexibility.",
                    video_url: "https://player.vimeo.com/video/146022717",
                    duration: "12:45",
                    order_index: 0
                },
                {
                    id: "mock-l2",
                    module_id: moduleId as string,
                    title: "Anticipation & Follow Through",
                    description: "Preparing the audience for an action and handling the physics of completion.",
                    video_url: "https://player.vimeo.com/video/146022717",
                    duration: "15:20",
                    order_index: 1
                },
                {
                    id: "mock-l3",
                    module_id: moduleId as string,
                    title: "Timing & Spacing",
                    description: "How the number of frames between poses determines the speed and feel of an action.",
                    video_url: "https://player.vimeo.com/video/146022717",
                    duration: "10:10",
                    order_index: 2
                }
            ];

            setLessons(mockLessons);
            setActiveLesson(mockLessons[0]);
            setCompletedLessons(["mock-l1"]); // Start with one completed for demo
            setLoading(false);
            return;
        }

        // 1. Fetch Module
        const { data: modData } = await supabase
            .from("lms_modules")
            .select("*")
            .eq("id", moduleId)
            .single();
// ...
        
        // 2. Fetch Lessons
        const { data: lessonData } = await supabase
            .from("lms_lessons")
            .select("*")
            .eq("module_id", moduleId)
            .order("order_index", { ascending: true });

        // 3. Fetch user progress
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data: progressData } = await supabase
                .from("lms_progress")
                .select("lesson_id")
                .eq("user_id", user.id);
            
            if (progressData) setCompletedLessons(progressData.map(p => p.lesson_id));
        }

        if (modData) setModule(modData);
        if (lessonData && lessonData.length > 0) {
            setLessons(lessonData);
            setActiveLesson(lessonData[0]);
        }
        setLoading(false);
    };

    const toggleProgress = async (lessonId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        if (completedLessons.includes(lessonId)) {
            await supabase.from("lms_progress").delete().eq("user_id", user.id).eq("lesson_id", lessonId);
            setCompletedLessons(prev => prev.filter(id => id !== lessonId));
        } else {
            await supabase.from("lms_progress").insert([{ user_id: user.id, lesson_id: lessonId }]);
            setCompletedLessons(prev => [...prev, lessonId]);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center anime-pulse"><BookOpen className="animate-bounce" /></div>;
    if (!module) return <div>Module not found</div>;

    return (
        <div className="min-h-screen bg-transparent p-4 lg:p-8 flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <Link 
                    href="/dashboard/academy" 
                    className="flex items-center gap-2 font-heading font-black text-sm uppercase hover:text-brand-yellow transition-colors"
                >
                    <ChevronLeft size={20} /> Back to Modules
                </Link>
                <div className="flex items-center gap-4">
                    <div className="bg-brand-black text-white px-4 py-2 rounded-xl text-xs font-black uppercase flex items-center gap-2 border-2 border-brand-black shadow-[4px_4px_0px_0px_#F5B301]">
                        <Star size={14} className="text-brand-yellow" /> {completedLessons.length}/{lessons.length} Completed
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Player Area */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="aspect-video bg-brand-black rounded-[40px] border-8 border-brand-black shadow-[16px_16px_0px_0px_#000] overflow-hidden relative group">
                        {activeLesson ? (
                            <iframe
                                src={activeLesson.video_url}
                                className="w-full h-full"
                                allow="autoplay; fullscreen; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/20">
                                <Video size={100} strokeWidth={1} />
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 p-4">
                        <div className="flex items-center gap-3">
                            <span className="bg-brand-yellow text-brand-black px-3 py-1 rounded-full text-xs font-black uppercase">
                                Episode {activeLesson ? lessons.findIndex(l => l.id === activeLesson.id) + 1 : "?"}
                            </span>
                            <h1 className="font-heading font-black text-3xl uppercase">{activeLesson?.title || "Select a Lesson"}</h1>
                        </div>
                        <p className="font-body text-gray-600 leading-relaxed max-w-3xl">
                            {activeLesson?.description}
                        </p>
                    </div>
                </div>

                {/* Sidebar Navigation */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-[40px] border-4 border-brand-black shadow-[12px_12px_0px_0px_#000] overflow-hidden flex flex-col h-full max-h-[70vh]">
                        <div className="p-6 bg-brand-black text-white flex items-center gap-3">
                            <List size={20} className="text-brand-yellow" />
                            <h2 className="font-heading font-black text-lg uppercase">Lessons</h2>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {lessons.map((lesson, idx) => {
                                const isActive = activeLesson?.id === lesson.id;
                                const isCompleted = completedLessons.includes(lesson.id);

                                return (
                                    <button
                                        key={lesson.id}
                                        onClick={() => setActiveLesson(lesson)}
                                        className={`w-full p-4 rounded-2xl border-2 text-left flex items-start gap-4 transition-all group ${
                                            isActive 
                                            ? "bg-brand-yellow border-brand-black shadow-[4px_4px_0px_0px_#000]" 
                                            : "border-transparent hover:bg-gray-50 border-brand-black/5"
                                        }`}
                                    >
                                        <div className={`mt-1 flex-shrink-0 ${isActive ? "text-brand-black" : "text-gray-400 group-hover:text-brand-yellow"}`}>
                                            {isCompleted ? <CheckCircle2 size={20} className="text-green-600" /> : <Play size={20} />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className={`font-heading font-bold text-sm leading-tight truncate ${isActive ? "text-brand-black" : "text-gray-700"}`}>
                                                {idx + 1}. {lesson.title}
                                            </h4>
                                            <span className={`text-[10px] font-black uppercase ${isActive ? "text-brand-black/60" : "text-gray-400"}`}>
                                                {lesson.duration}
                                            </span>
                                        </div>
                                        <div
                                            onClick={(e) => { e.stopPropagation(); toggleProgress(lesson.id); }}
                                            className="p-1 hover:scale-125 transition-transform"
                                        >
                                            <CheckCircle2 size={16} className={isCompleted ? "text-green-600" : "text-gray-200"} />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
