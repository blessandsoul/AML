'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Search, Navigation, HelpCircle, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { QuickAction } from '../types';

const QUICK_ACTIONS: QuickAction[] = [
    {
        id: 'car_search',
        label: 'ავტომობილის მოძებნა',
        icon: Search,
        category: 'car_search'
    },
    {
        id: 'navigation',
        label: 'საიტზე ნავიგაცია',
        icon: Navigation,
        category: 'navigation'
    },
    {
        id: 'support',
        label: 'მხარდაჭერა',
        icon: HelpCircle,
        category: 'support'
    },
    {
        id: 'calculator',
        label: 'ფასის გათვლა',
        icon: Calculator,
        category: 'calculator'
    }
];

interface QuickActionsProps {
    onAction: (actionId: string, label: string) => void;
}

export function QuickActions({ onAction }: QuickActionsProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-2 mt-3"
        >
            {QUICK_ACTIONS.map((action, index) => {
                const Icon = action.icon;
                return (
                    <motion.div
                        key={action.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * index }}
                    >
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onAction(action.id, action.label)}
                            className="text-xs gap-1.5 h-8"
                        >
                            <Icon className="w-3.5 h-3.5" />
                            {action.label}
                        </Button>
                    </motion.div>
                );
            })}
        </motion.div>
    );
}
