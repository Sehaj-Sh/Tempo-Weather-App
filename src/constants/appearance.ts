import { colors } from '@/constants/theme';

export type AppearanceMode = 'light' | 'dark' | 'custom';

export const DEFAULT_CUSTOM_COLOR = '#7C6CF0';

export const backgroundPalettes = {
  light: ['#A9C9F8', '#B7A6F0', '#9B86E0'] as const,
  dark: ['#1B1F3B', '#2A2150', '#1A1433'] as const,
};

export const customColorOptions = [
  '#7C6CF0', // purple
  '#5B8DEF', // blue
  '#4DB6AC', // teal
  '#66BB6A', // green
  '#FFB74D', // amber
  '#F06292', // pink
  '#EF5350', // red
  '#42A5F5', // sky
  '#AB47BC', // violet
  '#26C6DA', // cyan
  '#8D6E63', // brown
  '#78909C', // blue grey
] as const;

function clamp(n: number) {
  return Math.max(0, Math.min(255, Math.round(n)));
}

function hexToRgb(hex: string) {
  const normalized = hex.replace('#', '');
  const full =
    normalized.length === 3
      ? normalized
          .split('')
          .map((c) => c + c)
          .join('')
      : normalized;
  const int = parseInt(full, 16);
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((v) => clamp(v).toString(16).padStart(2, '0'))
    .join('')}`;
}

/** Lighten (positive) or darken (negative) a hex color. */
export function shadeHex(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(r + amount, g + amount, b + amount);
}

export function getGradientColors(mode: AppearanceMode, customColor: string) {
  if (mode === 'light') return [...backgroundPalettes.light] as [string, string, string];
  if (mode === 'dark') return [...backgroundPalettes.dark] as [string, string, string];
  return [shadeHex(customColor, 36), customColor, shadeHex(customColor, -42)] as [
    string,
    string,
    string,
  ];
}

export function isDarkAppearance(mode: AppearanceMode, customColor: string) {
  if (mode === 'dark') return true;
  if (mode === 'light') return false;
  const { r, g, b } = hexToRgb(customColor);
  // Perceived luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.55;
}

export function getHeroTextColor(isDark: boolean) {
  return isDark ? colors.white : colors.text;
}

export function getHeroMutedColor(isDark: boolean) {
  return isDark ? 'rgba(255,255,255,0.72)' : colors.textMuted;
}
