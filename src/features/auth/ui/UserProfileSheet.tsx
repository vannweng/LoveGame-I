import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { getCopy } from '@/content';
import { AppButton } from '@/shared/ui/AppButton';
import { PixelTag } from '@/shared/ui/PixelTag';
import { borderWidth, colors, fonts, radius, spacing, typography } from '@/shared/theme/tokens';

interface UserProfileSheetProps {
  onClose: () => void;
  onSignOut: () => void;
  partnerName: string;
  relationshipDays: number;
  userName: string;
  visible: boolean;
}

type ProfileInfo = 'announcements' | 'membership' | 'tutorial' | null;

export function UserProfileSheet({ onClose, onSignOut, partnerName, relationshipDays, userName, visible }: UserProfileSheetProps) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [info, setInfo] = useState<ProfileInfo>(null);
  const close = () => { setInfo(null); onClose(); };
  const content = getInfoContent(info);

  return <Modal animationType="slide" onRequestClose={close} presentationStyle="pageSheet" transparent visible={visible}><View style={styles.backdrop}><View style={styles.sheet}><View style={styles.header}><Text style={styles.title}>{getCopy('PROFILE_CENTER_TITLE')}</Text><Pressable accessibilityLabel={getCopy('PROFILE_CLOSE_A11Y')} onPress={close} style={styles.close}><Text style={styles.closeText}>×</Text></Pressable></View><View style={styles.profileCard}><View style={styles.avatar}><Text style={styles.avatarText}>♟</Text></View><View style={styles.profileCopy}><Text style={styles.names}>{userName} <Text style={styles.heart}>♥</Text> {partnerName}</Text><PixelTag color={colors.accent} label={getCopy('PROFILE_CURRENT_PLAN')} size="M" /><Text style={styles.days}>STAGE {String(relationshipDays).padStart(5, '0')} DAYS</Text></View></View><View style={styles.menu}><View style={styles.row}><Text style={styles.icon}>☾</Text><Text style={styles.rowText}>{getCopy('PROFILE_DARK_MODE')}</Text><Switch accessibilityLabel={getCopy('PROFILE_DARK_MODE')} onValueChange={setIsDarkMode} thumbColor={isDarkMode ? colors.accent : colors.textMuted} trackColor={{ false: colors.border, true: colors.safe }} value={isDarkMode} /></View><MenuRow icon="▤" label={getCopy('PROFILE_TUTORIAL')} onPress={() => setInfo('tutorial')} /><MenuRow icon="♙" label={getCopy('PROFILE_MEMBERSHIP')} onPress={() => setInfo('membership')} /><MenuRow icon="⚑" label={getCopy('PROFILE_ANNOUNCEMENTS')} onPress={() => setInfo('announcements')} /></View><AppButton label={getCopy('PROFILE_LOGOUT')} onPress={onSignOut} secondary /><Text style={styles.version}>{getCopy('PROFILE_VERSION')}</Text>{content ? <InfoDialog copy={content.copy} onClose={() => setInfo(null)} title={content.title} /> : null}</View></View></Modal>;
}

function MenuRow({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={styles.row}><Text style={styles.icon}>{icon}</Text><Text style={styles.rowText}>{label}</Text><Text style={styles.arrow}>›</Text></Pressable>;
}

function InfoDialog({ copy, onClose, title }: { copy: string; onClose: () => void; title: string }) {
  return <View style={styles.infoOverlay}><View style={styles.info}><Text style={styles.infoTitle}>{title}</Text><Text style={styles.infoCopy}>{copy}</Text><AppButton label={getCopy('PROFILE_DISMISS')} onPress={onClose} /></View></View>;
}

function getInfoContent(info: ProfileInfo): { copy: string; title: string } | null {
  if (info === 'tutorial') return { title: getCopy('PROFILE_TUTORIAL_TITLE'), copy: getCopy('PROFILE_TUTORIAL_COPY') };
  if (info === 'membership') return { title: getCopy('PROFILE_MEMBERSHIP_TITLE'), copy: getCopy('PROFILE_MEMBERSHIP_COPY') };
  if (info === 'announcements') return { title: getCopy('PROFILE_ANNOUNCEMENTS_TITLE'), copy: getCopy('PROFILE_ANNOUNCEMENTS_COPY') };
  return null;
}

const styles = StyleSheet.create({
  backdrop: { backgroundColor: 'rgba(0,0,0,0.72)', flex: 1, justifyContent: 'flex-end' }, sheet: { backgroundColor: colors.pageBg, borderTopColor: colors.accent, borderTopWidth: borderWidth, gap: spacing.lg, minHeight: '76%', padding: spacing.lg },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }, title: { color: colors.text, fontFamily: fonts.body, fontSize: typography.sectionTitle, fontWeight: '700' }, close: { alignItems: 'center', minHeight: 42, minWidth: 42 }, closeText: { color: colors.text, fontSize: 42, lineHeight: 36 },
  profileCard: { alignItems: 'center', borderColor: colors.border, borderRadius: radius.sm, borderWidth: borderWidth, flexDirection: 'row', gap: spacing.md, padding: spacing.md }, avatar: { alignItems: 'center', borderColor: colors.accent, borderRadius: radius.xs, borderWidth: 1, height: 84, justifyContent: 'center', width: 84 }, avatarText: { color: colors.accent, fontFamily: fonts.number, fontSize: 38 }, profileCopy: { flex: 1, gap: spacing.xs }, names: { color: colors.text, fontFamily: fonts.number, fontSize: typography.hero }, heart: { color: colors.pink }, days: { color: colors.textMuted, fontFamily: fonts.number, fontSize: typography.micro },
  menu: { borderColor: colors.border, borderRadius: radius.sm, borderWidth: borderWidth }, row: { alignItems: 'center', borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: 'row', gap: spacing.md, minHeight: 64, paddingHorizontal: spacing.md }, icon: { color: colors.accent, fontFamily: fonts.number, fontSize: typography.sectionTitle }, rowText: { color: colors.text, flex: 1, fontFamily: fonts.body, fontSize: typography.cardTitle, fontWeight: '700' }, arrow: { color: colors.textMuted, fontSize: 40, lineHeight: 40 },
  version: { color: colors.textMuted, fontFamily: fonts.number, fontSize: typography.micro, textAlign: 'center' }, infoOverlay: { alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.72)', bottom: 0, justifyContent: 'center', left: 0, position: 'absolute', right: 0, top: 0 }, info: { backgroundColor: colors.pageBg, borderColor: colors.accent, borderRadius: radius.sm, borderWidth: borderWidth, gap: spacing.md, margin: spacing.lg, padding: spacing.lg }, infoTitle: { color: colors.accent, fontFamily: fonts.body, fontSize: typography.sectionTitle }, infoCopy: { color: colors.text, fontFamily: fonts.body, fontSize: typography.body, lineHeight: 24 },
});
