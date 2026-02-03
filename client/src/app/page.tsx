import { Hero } from '@/features/catalog/components/Hero';
import { FeaturedCars } from '@/features/catalog/components/FeaturedCars';
import { ProcessSteps } from '@/features/catalog/components/ProcessSteps';
import { BrandMarquee } from '@/features/catalog/components/BrandMarquee';
import { Benefits } from '@/features/catalog/components/Benefits';
import { ReviewsSection } from '@/features/reviews/components';
import { ValueComparison } from '@/features/catalog/components/ValueComparison';
import { MinimalFAQ } from '@/features/catalog/components/MinimalFAQ';
import { TeamTrust } from '@/features/catalog/components/TeamTrust';
import { BlogPreview } from '@/features/blog/components';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background relative">
      <Hero />
      <BrandMarquee />
      <FeaturedCars />
      <ValueComparison />
      <ProcessSteps />
      <ReviewsSection />
      <MinimalFAQ /> {/* Reassurance Anchor */}
      <TeamTrust /> {/* Human Anchor */}
      <Benefits />
      <BlogPreview />
    </div>
  );
}
