import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '../theme/tokens';

export type BottomTab = 'home' | 'missions' | 'actions' | 'collection' | 'profile';

const tabs: { key: BottomTab; label: string; icon: string }[] = [
  { key: 'home', label: '首頁', icon: '⌂' }, { key: 'missions', label: '任務', icon: '✓' },
  { key: 'actions', label: '行動', icon: '✦' }, { key: 'collection', label: '圖鑑', icon: '▣' },
  { key: 'profile', label: '檔案', icon: '♡' },
];

export function BottomNavigation({ activeTab, onSelect }: { activeTab: BottomTab; onSelect: (tab: BottomTab) => void }) {
  return <View style={styles.nav}>{tabs.map((tab) => <Pressable key={tab.key} accessibilityRole="tab" onPress={() => onSelect(tab.key)} style={styles.item}><Text style={[styles.icon, activeTab === tab.key && styles.active]}>{tab.icon}</Text><Text style={[styles.label, activeTab === tab.key && styles.active]}>{tab.label}</Text></Pressable>)}</View>;
}

const styles = StyleSheet.create({
  nav: { backgroundColor: colors.surfaceMuted, borderTopColor: colors.border, borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-around', paddingBottom: spacing.sm, paddingTop: spacing.xs },
  item: { alignItems: 'center', gap: 2, minWidth: 48, paddingVertical: spacing.xs },
  icon: { color: colors.textMuted, fontSize: 18, fontWeight: '800' },
  label: { color: colors.textMuted, fontSize: 11, fontWeight: '700' },
  active: { color: colors.accent },
});
