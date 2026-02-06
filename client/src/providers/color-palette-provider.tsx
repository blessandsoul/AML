'use client';

import * as React from 'react';

/**
 * Color Palette Types
 * - 'default': Current electric blue theme
 * - 'aml': New AML brand colors (navy, turquoise, bright blue)
 */
export type ColorPalette = 'default' | 'aml';

interface ColorPaletteContextType {
  palette: ColorPalette;
  setPalette: (palette: ColorPalette) => void;
  palettes: { value: ColorPalette; label: string }[];
  mounted: boolean;
}

const ColorPaletteContext = React.createContext<ColorPaletteContextType | undefined>(undefined);

const PALETTE_STORAGE_KEY = 'aml-color-palette';

const AVAILABLE_PALETTES: { value: ColorPalette; label: string }[] = [
  { value: 'default', label: 'Default (Blue)' },
  { value: 'aml', label: 'AML Brand' },
];

interface ColorPaletteProviderProps {
  children: React.ReactNode;
  defaultPalette?: ColorPalette;
}

// Script to run before React hydrates to prevent flash
// This is a static string (not user input) so it's safe
const colorPaletteScript = `
(function() {
  try {
    var palette = localStorage.getItem('${PALETTE_STORAGE_KEY}');
    if (palette !== 'default') {
      document.documentElement.classList.add('palette-aml');
    }
  } catch (e) {
    document.documentElement.classList.add('palette-aml');
  }
})();
`;

export function ColorPaletteProvider({
  children,
  defaultPalette = 'aml',
}: ColorPaletteProviderProps) {
  const [palette, setPaletteState] = React.useState<ColorPalette>(defaultPalette);
  const [mounted, setMounted] = React.useState(false);

  // Load palette from localStorage on mount (must match the script above)
  React.useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(PALETTE_STORAGE_KEY) as ColorPalette | null;
      if (stored && AVAILABLE_PALETTES.some((p) => p.value === stored)) {
        setPaletteState(stored);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Apply palette class to document when palette changes
  React.useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    // Remove all palette classes
    AVAILABLE_PALETTES.forEach((p) => {
      root.classList.remove(`palette-${p.value}`);
    });

    // Add current palette class (only for non-default)
    if (palette !== 'default') {
      root.classList.add(`palette-${palette}`);
    }

    // Save to localStorage
    try {
      localStorage.setItem(PALETTE_STORAGE_KEY, palette);
    } catch {
      // Ignore localStorage errors
    }
  }, [palette, mounted]);

  const setPalette = React.useCallback((newPalette: ColorPalette) => {
    setPaletteState(newPalette);
  }, []);

  const value = React.useMemo(
    () => ({
      palette,
      setPalette,
      palettes: AVAILABLE_PALETTES,
      mounted,
    }),
    [palette, setPalette, mounted]
  );

  return (
    <ColorPaletteContext.Provider value={value}>
      <script
        dangerouslySetInnerHTML={{ __html: colorPaletteScript }}
        suppressHydrationWarning
      />
      {children}
    </ColorPaletteContext.Provider>
  );
}

export function useColorPalette() {
  const context = React.useContext(ColorPaletteContext);
  if (context === undefined) {
    throw new Error('useColorPalette must be used within a ColorPaletteProvider');
  }
  return context;
}
