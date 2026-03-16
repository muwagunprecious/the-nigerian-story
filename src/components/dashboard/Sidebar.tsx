"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    BookOpen,
    Users,
    PlusCircle,
    LogOut,
    Menu,
    X
} from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Stories", href: "/dashboard/stories", icon: BookOpen },
    { name: "Leaderboard", href: "/leaderboard", icon: Users },
    { name: "Submit Story", href: "/#submit", icon: PlusCircle },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-brand-yellow border-2 border-brand-black rounded-full shadow-[4px_4px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <div className={`
                fixed top-0 left-0 h-full w-64 bg-white border-r-4 border-brand-black z-40 transition-transform duration-300 lg:translate-x-0
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                <div className="flex flex-col h-full p-6">
                    {/* Logo Section */}
                    <div className="mb-12">
                        <Link href="/" className="flex flex-col">
                            <span className="font-heading font-black text-2xl uppercase leading-none">The Nigeria</span>
                            <span className="font-heading font-black text-2xl uppercase leading-none text-brand-yellow italic">Story</span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all group
                                        ${isActive
                                            ? "bg-brand-yellow border-brand-black shadow-[4px_4px_0px_0px_#000]"
                                            : "border-transparent hover:border-brand-black hover:bg-gray-50"}
                                    `}
                                >
                                    <Icon size={20} className={isActive ? "text-brand-black" : "text-gray-400 group-hover:text-brand-yellow"} />
                                    <span className={`font-heading font-bold ${isActive ? "text-brand-black" : "text-gray-600"}`}>
                                        {item.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom Actions */}
                    <div className="mt-auto pt-6 border-t-2 border-dashed border-gray-100">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-heading font-bold"
                        >
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
