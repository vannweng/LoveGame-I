import { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { getCopy } from '@/content';
import { AppButton } from '@/shared/ui/AppButton';
import { BottomSheet } from '@/shared/ui/BottomSheet';
import { Dialog } from '@/shared/ui/Dialog';
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

  return <BottomSheet onClose={close} title={getCopy('PROFILE_CENTER_TITLE')} visible={visible}><View style={styles.profileCard}><View style={styles.avatar}><Text style={styles.avatarText}>♟</Text></View><View style={styles.profileCopy}><Text style={styles.names}>{userName} <Text style={styles.heart}>♥</Text> {partnerName}</Text><PixelTag color={colors.accent} label={getCopy('PROFILE_CURRENT_PLAN')} size="M" /><Text style={styles.days}>STAGE {String(relationshipDays).padStart(5, '0')} DAYS</Text></View></View><View style={styles.menu}><View style={styles.row}><Text style={styles.icon}>☾</Text><Text style={styles.rowText}>{getCopy('PROFILE_DARK_MODE')}</Text><Switch accessibilityLabel={getCopy('PROFILE_DARK_MODE')} onValueChange={setIsDarkMode} thumbColor={isDarkMode ? colors.accent : colors.textMuted} trackColor={{ false: colors.border, true: colors.safe }} value={isDarkMode} /></View><MenuRow icon="▤" label={getCopy('PROFILE_TUTORIAL')} onPress={() => setInfo('tutorial')} /><MenuRow icon="♙" label={getCopy('PROFILE_MEMBERSHIP')} onPress={() => setInfo('membership')} /><MenuRow icon="⚑" label={getCopy('PROFILE_ANNOUNCEMENTS')} onPress={() => setInfo('announcements')} /></View><AppButton label={getCopy('PROFILE_LOGOUT')} onPress={onSignOut} secondary /><Text style={styles.version}>{getCopy('PROFILE_VERSION')}</Text>{content ? <InfoDialog copy={content.copy} onClose={() => setInfo(null)} title={content.title} /> : null}</BottomSheet>;
}

function MenuRow({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={styles.row}><Text style={styles.icon}>{icon}</Text><Text style={styles.rowText}>{label}</Text><Text style={styles.arrow}>›</Text></Pressable>;
}

function InfoDialog({ copy, onClose, title }: { copy: string; onClose: () => void; title: string }) {
  return <Dialog onClose={onClose} title={title} visible><Text style={styles.infoCopy}>{copy}</Text><AppButton label={getCopy('PROFILE_DISMISS')} onPress={onClose} /></Dialog>;
}

function getInfoContent(info: ProfileInfo): { copy: string; title: string } | null {
  if (info === 'tutorial') return { title: getCopy('PROFILE_TUTORIAL_TITLE'), copy: getCopy('PROFILE_TUTORIAL_COPY') };
  if (info === 'membership') return { title: getCopy('PROFILE_MEMBERSHIP_TITLE'), copy: getCopy('PROFILE_MEMBERSHIP_COPY') };
  if (info === 'announcements') return { title: getCopy('PROFILE_ANNOUNCEMENTS_TITLE'), copy: getCopy('PROFILE_ANNOUNCEMENTS_COPY') };
  return null;
}

const styles = StyleSheet.create({
  profileCard: { alignItems: 'center', borderColor: colors.border, borderRadius: radius.sm, borderWidth: borderWidth, flexDirection: 'row', gap: spacing.md, padding: spacing.md }, avatar: { alignItems: 'center', borderColor: colors.accent, borderRadius: radius.xs, borderWidth: 1, height: 84, justifyContent: 'center', width: 84 }, avatarText: { color: colors.accent, fontFamily: fonts.number, fontSize: 38 }, profileCopy: { flex: 1, gap: spacing.xs }, names: { color: colors.text, fontFamily: fonts.number, fontSize: typography.hero }, heart: { color: colors.pink }, days: { color: colors.textMuted, fontFamily: fonts.number, fontSize: typography.micro },
  menu: { borderColor: colors.border, borderRadius: radius.sm, borderWidth: borderWidth }, row: { alignItems: 'center', borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: 'row', gap: spacing.md, minHeight: 64, paddingHorizontal: spacing.md }, icon: { color: colors.accent, fontFamily: fonts.number, fontSize: typography.sectionTitle }, rowText: { color: colors.text, flex: 1, fontFamily: fonts.body, fontSize: typography.cardTitle, fontWeight: '700' }, arrow: { color: colors.textMuted, fontSize: 40, lineHeight: 40 },
  version: { color: colors.textMuted, fontFamily: fonts.number, fontSize: typography.micro, textAlign: 'center' }, infoCopy: { color: colors.text, fontFamily: fonts.body, fontSize: typography.body, lineHeight: 24 },
});
