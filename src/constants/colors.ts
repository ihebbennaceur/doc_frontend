/**
 * Color Theme Configuration
 * Centralized color palette for consistent design across the platform
 */

export const COLORS = {
  // Primary Brand Colors (Modern Indigo/Purple)
  primary: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6', // Main primary (Vibrant Purple)
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
  },

  // Secondary Colors (Teal/Cyan)
  secondary: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6', // Main secondary
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
  },

  // Accent Colors (Rose/Pink)
  accent: {
    50: '#fff7ed',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#f43f5e', // Main accent
    600: '#e11d48',
    700: '#be123c',
    800: '#9d174d',
    900: '#831843',
  },

  // Success Colors (Emerald/Green)
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#10b981', // Main success
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },

  // Warning Colors (Amber/Orange)
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b', // Main warning
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  // Error/Danger Colors (Red)
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444', // Main error
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  // Neutral Colors (Grayscale)
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280', // Main neutral
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Dark mode support
  dark: {
    bg: '#0f1419',
    surface: '#1a1f2e',
    border: '#2a3142',
  },
};

export const THEME = {
  // Light mode (default)
  light: {
    bg: '#ffffff',
    surface: '#f9fafb',
    text: COLORS.neutral[900],
    textSecondary: COLORS.neutral[600],
    border: COLORS.neutral[200],
    divider: COLORS.neutral[100],
  },

  // Dark mode
  dark: {
    bg: COLORS.dark.bg,
    surface: COLORS.dark.surface,
    text: '#ffffff',
    textSecondary: COLORS.neutral[400],
    border: COLORS.dark.border,
    divider: '#252d3d',
  },
};

// Semantic color names for UI states
export const SEMANTIC_COLORS = {
  primary: COLORS.primary[500],
  secondary: COLORS.secondary[500],
  accent: COLORS.accent[500],
  success: COLORS.success[500],
  warning: COLORS.warning[500],
  error: COLORS.error[500],
  info: COLORS.primary[500],
};

// Tailwind color utilities
export const getTailwindColor = (colorName: keyof typeof COLORS, shade: string) => {
  const color = COLORS[colorName as keyof typeof COLORS];
  if (typeof color === 'object') {
    return (color as any)[shade] || '#000000';
  }
  return color;
};
