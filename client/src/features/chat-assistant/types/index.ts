export type MessageRole = 'user' | 'assistant';
export type ChatCategory = 'car_search' | 'navigation' | 'support' | 'calculator' | 'general';
export type CarCharacterState = 'idle' | 'listening' | 'thinking' | 'talking' | 'happy' | 'sleeping';

export interface ChatMessage {
    id: string;
    role: MessageRole;
    content: string;
    timestamp: Date;
    category?: ChatCategory;
    showQuickActions?: boolean;
}

export interface QuickAction {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    category: ChatCategory;
}

export interface MockResponse {
    patterns: string[];
    responses: string[];
    followUpActions?: string[];
}

export interface ChatState {
    isOpen: boolean;
    messages: ChatMessage[];
    isTyping: boolean;
    characterState: CarCharacterState;
}

// Future AI API interfaces
export interface SendMessageRequest {
    message: string;
    conversationId?: string;
    context?: {
        currentPage?: string;
        sessionId?: string;
        language?: 'ka' | 'en' | 'ru';
    };
}

export interface SendMessageResponse {
    success: true;
    message: string;
    data: {
        reply: string;
        conversationId: string;
        suggestedActions?: string[];
    };
}
