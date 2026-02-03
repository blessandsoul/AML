'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { MessageSquareOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import { useReviews } from '../hooks';
import { ReviewCard } from './ReviewCard';

const RATING_FILTERS = [
  { label: 'ყველა', value: undefined },
  { label: '5\u2605', value: 5 },
  { label: '4\u2605', value: 4 },
  { label: '3\u2605', value: 3 },
  { label: '2\u2605', value: 2 },
  { label: '1\u2605', value: 1 },
] as const;

export function ReviewsList() {
  const [page, setPage] = React.useState(1);
  const [ratingFilter, setRatingFilter] = React.useState<number | undefined>(
    undefined
  );

  const { data, isLoading } = useReviews({
    page,
    limit: 10,
    rating: ratingFilter,
  });

  const reviews = data?.items ?? [];
  const pagination = data?.pagination;

  // Reset to page 1 when filter changes
  const handleFilterChange = (value: number | undefined) => {
    setRatingFilter(value);
    setPage(1);
  };

  // Generate page numbers for pagination
  const getPageNumbers = (): number[] => {
    if (!pagination) return [];
    const total = pagination.totalPages;
    const current = pagination.page;
    const pages: number[] = [];

    const start = Math.max(1, current - 2);
    const end = Math.min(total, current + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="space-y-8">
      {/* Rating Filter Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-wrap gap-2"
      >
        {RATING_FILTERS.map((filter) => (
          <Button
            key={filter.label}
            variant={ratingFilter === filter.value ? 'default' : 'outline'}
            size="sm"
            className={cn(
              'rounded-full px-5 font-medium transition-all',
              ratingFilter === filter.value &&
                'shadow-sm'
            )}
            onClick={() => handleFilterChange(filter.value)}
          >
            {filter.label}
          </Button>
        ))}
      </motion.div>

      {/* Reviews Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl p-4 space-y-2.5"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="w-28 h-4 rounded" />
                  <Skeleton className="w-16 h-3 rounded" />
                </div>
              </div>
              <Skeleton className="w-24 h-4 rounded" />
              <Skeleton className="w-full h-16 rounded" />
              <Skeleton className="w-32 h-5 rounded-full" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <MessageSquareOff className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            შეფასებები არ მოიძებნა
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            ამ ფილტრით შეფასებები ჯერ არ არსებობს. სცადეთ სხვა ფილტრი.
          </p>
          <Button
            variant="outline"
            className="mt-4 rounded-full"
            onClick={() => handleFilterChange(undefined)}
          >
            ყველა შეფასების ნახვა
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review, index) => (
            <ReviewCard key={review.id} review={review} index={index} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Pagination>
            <PaginationContent>
              {pagination.hasPreviousPage && (
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage((p) => Math.max(1, p - 1));
                    }}
                  />
                </PaginationItem>
              )}

              {getPageNumbers().map((pageNum) => (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    href="#"
                    isActive={pageNum === page}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(pageNum);
                    }}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {pagination.hasNextPage && (
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage((p) => p + 1);
                    }}
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </motion.div>
      )}
    </div>
  );
}
