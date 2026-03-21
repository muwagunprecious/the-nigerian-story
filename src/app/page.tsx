import Hero from "@/components/home/Hero";
import AboutSection from "@/components/home/AboutSection";
import DoYouKnow from "@/components/home/DoYouKnow";
import StorySubmission from "@/components/home/StorySubmission";
import StoryGallery from "@/components/home/StoryGallery";
import GuinnessRecord from "@/components/home/GuinnessRecord";

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full">
      <Hero />
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-24 py-24">
        <AboutSection />
        <DoYouKnow />
        <GuinnessRecord />
        <StorySubmission />
        <StoryGallery />
      </div>
    </div>
  );
}
