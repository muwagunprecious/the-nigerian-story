"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle2, AlertCircle, BookOpen, School, Send, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AmbassadorPage() {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [storyCount, setStoryCount] = useState(0);
    const [university, setUniversity] = useState("");
    const [fullName, setFullName] = useState("");
    const [applicationStatus, setApplicationStatus] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchStatus();
    }, []);

    const fetchStatus = async () => {
        setLoading(true);
        try {
            const isMock = typeof window !== "undefined" && localStorage.getItem("NIGERIA_STORY_MOCK_MODE") === "true";

            if (isMock) {
                setStoryCount(2); // Mock eligibility
                setUniversity("University of Lagos");
                setFullName("DemoExplorer");
                setApplicationStatus(null); // Allow them to see the form
                setLoading(false);
                return;
            }

            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
// ... rest of real fetch ...

            // 1. Check Stories Prerequisite
            const { count } = await supabase
                .from("stories")
                .select("*", { count: "exact", head: true })
                .eq("user_id", session.user.id);
            
            setStoryCount(count || 0);

            // 2. Fetch Profile Info
            const { data: profile } = await supabase
                .from("profiles")
                .select("university, username")
                .eq("id", session.user.id)
                .single();
            
            if (profile) {
                setUniversity(profile.university || "");
                setFullName(profile.username || "");
            }

            // 3. Check for existing application
            const { data: app } = await supabase
                .from("ambassador_applications")
                .select("status")
                .eq("user_id", session.user.id)
                .single();
            
            if (app) setApplicationStatus(app.status);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("Not authenticated");

            const { error: insertError } = await supabase
                .from("ambassador_applications")
                .insert([{
                    user_id: session.user.id,
                    university,
                    full_name: fullName,
                    status: 'pending'
                }]);
            
            if (insertError) throw insertError;
            setApplicationStatus('pending');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-yellow"></div>
        </div>
    );

    return (
        <div className="min-h-screen p-8 max-w-4xl mx-auto space-y-12">
            <header className="space-y-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-brand-yellow rounded-2xl border-2 border-brand-black shadow-[4px_4px_0px_0px_#000]">
                        <Sparkles size={32} />
                    </div>
                    <h1 className="font-heading font-black text-5xl uppercase text-brand-black leading-tight">
                        Ambassador <span className="text-brand-yellow italic">Program</span>
                    </h1>
                </div>
                <p className="font-body text-gray-600 text-lg max-w-2xl">
                    Join the movement to break the Guinness World Record for the most stories told. As an ambassador, you'll represent your university and lead the charge for heritage preservation.
                </p>
            </header>

            <div className="grid grid-cols-1 gap-8">
                {/* Application Logic */}
                {applicationStatus ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-12 rounded-[40px] border-4 border-brand-black shadow-[16px_16px_0px_0px_#000] text-center space-y-6"
                    >
                        <div className="w-24 h-24 bg-brand-yellow rounded-full border-4 border-brand-black mx-auto flex items-center justify-center animate-bounce">
                            <CheckCircle2 size={48} />
                        </div>
                        <div className="space-y-2">
                            <h2 className="font-heading font-black text-3xl uppercase">Application Submitted!</h2>
                            <p className="font-body text-gray-600">
                                Your application status is currently: <span className="font-black text-brand-black uppercase">{applicationStatus}</span>
                            </p>
                        </div>
                        <p className="font-body text-gray-500 max-w-md mx-auto">
                            Our team will review your profile and story submission. We will reach out to you via email with the next steps.
                        </p>
                    </motion.div>
                ) : storyCount === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-red-50 p-12 rounded-[40px] border-4 border-red-200 space-y-8"
                    >
                        <div className="flex items-start gap-6">
                            <div className="p-4 bg-white rounded-2xl border-4 border-brand-black shadow-[8px_8px_0px_0px_#000] flex-shrink-0 animate-pulse">
                                <AlertCircle className="text-red-500" size={40} />
                            </div>
                            <div className="space-y-4">
                                <h2 className="font-heading font-black text-3xl uppercase text-red-900">Wait a moment!</h2>
                                <p className="font-body text-red-800 text-lg leading-relaxed">
                                    To be an ambassador, you must lead by example. You need to **submit at least one story** before you can apply.
                                </p>
                                <Link 
                                    href="/#submit"
                                    className="inline-flex items-center gap-2 font-heading font-black text-sm uppercase bg-brand-black text-white px-8 py-4 rounded-2xl shadow-[6px_6px_0px_0px_#F5B301] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                                >
                                    Submit my first story <BookOpen size={20} />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.form 
                        onSubmit={handleApply}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-10 rounded-[40px] border-4 border-brand-black shadow-[16px_16px_0px_0px_#000] space-y-8"
                    >
                        <div className="space-y-4">
                            <h2 className="font-heading font-black text-2xl uppercase border-b-4 border-brand-yellow inline-block pb-1">
                                Application Details
                            </h2>
                            <p className="font-body text-gray-600">
                                You've submitted **{storyCount} story**, so you're eligible! Please confirm your details below.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="font-heading font-bold uppercase text-xs flex items-center gap-2">
                                    <School size={16} className="text-brand-yellow" /> University
                                </label>
                                <input 
                                    type="text"
                                    value={university}
                                    readOnly
                                    className="w-full bg-gray-50 border-2 border-brand-black p-4 rounded-2xl font-body text-gray-500 cursor-not-allowed uppercase text-sm"
                                />
                                <p className="text-[10px] text-gray-400 font-bold uppercase">To change your university, contact support.</p>
                            </div>

                            <div className="space-y-3">
                                <label className="font-heading font-bold uppercase text-xs flex items-center gap-2">
                                    <Sparkles size={16} className="text-brand-yellow" /> Full Name / Display Name
                                </label>
                                <input 
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Enter your full name"
                                    className="w-full bg-white border-4 border-brand-black p-4 rounded-2xl font-heading font-black text-brand-black placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-brand-yellow/20"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border-2 border-red-500 rounded-2xl text-red-700 text-sm font-bold flex items-center gap-2">
                                <AlertCircle size={18} /> {error}
                            </div>
                        )}

                        <button 
                            type="submit"
                            disabled={submitting}
                            className="w-full group bg-brand-yellow border-4 border-brand-black p-6 rounded-[30px] font-heading font-black text-2xl uppercase flex items-center justify-center gap-4 shadow-[8px_8px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
                        >
                            {submitting ? "Sending..." : "Submit Application"}
                            <Send size={28} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </button>
                    </motion.form>
                )}

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-brand-black text-white p-8 rounded-[40px] border-4 border-brand-black shadow-[8px_8px_0px_0px_#F5B301]">
                        <h3 className="font-heading font-black text-xl uppercase mb-4 text-brand-yellow">Why become an Ambassador?</h3>
                        <ul className="space-y-3 font-body text-gray-300 text-sm">
                            <li className="flex gap-2"><span>•</span> Lead the Guinness World Record attempt in your campus.</li>
                            <li className="flex gap-2"><span>•</span> Exclusive access to Animation Academy workshops.</li>
                            <li className="flex gap-2"><span>•</span> Get featured in the "Guardians of Heritage" gallery.</li>
                        </ul>
                    </div>
                    <div className="bg-white p-8 rounded-[40px] border-4 border-brand-black">
                        <h3 className="font-heading font-black text-xl uppercase mb-4">The Selection Process</h3>
                        <p className="font-body text-gray-600 text-sm leading-relaxed">
                            Applications are reviewed based on the quality of your story submissions and your active participation in the community. Approved ambassadors will receive a digital certificate and unique referral tools.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
