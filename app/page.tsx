import Hero from "@/components/home/Hero";
import PromptOptimizer from "@/components/home/PromptOptimizer";
import Categories from "@/components/home/Categories";
import FeaturedPrompts from "@/components/home/FeaturedPrompts";
import HowItWorks from "@/components/home/HowItWorks";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-blue-50/50 to-white">
      <Hero />
      <PromptOptimizer />
      <Categories />
      <FeaturedPrompts />
      <HowItWorks />
    </div>
  );
}
