"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, User, Sparkles, AlertCircle, ArrowRight } from "lucide-react";

export default function Signup() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
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

        try {
            // 1. Sign up the user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username,
                    },
                },
            });

            if (authError) throw authError;

            if (authData.user) {
                // 2. If there's a referral code, handle it
                if (referralCode) {
                    const { data: referrer } = await supabase
                        .from("profiles")
                        .select("id")
                        .eq("referral_code", referralCode.toUpperCase())
                        .single();

                    if (referrer) {
                        await supabase
                            .from("profiles")
                            .update({ referred_by: referrer.id })
                            .eq("id", authData.user.id);

                        await supabase.rpc('increment_referral_count', { referrer_id: referrer.id });
                    }
                }

                // If confirmation is OFF in Supabase, session will exist
                // If it's ON, we still redirect but they might hit a wall on next page
                // But the user asked to "remove" it, so we act as if it's off.
                router.push("/dashboard");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-white flex items-center justify-center p-6">
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
