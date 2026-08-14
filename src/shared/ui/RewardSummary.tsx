import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, spacing, typography } from '@/shared/theme/tokens';

interface RewardSummaryProps {
  expDelta: number;
  comboDelta: number;
  rankDelta: number;
  unlockLabel?: string;
}

export function RewardSummary({ comboDelta, expDelta, rankDelta, unlockLabel }: RewardSummaryProps) {
  return (
    <View style={styles.frame}>
      <Text style={styles.reward}>EXP {formatDelta(expDelta)}</Text>
      <Text style={styles.reward}>COMBO {formatDelta(comboDelta)}</Text>
      <Text style={styles.reward}>RANK {formatDelta(rankDelta)}</Text>
      {unlockLabel ? <Text style={styles.unlock}>{unlockLabel}</Text> : null}
    </View>
  );
}

function formatDelta(value: number): string {
  return value >= 0 ? `+${value}` : String(value);
}

const styles = StyleSheet.create({
  frame: { gap: spacing.xs },
  reward: { color: colors.gold, fontFamily: fonts.number, fontSize: typography.body },
  unlock: { color: colors.violet, fontFamily: fonts.body, fontSize: typography.caption },
});
