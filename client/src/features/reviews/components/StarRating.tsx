'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 'w-3.5 h-3.5',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

const valueSizeMap = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export function StarRating({
  rating,
  size = 'md',
  showValue = false,
  className,
}: StarRatingProps) {
  const starSize = sizeMap[size];
  const clampedRating = Math.min(5, Math.max(0, rating));
  const fullStars = Math.floor(clampedRating);
  const hasHalfStar = clampedRating - fullStars >= 0.25 && clampedRating - fullStars < 0.75;
  const adjustedFull = clampedRating - fullStars >= 0.75 ? fullStars + 1 : fullStars;
  const emptyStars = 5 - adjustedFull - (hasHalfStar ? 1 : 0);

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {/* Full stars */}
      {Array.from({ length: adjustedFull }).map((_, i) => (
        <Star
          key={`full-${i}`}
          className={cn(starSize, 'fill-yellow-400 text-yellow-400')}
        />
      ))}

      {/* Half star */}
      {hasHalfStar && (
        <div className={cn('relative', starSize)}>
          <Star className={cn(starSize, 'text-gray-300 absolute inset-0')} />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className={cn(starSize, 'fill-yellow-400 text-yellow-400')} />
          </div>
        </div>
      )}

      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star
          key={`empty-${i}`}
          className={cn(starSize, 'text-gray-300')}
        />
      ))}

      {/* Numeric value */}
      {showValue && (
        <span
          className={cn(
            'ml-1.5 font-semibold text-foreground',
            valueSizeMap[size]
          )}
        >
          {clampedRating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
