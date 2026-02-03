'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAdminPosts, useDeletePost, usePublishPost, useUnpublishPost } from '@/features/blog/hooks';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, MoreHorizontal, Edit, Trash, Eye, EyeOff, Globe } from 'lucide-react';
import type { BlogPost } from '@/features/blog/types';

export default function AdminBlogPage() {
  const [page, setPage] = useState(1);
  const [deletePost, setDeletePost] = useState<BlogPost | null>(null);

  const { data, isLoading } = useAdminPosts({ page, limit: 10 });
  const deleteMutation = useDeletePost();
  const publishMutation = usePublishPost();
  const unpublishMutation = useUnpublishPost();

  const handleDelete = () => {
    if (deletePost) {
      deleteMutation.mutate(deletePost.id);
      setDeletePost(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return <Badge className="bg-green-500">გამოქვეყნებული</Badge>;
      case 'DRAFT':
        return <Badge variant="secondary">დრაფტი</Badge>;
      case 'ARCHIVED':
        return <Badge variant="outline">დაარქივებული</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">ბლოგის მართვა</h1>
          <p className="text-muted-foreground">შექმენით და მართეთ ბლოგის პოსტები</p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/new">
            <Plus className="w-4 h-4 mr-2" />
            ახალი პოსტი
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>სათაური</TableHead>
                  <TableHead>კატეგორია</TableHead>
                  <TableHead>სტატუსი</TableHead>
                  <TableHead>ნახვები</TableHead>
                  <TableHead>თარიღი</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.items.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium line-clamp-1">{post.title}</p>
                        <p className="text-sm text-muted-foreground">{post.author_name}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {post.category ? (
                        <Badge variant="outline">{post.category.name}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(post.status)}</TableCell>
                    <TableCell>{post.view_count}</TableCell>
                    <TableCell>
                      {new Date(post.created_at).toLocaleDateString('ka-GE')}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {post.status === 'PUBLISHED' && (
                            <DropdownMenuItem asChild>
                              <Link href={`/blog/${post.slug}`} target="_blank">
                                <Globe className="w-4 h-4 mr-2" />
                                ნახვა
                              </Link>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/blog/${post.id}/edit`}>
                              <Edit className="w-4 h-4 mr-2" />
                              რედაქტირება
                            </Link>
                          </DropdownMenuItem>
                          {post.status === 'DRAFT' && (
                            <DropdownMenuItem onClick={() => publishMutation.mutate(post.id)}>
                              <Eye className="w-4 h-4 mr-2" />
                              გამოქვეყნება
                            </DropdownMenuItem>
                          )}
                          {post.status === 'PUBLISHED' && (
                            <DropdownMenuItem onClick={() => unpublishMutation.mutate(post.id)}>
                              <EyeOff className="w-4 h-4 mr-2" />
                              დრაფტში დაბრუნება
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setDeletePost(post)}
                          >
                            <Trash className="w-4 h-4 mr-2" />
                            წაშლა
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {data?.pagination && data.pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <Button
                variant="outline"
                disabled={!data.pagination.hasPreviousPage}
                onClick={() => setPage((p) => p - 1)}
              >
                წინა
              </Button>
              <span className="flex items-center px-4">
                {data.pagination.page} / {data.pagination.totalPages}
              </span>
              <Button
                variant="outline"
                disabled={!data.pagination.hasNextPage}
                onClick={() => setPage((p) => p + 1)}
              >
                შემდეგი
              </Button>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletePost} onOpenChange={() => setDeletePost(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>დარწმუნებული ხართ?</AlertDialogTitle>
            <AlertDialogDescription>
              ეს მოქმედება ვერ გაუქმდება. პოსტი &quot;{deletePost?.title}&quot; სამუდამოდ წაიშლება.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>გაუქმება</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              წაშლა
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
