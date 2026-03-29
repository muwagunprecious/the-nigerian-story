import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
    return (
        <footer className="w-full bg-brand-black text-brand-white py-16 px-6 md:px-12 mt-24 border-t border-gray-800">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="col-span-1 md:col-span-2">
                    <div className="flex flex-col mb-6">
                        <span className="font-hero text-3xl leading-none tracking-tighter">THE NIGERIA</span>
                        <span className="font-hero text-brand-yellow text-4xl leading-none -mt-1 tracking-tighter">STORY</span>
                    </div>
                    <p className="text-gray-400 font-body max-w-md">
                        A bold creative initiative designed to celebrate Nigeria's culture, creativity, and collective identity through a record-breaking storytelling experience.
                    </p>
                </div>

                <div>
                    <h4 className="font-heading font-bold text-xl text-brand-yellow mb-6 inline-block border-b-2 border-brand-yellow pb-1">Quick Links</h4>
                    <ul className="space-y-4 font-body">
                        <li><Link href="#about" className="hover:text-brand-yellow transition-colors flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-brand-yellow"></span> About</Link></li>
                        <li><Link href="#submit" className="hover:text-brand-yellow transition-colors flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-brand-yellow"></span> Submit Story</Link></li>
                        <li><Link href="#gallery" className="hover:text-brand-yellow transition-colors flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-brand-yellow"></span> Explore Stories</Link></li>
                        <li><Link href="#contact" className="hover:text-brand-yellow transition-colors flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-brand-yellow"></span> Contact Us</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-heading font-bold text-xl text-brand-yellow mb-6 inline-block border-b-2 border-brand-yellow pb-1">Follow Us</h4>
                    <div className="flex gap-4">
                        <a href="#" className="w-10 h-10 rounded-full bg-brand-white text-brand-black flex items-center justify-center hover:bg-brand-yellow hover:-translate-y-1 transition-all"><Facebook size={20} /></a>
                        <a href="#" className="w-10 h-10 rounded-full bg-brand-white text-brand-black flex items-center justify-center hover:bg-brand-yellow hover:-translate-y-1 transition-all"><Twitter size={20} /></a>
                        <a href="#" className="w-10 h-10 rounded-full bg-brand-white text-brand-black flex items-center justify-center hover:bg-brand-yellow hover:-translate-y-1 transition-all"><Instagram size={20} /></a>
                        <a href="#" className="w-10 h-10 rounded-full bg-brand-white text-brand-black flex items-center justify-center hover:bg-brand-yellow hover:-translate-y-1 transition-all"><Youtube size={20} /></a>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-800 text-center text-gray-400 font-body text-sm">
                <p>&copy; {new Date().getFullYear()} The Nigeria Story. All rights reserved. Led by Adetunwase Adenle.</p>
            </div>
        </footer>
    );
}
