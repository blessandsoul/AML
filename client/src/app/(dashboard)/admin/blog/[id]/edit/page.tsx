'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { usePostById, useUpdatePost, useCategories } from '@/features/blog/hooks';
import { BlogEditor } from '@/features/blog/components';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import type { UpdatePostRequest } from '@/features/blog/types';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const { data: post, isLoading, error } = usePostById(postId);
  const { data: categories } = useCategories();
  const updateMutation = useUpdatePost(postId);

  const [formData, setFormData] = useState<UpdatePostRequest>({
    title: '',
    content: '',
    excerpt: '',
    featured_image: '',
    category_id: undefined,
  });

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || '',
        featured_image: post.featured_image || '',
        category_id: post.category_id || undefined,
      });
    }
  }, [post]);

  const handleSubmit = () => {
    if (!formData.title || !formData.content) {
      return;
    }

    updateMutation.mutate(formData, {
      onSuccess: () => {
        router.push('/admin/blog');
      },
    });
  };

  if (isLoading) {
    return (
      <div className="container py-8 max-w-5xl">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-10 w-64 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-96" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container py-8 max-w-5xl">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="w-12 h-12 text-destructive mb-4" />
          <h1 className="text-2xl font-bold mb-2">პოსტი ვერ მოიძებნა</h1>
          <p className="text-muted-foreground mb-6">
            მოთხოვნილი პოსტი არ არსებობს ან წაშლილია
          </p>
          <Button asChild>
            <Link href="/admin/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              უკან დაბრუნება
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-5xl">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/admin/blog">
          <ArrowLeft className="w-4 h-4 mr-2" />
          უკან
        </Link>
      </Button>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">პოსტის რედაქტირება</h1>
        <Button onClick={handleSubmit} disabled={updateMutation.isPending}>
          <Save className="w-4 h-4 mr-2" />
          შენახვა
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>კონტენტი</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">სათაური *</Label>
                <Input
                  id="title"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="შეიყვანეთ პოსტის სათაური"
                />
              </div>

              <div className="space-y-2">
                <Label>კონტენტი *</Label>
                <BlogEditor
                  content={formData.content || ''}
                  onChange={(content) => setFormData({ ...formData, content })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">მოკლე აღწერა</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt || ''}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="მოკლე აღწერა სიაში ჩვენებისთვის (მაქს. 500 სიმბოლო)"
                  maxLength={500}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>მეტადატა</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>ავტორი</Label>
                <Input value={post.author_name} disabled className="bg-muted" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">კატეგორია</Label>
                <Select
                  value={formData.category_id || ''}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category_id: value || undefined })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="აირჩიეთ კატეგორია" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">არცერთი</SelectItem>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="featured_image">მთავარი სურათი (URL)</Label>
                <Input
                  id="featured_image"
                  type="url"
                  value={formData.featured_image || ''}
                  onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ინფორმაცია</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                <span className="font-medium">შექმნილია:</span>{' '}
                {new Date(post.created_at).toLocaleString('ka-GE')}
              </p>
              <p>
                <span className="font-medium">განახლებულია:</span>{' '}
                {new Date(post.updated_at).toLocaleString('ka-GE')}
              </p>
              <p>
                <span className="font-medium">ნახვები:</span> {post.view_count}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
