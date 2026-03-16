"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Copy, Users, BookOpen, Share2, ExternalLink, Calendar, MapPin, Tag } from "lucide-react";
import { useRouter } from "next/navigation";

interface Profile {
    id: string;
    username: string;
    referral_code: string;
    total_referrals: number;
}

interface Story {
    id: string;
    created_at: string;
    title: string;
    content: string;
    location: string;
    era: string;
    category: string;
}

export default function Dashboard() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                router.push("/login");
                return;
            }

            // Fetch profile
            const { data: profileData, error: profileError } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", session.user.id)
                .single();

            if (profileError) throw profileError;
            setProfile(profileData);

            // Fetch user's stories
            const { data: storiesData, error: storiesError } = await supabase
                .from("stories")
                .select("*")
                .eq("user_id", session.user.id)
                .order("created_at", { ascending: false });

            if (storiesError) throw storiesError;
            setStories(storiesData || []);

        } catch (err: any) {
            console.error("Error fetching dashboard data:", err);
        } finally {
            setLoading(false);
        }
    };

    const copyReferralLink = () => {
        if (!profile) return;
        const link = `${window.location.origin}/signup?ref=${profile.referral_code}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-yellow"></div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-12">
            <div className="max-w-6xl mx-auto space-y-12">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="font-heading font-black text-5xl uppercase text-brand-black">Your <span className="text-brand-yellow italic">Dashboard</span></h1>
                        <p className="font-body text-gray-600 mt-2 text-xl">Welcome back, <span className="font-bold text-brand-black">@{profile?.username}</span></p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-brand-black text-white px-8 py-4 rounded-3xl shadow-[4px_4px_0px_0px_#F5B301] flex items-center gap-4">
                            <Users className="text-brand-yellow" size={32} />
                            <div className="flex flex-col">
                                <span className="text-3xl font-black">{profile?.total_referrals || 0}</span>
                                <span className="text-xs uppercase font-bold text-gray-400">Referrals</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Referral & Actions */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Referral Card */}
                        <div className="bg-white p-8 rounded-3xl border-2 border-brand-black shadow-[8px_8px_0px_0px_#000]">
                            <div className="flex items-center gap-3 mb-6">
                                <Share2 className="text-brand-yellow" />
                                <h2 className="font-heading font-black text-2xl uppercase">Refer & Earn</h2>
                            </div>
                            <p className="font-body text-gray-600 mb-6">
                                Share your link with fellow Nigerians and climb the leaderboard!
                            </p>

                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-between">
                                    <span className="font-mono font-bold text-xl text-brand-black">{profile?.referral_code}</span>
                                    <button
                                        onClick={copyReferralLink}
                                        className="p-2 hover:bg-white rounded-xl transition-colors text-brand-yellow"
                                        title="Copy Referral Link"
                                    >
                                        {copied ? <span className="text-xs font-bold text-green-500 uppercase">Copied!</span> : <Copy size={20} />}
                                    </button>
                                </div>

                                <button
                                    onClick={copyReferralLink}
                                    className="btn-primary w-full flex items-center justify-center gap-2"
                                >
                                    {copied ? "Link Copied!" : "Copy Referral Link"} <ExternalLink size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-brand-black p-8 rounded-3xl border-2 border-brand-black shadow-[8px_8px_0px_0px_#F5B301]">
                            <h3 className="font-heading font-bold text-white text-xl mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => router.push("/#submit")}
                                    className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-white font-heading font-bold flex items-center justify-between transition-all"
                                >
                                    Submit New Story <BookOpen size={20} />
                                </button>
                                <button
                                    onClick={() => router.push("/leaderboard")}
                                    className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-white font-heading font-bold flex items-center justify-between transition-all"
                                >
                                    View Leaderboard <Users size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: User Stories */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <BookOpen className="text-brand-yellow" />
                                <h2 className="font-heading font-black text-3xl uppercase text-brand-black">Your <span className="text-brand-yellow">Stories</span></h2>
                            </div>
                            <span className="font-heading font-bold text-gray-400 italic">{stories.length} Total</span>
                        </div>

                        {stories.length === 0 ? (
                            <div className="bg-white py-24 rounded-3xl border-4 border-dashed border-gray-100 text-center">
                                <p className="font-body text-gray-400 text-xl">You haven't submitted any stories yet.</p>
                                <button
                                    onClick={() => router.push("/#submit")}
                                    className="mt-4 text-brand-yellow font-heading font-bold hover:underline"
                                >
                                    Start your first story →
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6">
                                {stories.map((story) => (
                                    <motion.div
                                        key={story.id}
                                        whileHover={{ scale: 1.01 }}
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
                                        <p className="font-body text-gray-600 line-clamp-3">
                                            {story.content}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
