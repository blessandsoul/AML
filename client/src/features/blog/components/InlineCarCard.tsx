'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Gauge, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Car } from '@/features/catalog/types';

interface InlineCarCardProps {
  car: Car;
}

export function InlineCarCard({ car }: InlineCarCardProps) {
  return (
    <div className="not-prose my-8 bg-gradient-to-br from-muted/50 to-muted/30 border border-border rounded-xl p-6 hover:shadow-lg transition-all">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="h-1 w-8 bg-primary rounded-full"></div>
        <span className="text-xs font-bold text-primary uppercase tracking-wider">
          რეკომენდაცია
        </span>
      </div>

      <div className="grid md:grid-cols-[200px,1fr] gap-6">
        {/* Image */}
        <Link href={`/catalog/${car.id}`} className="group">
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted">
            <Image
              src={car.image}
              alt={car.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {(car as Car & { profit?: number }).profit && (
              <div className="absolute top-2 left-2">
                <Badge className="bg-emerald-500 text-white font-bold">
                  +${(car as Car & { profit?: number }).profit!.toLocaleString()}
                </Badge>
              </div>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="flex flex-col justify-between space-y-3">
          <div>
            <Link href={`/catalog/${car.id}`}>
              <h3 className="text-lg font-bold hover:text-primary transition-colors line-clamp-2">
                {car.title}
              </h3>
            </Link>

            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5" />
                <span>{car.mileage.toLocaleString()} კმ</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{car.location}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div>
              <div className="text-xs text-muted-foreground">აუქციონის ფასი</div>
              <div className="text-2xl font-bold text-primary">
                ${car.price.toLocaleString()}
              </div>
            </div>

            <Button size="sm" className="rounded-full" asChild>
              <Link href={`/catalog/${car.id}`}>
                დეტალურად
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
