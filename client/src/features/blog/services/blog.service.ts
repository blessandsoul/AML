import { apiClient } from '@/lib/api/axios.config';
import type { ApiResponse, PaginatedResponse } from '@/lib/api/api.types';
import type {
  BlogPost,
  BlogCategory,
  BlogTag,
  CreatePostRequest,
  UpdatePostRequest,
  PostFilters,
  CreateCategoryRequest,
  CreateTagRequest,
  AddReactionRequest,
} from '../types';

const BASE_URL = '/blog';

class BlogService {
  // ===== PUBLIC =====

  async getPosts(params: PostFilters = {}) {
    const response = await apiClient.get<PaginatedResponse<BlogPost>>(BASE_URL, { params });
    return response.data.data;
  }

  async getPostBySlug(slug: string) {
    const response = await apiClient.get<ApiResponse<BlogPost>>(`${BASE_URL}/slug/${slug}`);
    return response.data.data;
  }

  async getCategories() {
    const response = await apiClient.get<ApiResponse<BlogCategory[]>>(`${BASE_URL}/categories`);
    return response.data.data;
  }

  async getTags() {
    const response = await apiClient.get<ApiResponse<BlogTag[]>>(`${BASE_URL}/tags`);
    return response.data.data;
  }

  // ===== REACTIONS =====

  async addReaction(postId: string, data: AddReactionRequest) {
    const response = await apiClient.post<ApiResponse<{ action: string }>>(
      `${BASE_URL}/${postId}/reactions`,
      data
    );
    return response.data.data;
  }

  async removeReaction(postId: string, sessionId: string) {
    const response = await apiClient.delete<ApiResponse<null>>(
      `${BASE_URL}/${postId}/reactions`,
      { params: { session_id: sessionId } }
    );
    return response.data.data;
  }

  // ===== ADMIN =====

  async getAdminPosts(params: PostFilters = {}) {
    const response = await apiClient.get<PaginatedResponse<BlogPost>>(
      `${BASE_URL}/admin/posts`,
      { params }
    );
    return response.data.data;
  }

  async getPostById(id: string) {
    const response = await apiClient.get<ApiResponse<BlogPost>>(`${BASE_URL}/admin/posts/${id}`);
    return response.data.data;
  }

  async createPost(data: CreatePostRequest) {
    const response = await apiClient.post<ApiResponse<BlogPost>>(`${BASE_URL}/admin/posts`, data);
    return response.data.data;
  }

  async updatePost(id: string, data: UpdatePostRequest) {
    const response = await apiClient.patch<ApiResponse<BlogPost>>(
      `${BASE_URL}/admin/posts/${id}`,
      data
    );
    return response.data.data;
  }

  async deletePost(id: string) {
    const response = await apiClient.delete<ApiResponse<null>>(`${BASE_URL}/admin/posts/${id}`);
    return response.data.data;
  }

  async publishPost(id: string) {
    const response = await apiClient.post<ApiResponse<BlogPost>>(
      `${BASE_URL}/admin/posts/${id}/publish`
    );
    return response.data.data;
  }

  async unpublishPost(id: string) {
    const response = await apiClient.post<ApiResponse<BlogPost>>(
      `${BASE_URL}/admin/posts/${id}/unpublish`
    );
    return response.data.data;
  }

  async archivePost(id: string) {
    const response = await apiClient.post<ApiResponse<BlogPost>>(
      `${BASE_URL}/admin/posts/${id}/archive`
    );
    return response.data.data;
  }

  // ===== CATEGORY MANAGEMENT =====

  async createCategory(data: CreateCategoryRequest) {
    const response = await apiClient.post<ApiResponse<BlogCategory>>(
      `${BASE_URL}/admin/categories`,
      data
    );
    return response.data.data;
  }

  async updateCategory(id: string, data: Partial<CreateCategoryRequest>) {
    const response = await apiClient.patch<ApiResponse<BlogCategory>>(
      `${BASE_URL}/admin/categories/${id}`,
      data
    );
    return response.data.data;
  }

  async deleteCategory(id: string) {
    const response = await apiClient.delete<ApiResponse<null>>(
      `${BASE_URL}/admin/categories/${id}`
    );
    return response.data.data;
  }

  // ===== TAG MANAGEMENT =====

  async createTag(data: CreateTagRequest) {
    const response = await apiClient.post<ApiResponse<BlogTag>>(`${BASE_URL}/admin/tags`, data);
    return response.data.data;
  }

  async deleteTag(id: string) {
    const response = await apiClient.delete<ApiResponse<null>>(`${BASE_URL}/admin/tags/${id}`);
    return response.data.data;
  }
}

export const blogService = new BlogService();
