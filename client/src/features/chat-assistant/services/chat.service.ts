import type { SendMessageRequest, SendMessageResponse } from '../types';

const BASE_URL = '/api/v1/chat';

class ChatService {
    /**
     * Send message to AI assistant
     * Currently returns mock responses, will integrate with AI API in future
     *
     * FUTURE: Uncomment for real API integration with OpenAI/Claude
     */
    async sendMessage(_data: SendMessageRequest): Promise<SendMessageResponse['data']> {
        // FUTURE: Uncomment for real API integration
        // const response = await apiClient.post<ApiResponse<SendMessageResponse['data']>>(
        //     `${BASE_URL}/message`,
        //     data
        // );
        // return response.data.data;

        // Mock implementation - throw error to fall back to local mock
        throw new Error('API not implemented - using local mock');
    }

    /**
     * Get conversation history
     */
    async getConversation(_conversationId: string) {
        // FUTURE: Implement when API is ready
        // const response = await apiClient.get<ApiResponse<ChatMessage[]>>(
        //     `${BASE_URL}/conversation/${conversationId}`
        // );
        // return response.data.data;

        return [];
    }

    /**
     * Create new conversation
     */
    async createConversation() {
        // FUTURE: Implement when API is ready
        return { conversationId: `local-${Date.now()}` };
    }
}

export const chatService = new ChatService();
