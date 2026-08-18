import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { getCopy } from '@/content';
import type { RelationshipProfile } from '@/features/relationship/domain';
import { PixelCard } from '@/shared/ui/PixelCard';
import { PixelTag } from '@/shared/ui/PixelTag';
import { PageLayout } from '@/shared/ui/PageLayout';
import { colors, fonts, spacing, typography } from '@/shared/theme/tokens';

export type RelationshipEditor = 'basic' | 'dates' | 'preferences';

interface RelationshipProfileViewProps {
  profile: RelationshipProfile | null;
  userName: string;
  onOpenEditor: (editor: RelationshipEditor) => void;
}

export function RelationshipProfileView({ profile, userName, onOpenEditor }: RelationshipProfileViewProps) {
  const partnerName = profile?.partnerNickname || getCopy('RELATIONSHIP_DEFAULT_P2');
  const anniversaryLabel = profile?.relationshipStatus === 'married' ? getCopy('RELATIONSHIP_MARRIED_DATE') : getCopy('RELATIONSHIP_DATING_DATE');
  const anniversaryDate = profile?.relationshipStatus === 'married' ? profile?.marriageDate : profile?.relationshipStartDate;
  const dates = getImportantDates(profile);
  const preferences = getPreferenceItems(profile);
  return (
    <PageLayout>
      <QuickReadCard accentColor={colors.pink} editor="basic" onPress={onOpenEditor} subtitle={getCopy('RELATIONSHIP_QUICK_BASIC_SUBTITLE')} title={getCopy('RELATIONSHIP_QUICK_BASIC')}>
        <Text style={styles.primary}>{userName} ♥ {partnerName}</Text>
        <Text style={styles.detail}>{anniversaryLabel} · {anniversaryDate || getCopy('RELATIONSHIP_NO_RELATIONSHIP_DATE')}</Text>
        <Text numberOfLines={1} style={styles.muted}>{profile?.relationshipStatus === 'married' ? `${getCopy('RELATIONSHIP_DATING_DATE')} · ${profile.relationshipStartDate}` : profile?.relationshipMotto || getCopy('RELATIONSHIP_MOTTO_PLACEHOLDER')}</Text>
      </QuickReadCard>
      <QuickReadCard accentColor={colors.gold} editor="dates" onPress={onOpenEditor} subtitle={getCopy('RELATIONSHIP_QUICK_DATES_SUBTITLE')} title={getCopy('RELATIONSHIP_QUICK_DATES')}>
        {dates.length ? <View style={styles.tags}>{dates.map((date) => <PixelTag color={colors.gold} key={`${date.label}-${date.date}`} label={`${date.label} · ${date.date}`} size="S" />)}</View> : <Text style={styles.muted}>{getCopy('RELATIONSHIP_NO_CUSTOM_DATES')}</Text>}
      </QuickReadCard>
      <QuickReadCard accentColor={colors.danger} editor="preferences" onPress={onOpenEditor} subtitle={getCopy('RELATIONSHIP_QUICK_PREFERENCES_SUBTITLE')} title={getCopy('RELATIONSHIP_QUICK_PREFERENCES')}>
        <Text style={styles.primary}>{profile?.preferences?.style === 'practical' ? getCopy('RELATIONSHIP_STYLE_PRACTICAL') : getCopy('RELATIONSHIP_STYLE_ROMANTIC')}</Text>
        {preferences.length ? <View style={styles.tags}>{preferences.map((item) => <PixelTag color={item.danger ? colors.danger : colors.accent} key={item.label} label={item.label} size="S" />)}</View> : <Text style={styles.muted}>{getCopy('RELATIONSHIP_NO_PREFERENCES')}</Text>}
      </QuickReadCard>
    </PageLayout>
  );
}

function QuickReadCard({ accentColor, children, editor, onPress, subtitle, title }: {
  accentColor: string;
  children: ReactNode;
  editor: RelationshipEditor;
  onPress: (editor: RelationshipEditor) => void;
  subtitle: string;
  title: string;
}) {
  return <Pressable accessibilityRole="button" onPress={() => onPress(editor)}><PixelCard accentColor={accentColor} subtitle={subtitle} title={title} trailing={<Text style={[styles.open, { color: accentColor }]}>{getCopy('RELATIONSHIP_OPEN_EDITOR')} →</Text>}><View style={styles.cardContent}>{children}</View></PixelCard></Pressable>;
}

function getImportantDates(profile: RelationshipProfile | null): { label: string; date: string }[] {
  const birthday = profile?.birthday ? [{ label: getCopy('RELATIONSHIP_BIRTHDAY'), date: profile.birthday }] : [];
  return [...birthday, ...(profile?.customImportantDates ?? []).map((date) => ({
    label: `${date.title} · ${getCopy(date.importance === 'normal' ? 'RELATIONSHIP_DATE_NORMAL' : 'RELATIONSHIP_DATE_SURVIVAL')}`,
    date: date.date,
  }))];
}

function getPreferenceItems(profile: RelationshipProfile | null): { label: string; danger: boolean }[] {
  const preferences = profile?.preferences;
  return [
    ...(preferences?.preferenceTags ?? []).map((label) => ({ label, danger: false })),
    ...(preferences?.dietaryPreferences ?? []).map((label) => ({ label, danger: false })),
    ...(preferences?.landmines ?? []).map((label) => ({ label, danger: true })),
  ];
}

const styles = StyleSheet.create({
  open: { fontFamily: fonts.number, fontSize: typography.micro },
  cardContent: { gap: spacing.xs },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  primary: { color: colors.text, fontFamily: fonts.body, fontSize: typography.cardTitle, fontWeight: '700' },
  detail: { color: colors.gold, fontFamily: fonts.number, fontSize: typography.caption },
  muted: { color: colors.textMuted, fontFamily: fonts.body, fontSize: typography.caption },
});
