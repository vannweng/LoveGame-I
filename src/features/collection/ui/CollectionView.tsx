import { StyleSheet, Text, View } from 'react-native';

import type { CollectionState } from '@/features/collection/domain';
import type { RunHistoryState } from '@/game/run';
import { getCopy } from '@/content';
import { PixelCard } from '@/shared/ui/PixelCard';
import { PixelTag } from '@/shared/ui/PixelTag';
import { ScreenState } from '@/shared/ui/ScreenState';
import { PageLayout } from '@/shared/ui/PageLayout';
import { colors, fonts, typography } from '@/shared/theme/tokens';

export function CollectionView({ collectionState, embedded = false, runHistory }: { collectionState: CollectionState; embedded?: boolean; runHistory: RunHistoryState }) {
  const hasContent = collectionState.items.length > 0 || runHistory.completedRuns.length > 0;
  const state = hasContent
    ? { kind: 'success' as const }
    : { kind: 'empty' as const, title: getCopy('COLLECTION_EMPTY_TITLE'), copy: getCopy('COLLECTION_EMPTY_COPY') };

  const content = <>
    <Text style={styles.copy}>{getCopy('COLLECTION_VAULT_UNLOCKED', { count: collectionState.items.length })}</Text>
    {collectionState.items.map((item) => <PixelCard key={item.id} accentColor={item.type === 'title' ? colors.gold : colors.danger} title={item.name} subtitle={item.type === 'title' ? getCopy('COLLECTION_TITLE_UNLOCKED') : getCopy('COLLECTION_GG_RECORD')} trailing={<PixelTag color={item.type === 'title' ? colors.gold : colors.danger} label={item.type === 'title' ? getCopy('COLLECTION_TITLE_TAG') : getCopy('COLLECTION_GG_TAG')} />} />)}
    {runHistory.completedRuns.length ? <Text style={styles.historyTitle}>{getCopy('RUN_HISTORY_TITLE')}</Text> : null}
    {runHistory.completedRuns.map((run, index) => <PixelCard accentColor={colors.textMuted} key={run.endedAt} subtitle={getCopy('COLLECTION_GG_RECORD')} title={getCopy('RUN_HISTORY_COPY', { number: index + 1, rank: run.highestRank, success: run.successCount, late: run.lateCount, fail: run.failCount })}><Text style={styles.historyCopy}>{getCopy(run.deathCause)}</Text></PixelCard>)}
  </>;
  if (embedded) return <View style={styles.embedded}><Text style={styles.title}>{getCopy('COLLECTION_SUMMARY_TITLE')}</Text>{hasContent ? content : <Text style={styles.historyCopy}>{getCopy('COLLECTION_EMPTY_COPY')}</Text>}</View>;
  return <ScreenState state={state}><PageLayout>{content}</PageLayout></ScreenState>;
}

const styles = StyleSheet.create({
  copy: { color: colors.accent, fontFamily: fonts.number, fontSize: typography.micro },
  embedded: { gap: 16 },
  historyTitle: { color: colors.gold, fontFamily: fonts.body, fontSize: typography.cardTitle, fontWeight: '700' },
  historyCopy: { color: colors.textMuted, fontFamily: fonts.body, fontSize: typography.caption },
  title: { color: colors.accent, fontFamily: fonts.body, fontSize: typography.cardTitle, fontWeight: '700' },
});
