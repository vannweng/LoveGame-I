import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import type { CompletedRun } from '@/game/run';
import { getCopy } from '@/content';
import { AppButton } from '@/shared/ui/AppButton';
import { PageLayout } from '@/shared/ui/PageLayout';
import { PixelCard } from '@/shared/ui/PixelCard';
import { colors, fonts, radius, spacing, typography } from '@/shared/theme/tokens';

interface RebirthViewProps {
  latestRun: CompletedRun | null;
  previousOath: string | null;
  onRebirth: (oath: string) => void;
}

export function RebirthView({ latestRun, previousOath, onRebirth }: RebirthViewProps) {
  const [oath, setOath] = useState('');
  const canRebirth = oath.trim().length > 0;
  return <PageLayout>
    <Text style={styles.eyebrow}>{getCopy('REBIRTH_EYEBROW')}</Text>
    <PixelCard accentColor={colors.danger} subtitle="GG" title={getCopy('REBIRTH_TITLE')}>
      <Text style={styles.copy}>{getCopy('REBIRTH_COPY')}</Text>
    </PixelCard>
    {latestRun ? <PixelCard accentColor={colors.textMuted} subtitle={getCopy('REBIRTH_HISTORY_TITLE')} title={getCopy('COLLECTION_GG_RECORD')}>
      <Text style={styles.copy}>{getCopy('REBIRTH_HISTORY_COPY', { cause: getCopy(latestRun.deathCause), rank: latestRun.highestRank })}</Text>
    </PixelCard> : null}
    {previousOath ? <PixelCard accentColor={colors.orange} subtitle="OATH LOG" title={getCopy('REBIRTH_PREVIOUS_OATH_TITLE')}><Text style={styles.copy}>{getCopy('REBIRTH_PREVIOUS_OATH_COPY', { oath: previousOath })}</Text></PixelCard> : null}
    <View style={styles.field}><Text style={styles.label}>{getCopy('REBIRTH_OATH_LABEL')}</Text><TextInput multiline onChangeText={setOath} placeholder={getCopy('REBIRTH_OATH_PLACEHOLDER')} placeholderTextColor={colors.textMuted} style={styles.input} value={oath} /></View>
    <Text style={styles.effect}>{getCopy('REBIRTH_EFFECT')}</Text>
    <View style={styles.fill} />
    <AppButton disabled={!canRebirth} label={getCopy('REBIRTH_CONFIRM')} onPress={() => onRebirth(oath.trim())} />
  </PageLayout>;
}

const styles = StyleSheet.create({
  eyebrow: { color: colors.danger, fontFamily: fonts.number, fontSize: typography.micro, letterSpacing: 1 },
  copy: { color: colors.textMuted, fontFamily: fonts.body, fontSize: typography.body, lineHeight: 24 },
  field: { gap: spacing.xs }, label: { color: colors.text, fontFamily: fonts.body, fontSize: typography.cardTitle, fontWeight: '700' },
  input: { borderColor: colors.border, borderRadius: radius.xs, borderWidth: 1, color: colors.text, fontFamily: fonts.body, fontSize: typography.body, minHeight: 96, padding: spacing.sm, textAlignVertical: 'top' },
  effect: { color: colors.gold, fontFamily: fonts.body, fontSize: typography.caption, lineHeight: 20 }, fill: { flex: 1 },
});
