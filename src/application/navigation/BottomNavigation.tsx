import { Pressable, StyleSheet, Text, View } from 'react-native';

import { borderWidth, colors, fonts, spacing, typography } from '@/shared/theme/tokens';
import { getCopy } from '@/content';
import type { FeatureFlags } from '@/application/config/featureFlags';

export type BottomTab = 'home' | 'missions' | 'actions' | 'collection' | 'profile';

const tabs: { key: BottomTab; label: string; icon: string }[] = [
  { key: 'home', label: getCopy('NAV_HOME'), icon: '⌂' }, { key: 'missions', label: getCopy('NAV_QUEST'), icon: '✓' },
  { key: 'actions', label: getCopy('NAV_PLAN'), icon: '✦' }, { key: 'collection', label: getCopy('NAV_VAULT'), icon: '▣' },
  { key: 'profile', label: getCopy('NAV_FILE'), icon: '♡' },
];

export function BottomNavigation({ activeTab, flags, onSelect }: { activeTab: BottomTab; flags: FeatureFlags; onSelect: (tab: BottomTab) => void }) {
  const enabledTabs = tabs.filter((tab) => tab.key !== 'actions' || flags.actionHub);
  return <View style={styles.nav}>{enabledTabs.map((tab) => <Pressable key={tab.key} accessibilityRole="tab" onPress={() => onSelect(tab.key)} style={styles.item}><Text style={[styles.icon, activeTab === tab.key && styles.active]}>{tab.icon}</Text><Text style={[styles.label, activeTab === tab.key && styles.active]}>{tab.label}</Text></Pressable>)}</View>;
}

const styles = StyleSheet.create({
  nav: { backgroundColor: colors.pageBg, borderTopColor: colors.border, borderTopWidth: borderWidth, flexDirection: 'row', justifyContent: 'space-around', paddingBottom: spacing.sm, paddingTop: spacing.xs },
  item: { alignItems: 'center', flex: 1, gap: 2, minWidth: 0, paddingVertical: spacing.xs },
  icon: { color: colors.textMuted, fontFamily: fonts.number, fontSize: typography.body },
  label: { color: colors.textMuted, fontFamily: fonts.number, fontSize: typography.micro, textAlign: 'center' },
  active: { color: colors.accent },
});
