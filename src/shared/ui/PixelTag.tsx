import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius, spacing, typography } from '@/shared/theme/tokens';

interface PixelTagProps {
  color?: string;
  label: string;
  size?: 'S' | 'M';
}

export function PixelTag({ color = colors.accent, label, size = 'S' }: PixelTagProps) {
  return <View style={[styles.tag, { borderColor: color }, size === 'M' && styles.medium]}><Text style={[styles.label, { color }, size === 'M' && styles.mediumLabel]}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  tag: { alignSelf: 'flex-start', borderRadius: radius.xs, borderWidth: 1, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  label: { fontFamily: fonts.number, fontSize: typography.micro, letterSpacing: 0.5 },
  medium: { paddingHorizontal: 10, paddingVertical: 6 },
  mediumLabel: { fontSize: typography.tag },
});
