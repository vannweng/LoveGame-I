import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { GameState } from '../../domain/gameplay';
import { colors, radius, spacing } from '../theme/tokens';

interface AppHeaderProps {
  title: string;
  gameState: GameState;
  onOptions?: () => void;
}

export function AppHeader({ title, gameState, onOptions }: AppHeaderProps) {
  return (
    <View style={styles.header}>
      <View><Text style={styles.brand}>LOVEGAME I</Text><Text style={styles.title}>{title}</Text></View>
      <View style={styles.actions}>{onOptions && <Pressable accessibilityLabel="關係檔案選單" onPress={onOptions} style={styles.options}><Text style={styles.optionsText}>⋯</Text></Pressable>}<View style={styles.rank}><Text style={styles.rankLabel}>RANK</Text><Text style={styles.rankValue}>{gameState.rankScore}</Text></View></View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', padding: spacing.lg },
  brand: { color: colors.textMuted, fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  title: { color: colors.text, fontSize: 24, fontWeight: '900', marginTop: spacing.xs },
  rank: { alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.sm, minWidth: 54, padding: spacing.sm },
  rankLabel: { color: colors.textMuted, fontSize: 9, fontWeight: '800' },
  rankValue: { color: colors.gold, fontSize: 20, fontWeight: '900' },
  actions: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  options: { alignItems: 'center', justifyContent: 'center', minHeight: 42, minWidth: 34 },
  optionsText: { color: colors.textMuted, fontSize: 28, fontWeight: '900', lineHeight: 28 },
});
