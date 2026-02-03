import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import FeaturedPrompts from "@/components/home/FeaturedPrompts";
import HowItWorks from "@/components/home/HowItWorks";
import Stats from "@/components/home/Stats";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-blue-50/50 to-white">
      <Hero />
      <Stats />
      <Categories />
      <FeaturedPrompts />
      <HowItWorks />
    </div>
  );
}
