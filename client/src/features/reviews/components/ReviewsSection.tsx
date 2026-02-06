'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, TrendingUp, Users, PiggyBank } from 'lucide-react';
import Link from 'next/link';
import Autoplay from 'embla-carousel-autoplay';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from '@/components/ui/carousel';
import { useAggregateRating, useReviews } from '../hooks';
import { StarRating } from './StarRating';
import { ReviewCard } from './ReviewCard';
import { COMPANY_STATS } from '@/features/catalog/constants/copywriting';

// Fetch more reviews to ensure we have enough with photos after filtering
const REVIEWS_LIMIT = { limit: 12 };

export function ReviewsSection() {
  const { data: aggregate, isLoading: isAggregateLoading } =
    useAggregateRating();
  const { data: reviewsData, isLoading: isReviewsLoading } = useReviews(REVIEWS_LIMIT);

  // Only show reviews with photos for consistent carousel display
  // Limit to 6 items for the homepage carousel
  const reviews = (reviewsData?.items ?? [])
    .filter((review) => review.photos.length > 0)
    .slice(0, 6);


  return (
    <section className="bg-background py-12 md:py-20 border-t border-border overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
          suppressHydrationWarning
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold uppercase tracking-widest mb-4"
            suppressHydrationWarning
          >
            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
            კლიენტების შეფასებები
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
            რატომ გვენდობიან კლიენტები
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            ათასობით კმაყოფილი კლიენტი მთელი საქართველოდან
          </p>
        </motion.div>

        {/* Aggregate Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12"
          suppressHydrationWarning
        >
          {isAggregateLoading ? (
            <div className="flex items-center gap-4">
              <Skeleton className="w-16 h-12 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="w-28 h-5 rounded" />
                <Skeleton className="w-20 h-4 rounded" />
              </div>
            </div>
          ) : aggregate ? (
            <div className="flex items-center gap-4 bg-card border border-border rounded-2xl px-8 py-5 shadow-sm">
              <span className="text-5xl font-black text-foreground">
                {aggregate.averageRating.toFixed(1)}
              </span>
              <div className="flex flex-col gap-1">
                <StarRating rating={aggregate.averageRating} size="md" />
                <span className="text-sm text-muted-foreground font-medium">
                  {aggregate.totalReviews.toLocaleString()}+ შეფასება
                </span>
              </div>
            </div>
          ) : null}
        </motion.div>

        {/* Company Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-12 max-w-4xl mx-auto"
          suppressHydrationWarning
        >
          {COMPANY_STATS.map((stat, index) => {
            // Icon mapping for each stat
            const icons = [Users, TrendingUp, PiggyBank];
            const Icon = icons[index] || TrendingUp;

            return (
              <div
                key={index}
                className="flex flex-col items-center gap-2 p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
              >
                <Icon className="w-6 h-6 text-primary mb-1" />
                <span className="text-3xl md:text-4xl font-black text-foreground">
                  {stat.value}
                </span>
                <span className="text-sm md:text-base text-muted-foreground font-medium text-center">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </motion.div>

        {/* Auto-scrolling Reviews Carousel */}
        {isReviewsLoading ? (
          <div className="flex gap-6 overflow-hidden pb-4" suppressHydrationWarning>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="min-w-[320px] flex-shrink-0">
                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="w-24 h-4 rounded" />
                      <Skeleton className="w-16 h-3 rounded" />
                    </div>
                  </div>
                  <Skeleton className="w-20 h-4 rounded" />
                  <Skeleton className="w-full h-12 rounded" />
                  <Skeleton className="w-28 h-5 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Carousel
            opts={{ loop: true, align: 'start' }}
            plugins={[Autoplay({ delay: 4000 })]}

            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {reviews.map((review, index) => (
                <CarouselItem
                  key={review.id}
                  className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                >
                  <ReviewCard review={review} index={index} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        )}

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-center mt-10"
          suppressHydrationWarning
        >
          <Button
            variant="outline"
            className="rounded-full px-8 h-12 border-border text-foreground hover:bg-muted hover:text-foreground transition-all font-semibold"
            asChild
          >
            <Link href="/reviews">
              ყველა მიმოხილვა
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
