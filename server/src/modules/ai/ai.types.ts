// AI Assistant Types

export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface ChatRequest {
    message: string;
    conversationHistory?: ChatMessage[];
    systemPrompt?: string;
}

export interface ChatResponse {
    message: string;
    model: string;
    usage: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
}

export interface GroqConfig {
    apiKey: string;
    model: string;
    maxTokens: number;
    temperature: number;
}

export interface GroqAPIResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: {
        index: number;
        message: {
            role: string;
            content: string;
        };
        logprobs: null;
        finish_reason: string;
    }[];
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}
