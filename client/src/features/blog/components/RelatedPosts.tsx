'use client';

import { BlogCard } from './BlogCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';
import type { BlogPost } from '../types';

interface RelatedPostsProps {
  currentPost: BlogPost;
  allPosts: BlogPost[];
}

export function RelatedPosts({ currentPost, allPosts }: RelatedPostsProps) {
  // Get related posts by category and tags
  const relatedPosts = allPosts
    .filter((p) => p.id !== currentPost.id && p.status === 'PUBLISHED')
    .map((post) => {
      let score = 0;

      // Same category: +10 points
      if (post.categoryId === currentPost.categoryId) {
        score += 10;
      }

      // Matching tags: +2 points per tag
      const currentTags = currentPost.tags.map((t) => t.id);
      const matchingTags = post.tags.filter((t) => currentTags.includes(t.id)).length;
      score += matchingTags * 2;

      return { post, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((item) => item.post);

  if (relatedPosts.length === 0) return null;

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs">
            <BookOpen className="w-4 h-4" />
            <span>დაკავშირებული</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
            მსგავსი სტატიები
          </h2>
        </div>

        <Button variant="outline" className="hidden md:flex rounded-full px-6" asChild>
          <Link href="/blog">
            ყველა სტატია
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedPosts.map((post, index) => (
          <BlogCard key={post.id} post={post} index={index} />
        ))}
      </div>

      {/* Mobile View All */}
      <div className="md:hidden text-center">
        <Button variant="outline" className="w-full rounded-full" asChild>
          <Link href="/blog">
            ყველა სტატია
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
