'use client';

import { Button } from '@/components/ui/button';
import { Heart, ThumbsUp, Lightbulb } from 'lucide-react';
import { useReaction, getSessionId } from '../hooks';
import type { ReactionType, BlogReaction } from '../types';
import { cn } from '@/lib/utils';

interface ReactionButtonsProps {
  postId: string;
  slug: string;
  reactionCounts?: Record<ReactionType, number>;
  reactions?: BlogReaction[];
}

export function ReactionButtons({
  postId,
  slug,
  reactionCounts = { LIKE: 0, LOVE: 0, HELPFUL: 0 },
  reactions = [],
}: ReactionButtonsProps) {
  const { mutate: addReaction, isPending } = useReaction(postId, slug);

  // Check if current user has reacted
  const sessionId = typeof window !== 'undefined' ? getSessionId() : '';
  const userReaction = reactions.find((r) => r.sessionId === sessionId);

  const handleReaction = (type: ReactionType) => {
    if (isPending) return;
    addReaction(type);
  };

  const buttons: { type: ReactionType; icon: typeof Heart; label: string }[] = [
    { type: 'LIKE', icon: ThumbsUp, label: 'მომწონს' },
    { type: 'LOVE', icon: Heart, label: 'მიყვარს' },
    { type: 'HELPFUL', icon: Lightbulb, label: 'სასარგებლო' },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {buttons.map(({ type, icon: Icon, label }) => {
        const isActive = userReaction?.type === type;
        const count = reactionCounts[type];

        return (
          <Button
            key={type}
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleReaction(type)}
            disabled={isPending}
            className={cn(
              'gap-2',
              isActive && type === 'LOVE' && 'bg-red-500 hover:bg-red-600',
              isActive && type === 'LIKE' && 'bg-blue-500 hover:bg-blue-600',
              isActive && type === 'HELPFUL' && 'bg-yellow-500 hover:bg-yellow-600 text-black'
            )}
          >
            <Icon className={cn('w-4 h-4', isActive && 'fill-current')} />
            <span>{label}</span>
            {count > 0 && <span className="text-xs opacity-70">({count})</span>}
          </Button>
        );
      })}
    </div>
  );
}
