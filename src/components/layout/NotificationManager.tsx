"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Info, Trophy, Star, BellRing } from "lucide-react";

interface Notification {
    id: string;
    title: string;
    message: string;
    type: "popup" | "feed";
    created_at: string;
}

export default function NotificationManager() {
    const [activePopup, setActivePopup] = useState<Notification | null>(null);

    useEffect(() => {
        // Listen for new notifications
        const channel = supabase
            .channel("realtime-notifications")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "notifications",
                },
                async (payload) => {
                    const newNotif = payload.new as Notification;

                    // Check if it's for this user or all users (user_id is null)
                    const { data: { session } } = await supabase.auth.getSession();
                    const targetUserId = (payload.new as any).user_id;

                    if (!targetUserId || (session && session.user.id === targetUserId)) {
                        if (newNotif.type === "popup") {
                            setActivePopup(newNotif);
                        }
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return (
        <AnimatePresence>
            {activePopup && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-black/40 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="w-full max-w-lg bg-white rounded-[40px] border-4 border-brand-black shadow-[16px_16px_0px_0px_#F5B301] overflow-hidden"
                    >
                        <div className="bg-brand-black p-8 flex items-center justify-between">
                            <div className="flex items-center gap-4 text-brand-yellow">
                                <BellRing size={32} className="animate-bounce" />
                                <h2 className="font-heading font-black text-2xl uppercase text-white tracking-widest">Broadcast</h2>
                            </div>
                            <button
                                onClick={() => setActivePopup(null)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-10 text-center">
                            <h3 className="font-heading font-black text-4xl uppercase text-brand-black mb-6">
                                {activePopup.title}
                            </h3>
                            <p className="font-body text-gray-600 text-xl leading-relaxed mb-8">
                                {activePopup.message}
                            </p>

                            <button
                                onClick={() => setActivePopup(null)}
                                className="btn-primary w-full text-2xl py-6 rounded-3xl"
                            >
                                GOT IT!
                            </button>
                        </div>

                        <div className="p-4 bg-gray-50 text-center">
                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">THE NIGERIA STORY • COMMUNITY UPDATE • {new Date(activePopup.created_at).toLocaleTimeString()}</p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
