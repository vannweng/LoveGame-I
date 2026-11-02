import { Pressable, StyleSheet, Text, View } from 'react-native';

import { borderWidth, colors, fonts, spacing, typography } from '@/shared/theme/tokens';
import { getCopy } from '@/content';
import { PixelIcon, type PixelIconName } from '@/shared/ui/PixelIcon';
import type { FeatureFlags } from '@/application/config/featureFlags';

export type BottomTab = 'home' | 'missions' | 'actions' | 'collection' | 'profile';

const tabs: { key: BottomTab; label: string; icon: PixelIconName }[] = [
  { key: 'home', label: getCopy('NAV_HOME'), icon: 'home' }, { key: 'missions', label: getCopy('NAV_QUEST'), icon: 'checklist' },
  { key: 'actions', label: getCopy('NAV_PLAN'), icon: 'calendar' }, { key: 'collection', label: getCopy('NAV_VAULT'), icon: 'archive' },
  { key: 'profile', label: getCopy('NAV_FILE'), icon: 'heart' },
];

export function BottomNavigation({ activeTab, flags, onSelect }: { activeTab: BottomTab; flags: FeatureFlags; onSelect: (tab: BottomTab) => void }) {
  const enabledTabs = tabs.filter((tab) => tab.key !== 'actions' || flags.actionHub);
  return <View style={styles.nav}>{enabledTabs.map((tab) => <Pressable key={tab.key} accessibilityRole="tab" onPress={() => onSelect(tab.key)} style={styles.item}><PixelIcon name={tab.icon} color={activeTab === tab.key ? colors.accent : colors.textMuted} size={24} /><Text style={[styles.label, activeTab === tab.key && styles.active]}>{tab.label}</Text></Pressable>)}</View>;
}

const styles = StyleSheet.create({
  nav: { backgroundColor: colors.pageBg, borderTopColor: colors.border, borderTopWidth: borderWidth, flexDirection: 'row', justifyContent: 'space-around', paddingBottom: spacing.sm, paddingTop: spacing.xs },
  item: { alignItems: 'center', flex: 1, gap: 2, minWidth: 0, paddingVertical: spacing.xs },
  label: { color: colors.textMuted, fontFamily: fonts.number, fontSize: typography.micro, textAlign: 'center' },
  active: { color: colors.accent },
});
