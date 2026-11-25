import { Platform } from 'react-native';

export const colors = {
  pageBg: '#101821',
  cardBg: '#15212C',
  subBoxBg: '#1A2B35',
  border: '#5A7883',
  text: '#EAF6F2',
  textMuted: '#AEC5C8',
  accent: '#58E4BB',
  gold: '#E5CA80',
  orange: '#F4B580',
  danger: '#FF8B95',
  pink: '#EAAFC0',
  safe: '#86D9B0',
  violet: '#B3C6D8',
  ink: '#101821',
} as const;

const systemMonospace = Platform.select({
  android: 'monospace',
  default: 'monospace',
  ios: 'Menlo',
});

export const fonts = {
  body: 'DotGothic16_400Regular',
  display: 'DotGothic16_400Regular',
  number: 'DotGothic16_400Regular',
  fallback: systemMonospace,
} as const;

export const fontScale = 1.15;
export const fs = (size: number): number => Math.round(size * fontScale);

export const typography = {
  hero: 28,
  sectionTitle: 20,
  cardTitle: 17,
  body: 16,
  caption: 14,
  tag: 13,
  micro: 12,
} as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radius = { none: 0, xs: 0, sm: 0, md: 0 } as const;
export const borderWidth = 2;
