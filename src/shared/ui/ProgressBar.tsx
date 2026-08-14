import { StyleSheet, Text, View } from 'react-native';

import { borderWidth, colors, fonts, radius, spacing, typography } from '@/shared/theme/tokens';

export type ProgressVariant = 'combo' | 'danger' | 'exp' | 'hp';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  variant?: ProgressVariant;
  showValue?: boolean;
}

const variantColors: Record<ProgressVariant, string> = {
  combo: colors.orange,
  danger: colors.danger,
  exp: colors.accent,
  hp: colors.safe,
};

export function ProgressBar({ label, max, showValue = true, value, variant = 'exp' }: ProgressBarProps) {
  const safeMax = Math.max(max, 1);
  const safeValue = Math.min(Math.max(value, 0), safeMax);
  const percentage = Math.round((safeValue / safeMax) * 100);
  const color = variantColors[variant];
  const valueLabel = `${safeValue}/${safeMax}`;
  return (
    <View accessibilityLabel={`${label ?? variant} ${valueLabel}`} accessibilityRole="progressbar" accessibilityValue={{ max: safeMax, min: 0, now: safeValue }} style={styles.frame}>
      {label || showValue ? <View style={styles.header}>{label ? <Text style={styles.label}>{label}</Text> : <View />}{showValue ? <Text style={[styles.value, { color }]}>{valueLabel}</Text> : null}</View> : null}
      <View style={styles.track}><View style={[styles.fill, { backgroundColor: color, width: `${percentage}%` }]} /></View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { gap: spacing.xs },
  header: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { color: colors.text, fontFamily: fonts.number, fontSize: typography.micro },
  value: { fontFamily: fonts.number, fontSize: typography.micro },
  track: { backgroundColor: colors.subBoxBg, borderColor: colors.border, borderRadius: radius.xs, borderWidth, height: spacing.md, overflow: 'hidden' },
  fill: { height: '100%' },
});
