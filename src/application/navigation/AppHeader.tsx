import { Pressable, StyleSheet, Text, View } from 'react-native';

import { getCopy } from '@/content';
import { useResponsiveLayout } from '@/shared/hooks/useResponsiveLayout';
import { borderWidth, colors, fonts, radius, spacing, typography } from '@/shared/theme/tokens';

interface AppHeaderProps {
  onProfile: () => void;
  onSos: () => void;
}

export function AppHeader({ onProfile, onSos }: AppHeaderProps) {
  const { isCompact } = useResponsiveLayout();
  return (
    <View style={[styles.header, isCompact && styles.compactHeader]}>
      <View style={styles.brandArea}><Text numberOfLines={1} style={[styles.title, isCompact && styles.compactTitle]}>{getCopy('APP_TITLE')}</Text><Text style={styles.brand}>{getCopy('APP_WAR_ROOM')}</Text></View>
      <View style={styles.actions}><Pressable accessibilityLabel={getCopy('APP_SOS_A11Y')} onPress={onSos} style={[styles.sos, isCompact && styles.compactSos]}><Text style={styles.sosLabel}>{getCopy('APP_SOS')}</Text></Pressable><Pressable accessibilityLabel={getCopy('APP_PROFILE_A11Y')} onPress={onProfile} style={[styles.options, isCompact && styles.compactOptions]}><Text style={styles.optionsText}>♟</Text></Pressable></View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', borderBottomColor: colors.border, borderBottomWidth: borderWidth, flexDirection: 'row', gap: spacing.sm, justifyContent: 'space-between', padding: spacing.lg }, compactHeader: { paddingHorizontal: spacing.md },
  brandArea: { flex: 1, minWidth: 0 }, title: { color: colors.text, flexShrink: 1, fontFamily: fonts.body, fontSize: typography.hero, fontWeight: '700' }, compactTitle: { fontSize: typography.sectionTitle },
  brand: { color: colors.accent, fontFamily: fonts.number, fontSize: typography.micro, letterSpacing: 1.5, marginTop: spacing.xs },
  actions: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  sos: { alignItems: 'center', backgroundColor: colors.danger, borderColor: colors.text, borderRadius: radius.xs, borderWidth: 1, justifyContent: 'center', minHeight: 48, minWidth: 76 }, compactSos: { minWidth: 60 }, sosLabel: { color: colors.text, fontFamily: fonts.number, fontSize: typography.caption },
  options: { alignItems: 'center', borderColor: colors.accent, borderRadius: radius.xs, borderWidth: 1, justifyContent: 'center', minHeight: 48, minWidth: 48 }, compactOptions: { minWidth: 42 },
  optionsText: { color: colors.accent, fontFamily: fonts.number, fontSize: typography.sectionTitle, lineHeight: typography.sectionTitle },
});
