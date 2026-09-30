import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { getCopy } from '@/content';
import type { CrushCandidate } from '@/features/relationship/domain';
import { AppButton, PageLayout, PixelCard } from '@/shared/ui';
import { borderWidth, colors, fonts, radius, spacing, typography } from '@/shared/theme/tokens';

const slots: CrushCandidate['id'][] = ['crush-a', 'crush-b', 'crush-c'];

export function OnboardingCrushStep({ candidates, activeId, onBack, onSave }: {
  candidates: CrushCandidate[]; activeId: CrushCandidate['id'] | null; onBack: () => void;
  onSave: (candidates: CrushCandidate[], activeId: CrushCandidate['id']) => void;
}) {
  const [drafts, setDrafts] = useState(() => slots.map((id) => candidates.find((item) => item.id === id) ?? { id, nickname: '' }));
  const [selected, setSelected] = useState<CrushCandidate['id'] | null>(activeId);
  const saved = drafts.filter((item) => item.nickname.trim()).map((item) => ({ ...item, nickname: item.nickname.trim() }));
  const canContinue = Boolean(selected && saved.some((item) => item.id === selected));
  const update = (id: CrushCandidate['id'], change: Partial<CrushCandidate>) => setDrafts((items) => items.map((item) => item.id === id ? { ...item, ...change } : item));
  return <PageLayout><Text style={styles.eyebrow}>{getCopy('ONBOARDING_SINGLE_TAG')}</Text><PixelCard accentColor={colors.pink} title={getCopy('ONBOARDING_CRUSH_TITLE')} subtitle={getCopy('ONBOARDING_CRUSH_SUBTITLE')}><Text style={styles.copy}>{getCopy('ONBOARDING_CRUSH_COPY')}</Text></PixelCard>
    {drafts.map((candidate, index) => <View key={candidate.id} style={[styles.card, selected === candidate.id && styles.selected]}><Text style={styles.label}>{getCopy('ONBOARDING_CRUSH_SLOT', { slot: String.fromCharCode(65 + index) })}</Text><TextInput maxLength={24} onChangeText={(nickname) => update(candidate.id, { nickname })} placeholder={getCopy(`ONBOARDING_CRUSH_NAME_PLACEHOLDER_${String.fromCharCode(65 + index)}`)} placeholderTextColor={colors.textMuted} style={styles.input} value={candidate.nickname} /><AppButton disabled={!candidate.nickname.trim()} label={selected === candidate.id ? getCopy('ONBOARDING_CRUSH_SELECTED') : getCopy('ONBOARDING_CRUSH_SELECT')} onPress={() => setSelected(candidate.id)} secondary={selected !== candidate.id} size="S" /></View>)}
    <AppButton disabled={!canContinue} label={getCopy('ONBOARDING_CRUSH_CONTINUE')} onPress={() => { if (selected) onSave(saved, selected); }} /><AppButton label={getCopy('ONBOARDING_BACK')} onPress={onBack} secondary />
  </PageLayout>;
}

const styles = StyleSheet.create({
  card: { borderColor: colors.border, borderRadius: radius.sm, borderWidth, gap: spacing.sm, padding: spacing.md },
  copy: { color: colors.textMuted, fontFamily: fonts.body, fontSize: typography.body, lineHeight: 24 },
  eyebrow: { color: colors.pink, fontFamily: fonts.number, fontSize: typography.micro, letterSpacing: 1 },
  input: { borderColor: colors.border, borderRadius: radius.xs, borderWidth: 1, color: colors.text, fontFamily: fonts.body, fontSize: typography.caption, minHeight: 44, padding: spacing.sm },
  label: { color: colors.text, fontFamily: fonts.body, fontSize: typography.cardTitle, fontWeight: '700' },
  selected: { borderColor: colors.pink },
});
