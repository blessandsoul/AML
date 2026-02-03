'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { CarCharacter } from './CarCharacter';
import type { CarCharacterState } from '../types';

interface ChatButtonProps {
    onClick: () => void;
    characterState: CarCharacterState;
    onWakeUp?: () => void;
}

export function ChatButton({ onClick, characterState, onWakeUp }: ChatButtonProps) {
    const [isHovered, setIsHovered] = React.useState(false);
    const isSleeping = characterState === 'sleeping';

    const handleMouseEnter = () => {
        setIsHovered(true);
        if (isSleeping && onWakeUp) {
            onWakeUp();
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    // Determine displayed state
    const displayState: CarCharacterState = isSleeping
        ? 'sleeping'
        : isHovered
            ? 'listening'
            : characterState;

    return (
        <motion.button
            onClick={onClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg hover:shadow-xl transition-shadow cursor-pointer flex items-center justify-center border-2 border-white/20"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
            {/* Pulse ring animation - different when sleeping */}
            <motion.div
                className="absolute inset-0 rounded-full bg-blue-400"
                animate={isSleeping ? {
                    scale: [1, 1.05, 1],
                    opacity: [0.2, 0.3, 0.2]
                } : {
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0, 0.5]
                }}
                transition={{
                    duration: isSleeping ? 3 : 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                }}
            />

            {/* Car character */}
            <CarCharacter
                state={displayState}
                size={52}
            />

            {/* Tooltip - different message when sleeping */}
            <motion.div
                className="absolute -top-12 right-0 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 5 }}
                transition={{ duration: 0.2 }}
            >
                {isSleeping ? 'დამაღვიძე!' : 'გამარჯობა! დაგეხმაროთ?'}
                <div className="absolute -bottom-1 right-4 w-2 h-2 bg-gray-900 rotate-45" />
            </motion.div>
        </motion.button>
    );
}
