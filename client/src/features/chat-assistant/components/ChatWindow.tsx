'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { QuickActions } from './QuickActions';
import { TypingIndicator } from './TypingIndicator';
import { CarCharacter } from './CarCharacter';
import type { ChatMessage as ChatMessageType, CarCharacterState } from '../types';

interface ChatWindowProps {
    messages: ChatMessageType[];
    isTyping: boolean;
    characterState: CarCharacterState;
    onSendMessage: (message: string) => void;
    onQuickAction: (actionId: string, label: string) => void;
    onClose: () => void;
    onClear: () => void;
    onInputFocus?: () => void;
    onInputBlur?: () => void;
}

export function ChatWindow({
    messages,
    isTyping,
    characterState,
    onSendMessage,
    onQuickAction,
    onClose,
    onClear,
    onInputFocus,
    onInputBlur
}: ChatWindowProps) {
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const lastMessage = messages[messages.length - 1];
    const showQuickActions = lastMessage?.showQuickActions && !isTyping;

    React.useEffect(() => {
        if (scrollRef.current) {
            const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, [messages, isTyping]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute bottom-20 right-0 w-[calc(100vw-2rem)] md:w-95 max-w-sm h-100 md:h-130 glass-3 glass-tint glass-noise rounded-2xl flex flex-col overflow-hidden"
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary/80 to-primary/60 backdrop-blur-xl border-b border-white/15">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        <CarCharacter state={characterState} size={28} />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-white">AML ასისტენტი</h3>
                        <p className="text-[10px] text-white/70">ონლაინ</p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClear}
                        className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                        title="გასუფთავება"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Messages */}
            <ScrollArea ref={scrollRef} className="flex-1 p-4">
                <div className="space-y-4">
                    {messages.map((message) => (
                        <ChatMessage key={message.id} message={message} />
                    ))}

                    <AnimatePresence>
                        {isTyping && <TypingIndicator />}
                    </AnimatePresence>

                    {showQuickActions && (
                        <QuickActions onAction={onQuickAction} />
                    )}
                </div>
            </ScrollArea>

            {/* Input */}
            <ChatInput
                onSend={onSendMessage}
                disabled={isTyping}
                onFocus={onInputFocus}
                onBlur={onInputBlur}
            />
        </motion.div>
    );
}
