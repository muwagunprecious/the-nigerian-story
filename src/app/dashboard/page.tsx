"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Users, BookOpen, Share2, Calendar, MapPin, School, ArrowRight, RefreshCw, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { universities, getAbbreviation, hasUniversityPrefix } from "@/data/universities";
import { SectionDecoration, FloatingDecoration } from "@/components/ui/SectionDecoration";

interface Profile {
    id: string;
    username: string;
    university: string;
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

// (SectionDecoration and FloatingDecoration are now imported from UI components)

export default function Dashboard() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [stories, setStories] = useState<Story[]>([]);
    const [referredUsers, setReferredUsers] = useState<{username: string, created_at: string}[]>([]);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [migrating, setMigrating] = useState(false);
    const [migrationSuccess, setMigrationSuccess] = useState(false);
    const [selectedUniv, setSelectedUniv] = useState("");
    const router = useRouter();

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const isMock = typeof window !== "undefined" && localStorage.getItem("NIGERIA_STORY_MOCK_MODE") === "true";

            if (isMock) {
                // Return high-quality mock data for demo
                setProfile({
                    id: "mock-id",
                    username: "DemoExplorer",
                    university: "University of Lagos",
                    referral_code: "UNILAG-X82JS9",
                    total_referrals: 12
                });
                setStories([
                    {
                        id: "mock-s1",
                        created_at: new Date().toISOString(),
                        title: "The Legend of the Talking Drum",
                        content: "The Gangan drum speaks a language that only the heart can truly understand. In the ancient courts of Oyo, every beat told a story of royalty and resilience...",
                        location: "Oyo State",
                        era: "Pre-Colonial",
                        category: "Mythology"
                    },
                    {
                        id: "mock-s2",
                        created_at: new Date(Date.now() - 86400000).toISOString(),
                        title: "Buses that Never Sleep",
                        content: "The Danfo bus is the yellow heartbeat of Lagos. From Oshodi to Obalende, it carries the dreams and hustle of twenty million souls...",
                        location: "Lagos State",
                        era: "Modern",
                        category: "Urban Life"
                    }
                ]);
                setReferredUsers([
                    { username: "Sade_Afro", created_at: new Date().toISOString() },
                    { username: "Tunde_Nok", created_at: new Date(Date.now() - 3600000).toISOString() },
                    { username: "Amaka_Stories", created_at: new Date(Date.now() - 7200000).toISOString() }
                ]);
                setLoading(false);
                return;
            }

            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/login");
                return;
            }

            // 1. Fetch current user profiles
            const { data: profileData, error: profileError } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
            if (profileError) throw profileError;
            
            // 2. Fetch people referred by this user
            const { data: referees, error: refereesError } = await supabase
                .from("profiles")
                .select("username, created_at")
                .eq("referred_by", session.user.id);
            
            if (refereesError) console.error("Error fetching referees:", refereesError);
            const actualCount = referees?.length || 0;
            setReferredUsers(referees || []);

            // 3. Self-healing: Update count if out of sync
            if (profileData.total_referrals !== actualCount) {
                console.log(`Syncing referrals: ${profileData.total_referrals} -> ${actualCount}`);
                await supabase.from("profiles").update({ total_referrals: actualCount }).eq("id", session.user.id);
                profileData.total_referrals = actualCount;
            }

            setProfile(profileData);

            // 4. Fetch stories
            const { data: storiesData, error: storiesError } = await supabase.from("stories").select("*").eq("user_id", session.user.id).order("created_at", { ascending: false });
            if (storiesError) throw storiesError;
            setStories(storiesData || []);
        } catch (err: any) {
            console.error("Dashboard error:", err);
        } finally {
            setLoading(false);
        }
    };

    const copyReferralLink = () => {
        if (!profile) return;
        const link = typeof window !== "undefined" ? window.location.origin + "/signup?ref=" + profile.referral_code : "";
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleMigration = async () => {
        if (!profile || !selectedUniv) return;
        setMigrating(true);
        try {
            const abbrev = getAbbreviation(selectedUniv);
            const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
            let code = "";
            for (let i = 0; i < 6; i++) {
                code += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            const newCode = `${abbrev.toUpperCase()}-${code}`;

            const { error: updateError } = await supabase
                .from("profiles")
                .update({ 
                    university: selectedUniv,
                    referral_code: newCode 
                })
                .eq("id", profile.id);

            if (updateError) throw updateError;

            setProfile({ ...profile, university: selectedUniv, referral_code: newCode });
            setMigrationSuccess(true);
            setTimeout(() => setMigrationSuccess(false), 3000);
        } catch (err) {
            console.error("Migration error:", err);
        } finally {
            setMigrating(false);
        }
    };

    const isLegacyCode = profile && !hasUniversityPrefix(profile.referral_code);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-yellow"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent relative overflow-hidden">
            {/* Background Pattern Backdrops (Subtle Ghosts) */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.05] overflow-hidden">
                <img src="/images/dashboard/pattern.png" className="w-full h-full object-cover scale-110" alt="" />
            </div>

            {/* Background Ghosts (Low Opacity) */}
            <FloatingDecoration src="/images/dashboard/map.png" className="top-40 -left-20 w-96 opacity-[0.08]" delay={0} />
            <FloatingDecoration src="/images/dashboard/attire.png" className="bottom-0 -right-20 w-96 opacity-[0.08]" delay={3} />
            
            {/* Additional Scattered Elements: Cowries & Nok */}
            <FloatingDecoration src="/images/dashboard/cowries.png" className="top-[20%] left-[30%] w-24 opacity-[0.05]" delay={1} />
            <FloatingDecoration src="/images/dashboard/cowries.png" className="bottom-[30%] right-[40%] w-32 opacity-[0.05]" delay={4} />
            <FloatingDecoration src="/images/dashboard/nok.png" className="top-[70%] left-[10%] w-64 opacity-[0.04] -rotate-12" delay={2} />
            
            <FloatingDecoration src="/images/dashboard/drum.png" className="top-[15%] right-[20%] w-40 opacity-[0.03]" delay={0.5} />
            <FloatingDecoration src="/images/dashboard/hat.png" className="bottom-[10%] left-[40%] w-28 opacity-[0.05]" delay={2.5} />
            <FloatingDecoration src="/images/dashboard/pot.png" className="top-[45%] left-[5%] w-36 opacity-[0.04]" delay={1.8} />
            <FloatingDecoration src="/images/dashboard/bus.png" className="bottom-[40%] left-[60%] w-48 opacity-[0.03]" delay={3.2} />

            <div className="p-6 md:p-12 relative z-20">
                <div className="max-w-6xl mx-auto space-y-12">
                    {/* Header with Hero Illustration */}
                    <header className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-8 bg-white/5 backdrop-blur-xl p-10 md:p-16 rounded-[4rem] border border-white/10 shadow-[20px_20px_60px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                        {/* Hero Illustration: Benin Mask */}
                        <div className="absolute top-1/2 -right-8 -translate-y-1/2 w-64 md:w-96 pointer-events-none transition-transform group-hover:scale-105 group-hover:-rotate-3 duration-700">
                            <SectionDecoration src="/images/dashboard/mask.png" className="w-full h-auto grayscale brightness-0 invert" blendMode="screen" />
                        </div>

                        <div className="relative z-10 flex-1">
                            <h1 className="font-hero text-6xl md:text-8xl uppercase text-white leading-[0.85] tracking-tighter">
                                Your <span className="text-brand-yellow drop-shadow-[4px_4px_0px_#FFF]">Profile</span>
                            </h1>
                            <div className="flex flex-col md:flex-row md:items-center gap-6 mt-12">
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-3xl bg-brand-yellow flex items-center justify-center font-hero text-3xl text-black shadow-[4px_4px_0px_#FFFFFF]">
                                        {profile?.username.charAt(0).toUpperCase()}
                                    </div>
                                    <p className="font-hero text-4xl uppercase tracking-tighter text-white">@{profile ? profile.username : "User"}</p>
                                </div>
                                {profile && profile.university && (
                                    <div className="flex items-center gap-3 px-8 py-3 bg-white/5 text-brand-yellow border border-white/10 rounded-full font-heading font-black text-sm uppercase tracking-widest backdrop-blur-md">
                                        <School size={20} /> {profile.university}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 relative z-10 lg:mr-48">
                            <div className="bg-brand-yellow text-black px-12 py-10 rounded-[3rem] shadow-[10px_10px_0px_#FFFFFF] flex items-center gap-10 border-2 border-white/10">
                                <div className="flex flex-col">
                                    <span className="text-6xl font-hero leading-none">{profile ? profile.total_referrals : 0}</span>
                                    <span className="text-[10px] uppercase font-black text-black/60 mt-2 tracking-[0.2em]">Total Referrals</span>
                                </div>
                                <div className="p-5 bg-black/10 rounded-[2rem]">
                                    <Users className="text-black" size={40} />
                                </div>
                            </div>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-1 space-y-10">
                            {/* Refer & Earn Card with Hero Illustration */}
                            <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10 shadow-[10px_10px_40px_rgba(0,0,0,0.3)] relative overflow-hidden group">
                                <div className="absolute -top-10 -right-10 w-48 pointer-events-none group-hover:rotate-12 transition-transform duration-500 opacity-20">
                                    <SectionDecoration src="/images/dashboard/drum.png" className="w-full grayscale brightness-0 invert" blendMode="screen" />
                                </div>
                                
                                <div className="relative z-10 mt-20 sm:mt-0">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="p-3 bg-brand-yellow rounded-2xl border border-white/20 shadow-[4px_4px_0px_#FFFFFF]">
                                            <Share2 className="text-black" size={28} />
                                        </div>
                                        <h2 className="font-hero text-3xl uppercase leading-tight text-white">Spread the <span className="text-brand-yellow">Word</span></h2>
                                    </div>
                                    <p className="font-body text-gray-400 text-lg mb-8 italic">Beat the drum for your campus! Share your unique code and bring more storytellers home.</p>
                                    
                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Master Referral Link</p>
                                            <div className="p-6 bg-black/40 border border-white/10 rounded-[2rem] flex items-center justify-between group/link overflow-hidden shadow-inner cursor-pointer" onClick={copyReferralLink}>
                                                <span className="font-mono font-bold text-xs text-brand-yellow truncate mr-4">
                                                    {typeof window !== "undefined" ? window.location.origin + "/signup?ref=" + (profile ? profile.referral_code : "") : ""}
                                                </span>
                                                <div className="p-2 bg-brand-yellow rounded-xl shadow-[2px_2px_0px_#FFF] group-hover/link:scale-110 transition-transform">
                                                    {copied ? <CheckCircle2 size={18} className="text-green-600" /> : <Copy size={18} className="text-black" />}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Your Referrals List with Hero Illustration */}
                            <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10 shadow-[10px_10px_40px_rgba(0,0,0,0.3)] relative overflow-hidden group">
                                <div className="absolute -bottom-10 -left-10 w-48 pointer-events-none opacity-10 group-hover:scale-110 transition-transform duration-500">
                                    <SectionDecoration src="/images/dashboard/hat.png" className="w-full h-auto grayscale brightness-0 invert" blendMode="screen" />
                                </div>
                                <div className="absolute -bottom-10 -right-10 w-32 pointer-events-none opacity-5 rotate-12">
                                    <img src="/images/dashboard/pattern.png" className="w-full invert" alt="" />
                                </div>

                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="p-3 bg-brand-yellow rounded-2xl border border-white/20 shadow-[4px_4px_0px_#FFFFFF]">
                                            <Users className="text-black" size={28} />
                                        </div>
                                        <h2 className="font-hero text-3xl uppercase leading-tight text-white">Your <span className="text-brand-yellow">Tribe</span></h2>
                                    </div>
                                    
                                    <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2 mb-10">
                                        {referredUsers.length === 0 ? (
                                            <div className="text-center py-16 bg-white/5 rounded-[2rem] border-2 border-dashed border-white/10">
                                                <Users size={64} className="mx-auto text-white/10 mb-6" />
                                                <p className="font-body text-gray-500 font-bold uppercase text-[10px] tracking-widest leading-relaxed px-10">Your circle is waiting to grow.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {referredUsers.map((user, idx) => (
                                                    <motion.div 
                                                        key={idx}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: idx * 0.1 }}
                                                        className="flex items-center justify-between p-6 bg-white/5 rounded-[2rem] border border-white/10 hover:bg-white/10 transition-all cursor-default"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-2xl bg-brand-yellow flex items-center justify-center font-hero text-xl text-black shadow-[3px_3px_0px_#FFFFFF]">
                                                                {user.username.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-hero text-lg uppercase text-white">@{user.username}</span>
                                                                <span className="text-[10px] uppercase font-black text-brand-yellow tracking-widest">Legendary Member</span>
                                                            </div>
                                                        </div>
                                                        <div className="px-4 py-2 bg-black/40 rounded-xl border border-white/10 font-mono text-[9px] font-black text-gray-500">
                                                            {new Date(user.created_at).toLocaleDateString()}
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2 space-y-10 relative z-20">
                            {/* University Migration Prompt with Hero Illustration */}
                            <AnimatePresence>
                                {(isLegacyCode || !profile?.university) && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-brand-yellow/5 p-12 md:p-16 rounded-[4rem] border-2 border-dashed border-brand-yellow/30 shadow-[20px_20px_60px_rgba(0,0,0,0.5)] relative overflow-hidden group backdrop-blur-sm"
                                    >
                                        {/* Hero Illustration: Africa Map */}
                                        <div className="absolute top-1/2 -right-16 -translate-y-1/2 w-80 pointer-events-none opacity-20 group-hover:scale-110 transition-transform duration-700">
                                            <SectionDecoration src="/images/dashboard/map.png" className="w-full h-auto grayscale brightness-0 invert" blendMode="screen" />
                                        </div>

                                        <div className="flex flex-col md:flex-row gap-12 items-center relative z-10">
                                            <div className="p-8 bg-brand-yellow rounded-[2.5rem] border border-white/20 shadow-[6px_6px_0px_#FFFFFF]">
                                                <School className="text-black" size={64} />
                                            </div>
                                            <div className="flex-1 space-y-6 text-center md:text-left">
                                                <h2 className="font-hero text-5xl uppercase leading-tight text-white">
                                                    {!profile?.university ? "Claim Your <span className='text-brand-yellow block'>Campus!</span>" : "Upgrade Your <span className='text-brand-yellow block'>Legacy Code</span>"}
                                                </h2>
                                                <p className="font-body text-gray-400 text-xl max-w-xl leading-relaxed italic">
                                                    {!profile?.university 
                                                        ? "Represent your alma mater and help your school lead the Great Nigerian Story record."
                                                        : "You're rocking an old-style code. Switch to a " + getAbbreviation(profile?.university || "OOU") + " branded link now!"}
                                                </p>
                                                
                                                <div className="flex flex-col sm:flex-row gap-6 mt-10">
                                                    <select
                                                        value={selectedUniv || profile?.university || ""}
                                                        onChange={(e) => setSelectedUniv(e.target.value)}
                                                        className="flex-1 px-10 py-5 bg-black/40 border-2 border-white/10 rounded-[2rem] focus:outline-none focus:border-brand-yellow transition-all font-heading font-black text-lg appearance-none cursor-pointer shadow-xl text-white"
                                                    >
                                                        <option value="" className="bg-black">Choose Your School</option>
                                                        {universities.map((u) => (
                                                            <option key={u.name} value={u.name} className="bg-black text-white">{u.name}</option>
                                                        ))}
                                                        <option value="Other" className="bg-black text-white">Other University</option>
                                                    </select>

                                                    <button 
                                                        onClick={handleMigration}
                                                        disabled={migrating || (!selectedUniv && !profile?.university)}
                                                        className="px-12 py-5 bg-brand-yellow text-black rounded-[2rem] font-heading font-black text-xl hover:scale-105 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-[6px_6px_0px_#FFFFFF] uppercase"
                                                    >
                                                        {migrating ? <RefreshCw className="animate-spin" size={24} /> : migrationSuccess ? <CheckCircle2 size={24} /> : <>Update Now <ArrowRight size={24} /></>}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Stories Section with Hero Illustration */}
                            <div className="space-y-8 relative">
                                <div className="flex items-center justify-between relative z-10">
                                    <h2 className="font-hero text-4xl uppercase text-white">Your <span className="text-brand-yellow">Record</span></h2>
                                    <div className="flex items-center gap-3 bg-white/5 text-brand-yellow px-6 py-2 rounded-full border border-white/10 font-heading font-black text-sm uppercase italic backdrop-blur-md shadow-xl">
                                        <BookOpen size={18} /> {stories.length} Contributions
                                    </div>
                                </div>
                                
                                {stories.length === 0 ? (
                                    <div className="bg-white/5 py-32 rounded-[4rem] border-4 border-dashed border-white/10 text-center relative group overflow-hidden shadow-inner backdrop-blur-sm">
                                        {/* Hero Illustration: Molded Pot */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 pointer-events-none opacity-[0.05] group-hover:opacity-[0.1] transition-opacity duration-700">
                                            <SectionDecoration src="/images/dashboard/pot.png" className="w-full h-auto grayscale brightness-0 invert" blendMode="screen" />
                                        </div>
                                        
                                        <div className="relative z-10 space-y-8">
                                            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto border-4 border-dashed border-white/10">
                                                <BookOpen size={40} className="text-white/10" />
                                            </div>
                                            <div className="space-y-2">
                                                <p className="font-hero text-3xl uppercase text-white/50">Your vessel is empty.</p>
                                                <p className="font-body text-gray-500 text-lg max-w-sm mx-auto italic">Pour your piece of the Nigerian story into the Great Record.</p>
                                            </div>
                                            <button onClick={() => router.push("/#submit")} className="bg-brand-yellow text-black px-12 py-5 rounded-full font-heading font-black text-xl hover:scale-105 transition-all shadow-[6px_6px_0px_#FFFFFF] uppercase">Start Writing Now →</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-12">
                                        {/* Stories Grid with Pot Decoration */}
                                        <div className="absolute -top-12 -right-12 w-64 pointer-events-none opacity-10">
                                            <SectionDecoration src="/images/dashboard/pot.png" className="w-full h-auto grayscale brightness-0 invert" blendMode="screen" />
                                        </div>

                                        {stories.map((story, idx) => (
                                            <motion.div 
                                                key={story.id} 
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="bg-white/5 backdrop-blur-xl p-10 md:p-14 rounded-[4rem] border border-white/10 shadow-[20px_20px_60px_rgba(0,0,0,0.5)] group relative overflow-hidden hover:shadow-[30px_30px_80px_rgba(0,0,0,0.6)] transition-all"
                                            >
                                                <div className="absolute top-0 right-0 w-48 h-full opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
                                                    <img src="/images/dashboard/pattern.png" className="w-full h-full object-cover invert" alt="" />
                                                </div>
                                                <div className="flex flex-wrap gap-4 mb-8 relative z-10">
                                                    <span className="px-6 py-2 bg-brand-yellow text-black text-[10px] font-black uppercase rounded-full border border-white/20 shadow-[3px_3px_0px_#FFF]">{story.category}</span>
                                                    <div className="flex items-center gap-4">
                                                        <span className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-500 tracking-widest"><Calendar size={14} className="text-brand-yellow" /> {new Date(story.created_at).toLocaleDateString()}</span>
                                                        <span className="w-1 h-1 rounded-full bg-white/20"></span>
                                                        <span className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-500 tracking-widest"><MapPin size={14} className="text-brand-yellow" /> {story.location}</span>
                                                    </div>
                                                </div>
                                                <h3 className="font-hero text-4xl md:text-5xl uppercase mb-6 group-hover:text-brand-yellow transition-colors leading-[0.85] relative z-10 tracking-tighter text-white">{story.title}</h3>
                                                <p className="font-body text-gray-400 text-xl leading-relaxed line-clamp-4 relative z-10 italic">{story.content}</p>
                                                <div className="mt-12 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                                                    <span className="font-mono text-[9px] font-black uppercase tracking-[0.3em] text-gray-600 bg-white/5 px-6 py-3 rounded-2xl border border-white/5">REC-ID-{story.id.slice(0, 8).toUpperCase()}</span>
                                                    <button className="px-10 py-4 bg-brand-yellow text-black rounded-2xl font-hero text-lg uppercase hover:scale-105 transition-all shadow-[4px_4px_0px_#FFFFFF]">Expand Account →</button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bold Quick Access Footer */}
                    <footer className="grid grid-cols-1 md:grid-cols-4 gap-10 pt-24 border-t border-white/10 relative">
                        {/* Footer Decoration */}
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 opacity-10">
                            <img src="/images/dashboard/pattern.png" className="w-full h-full object-contain invert" alt="" />
                        </div>

                        <button onClick={() => router.push("/#submit")} className="bg-white/5 backdrop-blur-xl p-12 rounded-[3.5rem] font-hero text-3xl uppercase flex flex-col items-center gap-8 hover:scale-105 transition-all border border-white/10 shadow-[15px_15px_40px_rgba(0,0,0,0.4)] group text-white">
                            <div className="p-8 bg-brand-yellow rounded-[2.5rem] group-hover:rotate-12 transition-transform shadow-[4px_4px_0px_#FFFFFF]">
                                <BookOpen size={56} className="text-black" />
                            </div>
                            New Record
                        </button>
                        <button onClick={() => router.push("/leaderboard")} className="bg-white/5 backdrop-blur-xl p-12 rounded-[3.5rem] font-hero text-3xl uppercase flex flex-col items-center gap-8 hover:scale-105 transition-all border border-white/10 shadow-[15px_15px_40px_rgba(0,0,0,0.4)] group text-white">
                            <div className="p-8 bg-black rounded-[2.5rem] group-hover:-rotate-12 transition-transform shadow-[4px_4px_0px_#FFA500]">
                                <Users size={56} className="text-brand-yellow" />
                            </div>
                            Leaderboard
                        </button>
                        <div className="md:col-span-2 bg-brand-yellow p-12 rounded-[4rem] border border-white/20 shadow-[20px_20px_60px_rgba(0,0,0,0.4)] flex flex-col sm:flex-row items-center justify-between gap-10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-full opacity-[0.05] pointer-events-none group-hover:opacity-[0.1] transition-opacity">
                                <img src="/images/dashboard/pattern.png" className="w-full h-full object-cover" alt="" />
                            </div>
                            <div className="space-y-4 relative z-10 text-center sm:text-left">
                                <h4 className="font-hero text-5xl uppercase tracking-tighter leading-none text-black">Guard <span className="text-white drop-shadow-md">Legacy</span></h4>
                                <p className="font-body text-black/70 text-xl font-bold italic">Invite the next generation of storytellers.</p>
                            </div>
                            <div className="w-56 relative z-10 hidden sm:block">
                                <SectionDecoration src="/images/dashboard/bus.png" className="w-full grayscale brightness-0 invert" blendMode="multiply" />
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}
