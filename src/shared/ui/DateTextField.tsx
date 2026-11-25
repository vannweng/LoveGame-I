import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, fonts, spacing, typography } from '@/shared/theme/tokens';
import { formatLocalDateInput } from '@/shared/utils/formatLocalDateInput';
import { isCalendarDate } from '@/shared/utils/calendarDate';
import { getCopy } from '@/content';

export interface DateFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function DateTextField({ label, value, onChange, disabled = false }: DateFieldProps) {
  const [blurred, setBlurred] = useState(false);
  const showError = blurred && Boolean(value) && !isCalendarDate(value.trim());
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput accessibilityLabel={label} editable={!disabled} value={value}
        inputMode="numeric" keyboardType="numeric" maxLength={10} placeholder="YYYY-MM-DD"
        placeholderTextColor={colors.textMuted} style={[styles.input, showError && styles.invalid]}
        onFocus={() => setBlurred(false)} onBlur={() => setBlurred(true)}
        onChangeText={(text) => onChange(formatLocalDateInput(text))} />
      {showError ? <Text accessibilityRole="alert" style={styles.error}>{getCopy('DATE_INPUT_INVALID')}</Text>
        : <Text style={styles.hint}>年－月－日，例如 2026-11-28</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: spacing.sm },
  label: { color: colors.text, fontFamily: fonts.body, fontSize: typography.body },
  input: { backgroundColor: colors.cardBg, borderColor: colors.border, borderWidth: 2,
    color: colors.text, fontFamily: fonts.body, fontSize: typography.body, minHeight: 48, padding: spacing.md },
  invalid: { borderColor: colors.danger },
  hint: { color: colors.textMuted, fontFamily: fonts.body, fontSize: typography.caption, lineHeight: 23 },
  error: { color: colors.danger, fontFamily: fonts.body, fontSize: typography.caption, lineHeight: 23 },
});
