import { Pressable, StyleSheet, Text, View } from 'react-native';

import { getCopy } from '@/content';
import { borderWidth, colors, fonts, radius, spacing, typography } from '@/shared/theme/tokens';

interface AppHeaderProps {
  onProfile: () => void;
  onSos: () => void;
}

export function AppHeader({ onProfile, onSos }: AppHeaderProps) {
  return (
    <View style={styles.header}>
      <View><Text style={styles.title}>{getCopy('APP_TITLE')}</Text><Text style={styles.brand}>{getCopy('APP_WAR_ROOM')}</Text></View>
      <View style={styles.actions}><Pressable accessibilityLabel={getCopy('APP_SOS_A11Y')} onPress={onSos} style={styles.sos}><Text style={styles.sosLabel}>{getCopy('APP_SOS')}</Text></Pressable><Pressable accessibilityLabel={getCopy('APP_PROFILE_A11Y')} onPress={onProfile} style={styles.options}><Text style={styles.optionsText}>♟</Text></Pressable></View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', borderBottomColor: colors.border, borderBottomWidth: borderWidth, flexDirection: 'row', justifyContent: 'space-between', padding: spacing.lg },
  title: { color: colors.text, fontFamily: fonts.body, fontSize: typography.hero, fontWeight: '700' },
  brand: { color: colors.accent, fontFamily: fonts.number, fontSize: typography.micro, letterSpacing: 1.5, marginTop: spacing.xs },
  actions: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  sos: { alignItems: 'center', backgroundColor: colors.danger, borderColor: colors.text, borderRadius: radius.xs, borderWidth: 1, justifyContent: 'center', minHeight: 48, minWidth: 76 }, sosLabel: { color: colors.text, fontFamily: fonts.number, fontSize: typography.caption },
  options: { alignItems: 'center', borderColor: colors.accent, borderRadius: radius.xs, borderWidth: 1, justifyContent: 'center', minHeight: 48, minWidth: 48 },
  optionsText: { color: colors.accent, fontFamily: fonts.number, fontSize: typography.sectionTitle, lineHeight: typography.sectionTitle },
});
