import { Pressable, StyleSheet, Text } from 'react-native';

import { borderWidth, colors, fonts, radius, spacing, typography } from '@/shared/theme/tokens';

interface AppButtonProps {
  label: string;
  onPress: () => void;
  secondary?: boolean;
  size?: 'S' | 'M';
  disabled?: boolean;
}

export function AppButton({ label, onPress, secondary = false, disabled = false, size = 'M' }: AppButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[styles.button, size === 'S' && styles.smallButton, secondary && styles.secondaryButton, disabled && styles.disabled]}
    >
      <Text style={[styles.label, size === 'S' && styles.smallLabel, secondary && styles.secondaryLabel]}>{size === 'M' ? `[${label}]` : label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { alignItems: 'center', backgroundColor: colors.accent, borderColor: colors.accent, borderRadius: radius.xs, borderWidth, maxWidth: '100%', minHeight: 40, minWidth: 0, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  smallButton: { minHeight: 32, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  secondaryButton: { backgroundColor: 'transparent', borderColor: colors.accent },
  label: { color: colors.ink, flexShrink: 1, fontFamily: fonts.body, fontSize: typography.caption, fontWeight: '700', textAlign: 'center' },
  smallLabel: { fontFamily: fonts.number, fontSize: typography.tag },
  secondaryLabel: { color: colors.accent },
  disabled: { opacity: 0.45 },
});
