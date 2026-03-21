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
                        <SectionDecoration src="/images/dashboard/mask.png" className="w-full" />
                    </div>
                    
                    <div className="inline-block px-4 py-2 bg-brand-black text-brand-white font-heading font-bold rounded-full mb-4 transform rotate-2">
                        Referral Rankings
                    </div>
                    <h1 className="font-heading font-black text-5xl md:text-7xl uppercase mb-4 text-brand-black">
                        NIGERIA <span className="text-brand-yellow italic text-stroke-black">LEGENDS</span>
                    </h1>
                    <p className="font-body text-gray-600 text-xl max-w-2xl mx-auto">
                        These are the top storytellers and community builders helping us document the record.
                    </p>
                </header>

                {/* University Filter */}
                <div className="mb-8 flex justify-center">
                    <div className="bg-white p-2 rounded-2xl border-2 border-brand-black shadow-[4px_4px_0px_0px_#000] flex items-center gap-2">
                        <span className="font-heading font-bold px-4 uppercase text-sm">Filter:</span>
                        <select 
                            value={selectedUniversity}
                            onChange={(e) => setSelectedUniversity(e.target.value)}
                            className="px-4 py-2 bg-gray-50 border-2 border-brand-black rounded-xl font-heading font-bold outline-none cursor-pointer"
                        >
                            <option value="All">All Universities</option>
                            {universities.map(u => (
                                <option key={u.name} value={u.name}>{u.name}</option>
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
                            className="bg-brand-black p-6 rounded-3xl border-2 border-brand-black shadow-[8px_8px_0px_0px_#F5B301] mb-12 flex items-center justify-between"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-brand-yellow flex items-center justify-center text-brand-black">
                                    <span className="font-heading font-black text-3xl">#{userRank.rank}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-gray-400 font-heading font-bold uppercase text-[10px]">Your Rank</span>
                                    <h3 className="text-brand-white font-heading font-black text-2xl uppercase">@{userRank.entry.username}</h3>
                                    <span className="text-brand-yellow font-heading text-xs uppercase">{userRank.entry.university}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-brand-yellow font-heading font-black text-3xl">{userRank.entry.total_referrals}</p>
                                <p className="text-gray-400 font-heading font-bold uppercase text-xs">Referrals</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Leaderboard List */}
                <div className="bg-white rounded-[40px] border-4 border-brand-black shadow-[12px_12px_0px_0px_#000] overflow-hidden">
                    <div className="p-8 border-b-4 border-brand-black bg-gray-50 flex items-center justify-between">
                        <h2 className="font-heading font-black text-2xl uppercase flex items-center gap-3">
                            <Trophy className="text-brand-yellow" /> Hall of Fame
                        </h2>
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase">
                            <Users size={16} /> {filteredEntries.length} Heroes
                        </div>
                    </div>

                    <div className="divide-y-2 divide-gray-100">
                        {filteredEntries.length === 0 ? (
                            <div className="py-20 text-center space-y-4">
                                <p className="font-body text-gray-400 text-xl italic font-black">No one from this university has referred yet!</p>
                                <Link href="/dashboard" className="btn-primary inline-flex items-center gap-2">
                                    Get your referral link <ArrowRight size={20} />
                                </Link>
                            </div>
                        ) : (
                            filteredEntries.map((entry, index) => (
                                <motion.div
                                    key={entry.id}
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    className={`p-6 flex items-center justify-between hover:bg-yellow-50 transition-colors ${entry.id === userRank?.entry.id ? 'bg-yellow-50' : ''}`}
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 flex justify-center">
                                            {getRankIcon(index + 1)}
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full border-2 border-brand-black bg-gray-100 flex items-center justify-center">
                                                <User size={24} className="text-gray-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-heading font-black text-lg uppercase text-brand-black leading-tight">@{entry.username}</h4>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-brand-yellow font-black uppercase">{entry.university}</span>
                                                    {index === 0 && <span className="inline-block mt-1 text-[10px] bg-brand-yellow px-2 py-0.5 rounded-full font-black uppercase text-brand-black border border-brand-black w-fit">Top Legend</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-2">
                                            <span className="font-heading font-black text-2xl text-brand-black">{entry.total_referrals}</span>
                                            <ArrowUp size={16} className="text-green-500" />
                                        </div>
                                        <p className="text-[10px] font-black uppercase text-gray-400">Referrals</p>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

                {/* Call to Action */}
                <div className="mt-12 text-center bg-brand-yellow/10 p-12 rounded-[50px] border-4 border-dashed border-brand-yellow relative overflow-hidden group">
                    {/* Hero Illustration: Talking Drum */}
                    <div className="absolute -top-10 -right-10 w-48 opacity-10 group-hover:opacity-20 transition-opacity">
                        <SectionDecoration src="/images/dashboard/drum.png" className="w-full" />
                    </div>

                    <h3 className="font-heading font-black text-3xl uppercase mb-4 relative z-10">Want to see your name here?</h3>
                    <p className="font-body text-gray-600 mb-8 text-xl relative z-10">
                        Every referral brings us closer to the Guinness World Record for the largest collection of Nigerian stories.
                    </p>
                    <Link href="/dashboard" className="btn-primary inline-flex items-center gap-2 relative z-10">
                        Start Referring Now <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
