import Hero from "@/components/home/Hero";
import AboutSection from "@/components/home/AboutSection";
import StorySubmission from "@/components/home/StorySubmission";
import StoryGallery from "@/components/home/StoryGallery";
import BrandPersonality from "@/components/home/BrandPersonality";
import GuinnessRecord from "@/components/home/GuinnessRecord";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-white text-brand-black flex flex-col items-center">
      <Navbar />
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-24 py-12">
        <Hero />
        <AboutSection />
        <GuinnessRecord />
        <BrandPersonality />
        <StorySubmission />
        <StoryGallery />
      </div>
      <Footer />
    </main>
  );
}
