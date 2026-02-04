'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { usePost, usePosts } from '@/features/blog/hooks';
import {
  BlogGallery,
  BlogPostInfo,
  BlogContentBody,
  ReactionButtons,
  RelatedPosts,
} from '@/features/blog/components';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: post, isLoading, error } = usePost(slug);
  const { data: postsData } = usePosts({ page: 1, limit: 100 }); // Get all posts for related
  const allPosts = postsData?.items || [];

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-10 md:pt-11 pb-12">
        <div className="container mx-auto px-4">
          <Skeleton className="h-10 w-40 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <Skeleton className="aspect-video w-full rounded-xl" />
              <Skeleton className="h-12 w-3/4" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
            <div className="lg:col-span-4">
              <Skeleton className="h-96 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !post) {
    return (
      <div className="min-h-screen bg-background pt-10 md:pt-11 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mb-4" />
            <h1 className="text-2xl font-bold mb-2">პოსტი ვერ მოიძებნა</h1>
            <p className="text-muted-foreground mb-6">
              მოთხოვნილი პოსტი არ არსებობს ან წაშლილია
            </p>
            <Button asChild>
              <Link href="/blog">
                <ChevronLeft className="w-4 h-4 mr-2" />
                ბლოგზე დაბრუნება
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Prepare gallery images
  const galleryImages = post.images && post.images.length > 0
    ? post.images
    : post.featuredImage
    ? [post.featuredImage]
    : [];

  // Article schema.org structured data
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || post.title,
    image: post.featuredImage || undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: post.author?.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Auto Market Logistic',
      logo: {
        '@type': 'ImageObject',
        url: 'https://automarket.ge/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://automarket.ge/blog/${post.slug}`,
    },
  };

  return (
    <div className="min-h-screen bg-background pt-10 md:pt-11 pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <div className="container mx-auto px-4">
        <Breadcrumbs
          items={[
            { label: 'მთავარი', href: '/' },
            { label: 'ბლოგი', href: '/blog' },
            { label: post.title },
          ]}
        />

        {/* 12-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Content (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Gallery */}
            {galleryImages.length > 0 && (
              <BlogGallery images={galleryImages} title={post.title} />
            )}

            {/* Header */}
            <header className="space-y-4">
              {post.category && (
                <Badge
                  variant="outline"
                  style={{
                    borderColor: post.category.color || undefined,
                    color: post.category.color || undefined,
                  }}
                >
                  {post.category.name}
                </Badge>
              )}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="text-lg text-muted-foreground">{post.excerpt}</p>
              )}
            </header>

            {/* Content */}
            <BlogContentBody post={post} />

            <Separator className="my-8" />

            {/* Reactions */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">მოგეწონათ ეს სტატია?</h3>
              <ReactionButtons
                postId={post.id}
                slug={post.slug}
                reactionCounts={post.reactionCounts}
                reactions={post.reactions}
              />
            </div>
          </div>

          {/* Right Column: Sidebar (4 cols) */}
          <div className="lg:col-span-4">
            <BlogPostInfo post={post} />
          </div>
        </div>

        {/* Related Posts Section */}
        {allPosts.length > 0 && (
          <div className="mt-20">
            <RelatedPosts currentPost={post} allPosts={allPosts} />
          </div>
        )}
      </div>
    </div>
  );
}
