'use client';

import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CarGalleryProps {
    images: string[];
    title: string;
}

export function CarGallery({ images, title }: CarGalleryProps) {
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = React.useState(false);

    const handlePrevious = () => {
        setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[4/3] md:aspect-[16/9] bg-muted rounded-2xl overflow-hidden group">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="relative w-full h-full cursor-zoom-in"
                        onClick={() => setIsLightboxOpen(true)}
                    >
                        <Image
                            src={images[selectedIndex]}
                            alt={`${title} - View ${selectedIndex + 1}`}
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 1200px) 100vw, 80vw"
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <Button
                        variant="secondary"
                        size="icon"
                        className="rounded-full h-10 w-10 bg-black/50 hover:bg-black/70 text-white border-none backdrop-blur-sm pointer-events-auto"
                        onClick={(e) => {
                            e.stopPropagation();
                            handlePrevious();
                        }}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                        variant="secondary"
                        size="icon"
                        className="rounded-full h-10 w-10 bg-black/50 hover:bg-black/70 text-white border-none backdrop-blur-sm pointer-events-auto"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleNext();
                        }}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>

                {/* Zoom Indicator */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-black/50 backdrop-blur-md text-white p-2 rounded-lg">
                        <ZoomIn className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x">
                {images.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedIndex(index)}
                        className={cn(
                            "relative flex-shrink-0 w-24 h-18 aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all snap-start",
                            selectedIndex === index
                                ? "border-primary ring-2 ring-primary/20"
                                : "border-transparent opacity-60 hover:opacity-100"
                        )}
                    >
                        <Image
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="96px"
                        />
                    </button>
                ))}
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {isLightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center"
                        onClick={() => setIsLightboxOpen(false)}
                    >
                        {/* Close Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4 text-white/70 hover:text-white hover:bg-white/10 z-[110]"
                            onClick={() => setIsLightboxOpen(false)}
                        >
                            <X className="w-8 h-8" />
                        </Button>

                        <div className="relative w-full h-full max-w-7xl max-h-[90vh] p-4 flex items-center justify-center">
                            <Image
                                src={images[selectedIndex]}
                                alt={`${title} - Fullscreen`}
                                fill
                                className="object-contain"
                                quality={100}
                                priority
                            />
                        </div>

                        {/* Lightbox Navigation */}
                        <div className="absolute inset-x-0 bottom-8 flex justify-center gap-4 z-[110]">
                            <Button
                                variant="secondary"
                                size="lg"
                                className="rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border-transparent"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePrevious();
                                }}
                            >
                                <ChevronLeft className="w-6 h-6 mr-2" />
                                წინა
                            </Button>
                            <div className="bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center">
                                {selectedIndex + 1} / {images.length}
                            </div>
                            <Button
                                variant="secondary"
                                size="lg"
                                className="rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border-transparent"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleNext();
                                }}
                            >
                                შემდეგი
                                <ChevronRight className="w-6 h-6 ml-2" />
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
