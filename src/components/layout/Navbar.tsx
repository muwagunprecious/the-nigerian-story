"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, LogOut, User, LayoutDashboard, Trophy, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export default function Navbar() {
    const [user, setUser] = useState<any>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
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
        setIsMenuOpen(false);
        router.push("/");
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <nav className="w-full bg-brand-black text-brand-white py-4 px-6 md:px-12 sticky top-0 z-50 border-b-4 border-brand-yellow">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
                    <div className="flex flex-col">
                        <span className="font-hero text-xl md:text-2xl leading-none drop-shadow-[2px_2px_0px_#F5B301]">THE NIGERIA</span>
                        <span className="font-hero text-brand-yellow text-2xl md:text-3xl leading-none -mt-1 drop-shadow-[2px_2px_0px_#FFFFFF]">STORY</span>
                    </div>
                </Link>

                {/* Desktop Menu */}
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

                {/* Mobile Toggle */}
                <button
                    onClick={toggleMenu}
                    className="md:hidden text-brand-white focus:outline-none z-50 p-2"
                >
                    {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
                </button>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: "100%" }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-0 bg-brand-black z-40 flex flex-col items-center justify-center gap-8 md:hidden"
                        >
                            <Link
                                href="/#about"
                                onClick={closeMenu}
                                className="font-heading font-black text-4xl hover:text-brand-yellow transition-colors uppercase"
                            >
                                About
                            </Link>
                            <Link
                                href="/leaderboard"
                                onClick={closeMenu}
                                className="font-heading font-black text-4xl flex items-center gap-4 hover:text-brand-yellow transition-colors uppercase"
                            >
                                <Trophy size={32} /> Leaderboard
                            </Link>

                            {user ? (
                                <>
                                    <Link
                                        href="/dashboard"
                                        onClick={closeMenu}
                                        className="font-heading font-black text-4xl flex items-center gap-4 hover:text-brand-yellow transition-colors uppercase"
                                    >
                                        <LayoutDashboard size={32} /> Dashboard
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="font-heading font-black text-4xl flex items-center gap-4 text-red-500 hover:text-red-400 transition-colors uppercase"
                                    >
                                        <LogOut size={32} /> Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        onClick={closeMenu}
                                        className="font-heading font-black text-4xl hover:text-brand-yellow transition-colors uppercase"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/signup"
                                        onClick={closeMenu}
                                        className="btn-primary text-2xl px-12 py-6"
                                    >
                                        Join the Record
                                    </Link>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
}
