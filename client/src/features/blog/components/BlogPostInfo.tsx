'use client';

import { Calendar, Clock, Eye, User, Tag as TagIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SocialShareButtons } from './SocialShareButtons';
import type { BlogPost } from '../types';
import { calculateReadingTime, formatReadingTime } from '../utils/reading-time';

interface BlogPostInfoProps {
  post: BlogPost;
}

export function BlogPostInfo({ post }: BlogPostInfoProps) {
  // Format date in Georgian
  const formatGeorgianDate = (dateString: string | null): string => {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);
    const months = [
      'იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი',
      'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი'
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month}, ${year}`;
  };

  const formattedDate = formatGeorgianDate(post.published_at);

  const metadata = [
    {
      icon: TagIcon,
      label: 'კატეგორია',
      value: post.category?.name || 'არ არის მითითებული',
      color: post.category?.color,
    },
    {
      icon: User,
      label: 'ავტორი',
      value: post.author_name,
    },
    {
      icon: Calendar,
      label: 'გამოქვეყნდა',
      value: formattedDate,
    },
    {
      icon: Eye,
      label: 'ნახვები',
      value: `${post.view_count} ნახვა`,
    },
  ];

  return (
    <div className="sticky top-24 space-y-6">
      {/* Main Info Card */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold line-clamp-3">{post.title}</h2>
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
        </div>

        <Separator />

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 gap-3">
          {metadata.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div
                className="p-2 rounded-md bg-primary/10"
                style={item.color ? { backgroundColor: `${item.color}20` } : {}}
              >
                <item.icon
                  className="w-4 h-4"
                  style={item.color ? { color: item.color } : {}}
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  {item.label}
                </span>
                <span className="text-sm font-medium truncate">{item.value}</span>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              თეგები
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((postTag) => (
                <Badge key={postTag.tag.id} variant="secondary" className="text-xs">
                  {postTag.tag.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Social Share */}
        <SocialShareButtons url={`/blog/${post.slug}`} title={post.title} />
      </div>
    </div>
  );
}
