'use client';

import { motion } from 'framer-motion';
import { BadgeCheck } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { StarRating } from './StarRating';
import type { Review } from '../types';

interface ReviewCardProps {
  review: Review;
  index?: number;
}

export function ReviewCard({ review, index = 0 }: ReviewCardProps) {
  const initials = review.customer_name.charAt(0).toUpperCase();

  const carLabel =
    review.car_make && review.car_model
      ? `${review.car_year ?? ''} ${review.car_make} ${review.car_model}`.trim()
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="h-full py-0 gap-0">
        <CardContent className="p-4 space-y-2.5">
          {/* Header: Avatar + Name + City */}
          <div className="flex items-center gap-2.5">
            <Avatar size="lg">
              {review.customer_avatar && (
                <AvatarImage
                  src={review.customer_avatar}
                  alt={review.customer_name}
                />
              )}
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-foreground truncate">
                  {review.customer_name}
                </p>
                {review.is_verified && (
                  <BadgeCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                )}
              </div>
              {review.customer_city && (
                <p className="text-xs text-muted-foreground">
                  {review.customer_city}
                </p>
              )}
            </div>
          </div>

          {/* Star Rating */}
          <StarRating rating={review.rating} size="sm" />

          {/* Review Text */}
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
            {review.text}
          </p>

          {/* Car Info Badge */}
          {carLabel && (
            <Badge variant="secondary" className="text-xs">
              {carLabel}
            </Badge>
          )}

          {/* Photo Thumbnails */}
          {review.photos.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {review.photos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative w-16 h-16 rounded-lg overflow-hidden border border-border"
                >
                  <Image
                    src={photo.url}
                    alt={photo.alt_text ?? 'Review photo'}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
