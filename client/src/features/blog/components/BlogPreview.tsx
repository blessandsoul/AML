'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { BlogCard } from './BlogCard';
import { usePosts } from '../hooks';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export function BlogPreview() {
  const { data, isLoading } = usePosts({ page: 1, limit: 3 });
  const posts = data?.items || [];

  return (
    <section className="bg-background py-14 md:py-32 border-t border-border">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs">
              <BookOpen className="w-4 h-4" />
              <span>ბლოგი</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
              სიახლეები და სტატიები
            </h2>
            <p className="text-muted-foreground text-lg max-w-lg font-medium">
              გაეცანით უახლეს სიახლეებს, რჩევებს და საინტერესო ინფორმაციას ავტომობილების შესახებ.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Button
              variant="outline"
              className="hidden md:flex rounded-full px-8 h-12 border-border text-foreground hover:bg-muted hover:text-foreground transition-all font-semibold"
              asChild
            >
              <Link href="/blog">
                ყველა სტატია
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Blog Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <BlogCard
                key={post.id}
                post={post}
                index={index}
                priority={index === 0}
              />
            ))}
          </div>
        )}

        {/* Mobile View All Button */}
        <div className="mt-12 text-center md:hidden">
          <Button
            variant="outline"
            className="w-full rounded-full h-12 border-border text-foreground"
            asChild
          >
            <Link href="/blog">
              ყველა სტატია
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
