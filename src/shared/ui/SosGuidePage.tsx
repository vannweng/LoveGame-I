import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { getCopy, sosGuides, type SosGuideLevel } from '@/content';
import type { ClipboardService } from '@/infrastructure/clipboard';
import { useResponsiveLayout } from '@/shared/hooks/useResponsiveLayout';
import { borderWidth, colors, fonts, radius, spacing, typography } from '@/shared/theme/tokens';
import { AppButton } from './AppButton';

export function SosGuidePage({ clipboardService, onClose }: { clipboardService: ClipboardService; onClose: () => void }) {
  const [level, setLevel] = useState<SosGuideLevel>('level1');
  const [copied, setCopied] = useState(false);
  const { isCompact } = useResponsiveLayout();
  const guide = sosGuides[level];
  const copyApology = () => void clipboardService.copyText(getCopy(guide.apologyKey)).then(() => setCopied(true));
  return <View style={styles.page}><View style={[styles.header, isCompact && styles.compactHeader]}><View style={styles.headerCopy}><Text style={styles.title}><Text style={styles.sos}>[SOS]</Text> {getCopy('GG_SOS_TITLE')}</Text><Text style={styles.copy}>{getCopy('GG_SOS_COACH_COPY')}</Text></View><CloseButton label={getCopy('GG_SOS_CLOSE_A11Y')} onPress={onClose} /></View><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}><View style={styles.levels}>{(Object.keys(sosGuides) as SosGuideLevel[]).map((guideLevel) => <Level active={level === guideLevel} compact={isCompact} key={guideLevel} label={getCopy(sosGuides[guideLevel].levelLabelKey)} onPress={() => { setLevel(guideLevel); setCopied(false); }} />)}</View><Panel title={getCopy(guide.diagnosisTitleKey)}><Text style={styles.muted}>{getCopy(guide.diagnosisKeys[0])}</Text><Text style={styles.muted}>{getCopy(guide.diagnosisKeys[1])}</Text></Panel><Panel title={getCopy('GG_SOS_ACTION_PLAN')} accent><Text style={styles.plan}>{getCopy(guide.actionKeys[0])}</Text><Text style={styles.plan}>{getCopy(guide.actionKeys[1])}</Text></Panel><Panel title={getCopy('GG_SOS_APOLOGY_CODE')} trailing={<CopyButton copied={copied} onPress={copyApology} />}><Text style={styles.apology}>{getCopy(guide.apologyKey)}</Text></Panel><Panel title={getCopy('GG_SOS_QUICK_ACTIONS')}><View style={[styles.quickActions, isCompact && styles.compactQuickActions]}><View style={styles.quickAction}><AppButton label={getCopy(guide.quickActionKeys[0])} onPress={() => undefined} secondary /></View><View style={styles.quickAction}><AppButton label={getCopy(guide.quickActionKeys[1])} onPress={() => undefined} secondary /></View></View></Panel></ScrollView></View>;
}

export function CloseButton({ label, onPress }: { label: string; onPress: () => void }) {
  return <Pressable accessibilityLabel={label} accessibilityRole="button" onPress={onPress} style={styles.close}><Text style={styles.closeLabel}>×</Text></Pressable>;
}

function Level({ active = false, compact, label, onPress }: { active?: boolean; compact: boolean; label: string; onPress: () => void }) {
  return <Pressable accessibilityRole="radio" accessibilityState={{ selected: active }} onPress={onPress} style={[styles.level, active && styles.levelActive]}><Text numberOfLines={compact ? 2 : 1} style={[styles.levelLabel, active && styles.levelActiveLabel]}>{label}</Text></Pressable>;
}

function CopyButton({ copied, onPress }: { copied: boolean; onPress: () => void }) {
  return <Pressable accessibilityLabel={getCopy('GG_SOS_COPY_A11Y')} accessibilityRole="button" onPress={onPress} style={styles.copyButton}><Text style={styles.copyButtonLabel}>{copied ? getCopy('GG_SOS_COPIED') : '⧉'}</Text></Pressable>;
}

function Panel({ accent = false, children, title, trailing }: { accent?: boolean; children: ReactNode; title: string; trailing?: ReactNode }) {
  return <View style={[styles.panel, accent && styles.accentPanel]}><View style={styles.panelHeader}><Text style={[styles.panelTitle, accent && styles.accentTitle]}>{title}</Text>{trailing}</View>{children}</View>;
}

const styles = StyleSheet.create({
  page: { backgroundColor: colors.pageBg, flex: 1 },
  header: { borderBottomColor: colors.accent, borderBottomWidth: borderWidth, flexDirection: 'row', gap: spacing.sm, justifyContent: 'space-between', padding: spacing.lg }, compactHeader: { paddingHorizontal: spacing.md }, headerCopy: { flex: 1, minWidth: 0 },
  title: { color: colors.text, flexShrink: 1, fontFamily: fonts.body, fontSize: typography.sectionTitle, fontWeight: '700' }, sos: { color: colors.danger, fontFamily: fonts.number }, copy: { color: colors.textMuted, fontFamily: fonts.body, fontSize: typography.caption, marginTop: spacing.sm }, close: { alignItems: 'center', flexShrink: 0, minHeight: 42, minWidth: 42 }, closeLabel: { color: colors.text, fontSize: 42, lineHeight: 36 },
  content: { gap: spacing.md, padding: spacing.lg, paddingBottom: spacing.xxl }, levels: { flexDirection: 'row', gap: spacing.sm }, level: { borderColor: colors.border, borderRadius: radius.xs, borderWidth: 1, flex: 1, minWidth: 0, padding: spacing.sm }, levelActive: { backgroundColor: colors.gold, borderColor: colors.gold }, levelLabel: { color: colors.textMuted, fontFamily: fonts.number, fontSize: typography.micro, textAlign: 'center' }, levelActiveLabel: { color: colors.ink },
  panel: { borderColor: colors.border, borderRadius: radius.xs, borderWidth: borderWidth, gap: spacing.sm, padding: spacing.md }, panelHeader: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm, justifyContent: 'space-between' }, accentPanel: { borderColor: colors.accent }, panelTitle: { color: colors.text, flex: 1, fontFamily: fonts.body, fontSize: typography.cardTitle, fontWeight: '700' }, accentTitle: { color: colors.accent, fontFamily: fonts.number }, copyButton: { alignItems: 'center', borderColor: colors.accent, borderRadius: radius.xs, borderWidth: 1, flexShrink: 0, minHeight: 32, minWidth: 40, paddingHorizontal: spacing.sm, justifyContent: 'center' }, copyButtonLabel: { color: colors.accent, fontFamily: fonts.number, fontSize: typography.caption }, muted: { color: colors.textMuted, fontFamily: fonts.body, fontSize: typography.caption, lineHeight: 24 }, plan: { color: colors.text, fontFamily: fonts.body, fontSize: typography.caption, lineHeight: 25 }, apology: { color: colors.accent, fontFamily: fonts.body, fontSize: typography.caption, lineHeight: 25 }, quickActions: { flexDirection: 'row', gap: spacing.sm }, compactQuickActions: { flexDirection: 'column' }, quickAction: { flex: 1, minWidth: 0 },
});
