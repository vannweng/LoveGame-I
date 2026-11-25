import { Pressable, StyleSheet, Text } from 'react-native';

import { borderWidth, colors, fonts, radius, spacing, typography } from '@/shared/theme/tokens';

interface AppButtonProps {
  label: string;
  onPress: () => void;
  secondary?: boolean;
  size?: 'S' | 'M';
  disabled?: boolean;
  tone?: 'default' | 'danger';
}

export function AppButton({ label, onPress, secondary = false, disabled = false, size = 'M', tone = 'default' }: AppButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.button, size === 'S' && styles.smallButton, secondary && styles.secondaryButton, tone === 'danger' && (secondary ? styles.dangerSecondary : styles.dangerButton), disabled && styles.disabled, pressed && !disabled && styles.pressed]}
    >
      <Text style={[styles.label, size === 'S' && styles.smallLabel, secondary && styles.secondaryLabel, secondary && tone === 'danger' && styles.dangerLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { alignItems: 'center', backgroundColor: colors.accent, borderColor: colors.text, borderRadius: radius.xs, borderWidth, maxWidth: '100%', minHeight: 52, minWidth: 0, paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  smallButton: { minHeight: 48, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  secondaryButton: { backgroundColor: 'transparent', borderColor: colors.accent },
  label: { color: colors.ink, flexShrink: 1, fontFamily: fonts.body, fontSize: typography.body, fontWeight: '700', textAlign: 'center' },
  smallLabel: { fontFamily: fonts.number, fontSize: typography.tag },
  secondaryLabel: { color: colors.accent },
  dangerButton: { backgroundColor: colors.danger, borderColor: colors.danger },
  dangerSecondary: { borderColor: colors.danger },
  dangerLabel: { color: colors.danger },
  pressed: { opacity: 0.78 },
  disabled: { opacity: 0.45 },
});
