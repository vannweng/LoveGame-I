import type { ReactNode } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppButton } from './AppButton';
import { getCopy } from '@/content';
import { borderWidth, colors, fonts, radius, spacing, typography } from '@/shared/theme/tokens';

interface SosGuideModalProps {
  onClose: () => void;
  visible: boolean;
}

export function SosGuideModal({ onClose, visible }: SosGuideModalProps) {
  return <Modal animationType="slide" onRequestClose={onClose} presentationStyle="pageSheet" transparent visible={visible}>
    <View style={styles.backdrop}><View style={styles.modal}><View style={styles.header}><View><Text style={styles.title}><Text style={styles.sos}>[SOS]</Text> {getCopy('GG_SOS_TITLE')}</Text><Text style={styles.copy}>{getCopy('GG_SOS_COACH_COPY')}</Text></View><Pressable accessibilityLabel={getCopy('GG_SOS_CLOSE_A11Y')} onPress={onClose} style={styles.close}><Text style={styles.closeLabel}>×</Text></Pressable></View><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}><View style={styles.levels}><Level label={getCopy('GG_SOS_LEVEL_ONE')} active /><Level label={getCopy('GG_SOS_LEVEL_TWO')} /><Level label={getCopy('GG_SOS_LEVEL_THREE')} /></View><Panel title={getCopy('GG_SOS_DIAGNOSIS')}><Text style={styles.muted}>{getCopy('GG_SOS_DIAGNOSIS_ONE')}</Text><Text style={styles.muted}>{getCopy('GG_SOS_DIAGNOSIS_TWO')}</Text></Panel><Panel title={getCopy('GG_SOS_ACTION_PLAN')} accent><Text style={styles.plan}>{getCopy('GG_SOS_ACTION_ONE')}</Text><Text style={styles.plan}>{getCopy('GG_SOS_ACTION_TWO')}</Text></Panel><Panel title={getCopy('GG_SOS_APOLOGY_CODE')}><Text style={styles.apology}>{getCopy('GG_SOS_APOLOGY')}</Text></Panel><Panel title={getCopy('GG_SOS_QUICK_ACTIONS')}><View style={styles.quickActions}><AppButton label={getCopy('GG_SOS_DRINK_DELIVERY')} onPress={() => undefined} secondary /><AppButton label={getCopy('GG_SOS_APOLOGY_LINES')} onPress={() => undefined} secondary /></View></Panel></ScrollView></View></View></Modal>;
}

function Level({ active = false, label }: { active?: boolean; label: string }) {
  return <View style={[styles.level, active && styles.levelActive]}><Text style={[styles.levelLabel, active && styles.levelActiveLabel]}>{label}</Text></View>;
}

function Panel({ accent = false, children, title }: { accent?: boolean; children: ReactNode; title: string }) {
  return <View style={[styles.panel, accent && styles.accentPanel]}><Text style={[styles.panelTitle, accent && styles.accentTitle]}>{title}</Text>{children}</View>;
}

const styles = StyleSheet.create({
  backdrop: { backgroundColor: 'rgba(0, 0, 0, 0.72)', flex: 1, justifyContent: 'flex-end' }, modal: { backgroundColor: colors.pageBg, maxHeight: '94%', minHeight: '78%' },
  header: { borderBottomColor: colors.accent, borderBottomWidth: borderWidth, flexDirection: 'row', justifyContent: 'space-between', padding: spacing.lg }, title: { color: colors.text, fontFamily: fonts.body, fontSize: typography.sectionTitle, fontWeight: '700' }, sos: { color: colors.danger, fontFamily: fonts.number }, copy: { color: colors.textMuted, fontFamily: fonts.body, fontSize: typography.caption, marginTop: spacing.sm }, close: { alignItems: 'center', minHeight: 42, minWidth: 42 }, closeLabel: { color: colors.text, fontSize: 42, lineHeight: 36 },
  content: { gap: spacing.md, padding: spacing.lg, paddingBottom: spacing.xxl }, levels: { flexDirection: 'row', gap: spacing.sm }, level: { borderColor: colors.border, borderRadius: radius.xs, borderWidth: 1, flex: 1, padding: spacing.sm }, levelActive: { backgroundColor: colors.gold, borderColor: colors.gold }, levelLabel: { color: colors.textMuted, fontFamily: fonts.number, fontSize: typography.micro, textAlign: 'center' }, levelActiveLabel: { color: colors.ink },
  panel: { borderColor: colors.border, borderRadius: radius.xs, borderWidth: borderWidth, gap: spacing.sm, padding: spacing.md }, accentPanel: { borderColor: colors.accent }, panelTitle: { color: colors.text, fontFamily: fonts.body, fontSize: typography.cardTitle, fontWeight: '700' }, accentTitle: { color: colors.accent, fontFamily: fonts.number }, muted: { color: colors.textMuted, fontFamily: fonts.body, fontSize: typography.caption, lineHeight: 24 }, plan: { color: colors.text, fontFamily: fonts.body, fontSize: typography.caption, lineHeight: 25 }, apology: { color: colors.accent, fontFamily: fonts.body, fontSize: typography.caption, lineHeight: 25 }, quickActions: { flexDirection: 'row', gap: spacing.sm },
});
