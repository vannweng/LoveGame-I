import { StyleSheet, Text, View } from 'react-native';

import type { GameState } from '@/features/missions/domain';
import type { AnnualDateCountdown } from '@/features/relationship/domain';
import { getCopy } from '@/content';
import { AppButton } from '@/shared/ui/AppButton';
import { PixelCard } from '@/shared/ui/PixelCard';
import { PixelTag } from '@/shared/ui/PixelTag';
import { PageLayout } from '@/shared/ui/PageLayout';
import { borderWidth, colors, fonts, spacing, typography } from '@/shared/theme/tokens';

interface HomeViewProps {
  gameState: GameState;
  importantDate: AnnualDateCountdown | null;
  importantDateLabel: string;
  onOpenMissions: () => void;
  p1Name: string;
  p2Name: string;
  relationshipDays: number;
}

export function HomeView({
  gameState,
  importantDate,
  importantDateLabel,
  onOpenMissions,
  p1Name,
  p2Name,
  relationshipDays,
}: HomeViewProps) {
  return (
    <PageLayout>
      <View style={styles.playerBoard}><PixelTag color={colors.accent} label={getCopy('HOME_PLAYER_LABEL')} size="M" /><Text style={styles.playerName}>{p1Name}</Text><Text style={styles.heart}>♥</Text><Text style={styles.playerName}>{p2Name}</Text><Text style={styles.stage}>{getCopy('HOME_STAGE_LABEL')} <Text style={styles.stageValue}>{padStage(relationshipDays)}</Text></Text></View>
      <View style={styles.divider} />
      <PixelCard accentColor={colors.accent} title={importantDateLabel} subtitle={getCopy('HOME_COUNTDOWN_SUBTITLE')} trailing={<Text style={styles.remain}>{getCopy('HOME_REMAIN_LABEL')} <Text style={styles.remainValue}>{padCountdown(importantDate?.daysRemaining ?? 0)}</Text></Text>}>
        <View style={styles.advice}><Text style={styles.adviceTitle}>{getCopy('HOME_ADVICE_LABEL')}</Text><Text style={styles.detail}>{importantDate ? getCopy('HOME_IMPORTANT_DATE_ADVICE', { label: importantDateLabel, days: importantDate.daysRemaining }) : getCopy('HOME_NO_IMPORTANT_DATE')}</Text></View>
      </PixelCard>
      <View style={styles.stats}><Stat label={getCopy('HOME_EXP_LABEL')} value={gameState.exp} /><Stat label={getCopy('HOME_COMBO_LABEL')} value={gameState.combo} /><Stat label={getCopy('HOME_RANK_LABEL')} value={gameState.rankScore} /></View>
      <View style={styles.fill} />
      <AppButton label={getCopy('HOME_OPEN_MISSIONS')} onPress={onOpenMissions} />
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  playerBoard: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  playerName: { color: colors.text, fontFamily: fonts.number, fontSize: typography.hero },
  heart: { color: colors.pink, fontFamily: fonts.body, fontSize: typography.sectionTitle },
  stage: { color: colors.orange, fontFamily: fonts.number, fontSize: typography.caption, marginLeft: 'auto' },
  stageValue: { color: colors.gold, fontSize: typography.hero },
  divider: { backgroundColor: colors.border, borderStyle: 'dashed', borderWidth: 1 },
  remain: { color: colors.textMuted, fontFamily: fonts.number, fontSize: typography.caption },
  remainValue: { color: colors.pink, fontSize: typography.hero },
  advice: { borderColor: colors.accent, borderRadius: 0, borderWidth: borderWidth, gap: spacing.xs, padding: spacing.md },
  adviceTitle: { color: colors.accent, fontFamily: fonts.number, fontSize: typography.caption },
  detail: { color: colors.text, fontFamily: fonts.body, fontSize: typography.body, lineHeight: 24 },
  stats: { flexDirection: 'row', gap: spacing.sm },
  stat: { backgroundColor: colors.subBoxBg, flex: 1, gap: spacing.xs, padding: spacing.sm },
  statLabel: { color: colors.textMuted, fontFamily: fonts.number, fontSize: typography.micro },
  statValue: { color: colors.gold, fontFamily: fonts.number, fontSize: typography.body },
  fill: { flex: 1 },
});

function Stat({ label, value }: { label: string; value: number }) {
  return <View style={styles.stat}><Text style={styles.statLabel}>{label}</Text><Text style={styles.statValue}>{value}</Text></View>;
}

function padCountdown(value: number): string {
  return String(Math.max(0, value)).padStart(3, '0');
}

function padStage(value: number): string {
  return String(Math.max(0, value)).padStart(5, '0');
}
