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
        <div className="min-h-screen bg-brand-white flex items-center justify-center p-6 py-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full"
            >
                <div className="text-center mb-8">
                    <h1 className="font-heading font-black text-4xl uppercase mb-2">Join the <span className="text-brand-yellow italic">Story</span></h1>
                    <p className="font-body text-gray-600">Create an account to track your progress and refer others.</p>
                </div>

                <div className="bg-white p-8 rounded-3xl border-2 border-brand-black shadow-[8px_8px_0px_0px_#000]">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-2 border-red-500 rounded-xl flex items-center gap-3 text-red-700">
                            <AlertCircle size={20} />
                            <span className="font-bold text-sm">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSignup} className="space-y-6">
                        <div className="space-y-2">
                            <label className="font-heading font-bold text-brand-black flex items-center gap-2">
                                <User size={18} /> Username
                            </label>
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="nigerian_warrior"
                                className="w-full px-4 py-3 bg-gray-50 border-2 border-brand-black rounded-xl focus:outline-none focus:border-brand-yellow transition-all font-body"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="font-heading font-bold text-brand-black flex items-center gap-2">
                                <School size={18} className="text-brand-yellow" /> University
                            </label>
                            <select
                                required
                                value={university}
                                onChange={(e) => setUniversity(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border-2 border-brand-black rounded-xl focus:outline-none focus:border-brand-yellow transition-all font-body appearance-none cursor-pointer"
                            >
                                <option value="">Select your university</option>
                                {universities.map((u) => (
                                    <option key={u.name} value={u.name}>{u.name}</option>
                                ))}
                                <option value="Other">Other University</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="font-heading font-bold text-brand-black flex items-center gap-2">
                                <Mail size={18} /> Email Address
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 bg-gray-50 border-2 border-brand-black rounded-xl focus:outline-none focus:border-brand-yellow transition-all font-body"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="font-heading font-bold text-brand-black flex items-center gap-2">
                                <Lock size={18} /> Password
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 bg-gray-50 border-2 border-brand-black rounded-xl focus:outline-none focus:border-brand-yellow transition-all font-body"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="font-heading font-bold text-brand-black flex items-center gap-2">
                                <Sparkles size={18} className="text-brand-yellow" /> Referral Code (Optional)
                            </label>
                            <input
                                type="text"
                                value={referralCode}
                                onChange={(e) => setReferralCode(e.target.value)}
                                placeholder="ABCDEF"
                                className="w-full px-4 py-3 bg-gray-50 border-2 border-brand-black rounded-xl focus:outline-none focus:border-brand-yellow transition-all font-body uppercase"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-4 text-xl flex items-center justify-center gap-2 disabled:opacity-50 shadow-[4px_4px_0px_0px_#000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
                        >
                            {loading ? "Joining..." : "Join the Record"} <UserPlus size={24} />
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t-2 border-dashed border-gray-100 pt-6">
                        <p className="font-body text-gray-600">
                            Already have an account?{" "}
                            <Link href="/login" className="text-brand-yellow font-black hover:underline inline-flex items-center gap-1">
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
