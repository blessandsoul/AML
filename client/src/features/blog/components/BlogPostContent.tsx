'use client';

import Image from 'next/image';
import { Calendar, Eye, User, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ReactionButtons } from './ReactionButtons';
import type { BlogPost } from '../types';
import DOMPurify from 'dompurify';

interface BlogPostContentProps {
  post: BlogPost;
}

export function BlogPostContent({ post }: BlogPostContentProps) {
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('ka-GE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  // Sanitize HTML content
  const sanitizedContent =
    typeof window !== 'undefined' && post.content
      ? DOMPurify.sanitize(post.content, {
          ALLOWED_TAGS: [
            'p',
            'br',
            'strong',
            'em',
            'u',
            's',
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'ul',
            'ol',
            'li',
            'a',
            'img',
            'blockquote',
            'pre',
            'code',
          ],
          ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'target', 'rel'],
        })
      : (post.content || '');

  return (
    <article className="max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        {post.category && (
          <Badge
            variant="outline"
            className="mb-4"
            style={{
              borderColor: post.category.color || undefined,
              color: post.category.color || undefined,
            }}
          >
            {post.category.name}
          </Badge>
        )}

        <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            <span>{post.author?.name}</span>
          </div>

          {formattedDate && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <Eye className="w-4 h-4" />
            <span>{post.viewCount} ნახვა</span>
          </div>
        </div>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <Tag className="w-4 h-4 text-muted-foreground" />
            {post.tags.map((tag) => (
              <Badge key={tag.id} variant="secondary" className="text-xs">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
      </header>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Content */}
      <div
        className="prose prose-lg dark:prose-invert max-w-none mb-8"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />

      <Separator className="my-8" />

      {/* Reactions */}
      <div className="space-y-4">
        <h3 className="font-semibold">მოგეწონათ ეს სტატია?</h3>
        <ReactionButtons
          postId={post.id}
          slug={post.slug}
          reactionCounts={post.reactionCounts}
          reactions={post.reactions}
        />
      </div>
    </article>
  );
}
