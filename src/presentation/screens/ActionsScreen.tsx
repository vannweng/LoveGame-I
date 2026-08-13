import { StyleSheet, Text, View } from 'react-native';

import { mockActionGroups } from '../../data/local/mockAppShellData';
import { ScreenLayout } from '../components/ScreenLayout';
import { colors, radius, spacing } from '../theme/tokens';

export function ActionsScreen() {
  return <ScreenLayout><Text style={styles.copy}>把約會準備拆成可執行的行動。</Text>{mockActionGroups.map((group) => <View key={group.title} style={styles.card}><Text style={styles.title}>{group.title}</Text>{group.items.map((item) => <View key={item} style={styles.item}><Text style={styles.itemText}>{item}</Text><Text style={styles.arrow}>›</Text></View>)}</View>)}</ScreenLayout>;
}

const styles = StyleSheet.create({
  copy: { color: colors.textMuted, fontSize: 15 }, card: { backgroundColor: colors.surface, borderRadius: radius.md, gap: spacing.sm, padding: spacing.md },
  title: { color: colors.gold, fontSize: 18, fontWeight: '900' }, item: { alignItems: 'center', backgroundColor: colors.surfaceMuted, borderRadius: radius.sm, flexDirection: 'row', justifyContent: 'space-between', padding: spacing.sm },
  itemText: { color: colors.text, fontWeight: '700' }, arrow: { color: colors.textMuted, fontSize: 22 },
});
