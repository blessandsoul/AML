'use client';

import * as React from 'react';
import { Check, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useColorPalette, type ColorPalette } from '@/providers/color-palette-provider';
import { cn } from '@/lib/utils';

// Color swatches for each palette
const PALETTE_SWATCHES: Record<ColorPalette, string[]> = {
  default: ['#3B82F6', '#6366F1', '#8B5CF6', '#FFFFFF'], // Electric blue theme
  aml: ['#0076BA', '#8ED3E0', '#3498DB', '#1C2331'], // AML brand colors
};

const PALETTE_DESCRIPTIONS: Record<ColorPalette, string> = {
  default: 'Electric blue & purple tones',
  aml: 'Navy, turquoise & bright blue',
};

export function ColorPaletteSelector() {
  const { palette, setPalette, palettes, mounted } = useColorPalette();

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full"
        disabled
      >
        <Palette className="w-5 h-5" />
        <span className="sr-only">Select color palette</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full"
        >
          <Palette className="w-5 h-5" />
          <span className="sr-only">Select color palette</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[220px]">
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
          Color Palette (Testing)
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {palettes.map((p) => (
          <DropdownMenuItem
            key={p.value}
            onClick={() => setPalette(p.value)}
            className="flex flex-col items-start gap-2 cursor-pointer py-3"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-sm font-medium">{p.label}</span>
              {palette === p.value && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </div>
            <div className="flex items-center gap-1">
              {PALETTE_SWATCHES[p.value].map((color, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "w-5 h-5 rounded-full border border-border/50",
                    idx === PALETTE_SWATCHES[p.value].length - 1 && "ring-1 ring-border"
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {PALETTE_DESCRIPTIONS[p.value]}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
