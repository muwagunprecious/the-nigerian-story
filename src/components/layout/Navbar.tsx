"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, LogOut, User, LayoutDashboard, Trophy } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
        });

        // Initial check
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    return (
        <nav className="w-full bg-brand-black text-brand-white py-4 px-6 md:px-12 sticky top-0 z-50 border-b-4 border-brand-yellow">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex flex-col">
                        <span className="font-heading font-black text-2xl md:text-3xl leading-none">THE NIGERIA</span>
                        <span className="font-heading font-black text-brand-yellow text-3xl md:text-4xl leading-none -mt-1">STORY</span>
                    </div>
                </Link>

                <div className="hidden md:flex gap-8 items-center font-heading font-bold text-lg">
                    <Link href="/#about" className="hover:text-brand-yellow transition-colors">About</Link>
                    <Link href="/leaderboard" className="hover:text-brand-yellow transition-colors flex items-center gap-2">
                        <Trophy size={18} /> Leaderboard
                    </Link>

                    {user ? (
                        <>
                            <Link href="/dashboard" className="hover:text-brand-yellow transition-colors flex items-center gap-2">
                                <LayoutDashboard size={18} /> Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="hover:text-red-400 transition-colors flex items-center gap-2"
                            >
                                <LogOut size={18} /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="hover:text-brand-yellow transition-colors">Login</Link>
                            <Link href="/signup" className="btn-primary">
                                Join the Record
                            </Link>
                        </>
                    )}
                </div>

                <button className="md:hidden text-brand-white focus:outline-none">
                    <Menu size={32} />
                </button>
            </div>
        </nav>
    );
}
