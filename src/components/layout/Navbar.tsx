import Link from "next/link";
import { Menu } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="w-full bg-brand-black text-brand-white py-4 px-6 md:px-12 sticky top-0 z-50 border-b-4 border-brand-yellow">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2">
                    {/* Text-based logo for now */}
                    <div className="flex flex-col">
                        <span className="font-heading font-black text-2xl md:text-3xl leading-none">THE NIGERIA</span>
                        <span className="font-heading font-black text-brand-yellow text-3xl md:text-4xl leading-none -mt-1">STORY</span>
                    </div>
                </Link>
                <div className="hidden md:flex gap-8 items-center font-heading font-bold text-lg">
                    <Link href="#about" className="hover:text-brand-yellow transition-colors">About</Link>
                    <Link href="#submit" className="hover:text-brand-yellow transition-colors">Submit Story</Link>
                    <Link href="#gallery" className="hover:text-brand-yellow transition-colors">Explore</Link>
                    <Link href="#submit" className="btn-primary">
                        Tell Your Story
                    </Link>
                </div>
                <button className="md:hidden text-brand-white focus:outline-none">
                    <Menu size={32} />
                </button>
            </div>
        </nav>
    );
}
