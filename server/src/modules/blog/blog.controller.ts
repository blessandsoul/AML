import { FastifyRequest, FastifyReply } from 'fastify';
import { blogService } from './blog.service';
import { successResponse, paginatedResponse } from '../../shared/helpers';
import {
  CreatePostSchema,
  UpdatePostSchema,
  PostFiltersSchema,
  CreateCategorySchema,
  CreateTagSchema,
  AddReactionSchema,
} from './blog.schemas';

type IdParams = { id: string };
type SlugParams = { slug: string };

export const blogController = {
  // ===== PUBLIC ENDPOINTS =====

  async getPublishedPosts(request: FastifyRequest, reply: FastifyReply) {
    const filters = PostFiltersSchema.parse(request.query);
    const { items, totalItems } = await blogService.findAllPublished(filters);

    return reply.send(
      paginatedResponse('Blog posts retrieved successfully', items, filters.page, filters.limit, totalItems)
    );
  },

  async getPostBySlug(request: FastifyRequest<{ Params: SlugParams }>, reply: FastifyReply) {
    const post = await blogService.findBySlug(request.params.slug);
    return reply.send(successResponse('Post retrieved successfully', post));
  },

  async getCategories(request: FastifyRequest, reply: FastifyReply) {
    const categories = await blogService.findAllCategories();
    return reply.send(successResponse('Categories retrieved successfully', categories));
  },

  async getTags(request: FastifyRequest, reply: FastifyReply) {
    const tags = await blogService.findAllTags();
    return reply.send(successResponse('Tags retrieved successfully', tags));
  },

  // ===== REACTION ENDPOINTS =====

  async addReaction(request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) {
    const { type, session_id } = AddReactionSchema.parse(request.body);
    const result = await blogService.addReaction(request.params.id, session_id, type);
    return reply.send(successResponse('Reaction processed successfully', result));
  },

  async removeReaction(request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) {
    const { session_id } = request.query as { session_id: string };
    await blogService.removeReaction(request.params.id, session_id);
    return reply.send(successResponse('Reaction removed successfully', null));
  },

  // ===== ADMIN ENDPOINTS =====

  async getAllPosts(request: FastifyRequest, reply: FastifyReply) {
    const filters = PostFiltersSchema.parse(request.query);
    const { items, totalItems } = await blogService.findAll(filters);

    return reply.send(
      paginatedResponse('Posts retrieved successfully', items, filters.page, filters.limit, totalItems)
    );
  },

  async getPostById(request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) {
    const post = await blogService.findById(request.params.id);
    return reply.send(successResponse('Post retrieved successfully', post));
  },

  async createPost(request: FastifyRequest, reply: FastifyReply) {
    const dto = CreatePostSchema.parse(request.body);
    const post = await blogService.create(dto);

    return reply.status(201).send(successResponse('Post created successfully', post));
  },

  async updatePost(request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) {
    const dto = UpdatePostSchema.parse(request.body);
    const post = await blogService.update(request.params.id, dto);

    return reply.send(successResponse('Post updated successfully', post));
  },

  async deletePost(request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) {
    await blogService.delete(request.params.id);
    return reply.send(successResponse('Post deleted successfully', null));
  },

  async publishPost(request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) {
    const post = await blogService.publish(request.params.id);
    return reply.send(successResponse('Post published successfully', post));
  },

  async unpublishPost(request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) {
    const post = await blogService.unpublish(request.params.id);
    return reply.send(successResponse('Post unpublished successfully', post));
  },

  async archivePost(request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) {
    const post = await blogService.archive(request.params.id);
    return reply.send(successResponse('Post archived successfully', post));
  },

  // ===== CATEGORY MANAGEMENT =====

  async createCategory(request: FastifyRequest, reply: FastifyReply) {
    const dto = CreateCategorySchema.parse(request.body);
    const category = await blogService.createCategory(dto);

    return reply.status(201).send(successResponse('Category created successfully', category));
  },

  async updateCategory(request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) {
    const dto = CreateCategorySchema.partial().parse(request.body);
    const category = await blogService.updateCategory(request.params.id, dto);

    return reply.send(successResponse('Category updated successfully', category));
  },

  async deleteCategory(request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) {
    await blogService.deleteCategory(request.params.id);
    return reply.send(successResponse('Category deleted successfully', null));
  },

  // ===== TAG MANAGEMENT =====

  async createTag(request: FastifyRequest, reply: FastifyReply) {
    const dto = CreateTagSchema.parse(request.body);
    const tag = await blogService.createTag(dto);

    return reply.status(201).send(successResponse('Tag created successfully', tag));
  },

  async deleteTag(request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) {
    await blogService.deleteTag(request.params.id);
    return reply.send(successResponse('Tag deleted successfully', null));
  },
};
