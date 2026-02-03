'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';
import { processContentWithHeadingIds } from '../utils/content-processor';
import { InlineCarCard } from './InlineCarCard';
import { MOCK_CARS } from '@/features/catalog/data/mock-cars';
import type { BlogPost } from '../types';

interface BlogContentBodyProps {
  post: BlogPost;
}

export function BlogContentBody({ post }: BlogContentBodyProps) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [contentSections, setContentSections] = useState<React.ReactElement[]>([]);

  // Track reading progress
  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(Math.max(progress, 0), 100));
    };

    window.addEventListener('scroll', updateProgress);
    updateProgress(); // Initial call

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  // Process content: sanitize + add heading IDs + inject car cards
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const withHeadingIds = processContentWithHeadingIds(post.content);
    const sanitized = DOMPurify.sanitize(withHeadingIds, {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 's',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'a', 'img',
        'blockquote', 'pre', 'code',
      ],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'target', 'rel', 'id'],
    });

    // Parse HTML and split into sections
    const parser = new DOMParser();
    const doc = parser.parseFromString(sanitized, 'text/html');
    const elements = Array.from(doc.body.children);

    // Group elements and inject car cards after every 4 paragraphs
    const sections: React.ReactElement[] = [];
    let currentHtml = '';
    let paragraphCount = 0;
    let carIndex = 0;

    // Get 2-3 random cars for recommendations
    const shuffledCars = [...MOCK_CARS].sort(() => 0.5 - Math.random()).slice(0, 3);

    elements.forEach((element, index) => {
      currentHtml += element.outerHTML;

      // Count paragraphs and content blocks
      if (element.tagName === 'P' && element.textContent && element.textContent.trim().length > 50) {
        paragraphCount++;
      }

      // Insert car card after every 4 content paragraphs
      if (paragraphCount > 0 && paragraphCount % 4 === 0 && carIndex < shuffledCars.length) {
        // Push current content section
        sections.push(
          <div
            key={`content-${sections.length}`}
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: currentHtml }}
          />
        );

        // Push car card
        sections.push(
          <InlineCarCard key={`car-${carIndex}`} car={shuffledCars[carIndex]} />
        );

        carIndex++;
        currentHtml = '';
        paragraphCount = 0;
      }
    });

    // Push remaining content
    if (currentHtml) {
      sections.push(
        <div
          key={`content-${sections.length}`}
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: currentHtml }}
        />
      );
    }

    setContentSections(sections);
  }, [post.content]);

  return (
    <>
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50"
        style={{ width: `${readingProgress}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${readingProgress}%` }}
        transition={{ duration: 0.1 }}
      />

      {/* Content with inline car cards */}
      <article className="space-y-6">
        {contentSections.map((section) => section)}
      </article>
    </>
  );
}
