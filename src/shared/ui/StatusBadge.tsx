import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius, spacing, typography } from '@/shared/theme/tokens';

export type StatusVariant = 'active' | 'success' | 'late' | 'fail' | 'danger' | 'gg';

interface StatusBadgeProps {
  label: string;
  variant: StatusVariant;
  accessibilityLabel?: string;
}

const variantColors: Record<StatusVariant, string> = {
  active: colors.accent,
  success: colors.safe,
  late: colors.orange,
  fail: colors.danger,
  danger: colors.danger,
  gg: colors.violet,
};

export function StatusBadge({ accessibilityLabel, label, variant }: StatusBadgeProps) {
  const color = variantColors[variant];
  return (
    <View accessibilityLabel={accessibilityLabel ?? label} accessibilityRole="text" style={[styles.badge, { borderColor: color }]}>
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignSelf: 'flex-start', backgroundColor: 'transparent', borderRadius: radius.xs, borderWidth: 1, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  label: { fontFamily: fonts.number, fontSize: typography.tag, letterSpacing: 0.5 },
});
