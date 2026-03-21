"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;
            router.push("/dashboard");
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
                    <h1 className="font-heading font-black text-4xl uppercase mb-2">Welcome <span className="text-brand-yellow italic">Back</span></h1>
                    <p className="font-body text-gray-600">Login to your dashboard and see your referrals.</p>
                </div>

                <div className="bg-white p-8 rounded-3xl border-2 border-brand-black shadow-[8px_8px_0px_0px_#000]">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-2 border-red-500 rounded-xl flex items-center gap-3 text-red-700">
                            <AlertCircle size={20} />
                            <span className="font-bold text-sm">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-4 text-xl flex items-center justify-center gap-2 disabled:opacity-50 shadow-[4px_4px_0px_0px_#000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
                        >
                            {loading ? "Logging in..." : "Login"} <LogIn size={24} />
                        </button>

                        <button
                            type="button"
                            onClick={async () => {
                                const demoEmail = "demo@nigerianstory.com";
                                const demoPass = "Nigeria123!";
                                setEmail(demoEmail);
                                setPassword(demoPass);
                                setLoading(true);
                                setError(null);
                                
                                try {
                                    // 1. Try standard sign in
                                    const { error: signInError } = await supabase.auth.signInWithPassword({
                                        email: demoEmail,
                                        password: demoPass
                                    });

                                    if (!signInError) {
                                        router.push("/dashboard");
                                        return;
                                    }

                                    // 2. Try anonymous sign in (zero friction)
                                    console.log("Standard login failed, trying anonymous access...");
                                    const { error: anonError } = await supabase.auth.signInAnonymously();
                                    
                                    if (!anonError) {
                                        router.push("/dashboard");
                                        return;
                                    }

                                    // 3. Absolute Fallback: Mock Mode
                                    console.warn("Auth rate limited or disabled. Activating Mock Mode.");
                                    localStorage.setItem("NIGERIA_STORY_MOCK_MODE", "true");
                                    alert("Verification service is rate-limited. Activating 'Preview Mode' - you can explore the dashboard and academy, but changes won't be saved to the database.");
                                    router.push("/dashboard");

                                } catch (err: any) {
                                    console.error("Demo Flow Error:", err);
                                    setError("Could not establish a connection. Please try again later.");
                                } finally {
                                    setLoading(false);
                                }
                            }}
                            className="w-full py-3 border-2 border-brand-black rounded-xl font-heading font-black text-sm uppercase hover:bg-brand-yellow/10 transition-all flex items-center justify-center gap-2"
                        >
                            Quick Demo Access
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t-2 border-dashed border-gray-100 pt-6">
                        <p className="font-body text-gray-600">
                            Don't have an account yet?{" "}
                            <Link href="/signup" className="text-brand-yellow font-black hover:underline inline-flex items-center gap-1">
                                Signup <ArrowRight size={16} />
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Featured Universities Marquee */}
                <div className="mt-12 overflow-hidden w-full opacity-40">
                    <p className="text-center font-heading font-bold text-xs uppercase text-gray-400 mb-4">Supporting Students From</p>
                    <div className="flex gap-8 animate-marquee whitespace-nowrap">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="flex gap-8 items-center">
                                <span className="font-heading font-black text-sm uppercase">Olabisi Onabanjo University</span>
                                <span className="w-1.5 h-1.5 bg-brand-yellow rounded-full" />
                                <span className="font-heading font-black text-sm uppercase">University of Lagos</span>
                                <span className="w-1.5 h-1.5 bg-brand-yellow rounded-full" />
                                <span className="font-heading font-black text-sm uppercase">University of Ibadan</span>
                                <span className="w-1.5 h-1.5 bg-brand-yellow rounded-full" />
                                <span className="font-heading font-black text-sm uppercase">Obafemi Awolowo University</span>
                                <span className="w-1.5 h-1.5 bg-brand-yellow rounded-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
