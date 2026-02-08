import { Hero } from '@/features/catalog/components/Hero';
import { CustomsCalculator } from '@/features/catalog/components/CustomsCalculator';
import { FeaturedCars } from '@/features/catalog/components/FeaturedCars';
import { ProcessSteps } from '@/features/catalog/components/ProcessSteps';
import { BrandMarquee } from '@/features/catalog/components/BrandMarquee';
import { Benefits } from '@/features/catalog/components/Benefits';
import { ReviewsSection } from '@/features/reviews/components';
import { MinimalFAQ } from '@/features/catalog/components/MinimalFAQ';
import { TeamTrust } from '@/features/catalog/components/TeamTrust';
import { BlogPreview } from '@/features/blog/components';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background bg-mesh relative">
      <div className="flex flex-col min-h-dvh md:min-h-[calc(100dvh-5rem)]">
        <Hero />
      </div>
      <CustomsCalculator />
      <BrandMarquee />
      <ProcessSteps />
      <FeaturedCars />
      <ReviewsSection />
      <MinimalFAQ /> {/* Reassurance Anchor */}
      <TeamTrust /> {/* Human Anchor */}
      <Benefits />
      <BlogPreview />
    </div>
  );
}
