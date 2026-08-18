import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { GameState } from '@/features/missions/domain';
import type { AnnualDateCountdown } from '@/features/relationship/domain';
import { getRankIdentity } from '@/game/rank/getRankIdentity';
import { getCopy } from '@/content';
import { AppButton } from '@/shared/ui/AppButton';
import { PixelCard } from '@/shared/ui/PixelCard';
import { PixelTag } from '@/shared/ui/PixelTag';
import { PageLayout } from '@/shared/ui/PageLayout';
import { StatusBadge, type StatusVariant } from '@/shared/ui/StatusBadge';
import { useResponsiveLayout } from '@/shared/hooks/useResponsiveLayout';
import { borderWidth, colors, fonts, spacing, typography } from '@/shared/theme/tokens';

interface HomeViewProps {
  gameState: GameState;
  importantDate: AnnualDateCountdown | null;
  importantDateLabel: string;
  onOpenMissions: () => void;
  onOpenRebirth?: () => void;
  p1Name: string;
  p2Name: string;
  relationshipDays: number;
}

export function HomeView({
  gameState,
  importantDate,
  importantDateLabel,
  onOpenMissions,
  onOpenRebirth,
  p1Name,
  p2Name,
  relationshipDays,
}: HomeViewProps) {
  const rankIdentity = getRankIdentity(gameState.rankScore);
  const { isCompact } = useResponsiveLayout();

  return (
    <PageLayout>
      <View style={styles.playerBoard}><PixelTag color={colors.accent} label={getCopy('HOME_PLAYER_LABEL')} size="M" /><Text style={styles.playerName}>{p1Name}</Text><Text style={styles.heart}>♥</Text><Text style={styles.playerName}>{p2Name}</Text><Text style={styles.stage}>{getCopy('HOME_STAGE_LABEL')} <Text style={styles.stageValue}>{padStage(relationshipDays)}</Text></Text></View>
      <View style={styles.divider} />
      <View style={[styles.hud, isCompact && styles.compactHud]}>
        <StatusBadge label={rankIdentity} variant={getRankBadgeVariant(gameState)} />
        <View style={[styles.hudStats, isCompact && styles.compactHudStats]}>
          <HudStat label={getCopy('HOME_RANK_LABEL')} value={formatRank(gameState.rankScore)} />
          <HudStat label={getCopy('HOME_EXP_LABEL')} value={padValue(gameState.exp)} />
          <HudStat label={getCopy('HOME_COMBO_LABEL')} value={`×${gameState.combo}`} />
        </View>
      </View>
      <PixelCard accentColor={colors.accent} title={importantDateLabel} subtitle={getCopy('HOME_COUNTDOWN_SUBTITLE')} trailing={<Text style={styles.remain}>{getCopy('HOME_REMAIN_LABEL')} <Text style={styles.remainValue}>{padCountdown(importantDate?.daysRemaining ?? 0)}</Text></Text>}>
        <View style={styles.advice}><Text style={styles.adviceTitle}>{getCopy('HOME_ADVICE_LABEL')}</Text><Text style={styles.detail}>{importantDate ? getCopy('HOME_IMPORTANT_DATE_ADVICE', { label: importantDateLabel, days: importantDate.daysRemaining }) : getCopy('HOME_NO_IMPORTANT_DATE')}</Text></View>
      </PixelCard>
      {onOpenRebirth ? <PixelCard accentColor={colors.danger} title={getCopy('REBIRTH_TITLE')} subtitle="GG"><Text style={styles.detail}>{getCopy('REBIRTH_COPY')}</Text><AppButton label={getCopy('REBIRTH_CONFIRM')} onPress={onOpenRebirth} /></PixelCard> : <Pressable accessibilityRole="button" onPress={onOpenMissions}><PixelCard accentColor={colors.safe} title={getCopy('HOME_TODAY_QUEST_TITLE')} subtitle="DAILY PLAY"><Text style={styles.detail}>{getCopy('HOME_TODAY_QUEST_COPY')}</Text></PixelCard></Pressable>}
      <View style={styles.fill} />
      {!onOpenRebirth ? <AppButton label={getCopy('HOME_GO_TO_QUESTS')} onPress={onOpenMissions} /> : null}
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  playerBoard: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  playerName: { color: colors.text, flexShrink: 1, fontFamily: fonts.number, fontSize: typography.hero },
  heart: { color: colors.pink, fontFamily: fonts.body, fontSize: typography.sectionTitle },
  stage: { color: colors.orange, fontFamily: fonts.number, fontSize: typography.caption, marginLeft: 'auto' },
  stageValue: { color: colors.gold, fontSize: typography.hero },
  divider: { backgroundColor: colors.border, borderStyle: 'dashed', borderWidth: 1 },
  remain: { color: colors.textMuted, fontFamily: fonts.number, fontSize: typography.caption },
  remainValue: { color: colors.pink, fontSize: typography.hero },
  advice: { borderColor: colors.accent, borderRadius: 0, borderWidth: borderWidth, gap: spacing.xs, padding: spacing.md },
  adviceTitle: { color: colors.accent, fontFamily: fonts.number, fontSize: typography.caption },
  detail: { color: colors.text, fontFamily: fonts.body, fontSize: typography.body, lineHeight: 24 },
  hud: { alignItems: 'center', flexDirection: 'row', gap: spacing.md, minWidth: 0 }, compactHud: { alignItems: 'flex-start', flexDirection: 'column' },
  hudStats: { flex: 1, flexDirection: 'row', gap: spacing.sm, justifyContent: 'flex-end', minWidth: 0 }, compactHudStats: { justifyContent: 'space-between', width: '100%' },
  hudStat: { alignItems: 'flex-end', gap: spacing.xs },
  hudLabel: { color: colors.textMuted, fontFamily: fonts.number, fontSize: typography.micro },
  hudValue: { color: colors.gold, fontFamily: fonts.number, fontSize: typography.sectionTitle },
  fill: { flex: 1 },
});

function HudStat({ label, value }: { label: string; value: string }) {
  return <View style={styles.hudStat}><Text style={styles.hudLabel}>{label}</Text><Text style={styles.hudValue}>{value}</Text></View>;
}

function padCountdown(value: number): string {
  return String(Math.max(0, value)).padStart(3, '0');
}

function padStage(value: number): string {
  return String(Math.max(0, value)).padStart(5, '0');
}

function padValue(value: number): string {
  return String(Math.max(0, value)).padStart(3, '0');
}

function formatRank(value: number): string {
  return value >= 0 ? `+${value}` : String(value);
}

function getRankBadgeVariant(gameState: GameState): StatusVariant {
  if (gameState.rankScore === -10) return 'gg';
  return gameState.status === 'safe' ? 'success' : 'danger';
}
