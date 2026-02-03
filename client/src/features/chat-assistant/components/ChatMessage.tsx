'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ChatMessage as ChatMessageType } from '../types';
import { CarCharacter } from './CarCharacter';

interface ChatMessageProps {
    message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.role === 'user';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.2 }}
            className={cn(
                'flex gap-2 max-w-[85%]',
                isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
            )}
        >
            {!isUser && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <CarCharacter state="idle" size={28} />
                </div>
            )}

            <div
                className={cn(
                    'px-3 py-2 rounded-2xl text-sm',
                    isUser
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-muted text-foreground rounded-bl-md'
                )}
            >
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
                <span
                    className={cn(
                        'text-[10px] mt-1 block',
                        isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    )}
                >
                    {message.timestamp.toLocaleTimeString('ka-GE', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </span>
            </div>
        </motion.div>
    );
}
