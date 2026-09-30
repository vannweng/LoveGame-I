import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { getCopy } from '@/content';
import { createCustomImportantDate, withRelationshipProfileDefaults, type RelationshipMode, type RelationshipProfile } from '@/features/relationship/domain';
import { AppButton, PageLayout, PixelCard } from '@/shared/ui';
import { borderWidth, colors, fonts, radius, spacing, typography } from '@/shared/theme/tokens';
import { formatLocalDateInput } from '@/shared/utils/formatLocalDateInput';

type DateKind = 'birthday' | 'custom';

export function OnboardingImportantDateStep({ mode, profile, onBack, onSave }: { mode: RelationshipMode; profile: RelationshipProfile | null; onBack: () => void; onSave: (profile: RelationshipProfile) => void }) {
  const hasTarget = Boolean(profile?.partnerNickname);
  const [kind, setKind] = useState<DateKind>(mode === 'partnered' || hasTarget ? 'birthday' : 'custom');
  const [title, setTitle] = useState(mode === 'single' && !hasTarget ? getCopy('ONBOARDING_SINGLE_DATE_DEFAULT_TITLE') : '');
  const [date, setDate] = useState(profile?.birthday ?? '');
  const isBirthday = kind === 'birthday';
  const canSave = Boolean(date.trim() && (isBirthday || title.trim()));
  const save = () => {
    const base = withRelationshipProfileDefaults(profile);
    const next = isBirthday ? { ...base, birthday: date.trim() } : { ...base, customImportantDates: [...base.customImportantDates, createCustomImportantDate(title.trim(), date.trim(), 'survival')] };
    onSave(next);
  };
  const tutorialCopy = mode === 'partnered' ? getCopy('ONBOARDING_TUTORIAL_PARTNER_COPY') : hasTarget ? getCopy('ONBOARDING_TUTORIAL_CRUSH_COPY', { name: profile?.partnerNickname ?? '' }) : getCopy('ONBOARDING_TUTORIAL_SINGLE_COPY');
  return <PageLayout><View style={styles.content}><Text style={styles.eyebrow}>{getCopy('ONBOARDING_NEW_PLAYER')}</Text><PixelCard accentColor={colors.accent} subtitle={getCopy('ONBOARDING_TUTORIAL_SUBTITLE')} title={getCopy('ONBOARDING_TUTORIAL_TITLE')}><Text style={styles.copy}>{tutorialCopy}</Text></PixelCard>
    {mode === 'partnered' || hasTarget ? <View style={styles.options}><Option active={isBirthday} label={getCopy('ONBOARDING_DATE_BIRTHDAY')} onPress={() => setKind('birthday')} /><Option active={!isBirthday} label={getCopy('ONBOARDING_DATE_ANNIVERSARY')} onPress={() => setKind('custom')} /></View> : null}
    {!isBirthday ? <TextInput maxLength={24} onChangeText={setTitle} placeholder={getCopy('ONBOARDING_DATE_TITLE_PLACEHOLDER')} placeholderTextColor={colors.textMuted} style={styles.input} value={title} /> : null}
    <TextInput inputMode="numeric" keyboardType="numeric" maxLength={10} onChangeText={(value) => setDate(formatLocalDateInput(value))} placeholder={getCopy('ONBOARDING_DATE_PLACEHOLDER')} placeholderTextColor={colors.textMuted} style={styles.input} value={date} />
  </View><AppButton disabled={!canSave} label={getCopy('ONBOARDING_TUTORIAL_ACTION')} onPress={save} /><AppButton label={getCopy('ONBOARDING_BACK')} onPress={onBack} secondary /></PageLayout>;
}

function Option({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={[styles.option, active && styles.active]}><Text style={[styles.optionText, active && styles.activeText]}>{label}</Text></Pressable>;
}

const styles = StyleSheet.create({
  active: { backgroundColor: colors.accent, borderColor: colors.accent },
  activeText: { color: colors.ink },
  content: { flex: 1, gap: spacing.md, justifyContent: 'center' },
  copy: { color: colors.textMuted, fontFamily: fonts.body, fontSize: typography.body, lineHeight: 24 },
  eyebrow: { color: colors.accent, fontFamily: fonts.number, fontSize: typography.micro, letterSpacing: 1 },
  input: { backgroundColor: colors.cardBg, borderColor: colors.border, borderRadius: radius.xs, borderWidth, color: colors.text, fontFamily: fonts.body, fontSize: typography.caption, padding: spacing.md },
  option: { alignItems: 'center', borderColor: colors.border, borderRadius: radius.xs, borderWidth, flex: 1, minHeight: 44, justifyContent: 'center', padding: spacing.sm },
  optionText: { color: colors.text, fontFamily: fonts.body, fontSize: typography.caption },
  options: { flexDirection: 'row', gap: spacing.sm },
});
