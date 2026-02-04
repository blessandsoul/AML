import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { FastifyInstance } from 'fastify';
import {
  buildTestApp,
  closeTestApp,
  createTestAdmin,
  cleanupTestUsers,
  cleanupTestBlogData,
  authHeader,
} from './helpers.js';

describe('Blog Endpoints', () => {
  let app: FastifyInstance;
  let adminToken: string;
  let testCategoryId: string;
  let testTagId: string;
  let testPostId: string;
  let testPostSlug: string;

  beforeAll(async () => {
    app = await buildTestApp();

    // Create admin user
    const admin = await createTestAdmin();
    adminToken = admin.tokens.accessToken;
  });

  afterAll(async () => {
    await cleanupTestBlogData();
    await cleanupTestUsers();
    await closeTestApp(app);
  });

  // ============================================
  // ADMIN: CATEGORY MANAGEMENT
  // ============================================

  describe('POST /api/v1/blog/admin/categories', () => {
    it('should create a category (admin)', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/blog/admin/categories',
        headers: authHeader(adminToken),
        payload: {
          name: 'Test Category',
          slug: `test-category-${Date.now()}`,
          description: 'A test category',
          color: '#FF5733',
        },
      });

      expect(response.statusCode).toBe(201);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.name).toBe('Test Category');

      testCategoryId = body.data.id;
    });

    it('should reject category creation without auth', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/blog/admin/categories',
        payload: {
          name: 'Unauthorized Category',
        },
      });

      expect(response.statusCode).toBe(401);
    });
  });

  // ============================================
  // ADMIN: TAG MANAGEMENT
  // ============================================

  describe('POST /api/v1/blog/admin/tags', () => {
    it('should create a tag (admin)', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/blog/admin/tags',
        headers: authHeader(adminToken),
        payload: {
          name: 'Test Tag',
          slug: `test-tag-${Date.now()}`,
        },
      });

      expect(response.statusCode).toBe(201);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.name).toBe('Test Tag');

      testTagId = body.data.id;
    });
  });

  // ============================================
  // ADMIN: POST MANAGEMENT
  // ============================================

  describe('POST /api/v1/blog/admin/posts', () => {
    it('should create a post (admin)', async () => {
      testPostSlug = `test-post-${Date.now()}`;

      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/blog/admin/posts',
        headers: authHeader(adminToken),
        payload: {
          title: 'Test Post',
          slug: testPostSlug,
          content: 'This is the content of the test post.',
          excerpt: 'Test excerpt',
          author_name: 'Test Author',
          category_id: testCategoryId,
          tag_ids: [testTagId],
          reading_time: 5,
        },
      });

      expect(response.statusCode).toBe(201);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.title).toBe('Test Post');
      expect(body.data.status).toBe('DRAFT');

      testPostId = body.data.id;
    });

    it('should reject post creation without required fields', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/blog/admin/posts',
        headers: authHeader(adminToken),
        payload: {
          title: 'Incomplete Post',
          // Missing content and author_name
        },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /api/v1/blog/admin/posts', () => {
    it('should list all posts (admin)', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/blog/admin/posts',
        headers: authHeader(adminToken),
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.items).toBeDefined();
      expect(body.data.pagination).toBeDefined();
    });

    it('should filter posts by status', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/blog/admin/posts?status=DRAFT',
        headers: authHeader(adminToken),
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      body.data.items.forEach((post: any) => {
        expect(post.status).toBe('DRAFT');
      });
    });
  });

  describe('GET /api/v1/blog/admin/posts/:id', () => {
    it('should get a post by ID (admin)', async () => {
      const response = await app.inject({
        method: 'GET',
        url: `/api/v1/blog/admin/posts/${testPostId}`,
        headers: authHeader(adminToken),
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.id).toBe(testPostId);
    });

    it('should return 404 for non-existent post', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/blog/admin/posts/00000000-0000-0000-0000-000000000000',
        headers: authHeader(adminToken),
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('POST /api/v1/blog/admin/posts/:id/publish', () => {
    it('should publish a draft post', async () => {
      const response = await app.inject({
        method: 'POST',
        url: `/api/v1/blog/admin/posts/${testPostId}/publish`,
        headers: authHeader(adminToken),
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.status).toBe('PUBLISHED');
      expect(body.data.publishedAt).toBeDefined();
    });
  });

  // ============================================
  // PUBLIC: READ POSTS
  // ============================================

  describe('GET /api/v1/blog', () => {
    it('should list published posts (public)', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/blog',
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.items).toBeDefined();
      expect(body.data.pagination).toBeDefined();

      // All returned posts should be published
      body.data.items.forEach((post: any) => {
        expect(post.status).toBe('PUBLISHED');
      });
    });

    it('should support pagination', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/blog?page=1&limit=5',
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.data.pagination.page).toBe(1);
      expect(body.data.pagination.limit).toBe(5);
    });
  });

  describe('GET /api/v1/blog/slug/:slug', () => {
    it('should get a published post by slug', async () => {
      const response = await app.inject({
        method: 'GET',
        url: `/api/v1/blog/slug/${testPostSlug}`,
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.slug).toBe(testPostSlug);
    });

    it('should return 404 for non-existent slug', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/blog/slug/non-existent-slug',
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('GET /api/v1/blog/categories', () => {
    it('should list all categories (public)', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/blog/categories',
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(Array.isArray(body.data)).toBe(true);
    });
  });

  describe('GET /api/v1/blog/tags', () => {
    it('should list all tags (public)', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/blog/tags',
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(Array.isArray(body.data)).toBe(true);
    });
  });

  // ============================================
  // PUBLIC: REACTIONS
  // ============================================

  describe('POST /api/v1/blog/:postId/reactions', () => {
    const sessionId = `test-session-${Date.now()}`;

    it('should add a reaction to a post', async () => {
      const response = await app.inject({
        method: 'POST',
        url: `/api/v1/blog/${testPostId}/reactions`,
        payload: {
          type: 'LIKE',
          session_id: sessionId,
        },
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.action).toBe('added');
    });

    it('should update reaction if same session adds different type', async () => {
      const response = await app.inject({
        method: 'POST',
        url: `/api/v1/blog/${testPostId}/reactions`,
        payload: {
          type: 'LOVE',
          session_id: sessionId,
        },
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.action).toBe('updated');
    });
  });

  describe('DELETE /api/v1/blog/:postId/reactions', () => {
    const sessionId = `test-session-delete-${Date.now()}`;

    beforeAll(async () => {
      // Add a reaction first
      await app.inject({
        method: 'POST',
        url: `/api/v1/blog/${testPostId}/reactions`,
        payload: {
          type: 'HELPFUL',
          session_id: sessionId,
        },
      });
    });

    it('should remove a reaction from a post', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: `/api/v1/blog/${testPostId}/reactions?session_id=${sessionId}`,
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
    });
  });

  // ============================================
  // ADMIN: UPDATE AND DELETE
  // ============================================

  describe('PATCH /api/v1/blog/admin/posts/:id', () => {
    it('should update a post', async () => {
      const response = await app.inject({
        method: 'PATCH',
        url: `/api/v1/blog/admin/posts/${testPostId}`,
        headers: authHeader(adminToken),
        payload: {
          title: 'Updated Test Post',
        },
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.title).toBe('Updated Test Post');
    });
  });

  describe('POST /api/v1/blog/admin/posts/:id/unpublish', () => {
    it('should unpublish a post', async () => {
      const response = await app.inject({
        method: 'POST',
        url: `/api/v1/blog/admin/posts/${testPostId}/unpublish`,
        headers: authHeader(adminToken),
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.status).toBe('DRAFT');
    });
  });

  describe('DELETE /api/v1/blog/admin/posts/:id', () => {
    it('should delete a post', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: `/api/v1/blog/admin/posts/${testPostId}`,
        headers: authHeader(adminToken),
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
    });
  });

  describe('DELETE /api/v1/blog/admin/tags/:id', () => {
    it('should delete a tag', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: `/api/v1/blog/admin/tags/${testTagId}`,
        headers: authHeader(adminToken),
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
    });
  });

  describe('DELETE /api/v1/blog/admin/categories/:id', () => {
    it('should delete a category', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: `/api/v1/blog/admin/categories/${testCategoryId}`,
        headers: authHeader(adminToken),
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
    });
  });
});
