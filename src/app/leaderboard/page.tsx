"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Medal, Users, ArrowUp, ArrowRight, User } from "lucide-react";
import Link from "next/link";
import { SectionDecoration, FloatingDecoration } from "@/components/ui/SectionDecoration";

import { universities } from "@/data/universities";

interface LeaderboardEntry {
    id: string;
    username: string;
    university: string;
    total_referrals: number;
}

export default function Leaderboard() {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [selectedUniversity, setSelectedUniversity] = useState<string>("All");
    const [userRank, setUserRank] = useState<{ rank: number; entry: LeaderboardEntry } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
    }, [selectedUniversity]);

    const fetchLeaderboard = async () => {
        try {
            setLoading(true);

            // Fetch top 100 referrers with server-side filtering
            let query = supabase
                .from("profiles")
                .select("id, username, university, total_referrals")
                .order("total_referrals", { ascending: false })
                .limit(100);
            
            if (selectedUniversity !== "All") {
                query = query.eq("university", selectedUniversity);
            }

            const { data, error } = await query;

            if (error) throw error;
            setEntries(data || []);

            // Get current user's rank
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                let rankQuery = supabase
                    .from("profiles")
                    .select("id, username, university, total_referrals")
                    .order("total_referrals", { ascending: false });
                
                if (selectedUniversity !== "All") {
                    rankQuery = rankQuery.eq("university", selectedUniversity);
                }

                const { data: allProfiles, error: rankError } = await rankQuery;

                if (!rankError && allProfiles) {
                    const index = allProfiles.findIndex(p => p.id === session.user.id);
                    if (index !== -1) {
                        setUserRank({
                            rank: index + 1,
                            entry: allProfiles[index]
                        });
                    } else {
                        setUserRank(null);
                    }
                }
            }
        } catch (err) {
            console.error("Error fetching leaderboard:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredEntries = selectedUniversity === "All" 
        ? entries 
        : entries.filter(e => e.university === selectedUniversity);

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1: return <Trophy className="text-yellow-500" size={32} />;
            case 2: return <Medal className="text-gray-400" size={32} />;
            case 3: return <Medal className="text-amber-600" size={32} />;
            default: return <span className="font-heading font-black text-2xl text-gray-300">#{rank}</span>;
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
        <div className="min-h-screen bg-transparent py-12 px-6 relative overflow-hidden">
            {/* Background Scattered Cowries & More */}
            <FloatingDecoration src="/images/dashboard/cowries.png" className="top-20 left-10 w-24 opacity-10" delay={0} />
            <FloatingDecoration src="/images/dashboard/cowries.png" className="bottom-40 right-10 w-32 opacity-10" delay={2} />
            <FloatingDecoration src="/images/dashboard/cowries.png" className="top-1/2 left-1/4 w-16 opacity-05" delay={4} />
            
            <FloatingDecoration src="/images/dashboard/drum.png" className="top-1/4 right-[5%] w-32 opacity-10" delay={1} />
            <FloatingDecoration src="/images/dashboard/hat.png" className="bottom-20 left-[15%] w-24 opacity-05" delay={3} />
            <FloatingDecoration src="/images/dashboard/pot.png" className="top-[60%] right-[10%] w-28 opacity-05" delay={5} />
            <FloatingDecoration src="/images/dashboard/palm.png" className="top-40 left-[20%] w-40 opacity-05" delay={1.5} />

            <div className="max-w-4xl mx-auto relative z-10">
                <header className="text-center mb-16 relative">
                    {/* Hero Illustration: Benin Mask */}
                    <div className="absolute -top-12 -right-8 w-48 opacity-10 hidden lg:block">
                        <SectionDecoration src="/images/dashboard/mask.png" className="w-full grayscale brightness-0 invert" blendMode="screen" />
                    </div>
                    
                    <div className="inline-block px-4 py-2 bg-brand-yellow text-black font-heading font-bold rounded-full mb-4 transform rotate-2">
                        Referral Rankings
                    </div>
                    <h1 className="font-hero text-6xl md:text-8xl text-brand-yellow leading-tight drop-shadow-[4px_4px_0px_#000] uppercase mb-4">
                        NIGERIA <br /> <span className="text-white drop-shadow-[4px_4px_0px_#FFA500]">LEGENDS</span>
                    </h1>
                    <p className="font-body text-gray-400 text-xl max-w-2xl mx-auto italic">
                        The top storytellers and community builders uniting our nation's history.
                    </p>
                </header>

                {/* University Filter */}
                <div className="mb-12 flex justify-center">
                    <div className="bg-white/5 backdrop-blur-md p-2 rounded-2xl border border-white/10 flex items-center gap-2 shadow-2xl">
                        <span className="font-heading font-black px-4 uppercase text-[10px] text-gray-500 tracking-widest">Filter:</span>
                        <select 
                            value={selectedUniversity}
                            onChange={(e) => setSelectedUniversity(e.target.value)}
                            className="px-6 py-2 bg-black/40 border border-white/10 rounded-xl font-heading font-black text-sm uppercase outline-none cursor-pointer text-brand-yellow focus:border-brand-yellow transition-all"
                        >
                            <option value="All" className="bg-black">All Universities</option>
                            {universities.map(u => (
                                <option key={u.name} value={u.name} className="bg-black text-white">{u.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Current User Rank Bar */}
                <AnimatePresence>
                    {userRank && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 shadow-[20px_20px_40px_rgba(0,0,0,0.5)] mb-12 flex items-center justify-between"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-brand-yellow flex items-center justify-center text-black shadow-[4px_4px_0px_#FFFFFF]">
                                    <span className="font-hero text-3xl pt-1">#{userRank.rank}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-gray-500 font-heading font-black uppercase text-[10px] tracking-widest">Your Legend Rank</span>
                                    <h3 className="text-white font-hero text-3xl uppercase tracking-tighter">@{userRank.entry.username}</h3>
                                    <span className="text-brand-yellow font-heading font-bold text-xs uppercase tracking-wide">{userRank.entry.university}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-brand-yellow font-hero text-4xl leading-none">{userRank.entry.total_referrals}</p>
                                <p className="text-gray-500 font-heading font-black uppercase text-[10px] mt-1 tracking-widest">Referrals</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Leaderboard List */}
                <div className="bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10 shadow-[20px_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
                    <div className="p-10 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
                        <h2 className="font-hero text-3xl uppercase flex items-center gap-4 text-brand-yellow">
                            <Trophy className="text-white" size={32} /> Hall of Fame
                        </h2>
                        <div className="flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-widest">
                            <Users size={16} /> {filteredEntries.length} Legends
                        </div>
                    </div>

                    <div className="divide-y divide-white/5">
                        {filteredEntries.length === 0 ? (
                            <div className="py-24 text-center space-y-8">
                                <p className="font-body text-gray-500 text-2xl italic font-medium">Be the first legend from this school!</p>
                                <Link href="/dashboard" className="bg-brand-yellow text-black px-10 py-4 rounded-full font-heading font-black text-lg uppercase shadow-[4px_4px_0px_#FFFFFF] inline-flex items-center gap-3">
                                    Start Referring <ArrowRight size={20} />
                                </Link>
                            </div>
                        ) : (
                            filteredEntries.map((entry, index) => (
                                <motion.div
                                    key={entry.id}
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    className={`p-8 flex items-center justify-between hover:bg-white/[0.02] transition-colors ${entry.id === userRank?.entry.id ? 'bg-white/[0.05]' : ''}`}
                                >
                                    <div className="flex items-center gap-8">
                                        <div className="w-12 flex justify-center">
                                            {getRankIcon(index + 1)}
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
                                                <User size={28} className="text-gray-500" />
                                            </div>
                                            <div>
                                                <h4 className="font-hero text-2xl uppercase text-white leading-none tracking-tighter">@{entry.username}</h4>
                                                <div className="flex flex-col mt-1">
                                                    <span className="text-[10px] text-brand-yellow font-black uppercase tracking-widest">{entry.university}</span>
                                                    {index === 0 && <span className="inline-block mt-2 text-[8px] bg-brand-yellow text-black px-3 py-1 rounded-full font-black uppercase tracking-tighter shadow-[2px_2px_0px_#FFF]">Ultimate Legend</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <span className="font-hero text-3xl text-brand-yellow">{entry.total_referrals}</span>
                                            <ArrowUp size={18} className="text-green-500" />
                                        </div>
                                        <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mt-1">Referrals</p>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

                {/* Call to Action */}
                <div className="mt-20 text-center bg-brand-yellow/5 p-16 rounded-[4rem] border-2 border-dashed border-brand-yellow/30 relative overflow-hidden group backdrop-blur-sm">
                    {/* Hero Illustration: Talking Drum */}
                    <div className="absolute -top-10 -right-10 w-64 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                        <SectionDecoration src="/images/dashboard/drum.png" className="w-full grayscale brightness-0 invert" blendMode="screen" />
                    </div>

                    <h3 className="font-hero text-4xl uppercase mb-6 relative z-10 text-white leading-tight">
                        Want to see your name <span className="text-brand-yellow">in the record?</span>
                    </h3>
                    <p className="font-body text-gray-400 mb-10 text-xl max-w-2xl mx-auto relative z-10 italic">
                        Every referral brings us closer to the Guinness World Record for the largest collection of Nigerian stories.
                    </p>
                    <Link href="/dashboard" className="bg-brand-yellow text-black px-12 py-5 rounded-full font-heading font-black text-xl hover:scale-105 transition-all shadow-[6px_6px_0px_#FFFFFF] uppercase inline-flex items-center gap-3 relative z-10">
                        Start Referring Now <ArrowRight size={24} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
