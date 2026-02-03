'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, Eye, User, Tag, ArrowRight } from 'lucide-react';
import type { BlogPost } from '../types';

interface BlogCardProps {
  post: BlogPost;
  index: number;
  priority?: boolean;
}

// Georgian month names
const GEORGIAN_MONTHS = [
  'იან', 'თებ', 'მარ', 'აპრ', 'მაი', 'ივნ',
  'ივლ', 'აგვ', 'სექ', 'ოქტ', 'ნოე', 'დეკ'
];

function formatGeorgianDate(dateStr: string): string {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = GEORGIAN_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month}. ${year}`;
}

export function BlogCard({ post, index, priority = false }: BlogCardProps) {
  const formattedDate = post.published_at
    ? formatGeorgianDate(post.published_at)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group relative bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full"
    >
      {/* Image Container */}
      <Link href={`/blog/${post.slug}`} className="block relative aspect-[4/3] overflow-hidden bg-muted">
        {post.featured_image ? (
          <Image
            src={post.featured_image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
            priority={priority}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <Tag className="w-12 h-12 text-primary/30" />
          </div>
        )}

        {/* Category Badge */}
        {post.category && (
          <div className="absolute top-3 left-3 z-10">
            <div
              className="px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-lg text-white text-xs font-bold"
              style={{ backgroundColor: post.category.color || '#3B82F6' }}
            >
              {post.category.name}
            </div>
          </div>
        )}

        {/* Bottom Gradient */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

        {/* Stats Overlay on Image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white/90 text-[11px] font-medium">
          <div className="flex items-center gap-3">
            {formattedDate && (
              <div className="flex items-center gap-1">
                <span className="bg-white/20 p-1 rounded-sm"><Calendar className="w-3 h-3" /></span>
                <span>{formattedDate}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <span className="bg-white/20 p-1 rounded-sm"><Eye className="w-3 h-3" /></span>
              <span>{post.view_count.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div className="space-y-1">
          <Link href={`/blog/${post.slug}`}>
            <h3 className="font-bold text-base leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {post.title}
            </h3>
          </Link>
          {post.excerpt && (
            <p className="text-xs text-muted-foreground/80 line-clamp-2 mt-2">
              {post.excerpt}
            </p>
          )}
        </div>

        {/* Author & CTA */}
        <div className="mt-auto pt-3 border-t border-border border-dashed flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="w-4 h-4" />
            <span className="font-medium">{post.author_name}</span>
          </div>

          <Button
            size="icon"
            variant="outline"
            className="rounded-xl h-10 w-10 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
            asChild
          >
            <Link href={`/blog/${post.slug}`}>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
