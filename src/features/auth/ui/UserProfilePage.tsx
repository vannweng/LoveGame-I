import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { getCopy } from '@/content';
import type { RelationshipMode } from '@/features/relationship/domain';
import { AppButton } from '@/shared/ui/AppButton';
import { PixelTag } from '@/shared/ui/PixelTag';
import { PixelIcon, type PixelIconName } from '@/shared/ui/PixelIcon';
import { CloseButton } from '@/shared/ui/SosGuidePage';
import { useResponsiveLayout } from '@/shared/hooks/useResponsiveLayout';
import { borderWidth, colors, fonts, radius, spacing, typography } from '@/shared/theme/tokens';
import { AccountInfoDialog, ResetDataDialog, type AccountInfo } from './AccountDialogs';

interface UserProfilePageProps {
  onClose: () => void;
  onResetAndSignOut: () => Promise<void>;
  onSignOut: () => void;
  partnerName: string;
  relationshipDays: number;
  relationshipMode?: RelationshipMode;
  userName: string;
}

export function UserProfilePage({ onClose, onResetAndSignOut, onSignOut, partnerName,
  relationshipDays, relationshipMode = 'partnered', userName }: UserProfilePageProps) {
  const [info, setInfo] = useState<AccountInfo | null>(null);
  const [resetVisible, setResetVisible] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetError, setResetError] = useState('');
  const { isCompact } = useResponsiveLayout();
  const reset = () => {
    if (resetting) return;
    setResetting(true);
    setResetError('');
    void onResetAndSignOut().catch(() => {
      setResetting(false);
      setResetError(getCopy('PROFILE_RESET_FAILED'));
    });
  };

  return (
    <View style={styles.page}>
      <View style={[styles.header, isCompact && styles.compactHeader]}>
        <Text accessibilityRole="header" style={styles.headerTitle}>{getCopy('PROFILE_CENTER_TITLE')}</Text>
        <CloseButton label={getCopy('PROFILE_CLOSE_A11Y')} onPress={onClose} />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.profileCard, isCompact && styles.compactProfileCard]}>
          <View style={styles.avatar}><PixelIcon name="user" color={colors.accent} size={40} /></View>
          <View style={styles.profileCopy}>
            <Text style={styles.names}>{userName}{partnerName ? ` · ${partnerName}` : ''}</Text>
            <PixelTag color={colors.textMuted} label={getCopy('PROFILE_CURRENT_PLAN')} size="M" />
            {relationshipMode === 'partnered' ? <Text style={styles.days}>一起走過 {relationshipDays} 天</Text> : null}
          </View>
        </View>
        <View style={styles.menu}>
          <View style={styles.row}>
            <PixelIcon name="moon" color={colors.accent} />
            <Text style={styles.rowText}>{getCopy('PROFILE_APPEARANCE')}</Text>
            <Text style={styles.value}>{getCopy('PROFILE_DARK_MODE')}</Text>
          </View>
          <MenuRow icon="book" label={getCopy('PROFILE_TUTORIAL')} onPress={() => setInfo('tutorial')} />
          <MenuRow icon="user" label={getCopy('PROFILE_MEMBERSHIP')} onPress={() => setInfo('membership')} />
          <MenuRow icon="mail" label={getCopy('PROFILE_ANNOUNCEMENTS')} onPress={() => setInfo('announcements')} />
        </View>
        <AppButton label={getCopy('PROFILE_LOGOUT')} onPress={onSignOut} secondary />
        <View style={styles.dataSection}>
          <Text accessibilityRole="header" style={styles.sectionTitle}>{getCopy('PROFILE_DATA_MANAGEMENT')}</Text>
          <Text style={styles.dataCopy}>{getCopy('PROFILE_DATA_WARNING')}</Text>
          <AppButton label={getCopy('PROFILE_RESET')} onPress={() => setResetVisible(true)} secondary tone="danger" />
        </View>
        <Text style={styles.version}>{getCopy('PROFILE_VERSION')}</Text>
      </ScrollView>
      {info ? <AccountInfoDialog info={info} relationshipMode={relationshipMode} onClose={() => setInfo(null)} /> : null}
      {resetVisible ? <ResetDataDialog busy={resetting} error={resetError}
        onCancel={() => setResetVisible(false)} onConfirm={reset} /> : null}
    </View>
  );
}

function MenuRow({ icon, label, onPress }: { icon: PixelIconName; label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.row}>
      <PixelIcon name={icon} color={colors.accent} />
      <Text style={styles.rowText}>{label}</Text>
      <PixelIcon name="chevron-right" color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: { backgroundColor: colors.pageBg, flex: 1, minWidth: 0 },
  header: { alignItems: 'center', borderBottomColor: colors.accent, borderBottomWidth: borderWidth,
    flexDirection: 'row', gap: spacing.sm, justifyContent: 'space-between', padding: spacing.lg },
  compactHeader: { paddingHorizontal: spacing.md },
  headerTitle: { color: colors.text, flex: 1, fontFamily: fonts.body, fontSize: typography.sectionTitle },
  content: { alignSelf: 'center', gap: spacing.lg, maxWidth: 720, padding: spacing.lg,
    paddingBottom: spacing.xxl, width: '100%' },
  profileCard: { alignItems: 'center', borderColor: colors.border, borderRadius: radius.sm,
    borderWidth, flexDirection: 'row', gap: spacing.md, minWidth: 0, padding: spacing.md },
  compactProfileCard: { alignItems: 'flex-start', flexDirection: 'column' },
  avatar: { alignItems: 'center', borderColor: colors.accent, borderWidth: 1, height: 84,
    justifyContent: 'center', width: 84 },
  profileCopy: { flex: 1, gap: spacing.sm, minWidth: 0 },
  names: { color: colors.text, flexShrink: 1, fontFamily: fonts.body, fontSize: typography.hero },
  days: { color: colors.textMuted, fontFamily: fonts.number, fontSize: typography.caption },
  menu: { borderColor: colors.border, borderWidth },
  row: { alignItems: 'center', borderBottomColor: colors.border, borderBottomWidth: 1,
    flexDirection: 'row', gap: spacing.md, minHeight: 64, paddingHorizontal: spacing.md },
  rowText: { color: colors.text, flex: 1, fontFamily: fonts.body, fontSize: typography.cardTitle },
  value: { color: colors.textMuted, fontFamily: fonts.body, fontSize: typography.body },
  dataSection: { borderTopColor: colors.border, borderTopWidth: 1, gap: spacing.md,
    marginTop: spacing.lg, paddingTop: spacing.xl },
  sectionTitle: { color: colors.text, fontFamily: fonts.body, fontSize: typography.sectionTitle },
  dataCopy: { color: colors.textMuted, fontFamily: fonts.body, fontSize: typography.caption, lineHeight: 23 },
  version: { color: colors.textMuted, fontFamily: fonts.number, fontSize: typography.micro, textAlign: 'center' },
});
