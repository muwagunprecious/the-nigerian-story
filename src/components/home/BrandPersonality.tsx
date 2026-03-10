"use client";

import { motion } from "framer-motion";

const values = [
    {
        title: "PLAYFUL",
        description: "Creative and expressive.",
        icon: (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 16C28.4183 16 32 12.4183 32 8C32 3.58172 28.4183 0 24 0C19.5817 0 16 3.58172 16 8C16 12.4183 19.5817 16 24 16Z" stroke="#F5B301" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 26C14 26 18 36 24 36C30 36 34 26 34 26" stroke="#F5B301" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 14C4 14 6 22 10 24" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M44 14C44 14 42 22 38 24" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        )
    },
    {
        title: "CREATIVE",
        description: "Unpredictable and artistic.",
        icon: (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M36 24C36 17.3726 30.6274 12 24 12C17.3726 12 12 17.3726 12 24" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M24 6V0" stroke="#F5B301" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 10L6 6" stroke="#F5B301" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M38 10L42 6" stroke="#F5B301" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20 32C20 32 22 36 24 36C26 36 28 32 28 32" stroke="#F5B301" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        )
    },
    {
        title: "BOLD",
        description: "Confident and fearless.",
        icon: (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12C27.3137 12 30 9.31371 30 6C30 2.68629 27.3137 0 24 0C20.6863 0 18 2.68629 18 6C18 9.31371 20.6863 12 24 12Z" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 20H36" stroke="#F5B301" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M24 20V48" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M24 34L12 48" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M24 34L36 48" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 14H12V26H6V14Z" stroke="#F5B301" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M36 14H42V26H36V14Z" stroke="#F5B301" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        )
    },
    {
        title: "YOUTHFUL",
        description: "Fresh and energetic.",
        icon: (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M30 14C32.7614 14 35 11.7614 35 9C35 6.23858 32.7614 4 30 4C27.2386 4 25 6.23858 25 9C25 11.7614 27.2386 14 30 14Z" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20 22L28 16L32 24L26 30V48" stroke="#F5B301" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M26 30L14 40L18 48" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 16L20 22" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        )
    },
    {
        title: "PROUD",
        description: "Celebrating Nigerian identity.",
        icon: (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 24C28.4183 24 32 20.4183 32 16C32 11.5817 28.4183 8 24 8C19.5817 8 16 11.5817 16 16C16 20.4183 19.5817 24 24 24Z" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 8L16 16" stroke="#F5B301" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M24 0V8" stroke="#F5B301" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M38 8L32 16" stroke="#F5B301" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 40H36V48H12V40Z" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M24 24V40" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        )
    }
];

export default function BrandPersonality() {
    return (
        <section className="w-full py-16 text-center">
            <div className="mb-12">
                <h2 className="font-heading font-black text-4xl md:text-5xl inline-flex flex-col items-center">
                    BRAND PERSONALITY
                    <svg className="w-full max-w-sm mt-2" viewBox="0 0 200 10" preserveAspectRatio="none">
                        <path d="M0,5 Q100,10 200,0" stroke="#F5B301" strokeWidth="6" fill="none" strokeLinecap="round" />
                    </svg>
                </h2>
            </div>

            <div className="flex flex-wrap justify-center gap-8 md:gap-12 mt-12">
                {values.map((value, idx) => (
                    <motion.div
                        key={value.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -10 }}
                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                        className="flex flex-col items-center max-w-[200px]"
                    >
                        <div className="mb-4 text-brand-black">
                            {value.icon}
                        </div>
                        <h3 className="font-heading font-black text-2xl text-brand-black tracking-wide mb-2">
                            {value.title}
                        </h3>
                        <p className="font-body text-gray-500 text-sm">
                            {value.description}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
