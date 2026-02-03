'use client';

import { BlogCard } from './BlogCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import type { BlogPost } from '../types';
import type { PaginationMeta } from '@/lib/api/api.types';

interface BlogGridProps {
  posts: BlogPost[];
  pagination?: PaginationMeta;
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  onPageChange?: (page: number) => void;
}

export function BlogGrid({
  posts,
  pagination,
  isLoading,
  error,
  onRetry,
  onPageChange,
}: BlogGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="aspect-video w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h3 className="font-semibold text-lg mb-2">შეცდომა</h3>
        <p className="text-muted-foreground mb-4">
          ვერ მოხერხდა პოსტების ჩატვირთვა
        </p>
        {onRetry && (
          <Button variant="outline" onClick={onRetry}>
            <RefreshCw className="w-4 h-4 mr-2" />
            ხელახლა ცდა
          </Button>
        )}
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">პოსტები არ მოიძებნა</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <BlogCard key={post.id} post={post} index={index} />
        ))}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            disabled={!pagination.hasPreviousPage}
            onClick={() => onPageChange?.(pagination.page - 1)}
          >
            წინა
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter((page) => {
                const current = pagination.page;
                return (
                  page === 1 ||
                  page === pagination.totalPages ||
                  (page >= current - 1 && page <= current + 1)
                );
              })
              .map((page, idx, arr) => {
                const prevPage = arr[idx - 1];
                const showEllipsis = prevPage && page - prevPage > 1;

                return (
                  <div key={page} className="flex items-center gap-2">
                    {showEllipsis && (
                      <span className="text-muted-foreground">...</span>
                    )}
                    <Button
                      variant={page === pagination.page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => onPageChange?.(page)}
                    >
                      {page}
                    </Button>
                  </div>
                );
              })}
          </div>
          <Button
            variant="outline"
            disabled={!pagination.hasNextPage}
            onClick={() => onPageChange?.(pagination.page + 1)}
          >
            შემდეგი
          </Button>
        </div>
      )}
    </div>
  );
}
