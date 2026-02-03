'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useAggregateRating, useReviews } from '../hooks';
import { StarRating } from './StarRating';
import { ReviewCard } from './ReviewCard';

export function ReviewsSection() {
  const { data: aggregate, isLoading: isAggregateLoading } =
    useAggregateRating();
  const { data: reviewsData, isLoading: isReviewsLoading } = useReviews({
    limit: 6,
  });

  const reviews = reviewsData?.items ?? [];

  return (
    <section className="bg-background py-20 border-t border-border overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold uppercase tracking-widest mb-4">
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

        {/* Scrollable Reviews Row */}
        {isReviewsLoading ? (
          <div className="flex gap-6 overflow-hidden pb-4">
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
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent snap-x snap-mandatory">
            {reviews.map((review, index) => (
              <div
                key={review.id}
                className="min-w-[320px] max-w-[380px] flex-shrink-0 snap-start"
              >
                <ReviewCard review={review} index={index} />
              </div>
            ))}
          </div>
        )}

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-center mt-10"
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
