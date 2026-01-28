'use client';

import * as React from 'react';
import Image from 'next/image';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from '@/components/ui/carousel';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface CarGalleryProps {
    images: string[];
    title: string;
}

export function CarGallery({ images, title }: CarGalleryProps) {
    const [api, setApi] = React.useState<CarouselApi>();
    const [current, setCurrent] = React.useState(0);

    React.useEffect(() => {
        if (!api) {
            return;
        }

        setCurrent(api.selectedScrollSnap());

        api.on('select', () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    return (
        <div className="space-y-4">
            <Carousel setApi={setApi} className="w-full">
                <div className="relative">
                    <CarouselContent>
                        {images.map((img, index) => (
                            <CarouselItem key={index}>
                                <div className="relative aspect-[16/10] overflow-hidden rounded-xl border bg-muted">
                                    <Image
                                        src={img}
                                        alt={`${title} - view ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        priority={index === 0}
                                    />
                                    <Badge variant="secondary" className="absolute top-4 left-4 bg-black/60 text-white border-0 backdrop-blur">
                                        {index + 1} / {images.length}
                                    </Badge>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-4" />
                    <CarouselNext className="right-4" />
                </div>
            </Carousel>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, index) => (
                    <button
                        key={index}
                        onClick={() => api?.scrollTo(index)}
                        className={cn(
                            "relative aspect-[16/10] w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                            current === index ? "border-primary ring-2 ring-primary/20" : "border-transparent opacity-70 hover:opacity-100"
                        )}
                    >
                        <Image
                            src={img}
                            alt={`Thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
