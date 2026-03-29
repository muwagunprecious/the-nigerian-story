"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, User, Sparkles, AlertCircle, ArrowRight, School } from "lucide-react";
import { universities, getAbbreviation } from "@/data/universities";

import { Suspense } from "react";

const generateReferralCode = (univAbbrev: string) => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${univAbbrev.toUpperCase()}-${code}`;
};

function SignupContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [university, setUniversity] = useState("");
    const [referralCode, setReferralCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const ref = searchParams.get("ref");
        if (ref) setReferralCode(ref);
    }, [searchParams]);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!university) {
            setError("Please select your university.");
            setLoading(false);
            return;
        }

        try {
            // 1. Sign up the user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username,
                        university,
                    },
                },
            });

            if (authError) throw authError;

            if (authData.user) {
                const abbrev = getAbbreviation(university);
                const userReferralCode = generateReferralCode(abbrev);

                console.log("Auth success, creating profile...");

                // 2. Use UPSERT to handle race conditions with triggers
                // We retry once if it fails
                const createProfile = async (retry = true) => {
                    const { error: profileError } = await supabase
                        .from("profiles")
                        .upsert({
                            id: authData.user!.id,
                            username,
                            university,
                            referral_code: userReferralCode
                        });
                    
                    if (profileError && retry) {
                        console.warn("Retrying profile creation...");
                        await new Promise(r => setTimeout(r, 1000));
                        return createProfile(false);
                    }
                    if (profileError) throw profileError;
                };

                await createProfile();
                console.log("Profile created successfully");

                // 3. Handle incoming referral
                if (referralCode) {
                    const cleanCode = referralCode.trim().toUpperCase();
                    console.log("Checking referral code:", cleanCode);

                    const { data: referrer, error: referrerError } = await supabase
                        .from("profiles")
                        .select("id")
                        .eq("referral_code", cleanCode)
                        .single();

                    if (referrerError) {
                        console.error("Referrer not found or error:", referrerError.message);
                    } else if (referrer) {
                        console.log("Found referrer:", referrer.id);

                        // Attach referral to new user
                        const { error: linkError } = await supabase
                            .from("profiles")
                            .update({ referred_by: referrer.id })
                            .eq("id", authData.user.id);

                        if (linkError) {
                            console.error("Failed to link referral:", linkError.message);
                        } else {
                            console.log("Linked referral, incrementing count...");
                            const { error: rpcError } = await supabase.rpc('increment_referral_count', { referrer_id: referrer.id });
                            if (rpcError) console.error("RPC error:", rpcError.message);
                            else console.log("Referral count incremented successfully");
                        }
                    }
                }

                router.push("/dashboard");
            }
        } catch (err: any) {
            console.error("Signup error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 py-24 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <img src="/images/dashboard/pattern.png" className="w-full h-full object-cover invert" alt="" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full relative z-10"
            >
                <div className="text-center mb-10">
                    <h1 className="font-hero text-5xl md:text-6xl uppercase mb-4 text-white leading-none">Join the <span className="text-brand-yellow">Story</span></h1>
                    <p className="font-body text-gray-400 italic font-medium">Create your legacy in the Great Record.</p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[3.5rem] border border-white/10 shadow-[20px_20px_60px_rgba(0,0,0,0.5)]">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-2 border-red-500 rounded-xl flex items-center gap-3 text-red-700">
                            <AlertCircle size={20} />
                            <span className="font-bold text-sm">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSignup} className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                <User size={14} className="text-brand-yellow" /> Username
                            </label>
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="nigerian_warrior"
                                className="w-full px-6 py-4 bg-black/40 border-2 border-white/10 rounded-2xl focus:outline-none focus:border-brand-yellow transition-all font-heading font-black text-white placeholder:text-gray-700"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                <School size={14} className="text-brand-yellow" /> University
                            </label>
                            <select
                                required
                                value={university}
                                onChange={(e) => setUniversity(e.target.value)}
                                className="w-full px-6 py-4 bg-black/40 border-2 border-white/10 rounded-2xl focus:outline-none focus:border-brand-yellow transition-all font-heading font-black text-white appearance-none cursor-pointer"
                            >
                                <option value="" className="text-gray-400">Select your university</option>
                                {universities.map((u) => (
                                    <option key={u.name} value={u.name} className="bg-black text-white">{u.name}</option>
                                ))}
                                <option value="Other" className="bg-black text-white">Other University</option>
                            </select>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                <Mail size={14} className="text-brand-yellow" /> Email Address
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full px-6 py-4 bg-black/40 border-2 border-white/10 rounded-2xl focus:outline-none focus:border-brand-yellow transition-all font-heading font-black text-white placeholder:text-gray-700"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                <Lock size={14} className="text-brand-yellow" /> Password
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-6 py-4 bg-black/40 border-2 border-white/10 rounded-2xl focus:outline-none focus:border-brand-yellow transition-all font-heading font-black text-white placeholder:text-gray-700"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                <Sparkles size={14} className="text-brand-yellow" /> Referral Code
                            </label>
                            <input
                                type="text"
                                value={referralCode}
                                onChange={(e) => setReferralCode(e.target.value)}
                                placeholder="ABCDEF"
                                className="w-full px-6 py-4 bg-black/40 border-2 border-white/10 rounded-2xl focus:outline-none focus:border-brand-yellow transition-all font-heading font-black text-white placeholder:text-gray-700 uppercase"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-brand-yellow text-black rounded-2xl font-heading font-black text-xl flex items-center justify-center gap-3 disabled:opacity-50 shadow-[6px_6px_0px_#FFFFFF] uppercase hover:scale-102 transition-transform active:translate-x-[2px] active:translate-y-[2px]"
                        >
                            {loading ? "Joining..." : "Join the Record"} <UserPlus size={24} />
                        </button>
                    </form>

                    <div className="mt-10 text-center border-t border-white/10 pt-8">
                        <p className="font-body text-gray-500 italic">
                            Already have an account?{" "}
                            <Link href="/login" className="text-brand-yellow font-black hover:underline inline-flex items-center gap-1 not-italic">
                                Login <ArrowRight size={16} />
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default function Signup() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-brand-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-yellow border-t-brand-black"></div>
            </div>
        }>
            <SignupContent />
        </Suspense>
    );
}
