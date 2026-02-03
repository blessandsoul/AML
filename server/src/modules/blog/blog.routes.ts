import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { blogController } from './blog.controller';

export async function blogRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  // ===== PUBLIC ROUTES =====

  // Get published posts (paginated)
  fastify.get('/', blogController.getPublishedPosts);

  // Get single post by slug
  fastify.get('/slug/:slug', blogController.getPostBySlug);

  // Get all categories
  fastify.get('/categories', blogController.getCategories);

  // Get all tags
  fastify.get('/tags', blogController.getTags);

  // ===== REACTION ROUTES =====

  // Add/toggle reaction
  fastify.post('/:id/reactions', blogController.addReaction);

  // Remove reaction
  fastify.delete('/:id/reactions', blogController.removeReaction);

  // ===== ADMIN ROUTES (MVP: No auth protection) =====

  // Get all posts (including drafts)
  fastify.get('/admin/posts', blogController.getAllPosts);

  // Get single post by ID (for editing)
  fastify.get('/admin/posts/:id', blogController.getPostById);

  // Create post
  fastify.post('/admin/posts', blogController.createPost);

  // Update post
  fastify.patch('/admin/posts/:id', blogController.updatePost);

  // Delete post
  fastify.delete('/admin/posts/:id', blogController.deletePost);

  // Publish post
  fastify.post('/admin/posts/:id/publish', blogController.publishPost);

  // Unpublish post
  fastify.post('/admin/posts/:id/unpublish', blogController.unpublishPost);

  // Archive post
  fastify.post('/admin/posts/:id/archive', blogController.archivePost);

  // ===== CATEGORY MANAGEMENT =====

  // Create category
  fastify.post('/admin/categories', blogController.createCategory);

  // Update category
  fastify.patch('/admin/categories/:id', blogController.updateCategory);

  // Delete category
  fastify.delete('/admin/categories/:id', blogController.deleteCategory);

  // ===== TAG MANAGEMENT =====

  // Create tag
  fastify.post('/admin/tags', blogController.createTag);

  // Delete tag
  fastify.delete('/admin/tags/:id', blogController.deleteTag);
}
