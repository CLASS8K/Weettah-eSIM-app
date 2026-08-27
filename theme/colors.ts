// Sourced from takeflyt.app's brand tokens (:root CSS custom properties).
// Dark surfaces get the more vivid brand color (cyan); light surfaces get
// the higher-contrast anchor color (blue) — both are the two stops of the
// brand's own --gradient-cta.
export type ColorScheme = typeof darkColors;

export const darkColors = {
  bg: '#071A2B', // --color-midnight
  surface: '#0B2342', // elevated midnight (no direct brand token)
  surfaceLight: '#FFFFFF', // --color-white
  card: 'rgba(11, 35, 66, 0.6)', // surface, translucent
  primary: '#19D3F3', // --color-cyan
  primaryDark: '#2563EB', // --color-blue
  accent: '#2563EB', // --color-blue
  onPrimary: '#0B1220', // text drawn on top of `primary`
  text: '#FFFFFF', // --color-white
  textMuted: '#64748B', // --color-slate
  textDark: '#0B1220', // --color-ink; text on bright neutral surfaces (e.g. the QR box)
  border: 'rgba(255, 255, 255, 0.12)',
  danger: '#DC2626', // --color-error
  warning: '#F59E0B', // --color-warning
  success: '#16A34A', // --color-success
};

export const lightColors = {
  bg: '#F7F9FC', // --color-cloud
  surface: '#FFFFFF', // --color-white
  surfaceLight: '#FFFFFF', // --color-white
  card: 'rgba(255, 255, 255, 0.7)',
  primary: '#2563EB', // --color-blue
  primaryDark: '#1C4DB1',
  accent: '#19D3F3', // --color-cyan
  onPrimary: '#FFFFFF',
  text: '#0B1220', // --color-ink
  textMuted: '#64748B', // --color-slate
  textDark: '#0B1220', // --color-ink
  border: 'rgba(11, 18, 32, 0.12)',
  danger: '#DC2626',
  warning: '#F59E0B',
  success: '#16A34A',
};

// Default export for non-component contexts. Components should use
// useTheme() from ThemeContext instead so they react to theme changes.
export const colors = darkColors;

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};
