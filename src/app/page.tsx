import { HeroSection } from '@/components/home/HeroSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] pt-16">
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
    </main>
  );
}
  