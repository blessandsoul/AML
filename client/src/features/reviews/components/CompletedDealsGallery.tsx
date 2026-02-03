'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { MapPin, TrendingDown, Car, Calendar } from 'lucide-react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { useDeals } from '../hooks';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function CompletedDealsGallery() {
  const { data, isLoading } = useDeals({ limit: 12 });
  const deals = data?.items ?? [];

  return (
    <div className="space-y-8">
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-2xl overflow-hidden"
            >
              <Skeleton className="w-full aspect-[4/3]" />
              <div className="p-4 space-y-3">
                <Skeleton className="w-40 h-5 rounded" />
                <Skeleton className="w-full h-4 rounded" />
                <div className="pt-3 border-t border-border border-dashed flex gap-3">
                  <Skeleton className="w-20 h-5 rounded" />
                  <Skeleton className="w-16 h-4 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : deals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Car className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            გარიგებები ჯერ არ არის
          </h3>
          <p className="text-sm text-muted-foreground">
            დასრულებული გარიგებები მალე გამოჩნდება.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal, index) => {
            const afterPhoto = deal.photos.find(
              (p) => p.photo_type === 'AFTER'
            );
            const firstPhoto = deal.photos[0];
            const displayPhoto = afterPhoto ?? firstPhoto;
            const carLabel = `${deal.car_year} ${deal.car_make} ${deal.car_model}`;

            return (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group relative bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full"
              >
                {/* Image Section */}
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  {displayPhoto ? (
                    <Image
                      src={displayPhoto.url}
                      alt={displayPhoto.alt_text ?? carLabel}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <Car className="w-12 h-12 text-primary/30" />
                    </div>
                  )}

                  {/* Savings Badge */}
                  <div className="absolute top-3 right-3 z-10">
                    <div className="px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-lg text-white text-xs font-bold bg-emerald-500">
                      <TrendingDown className="w-3 h-3" />
                      დაზოგილი: {formatPrice(deal.savings)}
                    </div>
                  </div>

                  {/* Bottom Gradient */}
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                  {/* Stats Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white/90 text-[11px] font-medium">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <span className="bg-white/20 p-1 rounded-sm">
                          <Calendar className="w-3 h-3" />
                        </span>
                        <span>{deal.car_year}</span>
                      </div>
                      {deal.delivery_city && (
                        <div className="flex items-center gap-1">
                          <span className="bg-white/20 p-1 rounded-sm">
                            <MapPin className="w-3 h-3" />
                          </span>
                          <span>{deal.delivery_city}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1 gap-3">
                  <div className="space-y-1">
                    <h3 className="font-bold text-base leading-tight text-foreground line-clamp-2">
                      {deal.car_make} {deal.car_model}
                    </h3>
                    {deal.description && (
                      <p className="text-xs text-muted-foreground/80 line-clamp-2 mt-2">
                        {deal.description}
                      </p>
                    )}
                  </div>

                  {/* Price & Info */}
                  <div className="mt-auto pt-3 border-t border-border border-dashed flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-bold text-foreground">
                        {formatPrice(deal.auction_price)}
                      </span>
                      <span className="text-xs text-muted-foreground line-through">
                        {formatPrice(deal.market_price)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
