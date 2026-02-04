'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCreatePost, useCategories } from '@/features/blog/hooks';
import { BlogEditor } from '@/features/blog/components';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Send } from 'lucide-react';
import type { CreatePostRequest, PostStatus } from '@/features/blog/types';

export default function NewPostPage() {
  const router = useRouter();
  const { data: categories } = useCategories();
  const createMutation = useCreatePost();

  const [formData, setFormData] = useState<CreatePostRequest>({
    title: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    authorName: '',
    categoryId: undefined,
    status: 'DRAFT',
  });

  const handleSubmit = (status: PostStatus) => {
    if (!formData.title || !formData.content || !formData.authorName) {
      return;
    }

    createMutation.mutate(
      { ...formData, status },
      {
        onSuccess: () => {
          router.push('/admin/blog');
        },
      }
    );
  };

  return (
    <div className="container py-8 max-w-5xl">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/admin/blog">
          <ArrowLeft className="w-4 h-4 mr-2" />
          უკან
        </Link>
      </Button>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">ახალი პოსტი</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleSubmit('DRAFT')}
            disabled={createMutation.isPending}
          >
            <Save className="w-4 h-4 mr-2" />
            დრაფტად შენახვა
          </Button>
          <Button onClick={() => handleSubmit('PUBLISHED')} disabled={createMutation.isPending}>
            <Send className="w-4 h-4 mr-2" />
            გამოქვეყნება
          </Button>
        </div>
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
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="შეიყვანეთ პოსტის სათაური"
                />
              </div>

              <div className="space-y-2">
                <Label>კონტენტი *</Label>
                <BlogEditor
                  content={formData.content}
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
                <Label htmlFor="author">ავტორი *</Label>
                <Input
                  id="author"
                  value={formData.authorName}
                  onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                  placeholder="ავტორის სახელი"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">კატეგორია</Label>
                <Select
                  value={formData.categoryId || ''}
                  onValueChange={(value) =>
                    setFormData({ ...formData, categoryId: value || undefined })
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
                <Label htmlFor="featuredImage">მთავარი სურათი (URL)</Label>
                <Input
                  id="featuredImage"
                  type="url"
                  value={formData.featuredImage || ''}
                  onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
