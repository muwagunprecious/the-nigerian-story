import Hero from "@/components/home/Hero";
import AboutSection from "@/components/home/AboutSection";
import HistorySection from "@/components/home/HistorySection";
import StorySubmission from "@/components/home/StorySubmission";
import StoryGallery from "@/components/home/StoryGallery";

export default function Home() {
  return (
    <div className="flex flex-col w-full bg-black">
      <Hero />
      <HistorySection />
      <StoryGallery />
      <AboutSection />
      <StorySubmission />
    </div>
  );
}
