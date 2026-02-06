/**
 * AML Brand Color Palette
 *
 * This file contains all brand and interface colors.
 * Colors are organized by purpose and can be used directly or converted to CSS variables.
 */

// ============================================================================
// MAIN BRAND & INTERFACE COLORS
// ============================================================================

export const BRAND_COLORS = {
  /** Dark blue - Footer and calculator section background */
  darkNavy: '#1C2331',

  /** Cerulean blue - Navigation menu primary color */
  navyBlue: '#2D88C4',

  /** Teal - Logo wings and decorative elements */
  turquoise: '#55A8B9',

  /** Bright blue - Primary buttons and accent elements */
  brightBlue: '#3498DB',

  /** White - Main background and text on dark blocks */
  white: '#FFFFFF',
} as const;

// ============================================================================
// SECTION ICON COLORS
// ============================================================================

export const ICON_COLORS = {
  /** Brown/Gold - Auction hammer icon */
  auction: '#B68A52',

  /** Red/Terracotta - Shipping/logistics ship icon */
  shipping: '#D24D3E',

  /** Lilac-blue - Additional details box icon */
  details: '#8B9DC3',
} as const;

// ============================================================================
// AUXILIARY COLORS
// ============================================================================

export const AUXILIARY_COLORS = {
  /** Light gray - Field borders and dividers */
  borderLight: '#D1D1D1',

  /** Dark gray - Main text on light background */
  textDark: '#333333',

  /** Blue - Links and social media icons (WhatsApp/Phone) */
  link: '#007AFF',
} as const;

// ============================================================================
// SEMANTIC COLOR MAPPINGS
// ============================================================================

export const SEMANTIC_COLORS = {
  // Backgrounds
  backgroundDark: BRAND_COLORS.darkNavy,
  backgroundLight: BRAND_COLORS.white,
  backgroundNav: BRAND_COLORS.navyBlue,

  // Text
  textOnDark: BRAND_COLORS.white,
  textOnLight: AUXILIARY_COLORS.textDark,

  // Interactive Elements
  buttonPrimary: BRAND_COLORS.brightBlue,
  buttonPrimaryHover: '#2980B9', // Darker shade of brightBlue
  linkColor: AUXILIARY_COLORS.link,

  // Borders
  border: AUXILIARY_COLORS.borderLight,

  // Logo & Branding
  logoAccent: BRAND_COLORS.turquoise,
} as const;

// ============================================================================
// HSL VALUES (for CSS custom properties compatibility)
// ============================================================================

export const BRAND_COLORS_HSL = {
  darkNavy: '218 28% 15%',
  navyBlue: '204 63% 47%',
  turquoise: '190 42% 53%',
  brightBlue: '204 70% 53%',
  white: '0 0% 100%',
} as const;

export const ICON_COLORS_HSL = {
  auction: '35 38% 52%',
  shipping: '8 62% 53%',
  details: '223 24% 65%',
} as const;

export const AUXILIARY_COLORS_HSL = {
  borderLight: '0 0% 82%',
  textDark: '0 0% 20%',
  link: '211 100% 50%',
} as const;

// ============================================================================
// RGB VALUES (for rgba() usage)
// ============================================================================

export const BRAND_COLORS_RGB = {
  darkNavy: '28, 35, 49',
  navyBlue: '45, 136, 196',
  turquoise: '85, 168, 185',
  brightBlue: '52, 152, 219',
  white: '255, 255, 255',
} as const;

export const ICON_COLORS_RGB = {
  auction: '182, 138, 82',
  shipping: '210, 77, 62',
  details: '139, 157, 195',
} as const;

export const AUXILIARY_COLORS_RGB = {
  textDark: '51, 51, 51',
  borderLight: '209, 209, 209',
  link: '0, 122, 255',
} as const;

// ============================================================================
// GRADIENTS
// ============================================================================

export const GRADIENTS = {
  /** Navy to darker navy - for footer/dark sections */
  darkNavyGradient: `linear-gradient(180deg, ${BRAND_COLORS.darkNavy} 0%, #151A24 100%)`,

  /** Blue accent gradient - for buttons or highlights */
  blueGradient: `linear-gradient(135deg, ${BRAND_COLORS.navyBlue} 0%, ${BRAND_COLORS.brightBlue} 100%)`,

  /** Turquoise accent gradient - for decorative elements */
  turquoiseGradient: `linear-gradient(135deg, ${BRAND_COLORS.turquoise} 0%, ${BRAND_COLORS.brightBlue} 100%)`,
} as const;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type BrandColor = keyof typeof BRAND_COLORS;
export type IconColor = keyof typeof ICON_COLORS;
export type AuxiliaryColor = keyof typeof AUXILIARY_COLORS;
export type SemanticColor = keyof typeof SEMANTIC_COLORS;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Convert hex color to rgba with opacity
 */
export function hexToRgba(hex: string, opacity: number): string {
  const regex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
  const result = regex.exec(hex);
  if (!result) return hex;

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Get color with opacity
 */
export function withOpacity(color: string, opacity: number): string {
  return hexToRgba(color, opacity);
}

// ============================================================================
// ALL COLORS EXPORT (for convenience)
// ============================================================================

export const COLORS = {
  brand: BRAND_COLORS,
  icons: ICON_COLORS,
  auxiliary: AUXILIARY_COLORS,
  semantic: SEMANTIC_COLORS,
  gradients: GRADIENTS,
} as const;

export default COLORS;
