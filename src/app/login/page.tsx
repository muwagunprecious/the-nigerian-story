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
            </motion.div>
        </div>
    );
}
