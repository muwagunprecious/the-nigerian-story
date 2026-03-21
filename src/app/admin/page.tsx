"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Calendar, MapPin, User, Mail, Tag, BookOpen, BarChart3, Bell, Send, Users, Smartphone } from "lucide-react";
import { SectionDecoration, FloatingDecoration } from "@/components/ui/SectionDecoration";
import LMSManager from "@/components/admin/LMSManager";

interface Story {
    id: string;
    created_at: string;
    name: string;
    email: string;
    location: string;
    era: string;
    category: string;
    title: string;
    content: string;
}

interface Stats {
    totalStories: number;
    totalUsers: number;
    totalReferrals: number;
}

export default function AdminDashboard() {
    const [stories, setStories] = useState<Story[]>([]);
    const [stats, setStats] = useState<Stats>({ totalStories: 0, totalUsers: 0, totalReferrals: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"stories" | "academy">("stories");

    // Notification states
    const [notifTitle, setNotifTitle] = useState("");
    const [notifMessage, setNotifMessage] = useState("");
    const [notifType, setNotifType] = useState<"popup" | "feed">("feed");
    const [targetUser, setTargetUser] = useState(""); // empty for everyone
    const [sendingNotif, setSendingNotif] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            // 1. Fetch stories
            const { data: storyData, error: storyError } = await supabase
                .from("stories")
                .select("*")
                .order("created_at", { ascending: false });

            if (storyError) throw storyError;
            setStories(storyData || []);

            // 2. Fetch stats
            const { count: storiesCount } = await supabase.from("stories").select("*", { count: "exact", head: true });
            const { data: profileData, count: usersCount } = await supabase.from("profiles").select("total_referrals", { count: "exact" });

            const totalReferrals = profileData?.reduce((acc, curr) => acc + (curr.total_referrals || 0), 0) || 0;

            setStats({
                totalStories: storiesCount || 0,
                totalUsers: usersCount || 0,
                totalReferrals
            });

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteStory = async (id: string) => {
        if (!confirm("Are you sure you want to delete this story?")) return;

        try {
            const { error: supabaseError } = await supabase
                .from("stories")
                .delete()
                .eq("id", id);

            if (supabaseError) throw supabaseError;
            setStories(stories.filter((s) => s.id !== id));
            setStats(prev => ({ ...prev, totalStories: prev.totalStories - 1 }));
        } catch (err: any) {
            alert("Error deleting story: " + err.message);
        }
    };

    const handleSendNotification = async (e: React.FormEvent) => {
        e.preventDefault();
        setSendingNotif(true);

        try {
            let userId = null;
            if (targetUser) {
                // Try to find user by username or ID
                const { data: userData, error: userError } = await supabase
                    .from("profiles")
                    .select("id")
                    .or(`username.eq.${targetUser},id.eq.${targetUser}`)
                    .single();

                if (userError || !userData) throw new Error("Target user not found.");
                userId = userData.id;
            }

            const { error: notifError } = await supabase
                .from("notifications")
                .insert([{
                    user_id: userId,
                    title: notifTitle,
                    message: notifMessage,
                    type: notifType,
                }]);

            if (notifError) throw notifError;

            alert("Notification sent successfully!");
            setNotifTitle("");
            setNotifMessage("");
            setTargetUser("");
        } catch (err: any) {
            alert("Error sending notification: " + err.message);
        } finally {
            setSendingNotif(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-transparent">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-yellow"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent p-8 relative overflow-hidden">
            {/* Background Scattering */}
            <FloatingDecoration src="/images/dashboard/cowries.png" className="top-10 left-10 w-24 opacity-10" delay={0} />
            <FloatingDecoration src="/images/dashboard/map.png" className="bottom-20 right-10 w-48 opacity-10" delay={2} />
            <FloatingDecoration src="/images/dashboard/nok.png" className="top-1/2 left-[5%] w-32 opacity-05" delay={1.5} />
            <FloatingDecoration src="/images/dashboard/attire.png" className="bottom-40 left-[10%] w-40 opacity-05" delay={3} />
            <FloatingDecoration src="/images/dashboard/bus.png" className="top-40 right-[15%] w-36 opacity-05" delay={4} />

            <div className="max-w-6xl mx-auto space-y-12 relative z-10">
                <header className="flex justify-between items-center">
                    <div>
                        <h1 className="font-heading font-black text-4xl uppercase text-brand-black">Admin <span className="text-brand-yellow italic">Dashboard</span></h1>
                        <p className="font-body text-gray-600 mt-2">Managing the pieces of the Nigeria Story</p>
                    </div>
                    <div className="flex bg-brand-black p-1 rounded-2xl border-2 border-brand-black shadow-[4px_4px_0px_0px_#000]">
                        <button 
                            onClick={() => setActiveTab("stories")}
                            className={`px-6 py-2 rounded-xl font-heading font-black text-sm uppercase transition-all ${activeTab === 'stories' ? 'bg-brand-yellow text-brand-black' : 'text-gray-400 hover:text-white'}`}
                        >
                            Stories
                        </button>
                        <button 
                            onClick={() => setActiveTab("academy")}
                            className={`px-6 py-2 rounded-xl font-heading font-black text-sm uppercase transition-all ${activeTab === 'academy' ? 'bg-brand-yellow text-brand-black' : 'text-gray-400 hover:text-white'}`}
                        >
                            Academy
                        </button>
                    </div>
                </header>

                {/* Stats Grid */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { label: "Total Stories", value: stats.totalStories, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-50" },
                        { label: "Registered Users", value: stats.totalUsers, icon: Users, color: "text-green-500", bg: "bg-green-50" },
                        { label: "Total Referrals", value: stats.totalReferrals, icon: BarChart3, color: "text-brand-yellow", bg: "bg-yellow-50" },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-8 rounded-3xl border-2 border-brand-black shadow-[8px_8px_0px_0px_#000] bg-white flex items-center justify-between"
                        >
                            <div>
                                <p className="text-xs font-black uppercase text-gray-400 mb-1">{stat.label}</p>
                                <p className="text-4xl font-black text-brand-black">{stat.value}</p>
                            </div>
                            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} border-2 border-brand-black`}>
                                <stat.icon size={32} />
                            </div>
                        </motion.div>
                    ))}
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Sidebar: Notifications */}
                    <section className="lg:col-span-1 space-y-6">
                        <div className="bg-brand-black p-8 rounded-3xl border-2 border-brand-black shadow-[8px_8px_0px_0px_#F5B301] text-white">
                            <h2 className="font-heading font-black text-2xl uppercase mb-6 flex items-center gap-3">
                                <Bell className="text-brand-yellow" /> Broadcast
                            </h2>
                            <form onSubmit={handleSendNotification} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-gray-400">Target User (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="Username or ID (blank for all)"
                                        value={targetUser}
                                        onChange={(e) => setTargetUser(e.target.value)}
                                        className="w-full px-4 py-2 bg-white/10 border-2 border-white/20 rounded-xl focus:outline-none focus:border-brand-yellow font-body text-sm text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-gray-400">Title</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Welcome to the record!"
                                        value={notifTitle}
                                        onChange={(e) => setNotifTitle(e.target.value)}
                                        className="w-full px-4 py-2 bg-white/10 border-2 border-white/20 rounded-xl focus:outline-none focus:border-brand-yellow font-body text-sm text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-gray-400">Message</label>
                                    <textarea
                                        required
                                        rows={3}
                                        placeholder="Write your message here..."
                                        value={notifMessage}
                                        onChange={(e) => setNotifMessage(e.target.value)}
                                        className="w-full px-4 py-2 bg-white/10 border-2 border-white/20 rounded-xl focus:outline-none focus:border-brand-yellow font-body text-sm text-white resize-none"
                                    ></textarea>
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setNotifType("feed")}
                                        className={`flex-1 py-2 rounded-xl border-2 font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all ${notifType === 'feed' ? 'bg-brand-yellow border-brand-yellow text-brand-black shadow-[4px_4px_0px_0px_#000]' : 'border-white/20 text-gray-400'}`}
                                    >
                                        <Bell size={14} /> Feed
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setNotifType("popup")}
                                        className={`flex-1 py-2 rounded-xl border-2 font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all ${notifType === 'popup' ? 'bg-brand-yellow border-brand-yellow text-brand-black shadow-[4px_4px_0px_0px_#000]' : 'border-white/20 text-gray-400'}`}
                                    >
                                        <Smartphone size={14} /> Pop-up
                                    </button>
                                </div>
                                <button
                                    type="submit"
                                    disabled={sendingNotif}
                                    className="btn-primary w-full mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {sendingNotif ? "Sending..." : "Blast Notification"} <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </section>

                    {/* Right Panel: Content */}
                    <section className="lg:col-span-2 space-y-6">
                        {activeTab === "stories" ? (
                            <>
                                <h2 className="font-heading font-black text-3xl uppercase flex items-center justify-between">
                                    Stories <span>{stories.length}</span>
                                </h2>
                                {error && (
                                    <div className="bg-red-100 border-2 border-red-500 text-red-700 p-4 rounded-2xl mb-8 flex items-center gap-3">
                                        <span className="font-bold">Error:</span> {error}
                                    </div>
                                )}
                                <div className="grid grid-cols-1 gap-6">
                                    {stories.length === 0 ? (
                                        <div className="text-center py-24 bg-white rounded-3xl border-4 border-dashed border-gray-200">
                                            <BookOpen size={64} className="mx-auto text-gray-300 mb-4" />
                                            <p className="text-gray-500 font-heading font-bold text-xl">No stories collected yet.</p>
                                        </div>
                                    ) : (
                                        stories.map((story) => (
                                            <motion.div
                                                key={story.id}
                                                layout
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-white p-8 rounded-3xl border-2 border-brand-black shadow-[8px_8px_0px_0px_#000] hover:shadow-[12px_12px_0px_0px_#000] transition-all group"
                                            >
                                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                                    <div className="flex-1 space-y-4">
                                                        <div className="flex flex-wrap gap-3">
                                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-brand-black text-sm font-bold rounded-full border border-brand-yellow">
                                                                <Tag size={14} /> {story.category}
                                                            </span>
                                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full border border-gray-200">
                                                                <Calendar size={14} /> {story.era}
                                                            </span>
                                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full border border-gray-200">
                                                                <MapPin size={14} /> {story.location}
                                                            </span>
                                                        </div>
                                                        <h2 className="font-heading font-black text-2xl uppercase group-hover:text-brand-yellow transition-colors">
                                                            {story.title}
                                                        </h2>
                                                        <p className="font-body text-gray-700 leading-relaxed whitespace-pre-wrap">
                                                            {story.content}
                                                        </p>
                                                        <div className="flex flex-wrap gap-6 pt-4 border-t border-gray-100">
                                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                                <User size={16} className="text-brand-black" />
                                                                <span className="font-bold">{story.name}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                                <Mail size={16} className="text-brand-black" />
                                                                <span>{story.email}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-sm text-gray-400 ml-auto">
                                                                <span>Submitted on {new Date(story.created_at).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="md:border-l md:pl-6 flex items-start">
                                                        <button
                                                            onClick={() => deleteStory(story.id)}
                                                            className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all border-2 border-transparent hover:border-brand-black shadow-[4px_4px_0px_0px_transparent] hover:shadow-[4px_4px_0px_0px_#000]"
                                                            title="Delete Story"
                                                        >
                                                            <Trash2 size={24} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                </div>
                            </>
                        ) : (
                            <LMSManager />
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
