import type { ChatMessage, ChatResponse, GroqAPIResponse, GroqConfig } from './ai.types';

// Groq API Configuration
const GROQ_CONFIG: GroqConfig = {
    apiKey: process.env.GROQ_API_KEY || '',
    model: 'llama-3.3-70b-versatile', // Самая умная бесплатная модель
    maxTokens: 4096,
    temperature: 0.7,
};

// Default system prompt for AML assistant
const DEFAULT_SYSTEM_PROMPT = `Ты - умный AI помощник платформы AML (Auto Market Logistic). 
Ты помогаешь пользователям с вопросами об автомобилях, аукционах, заказах и работе платформы.
Отвечай кратко и по делу. Используй русский или грузинский язык в зависимости от языка вопроса.
Если не знаешь ответ - так и скажи, не выдумывай.`;

class AIService {
    private apiKey: string;
    private model: string;
    private maxTokens: number;
    private temperature: number;

    constructor() {
        this.apiKey = GROQ_CONFIG.apiKey;
        this.model = GROQ_CONFIG.model;
        this.maxTokens = GROQ_CONFIG.maxTokens;
        this.temperature = GROQ_CONFIG.temperature;
    }

    /**
     * Send a chat message to Groq AI
     */
    async chat(
        userMessage: string,
        conversationHistory: ChatMessage[] = [],
        customSystemPrompt?: string
    ): Promise<ChatResponse> {
        if (!this.apiKey) {
            throw new Error('GROQ_API_KEY is not configured');
        }

        const systemPrompt = customSystemPrompt || DEFAULT_SYSTEM_PROMPT;

        const messages: ChatMessage[] = [
            { role: 'system', content: systemPrompt },
            ...conversationHistory,
            { role: 'user', content: userMessage },
        ];

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: this.model,
                messages,
                max_tokens: this.maxTokens,
                temperature: this.temperature,
            }),
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Groq API error: ${response.status} - ${errorData}`);
        }

        const data = await response.json() as GroqAPIResponse;

        return {
            message: data.choices[0]?.message?.content || '',
            model: data.model,
            usage: {
                promptTokens: data.usage.prompt_tokens,
                completionTokens: data.usage.completion_tokens,
                totalTokens: data.usage.total_tokens,
            },
        };
    }

    /**
     * Quick question - simple one-shot response
     */
    async quickQuestion(question: string): Promise<string> {
        const response = await this.chat(question);
        return response.message;
    }

    /**
     * Get available models info
     */
    async getModels(): Promise<{ id: string; owned_by: string }[]> {
        if (!this.apiKey) {
            throw new Error('GROQ_API_KEY is not configured');
        }

        const response = await fetch('https://api.groq.com/openai/v1/models', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch models: ${response.status}`);
        }

        const data = await response.json() as { data: { id: string; owned_by: string }[] };
        return data.data.map((m) => ({ id: m.id, owned_by: m.owned_by }));
    }

    /**
     * Check if AI service is configured and working
     */
    async healthCheck(): Promise<{ status: string; model: string; configured: boolean }> {
        const configured = !!this.apiKey;

        if (!configured) {
            return { status: 'not_configured', model: this.model, configured: false };
        }

        try {
            await this.quickQuestion('Привет! Отвечь одним словом: работаешь?');
            return { status: 'healthy', model: this.model, configured: true };
        } catch (error) {
            return { status: 'error', model: this.model, configured: true };
        }
    }
}

export const aiService = new AIService();
