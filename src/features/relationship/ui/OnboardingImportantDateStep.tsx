import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { getCopy } from '@/content';
import { createCustomImportantDate, withRelationshipProfileDefaults, type RelationshipMode,
  type RelationshipProfile } from '@/features/relationship/domain';
import { AppButton, PageLayout, PixelCard } from '@/shared/ui';
import { DateField } from '@/shared/ui/DateField';
import { borderWidth, colors, fonts, spacing, typography } from '@/shared/theme/tokens';
import { isCalendarDate } from '@/shared/utils/calendarDate';

type DateKind = 'birthday' | 'custom';

export function OnboardingImportantDateStep({ mode, profile, onBack, onSave, busy = false }: {
  mode: RelationshipMode; profile: RelationshipProfile | null; onBack: () => void;
  onSave: (profile: RelationshipProfile) => void; busy?: boolean;
}) {
  const hasTarget = Boolean(profile?.partnerNickname);
  const [kind, setKind] = useState<DateKind>(mode === 'partnered' || hasTarget ? 'birthday' : 'custom');
  const [title, setTitle] = useState(mode === 'single' && !hasTarget ? getCopy('ONBOARDING_SINGLE_DATE_DEFAULT_TITLE') : '');
  const [date, setDate] = useState(profile?.birthday ?? '');
  const [titleBlurred, setTitleBlurred] = useState(false);
  const isBirthday = kind === 'birthday';
  const canSave = isCalendarDate(date.trim()) && Boolean(isBirthday || title.trim());
  const save = () => {
    if (!canSave || busy) return;
    const base = withRelationshipProfileDefaults(profile);
    const next = isBirthday ? { ...base, birthday: date.trim() }
      : { ...base, customImportantDates: [...base.customImportantDates,
        createCustomImportantDate(title.trim(), date.trim(), 'survival')] };
    onSave(next);
  };
  const tutorialCopy = mode === 'partnered' ? getCopy('ONBOARDING_TUTORIAL_PARTNER_COPY')
    : hasTarget ? getCopy('ONBOARDING_TUTORIAL_CRUSH_COPY', { name: profile?.partnerNickname ?? '' })
      : getCopy('ONBOARDING_TUTORIAL_SINGLE_COPY');

  return (
    <PageLayout>
      <View style={styles.content}>
        <PixelCard accentColor={colors.accent} title={getCopy('ONBOARDING_TUTORIAL_TITLE')}>
          <Text style={styles.copy}>{tutorialCopy}</Text>
        </PixelCard>
        {mode === 'partnered' || hasTarget ? (
          <View accessibilityRole="radiogroup" style={styles.options}>
            <Option active={isBirthday} disabled={busy} label={getCopy('ONBOARDING_DATE_BIRTHDAY')}
              onPress={() => setKind('birthday')} />
            <Option active={!isBirthday} disabled={busy} label={getCopy('ONBOARDING_DATE_ANNIVERSARY')}
              onPress={() => setKind('custom')} />
          </View>
        ) : null}
        {!isBirthday ? (
          <View style={styles.field}>
            <Text style={styles.label}>{getCopy('ONBOARDING_DATE_TITLE_PLACEHOLDER')}</Text>
            <TextInput accessibilityLabel={getCopy('ONBOARDING_DATE_TITLE_PLACEHOLDER')}
              editable={!busy} maxLength={24} onChangeText={setTitle} onBlur={() => setTitleBlurred(true)}
              placeholder="例如：第一次約會" placeholderTextColor={colors.textMuted}
              style={styles.input} value={title} />
            {titleBlurred && !title.trim() ? <Text accessibilityRole="alert" style={styles.error}>請填重要日名稱。</Text> : null}
          </View>
        ) : null}
        <DateField label={getCopy('ONBOARDING_DATE_LABEL')} value={date} onChange={setDate} disabled={busy} />
      </View>
      <AppButton disabled={!canSave || busy}
        label={busy ? getCopy('ONBOARDING_DATE_SAVING') : getCopy('ONBOARDING_TUTORIAL_ACTION')} onPress={save} />
      <AppButton disabled={busy} label={getCopy('ONBOARDING_BACK')} onPress={onBack} secondary />
    </PageLayout>
  );
}

function Option({ active, disabled, label, onPress }: {
  active: boolean; disabled: boolean; label: string; onPress: () => void;
}) {
  return (
    <Pressable accessibilityRole="radio" accessibilityState={{ checked: active, disabled }}
      disabled={disabled} onPress={onPress} style={[styles.option, active && styles.active]}>
      <Text style={[styles.optionText, active && styles.activeText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  active: { backgroundColor: colors.accent, borderColor: colors.accent },
  activeText: { color: colors.ink },
  content: { flex: 1, gap: spacing.xl, justifyContent: 'center' },
  copy: { color: colors.textMuted, fontFamily: fonts.body, fontSize: typography.body, lineHeight: 24 },
  field: { gap: spacing.sm },
  label: { color: colors.text, fontFamily: fonts.body, fontSize: typography.body },
  input: { backgroundColor: colors.cardBg, borderColor: colors.border, borderWidth,
    color: colors.text, fontFamily: fonts.body, fontSize: typography.body, minHeight: 48, padding: spacing.md },
  error: { color: colors.danger, fontFamily: fonts.body, fontSize: typography.caption, lineHeight: 23 },
  option: { alignItems: 'center', borderColor: colors.border, borderWidth, flex: 1,
    minHeight: 48, justifyContent: 'center', padding: spacing.sm },
  optionText: { color: colors.text, fontFamily: fonts.body, fontSize: typography.caption },
  options: { flexDirection: 'row', gap: spacing.sm },
});
