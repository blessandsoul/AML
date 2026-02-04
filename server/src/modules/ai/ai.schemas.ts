import { z } from 'zod';

// Schema for chat message
export const ChatMessageSchema = z.object({
    role: z.enum(['system', 'user', 'assistant']),
    content: z.string().min(1),
});

// Schema for chat request
export const ChatRequestSchema = z.object({
    message: z.string().min(1, 'Сообщение обязательно'),
    conversationHistory: z.array(ChatMessageSchema).optional(),
    systemPrompt: z.string().optional(),
});

// Schema for quick question (simple endpoint)
export const QuickQuestionSchema = z.object({
    question: z.string().min(1, 'Вопрос обязателен'),
});

export type ChatRequestInput = z.infer<typeof ChatRequestSchema>;
export type QuickQuestionInput = z.infer<typeof QuickQuestionSchema>;
