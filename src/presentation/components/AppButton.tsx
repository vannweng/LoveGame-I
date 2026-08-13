import { Pressable, StyleSheet, Text } from 'react-native';

interface AppButtonProps {
  label: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
}

export function AppButton({ label, onPress, secondary = false, disabled = false }: AppButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[styles.button, secondary && styles.secondaryButton, disabled && styles.disabled]}
    >
      <Text style={[styles.label, secondary && styles.secondaryLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#F06A6A',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  secondaryButton: { backgroundColor: '#2B2D42' },
  label: { color: '#1A1025', fontSize: 16, fontWeight: '700' },
  secondaryLabel: { color: '#F7F2FA' },
  disabled: { opacity: 0.45 },
});
