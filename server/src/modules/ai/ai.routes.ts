import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { aiController } from './ai.controller';

export async function aiRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
    // Health check for AI service
    fastify.get('/health', aiController.healthCheck);

    // Get available models
    fastify.get('/models', aiController.getModels);

    // Quick one-shot question
    fastify.post('/ask', aiController.quickQuestion);

    // Full chat with conversation history
    fastify.post('/chat', aiController.chat);
}
