import { Platform } from 'react-native';

export const colors = {
  pageBg: '#0D0E15',
  cardBg: '#0D0E15',
  subBoxBg: '#161726',
  border: '#363753',
  text: '#F5F2EB',
  textMuted: '#9D9BB5',
  accent: '#00E5FF',
  gold: '#FFD700',
  orange: '#FF6D00',
  danger: '#FF1744',
  pink: '#FF4081',
  safe: '#00E676',
  violet: '#B388FF',
  ink: '#0D0E15',
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
  hero: 22,
  sectionTitle: fs(14),
  cardTitle: fs(12),
  body: fs(12),
  caption: fs(10),
  tag: fs(10),
  micro: fs(10),
} as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 } as const;
export const radius = { none: 0, xs: 2, sm: 4, md: 8 } as const;
export const borderWidth = 2;
