'use client';

import { motion } from 'framer-motion';
import { BadgeCheck, MapPin, Star } from 'lucide-react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group relative bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full"
    >
      {/* Car Image Container */}
      {review.photos.length > 0 && (
        <div className="block relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={review.photos[0].url}
            alt={review.photos[0].alt_text ?? 'Review car photo'}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Rating Badge - Top Left */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            <div className="bg-yellow-500 text-white px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-lg">
              <Star className="w-3.5 h-3.5 fill-white" />
              <span className="text-sm font-black font-mono">
                {review.rating}.0
              </span>
            </div>
          </div>

          {/* Verified Badge - Top Right */}
          {review.is_verified && (
            <div className="absolute top-3 right-3 bg-emerald-500 text-white px-2 py-1 rounded-md flex items-center gap-1 shadow-lg">
              <BadgeCheck className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase font-bold tracking-wide">
                შემოწმებული
              </span>
            </div>
          )}

          {/* Bottom Gradient */}
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

          {/* Car Model Overlay on Image */}
          {carLabel && (
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-md">
                  {carLabel}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* Customer Info */}
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            {review.customer_avatar && (
              <AvatarImage
                src={review.customer_avatar}
                alt={review.customer_name}
              />
            )}
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base leading-tight text-foreground line-clamp-1">
              {review.customer_name}
            </h3>
            {review.customer_city && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground/80">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{review.customer_city}</span>
              </div>
            )}
          </div>
        </div>

        {/* Review Text */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
          {review.text}
        </p>
      </div>
    </motion.div>
  );
}
