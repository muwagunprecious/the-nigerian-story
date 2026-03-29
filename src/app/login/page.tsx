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
        <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
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
                    <h1 className="font-hero text-5xl md:text-6xl uppercase mb-4 text-white leading-none">Welcome <span className="text-brand-yellow">Back</span></h1>
                    <p className="font-body text-gray-400 italic font-medium">Verify your legacy and continue the story.</p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[3.5rem] border border-white/10 shadow-[20px_20px_60px_rgba(0,0,0,0.5)]">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-2 border-red-500 rounded-xl flex items-center gap-3 text-red-700">
                            <AlertCircle size={20} />
                            <span className="font-bold text-sm">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-8">
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-brand-yellow text-black rounded-2xl font-heading font-black text-xl flex items-center justify-center gap-3 disabled:opacity-50 shadow-[6px_6px_0px_#FFFFFF] uppercase hover:scale-102 transition-transform active:translate-x-[2px] active:translate-y-[2px]"
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
                            className="w-full py-4 border border-white/20 rounded-2xl font-heading font-black text-[10px] uppercase text-gray-400 hover:bg-white/5 transition-all flex items-center justify-center gap-2 tracking-[0.2em]"
                        >
                            Quick Demo Access
                        </button>
                    </form>

                    <div className="mt-10 text-center border-t border-white/10 pt-8">
                        <p className="font-body text-gray-500 italic">
                            Don't have an account yet?{" "}
                            <Link href="/signup" className="text-brand-yellow font-black hover:underline inline-flex items-center gap-1 not-italic">
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
