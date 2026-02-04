'use client';

import { useState } from 'react';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { ReviewsList, CompletedDealsGallery } from '@/features/reviews/components';
import { useAggregateRating } from '@/features/reviews/hooks';
import { StarRating } from '@/features/reviews/components/StarRating';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Users, Trophy, TrendingUp } from 'lucide-react';

export default function ReviewsPage() {
  const { data: aggregate, isLoading: aggregateLoading } = useAggregateRating();

  const baseUrl = 'https://automarket.ge';

  const aggregateJsonLd = aggregate
    ? {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'Auto Market Logistic',
        '@id': baseUrl,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: aggregate.averageRating.toString(),
          bestRating: '5',
          worstRating: '1',
          reviewCount: aggregate.totalReviews.toString(),
        },
      }
    : null;

  return (
    <div className="min-h-screen bg-background pt-10 md:pt-8 pb-12">
      <div className="container mx-auto px-4">
        <Breadcrumbs
          items={[
            { label: 'მთავარი', href: '/' },
            { label: 'მიმოხილვები' },
          ]}
        />

        {aggregateJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateJsonLd) }}
          />
        )}

        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            კლიენტების მიმოხილვები
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            გაეცანით ჩვენი კლიენტების გამოცდილებას ავტომობილების იმპორტის პროცესში
          </p>

          {/* Aggregate Stats */}
          {aggregateLoading ? (
            <div className="flex items-center justify-center gap-8">
              <Skeleton className="h-20 w-32" />
              <Skeleton className="h-20 w-32" />
              <Skeleton className="h-20 w-32" />
            </div>
          ) : aggregate ? (
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-4xl font-bold text-primary">
                    {aggregate.averageRating}
                  </span>
                  <span className="text-2xl text-muted-foreground">/5</span>
                </div>
                <StarRating rating={aggregate.averageRating} size="md" />
              </div>

              <Separator orientation="vertical" className="h-16 hidden md:block" />

              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="text-2xl font-bold">
                    {aggregate.totalReviews.toLocaleString()}+
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  კმაყოფილი კლიენტი
                </span>
              </div>

              <Separator orientation="vertical" className="h-16 hidden md:block" />

              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="w-5 h-5 text-primary" />
                  <span className="text-2xl font-bold">13+</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  წლიანი გამოცდილება
                </span>
              </div>
            </div>
          ) : null}
        </div>

        {/* Reviews List */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8">შეფასებები</h2>
          <ReviewsList />
        </section>

        <Separator className="mb-20" />

        {/* Completed Deals */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              წარმატებული გარიგებები
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              ნახეთ რეალური მაგალითები — რამდენი დაზოგეს ჩვენმა კლიენტებმა
            </p>
          </div>
          <CompletedDealsGallery />
        </section>
      </div>
    </div>
  );
}
