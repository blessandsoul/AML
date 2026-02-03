'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BlogGalleryProps {
  images: string[];
  title: string;
}

export function BlogGallery({ images, title }: BlogGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // If only one image, simplify
  if (images.length === 1) {
    return (
      <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
        <Image
          src={images[0]}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
          className="object-cover cursor-pointer"
          onClick={() => {
            setLightboxIndex(0);
            setIsLightboxOpen(true);
          }}
          priority
        />
      </div>
    );
  }

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      {/* Main Gallery */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative aspect-video rounded-xl overflow-hidden bg-muted group">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full"
            >
              <Image
                src={images[activeIndex]}
                alt={`${title} - Image ${activeIndex + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
                className="object-cover cursor-pointer"
                onClick={() => {
                  setLightboxIndex(activeIndex);
                  setIsLightboxOpen(true);
                }}
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="secondary"
              size="icon"
              className="bg-background/80 backdrop-blur-sm"
              onClick={handlePrevious}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="bg-background/80 backdrop-blur-sm"
              onClick={handleNext}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
            {activeIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnails */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                index === activeIndex
                  ? 'border-primary scale-105'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={() => setIsLightboxOpen(false)}
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Image */}
            <div
              className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={lightboxIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={images[lightboxIndex]}
                    alt={`${title} - Image ${lightboxIndex + 1}`}
                    fill
                    sizes="100vw"
                    className="object-contain"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
              <Button
                variant="secondary"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
                }}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-white font-medium">
                {lightboxIndex + 1} / {images.length}
              </span>
              <Button
                variant="secondary"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
                }}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
