'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { usePosts } from '@/features/blog/hooks';
import { BlogGrid, CategoryFilter } from '@/features/blog/components';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Skeleton } from '@/components/ui/skeleton';

function BlogPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1');
  const categoryId = searchParams.get('category') || undefined;
  const search = searchParams.get('search') || undefined;

  const [searchInput, setSearchInput] = useState(search || '');

  const { data, isLoading, error, refetch } = usePosts({
    page,
    limit: 9,
    categoryId,
    search,
  });

  const updateParams = (params: Record<string, string | undefined>) => {
    const newParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });

    // Reset to page 1 when filters change
    if (!params.page) {
      newParams.delete('page');
    }

    router.push(`/blog?${newParams.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search: searchInput || undefined, page: undefined });
  };

  const handleCategoryChange = (newCategoryId: string | undefined) => {
    updateParams({ category: newCategoryId, page: undefined });
  };

  const handlePageChange = (newPage: number) => {
    updateParams({ page: newPage.toString() });
  };

  return (
    <div className="min-h-screen bg-background bg-mesh">
      <div className="container mx-auto px-4 py-12">
        <Breadcrumbs
        items={[
          { label: 'მთავარი', href: '/' },
          { label: 'ბლოგი' },
        ]}
      />
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">ბლოგი</h1>
        <p className="text-muted-foreground text-lg">
          სიახლეები, სტატიები და სასარგებლო ინფორმაცია
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="ძებნა..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10"
            />
          </form>

          {/* Categories */}
          <CategoryFilter
            selectedCategory={categoryId}
            onCategoryChange={handleCategoryChange}
          />
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3">
          <BlogGrid
            posts={data?.items || []}
            pagination={data?.pagination}
            isLoading={isLoading}
            error={error as Error | null}
            onRetry={refetch}
            onPageChange={handlePageChange}
          />
        </main>
      </div>
      </div>
    </div>
  );
}

function BlogPageFallback() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Skeleton className="h-6 w-40 mb-6" />
      <Skeleton className="h-10 w-48 mb-4" />
      <Skeleton className="h-5 w-72 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={<BlogPageFallback />}>
      <BlogPageContent />
    </Suspense>
  );
}
