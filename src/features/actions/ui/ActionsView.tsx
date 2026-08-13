import { StyleSheet, Text, View } from 'react-native';

import { mockActionGroups } from '@/features/actions/data/mockAppShellData';
import { getCopy } from '@/content';
import { PixelCard } from '@/shared/ui/PixelCard';
import { PageLayout } from '@/shared/ui/PageLayout';
import { colors, fonts, spacing, typography } from '@/shared/theme/tokens';

export function ActionsView() {
  return <PageLayout><Text style={styles.copy}>{getCopy('ACTION_INTRO')}</Text>{mockActionGroups.map((group) => <PixelCard key={group.title} accentColor={colors.violet} title={group.title} subtitle={getCopy('ACTION_MENU')}>{group.items.map((item) => <View key={item} style={styles.item}><Text style={styles.itemText}>{item}</Text><Text style={styles.arrow}>{getCopy('ACTION_ARROW')}</Text></View>)}</PixelCard>)}</PageLayout>;
}

const styles = StyleSheet.create({
  copy: { color: colors.textMuted, fontFamily: fonts.body, fontSize: typography.caption },
  item: { alignItems: 'center', backgroundColor: colors.subBoxBg, flexDirection: 'row', justifyContent: 'space-between', padding: spacing.sm },
  itemText: { color: colors.text, fontFamily: fonts.body, fontSize: typography.caption }, arrow: { color: colors.violet, fontFamily: fonts.number, fontSize: typography.caption },
});
