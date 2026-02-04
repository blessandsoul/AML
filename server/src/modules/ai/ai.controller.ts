import { FastifyReply, FastifyRequest } from 'fastify';
import { aiService } from './ai.service';
import { ChatRequestSchema, QuickQuestionSchema } from './ai.schemas';
import { successResponse } from '../../shared/helpers/response';

class AIController {
    /**
     * POST /ai/chat - Full chat with conversation history
     */
    async chat(request: FastifyRequest, reply: FastifyReply) {
        const validation = ChatRequestSchema.safeParse(request.body);

        if (!validation.success) {
            return reply.status(400).send({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: validation.error.issues[0]?.message || 'Invalid request',
                },
            });
        }

        const { message, conversationHistory, systemPrompt } = validation.data;

        try {
            const response = await aiService.chat(message, conversationHistory, systemPrompt);
            return reply.send(successResponse('AI ответил успешно', response));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return reply.status(500).send({
                success: false,
                error: {
                    code: 'AI_ERROR',
                    message: errorMessage,
                },
            });
        }
    }

    /**
     * POST /ai/ask - Quick one-shot question
     */
    async quickQuestion(request: FastifyRequest, reply: FastifyReply) {
        const validation = QuickQuestionSchema.safeParse(request.body);

        if (!validation.success) {
            return reply.status(400).send({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: validation.error.issues[0]?.message || 'Invalid request',
                },
            });
        }

        const { question } = validation.data;

        try {
            const answer = await aiService.quickQuestion(question);
            return reply.send(successResponse('Ответ получен', { answer }));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return reply.status(500).send({
                success: false,
                error: {
                    code: 'AI_ERROR',
                    message: errorMessage,
                },
            });
        }
    }

    /**
     * GET /ai/models - Get available models
     */
    async getModels(request: FastifyRequest, reply: FastifyReply) {
        try {
            const models = await aiService.getModels();
            return reply.send(successResponse('Модели получены', { models }));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return reply.status(500).send({
                success: false,
                error: {
                    code: 'AI_ERROR',
                    message: errorMessage,
                },
            });
        }
    }

    /**
     * GET /ai/health - Check AI service health
     */
    async healthCheck(request: FastifyRequest, reply: FastifyReply) {
        try {
            const status = await aiService.healthCheck();
            return reply.send(successResponse('AI статус проверен', status));
        } catch (error) {
            return reply.status(500).send({
                success: false,
                error: {
                    code: 'AI_ERROR',
                    message: 'Health check failed',
                },
            });
        }
    }
}

export const aiController = new AIController();
