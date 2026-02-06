'use client';

import * as React from 'react';
import { Layers, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useHeaderVariant } from '@/providers/header-variant-provider';
import { cn } from '@/lib/utils';

export function HeaderVariantSelector() {
    const { variant, setVariant, variants, mounted } = useHeaderVariant();

    if (!mounted) {
        return null;
    }

    return (
        <div className="fixed bottom-6 left-6 z-[60]">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        className="rounded-full shadow-xl bg-primary text-primary-foreground hover:bg-primary/90 gap-2 pr-5 pl-4 h-11"
                    >
                        <Layers className="w-4 h-4" />
                        Header
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="start" className="w-[300px] mb-2">
                    <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                        Choose Header Style
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {variants.map((v) => {
                        const isActive = variant === v.id;
                        return (
                            <DropdownMenuItem
                                key={v.id}
                                onClick={() => setVariant(v.id)}
                                className={cn(
                                    "flex items-center justify-between cursor-pointer py-3 px-3 rounded-lg",
                                    isActive && "bg-primary/5"
                                )}
                            >
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-sm font-bold">{v.label}</span>
                                    <span className="text-xs text-muted-foreground">{v.description}</span>
                                </div>
                                {isActive && (
                                    <Check className="w-4 h-4 text-primary shrink-0 ml-3" />
                                )}
                            </DropdownMenuItem>
                        );
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
