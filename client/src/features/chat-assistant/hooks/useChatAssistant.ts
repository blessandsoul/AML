'use client';

import * as React from 'react';
import type { ChatMessage, ChatState, ChatCategory, CarCharacterState } from '../types';
import { MOCK_RESPONSES, DEFAULT_RESPONSE, TYPING_DELAY, WELCOME_MESSAGE } from '../data/mock-responses';

const SLEEP_TIMEOUT = 30000; // 30 seconds of inactivity before sleeping

export function useChatAssistant() {
    const [state, setState] = React.useState<ChatState>({
        isOpen: false,
        messages: [{ ...WELCOME_MESSAGE, timestamp: new Date() }],
        isTyping: false,
        characterState: 'idle'
    });

    const sleepTimerRef = React.useRef<NodeJS.Timeout | null>(null);

    // Reset sleep timer - called on any interaction
    const resetSleepTimer = React.useCallback(() => {
        if (sleepTimerRef.current) {
            clearTimeout(sleepTimerRef.current);
        }

        sleepTimerRef.current = setTimeout(() => {
            setState(prev => {
                // Only sleep if chat is closed and not busy
                if (!prev.isOpen && prev.characterState === 'idle') {
                    return { ...prev, characterState: 'sleeping' };
                }
                return prev;
            });
        }, SLEEP_TIMEOUT);
    }, []);

    // Wake up from sleeping
    const wakeUp = React.useCallback(() => {
        setState(prev => {
            if (prev.characterState === 'sleeping') {
                return { ...prev, characterState: 'idle' };
            }
            return prev;
        });
        resetSleepTimer();
    }, [resetSleepTimer]);

    // Start sleep timer on mount
    React.useEffect(() => {
        resetSleepTimer();
        return () => {
            if (sleepTimerRef.current) {
                clearTimeout(sleepTimerRef.current);
            }
        };
    }, [resetSleepTimer]);

    const toggleChat = React.useCallback(() => {
        wakeUp();
        setState(prev => ({
            ...prev,
            isOpen: !prev.isOpen,
            characterState: !prev.isOpen ? 'happy' : 'idle'
        }));
    }, [wakeUp]);

    const closeChat = React.useCallback(() => {
        setState(prev => ({
            ...prev,
            isOpen: false,
            characterState: 'idle'
        }));
        resetSleepTimer();
    }, [resetSleepTimer]);

    const setCharacterState = React.useCallback((characterState: CarCharacterState) => {
        setState(prev => ({ ...prev, characterState }));
        if (characterState === 'idle') {
            resetSleepTimer();
        }
    }, [resetSleepTimer]);

    const findResponse = React.useCallback((message: string): { content: string; followUpActions?: string[] } => {
        const lowerMessage = message.toLowerCase();

        for (const category of Object.keys(MOCK_RESPONSES) as ChatCategory[]) {
            for (const mockResponse of MOCK_RESPONSES[category]) {
                if (mockResponse.patterns.some(pattern => lowerMessage.includes(pattern.toLowerCase()))) {
                    const randomIndex = Math.floor(Math.random() * mockResponse.responses.length);
                    return {
                        content: mockResponse.responses[randomIndex],
                        followUpActions: mockResponse.followUpActions
                    };
                }
            }
        }

        const randomIndex = Math.floor(Math.random() * DEFAULT_RESPONSE.responses.length);
        return {
            content: DEFAULT_RESPONSE.responses[randomIndex],
            followUpActions: DEFAULT_RESPONSE.followUpActions
        };
    }, []);

    const sendMessage = React.useCallback(async (content: string) => {
        if (!content.trim()) return;

        wakeUp();

        const userMessage: ChatMessage = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: content.trim(),
            timestamp: new Date()
        };

        setState(prev => ({
            ...prev,
            messages: [...prev.messages, userMessage],
            isTyping: true,
            characterState: 'thinking'
        }));

        const delay = Math.random() * (TYPING_DELAY.max - TYPING_DELAY.min) + TYPING_DELAY.min;
        await new Promise(resolve => setTimeout(resolve, delay));

        const { content: responseContent, followUpActions } = findResponse(content);

        const botMessage: ChatMessage = {
            id: `bot-${Date.now()}`,
            role: 'assistant',
            content: responseContent,
            timestamp: new Date(),
            showQuickActions: !!followUpActions && followUpActions.length > 0
        };

        setState(prev => ({
            ...prev,
            messages: [...prev.messages, botMessage],
            isTyping: false,
            characterState: 'talking'
        }));

        setTimeout(() => setCharacterState('idle'), 2000);
    }, [findResponse, setCharacterState, wakeUp]);

    const handleQuickAction = React.useCallback((actionId: string, label: string) => {
        sendMessage(label);
    }, [sendMessage]);

    const clearChat = React.useCallback(() => {
        setState(prev => ({
            ...prev,
            messages: [{ ...WELCOME_MESSAGE, timestamp: new Date() }]
        }));
    }, []);

    return {
        ...state,
        toggleChat,
        closeChat,
        sendMessage,
        handleQuickAction,
        clearChat,
        setCharacterState,
        wakeUp
    };
}
