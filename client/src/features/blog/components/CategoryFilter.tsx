'use client';

import { useCategories } from '../hooks';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  selectedCategory?: string;
  onCategoryChange: (categoryId: string | undefined) => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className="space-y-3">
        <h3 className="font-semibold">კატეგორიები</h3>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-20" />
          ))}
        </div>
      </div>
    );
  }

  if (!categories?.length) return null;

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">კატეგორიები</h3>
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={!selectedCategory ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => onCategoryChange(undefined)}
        >
          ყველა
        </Badge>
        {categories.map((category) => (
          <Badge
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            className={cn('cursor-pointer', selectedCategory !== category.id && 'hover:bg-muted')}
            style={{
              borderColor: selectedCategory !== category.id ? category.color || undefined : undefined,
              color: selectedCategory !== category.id ? category.color || undefined : undefined,
            }}
            onClick={() => onCategoryChange(category.id)}
          >
            {category.name}
            {category._count && (
              <span className="ml-1 text-xs opacity-70">({category._count.posts})</span>
            )}
          </Badge>
        ))}
      </div>
    </div>
  );
}
