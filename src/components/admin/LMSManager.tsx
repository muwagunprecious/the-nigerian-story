"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Play, Trash2, ChevronDown, ChevronUp, Video, BookOpen, Clock, Save, X } from "lucide-react";

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
    thumbnail_url: string;
    order_index: number;
}

export default function LMSManager() {
    const [modules, setModules] = useState<Module[]>([]);
    const [lessons, setLessons] = useState<Record<string, Lesson[]>>({});
    const [loading, setLoading] = useState(true);
    const [expandedModule, setExpandedModule] = useState<string | null>(null);

    // Form states
    const [showModuleForm, setShowModuleForm] = useState(false);
    const [newModule, setNewModule] = useState({ title: "", description: "", thumbnail_url: "" });
    const [showLessonForm, setShowLessonForm] = useState<string | null>(null);
    const [newLesson, setNewLesson] = useState({ title: "", description: "", video_url: "", duration: "" });

    useEffect(() => {
        fetchModules();
    }, []);

    const fetchModules = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("lms_modules")
            .select("*")
            .order("order_index", { ascending: true });
        
        if (!error && data) {
            setModules(data);
            // Fetch lessons for each module
            for (const mod of data) {
                fetchLessons(mod.id);
            }
        }
        setLoading(false);
    };

    const fetchLessons = async (moduleId: string) => {
        const { data, error } = await supabase
            .from("lms_lessons")
            .select("*")
            .eq("module_id", moduleId)
            .order("order_index", { ascending: true });
        
        if (!error && data) {
            setLessons(prev => ({ ...prev, [moduleId]: data }));
        }
    };

    const handleAddModule = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase
            .from("lms_modules")
            .insert([{ ...newModule, order_index: modules.length }]);
        
        if (!error) {
            fetchModules();
            setShowModuleForm(false);
            setNewModule({ title: "", description: "", thumbnail_url: "" });
        }
    };

    const handleAddLesson = async (moduleId: string) => {
        const { error } = await supabase
            .from("lms_lessons")
            .insert([{ 
                ...newLesson, 
                module_id: moduleId, 
                order_index: (lessons[moduleId]?.length || 0) 
            }]);
        
        if (!error) {
            fetchLessons(moduleId);
            setShowLessonForm(null);
            setNewLesson({ title: "", description: "", video_url: "", duration: "" });
        }
    };

    const deleteModule = async (id: string) => {
        if (!confirm("Delete module and ALL its lessons?")) return;
        const { error } = await supabase.from("lms_modules").delete().eq("id", id);
        if (!error) fetchModules();
    };

    const deleteLesson = async (lessonId: string, moduleId: string) => {
        if (!confirm("Delete this lesson?")) return;
        const { error } = await supabase.from("lms_lessons").delete().eq("id", lessonId);
        if (!error) fetchLessons(moduleId);
    };

    const seedDemoData = async () => {
        setLoading(true);
        const demoModule = {
            title: "African 2D Animation Fundamentals",
            description: "Learn how to use traditional Nigerian motifs and storytelling in modern 2D animation.",
            thumbnail_url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f",
            order_index: 0
        };

        const { data: mod, error: modErr } = await supabase
            .from("lms_modules")
            .insert([demoModule])
            .select()
            .single();

        if (mod) {
            const demoLessons = [
                {
                    module_id: mod.id,
                    title: "Introduction to Cultural Motif Animation",
                    description: "Understanding how to animate Nok art and Benin bronze styles.",
                    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    duration: "10:00",
                    order_index: 0
                },
                {
                    module_id: mod.id,
                    title: "Storytelling with The Talking Drum",
                    description: "Synchronizing sound and motion in traditional narratives.",
                    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    duration: "15:30",
                    order_index: 1
                }
            ];
            await supabase.from("lms_lessons").insert(demoLessons);
        }
        
        await fetchModules();
        setLoading(false);
        alert("Demo content added!");
    };

    if (loading) return <div className="p-12 text-center text-gray-500 font-heading font-black uppercase anime-pulse">Loading Academy Content...</div>;

    return (
        <div className="space-y-8 pb-20">
            <div className="flex justify-between items-center">
                <h2 className="font-heading font-black text-3xl uppercase">Academy modules <span className="text-brand-yellow">({modules.length})</span></h2>
                <div className="flex gap-4">
                    <button 
                        onClick={seedDemoData}
                        className="px-6 py-2 border-2 border-brand-black rounded-xl font-heading font-black text-sm uppercase hover:bg-gray-100 transition-all"
                    >
                        Seed Demo Data
                    </button>
                    <button 
                        onClick={() => setShowModuleForm(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus size={20} /> New Module
                    </button>
                </div>
            </div>

            {/* New Module Form */}
            <AnimatePresence>
                {showModuleForm && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-brand-black p-8 rounded-3xl border-4 border-brand-black shadow-[8px_8px_0px_0px_#F5B301] text-white"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-heading font-black text-xl uppercase italic">Create New Module</h3>
                            <button onClick={() => setShowModuleForm(false)} className="p-2 hover:bg-white/10 rounded-full transition-all"><X /></button>
                        </div>
                        <form onSubmit={handleAddModule} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-gray-400">Module Title</label>
                                <input 
                                    type="text" 
                                    required
                                    value={newModule.title}
                                    onChange={e => setNewModule({...newModule, title: e.target.value})}
                                    placeholder="e.g. Intro to 2D Animation"
                                    className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl focus:outline-none focus:border-brand-yellow font-body text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-gray-400">Thumbnail URL</label>
                                <input 
                                    type="text" 
                                    value={newModule.thumbnail_url}
                                    onChange={e => setNewModule({...newModule, thumbnail_url: e.target.value})}
                                    placeholder="https://..."
                                    className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl focus:outline-none focus:border-brand-yellow font-body text-white"
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-black uppercase text-gray-400">Description</label>
                                <textarea 
                                    required
                                    rows={3}
                                    value={newModule.description}
                                    onChange={e => setNewModule({...newModule, description: e.target.value})}
                                    placeholder="What will students learn in this module?"
                                    className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl focus:outline-none focus:border-brand-yellow font-body text-white resize-none"
                                />
                            </div>
                            <div className="md:col-span-2 flex justify-end">
                                <button type="submit" className="btn-primary w-full md:w-auto px-12">
                                    <Save size={18} className="inline mr-2" /> Save Module
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modules List */}
            <div className="space-y-6">
                {modules.map((mod) => (
                    <div 
                        key={mod.id}
                        className="bg-white rounded-3xl border-2 border-brand-black shadow-[8px_8px_0px_0px_#000] overflow-hidden"
                    >
                        <div 
                            className="p-6 cursor-pointer flex justify-between items-center hover:bg-gray-50 transition-all border-b-2 border-brand-black/10"
                            onClick={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)}
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-brand-yellow rounded-2xl border-2 border-brand-black flex items-center justify-center font-heading font-black text-2xl">
                                    {mod.order_index + 1}
                                </div>
                                <div>
                                    <h3 className="font-heading font-black text-2xl uppercase">{mod.title}</h3>
                                    <p className="text-gray-500 font-body text-sm line-clamp-1">{mod.description}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="bg-brand-black text-white px-3 py-1 rounded-full text-xs font-black uppercase">
                                    {lessons[mod.id]?.length || 0} Lessons
                                </span>
                                {expandedModule === mod.id ? <ChevronUp /> : <ChevronDown />}
                                <button 
                                    onClick={(e) => { e.stopPropagation(); deleteModule(mod.id); }}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>

                        <AnimatePresence>
                            {expandedModule === mod.id && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="p-8 bg-gray-50 space-y-4"
                                >
                                    {lessons[mod.id]?.map((lesson, idx) => (
                                        <div 
                                            key={lesson.id}
                                            className="bg-white p-4 rounded-2xl border-2 border-brand-black flex items-center justify-between shadow-[4px_4px_0px_0px_#000]"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-brand-yellow/20 rounded-xl text-brand-black">
                                                    <Video size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="font-heading font-bold text-lg">{idx + 1}. {lesson.title}</h4>
                                                    <div className="flex gap-4 text-xs text-brand-black/60 font-medium">
                                                        <span className="flex items-center gap-1"><Clock size={12} /> {lesson.duration}</span>
                                                        <span className="flex items-center gap-1 truncate max-w-[200px]"><Play size={12} /> {lesson.video_url}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => deleteLesson(lesson.id, mod.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}

                                    {/* Add Lesson Form */}
                                    {showLessonForm === mod.id ? (
                                        <div className="mt-6 bg-brand-yellow/10 p-6 rounded-2xl border-2 border-dashed border-brand-yellow space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input 
                                                    placeholder="Lesson Title"
                                                    value={newLesson.title}
                                                    onChange={e => setNewLesson({...newLesson, title: e.target.value})}
                                                    className="px-4 py-2 border-2 border-brand-black rounded-xl font-body text-sm"
                                                />
                                                <input 
                                                    placeholder="Video URL"
                                                    value={newLesson.video_url}
                                                    onChange={e => setNewLesson({...newLesson, video_url: e.target.value})}
                                                    className="px-4 py-2 border-2 border-brand-black rounded-xl font-body text-sm"
                                                />
                                                <input 
                                                    placeholder="Duration (e.g. 5:20)"
                                                    value={newLesson.duration}
                                                    onChange={e => setNewLesson({...newLesson, duration: e.target.value})}
                                                    className="px-4 py-2 border-2 border-brand-black rounded-xl font-body text-sm"
                                                />
                                                <textarea 
                                                    placeholder="Description"
                                                    value={newLesson.description}
                                                    onChange={e => setNewLesson({...newLesson, description: e.target.value})}
                                                    className="md:col-span-2 px-4 py-2 border-2 border-brand-black rounded-xl font-body text-sm resize-none"
                                                />
                                            </div>
                                            <div className="flex gap-3 justify-end">
                                                <button onClick={() => setShowLessonForm(null)} className="px-4 py-2 font-black text-sm uppercase">Cancel</button>
                                                <button 
                                                    onClick={() => handleAddLesson(mod.id)}
                                                    className="px-6 py-2 bg-brand-black text-white rounded-xl font-black text-sm uppercase shadow-[4px_4px_0px_0px_#F5B301]"
                                                >
                                                    Add Lesson
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => setShowLessonForm(mod.id)}
                                            className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-300 hover:border-brand-yellow hover:bg-brand-yellow/5 transition-all flex items-center justify-center gap-2 text-gray-400 hover:text-brand-yellow font-heading font-bold"
                                        >
                                            <Plus size={20} /> Add Lesson to Module
                                        </button>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}

                {modules.length === 0 && !showModuleForm && (
                     <div className="text-center py-24 bg-white rounded-3xl border-4 border-dashed border-gray-200">
                        <BookOpen size={64} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 font-heading font-bold text-xl">No modules created yet. Start building your academy!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
