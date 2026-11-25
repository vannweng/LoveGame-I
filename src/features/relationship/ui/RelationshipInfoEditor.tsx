import { useState, type ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { getCopy } from '@/content';
import { withRelationshipProfileDefaults, type RelationshipMode, type RelationshipProfile } from '@/features/relationship/domain';
import { canSaveRelationshipInfo, invalidDateMessage } from '../domain/validateProfileDates';
import { isCalendarDate } from '@/shared/utils/calendarDate';
import { borderWidth, colors, fonts, radius, spacing, typography } from '@/shared/theme/tokens';
import { formatLocalDateInput } from '@/shared/utils/formatLocalDateInput';
import { RelationshipEditorLayout } from './RelationshipEditorLayout';
import { useResponsiveLayout } from '@/shared/hooks/useResponsiveLayout';

interface RelationshipInfoEditorProps {
  profile: RelationshipProfile | null;
  userName: string;
  relationshipMode: RelationshipMode;
  onCancel: () => void;
  onSave: (profile: RelationshipProfile) => void;
}

export function RelationshipInfoEditor({ onCancel, onSave, profile, userName, relationshipMode }: RelationshipInfoEditorProps) {
  const { isCompact } = useResponsiveLayout();
  const baseProfile = withRelationshipProfileDefaults(profile);
  const [userNickname, setUserNickname] = useState(baseProfile.userNickname ?? userName);
  const [partnerNickname, setPartnerNickname] = useState(baseProfile.partnerNickname);
  const [relationshipMotto, setRelationshipMotto] = useState(baseProfile.relationshipMotto ?? '');
  const [relationshipStartDate, setRelationshipStartDate] = useState(baseProfile.relationshipStartDate);
  const [marriageDate, setMarriageDate] = useState(baseProfile.marriageDate ?? '');
  const [relationshipStatus, setRelationshipStatus] = useState(baseProfile.relationshipStatus);
  const single = relationshipMode === 'single';
  const nextProfile = { ...baseProfile, marriageDate: marriageDate.trim() || undefined, partnerNickname: partnerNickname.trim(), relationshipMotto: relationshipMotto.trim() || undefined, relationshipStartDate: relationshipStartDate.trim(), relationshipStatus, userNickname: userNickname.trim() };
  const canSave = canSaveRelationshipInfo(nextProfile, relationshipMode);

  return <RelationshipEditorLayout onCancel={onCancel} onSave={() => { if (canSave) onSave(nextProfile); }} saveDisabled={!canSave} subtitle={getCopy('RELATIONSHIP_EDITOR_BASIC_SUBTITLE')} title={getCopy('RELATIONSHIP_QUICK_BASIC')}>
    <View style={[styles.row, isCompact && styles.compactRow]}><Field label={getCopy('RELATIONSHIP_P1_NICKNAME')} onChangeText={setUserNickname} value={userNickname} /><Field label={single ? '曖昧對象稱呼（選填）' : getCopy('RELATIONSHIP_P2_NICKNAME')} onChangeText={setPartnerNickname} value={partnerNickname} /></View>
    <Field label={getCopy('RELATIONSHIP_MOTTO')} multiline onChangeText={setRelationshipMotto} placeholder={getCopy('RELATIONSHIP_MOTTO_PLACEHOLDER')} value={relationshipMotto} />
    <Text style={styles.label}>{getCopy('RELATIONSHIP_STATUS')}</Text>
    {single ? <Text style={styles.label}>{partnerNickname.trim() ? '單身／曖昧中' : '單身練習'}（不需填伴侶或交往日期）</Text> : <View style={styles.statuses}><StatusOption active={relationshipStatus === 'dating'} label={getCopy('RELATIONSHIP_STATUS_DATING')} onPress={() => setRelationshipStatus('dating')} /><StatusOption active={relationshipStatus === 'married'} label={getCopy('RELATIONSHIP_STATUS_MARRIED')} onPress={() => setRelationshipStatus('married')} /></View>}
    <Field inputMode="numeric" keyboardType="numeric" label={single ? '紀念起始日（選填）' : getCopy('RELATIONSHIP_START_DATE')} maxLength={10} onChangeText={(value) => setRelationshipStartDate(formatLocalDateInput(value))} value={relationshipStartDate} />
    {relationshipStartDate && !isCalendarDate(relationshipStartDate.trim()) ? <Text accessibilityRole="alert" style={{ color: colors.danger }}>{invalidDateMessage}</Text> : null}
    <View style={styles.marriageDateSlot}>{relationshipStatus === 'married' ? <Field inputMode="numeric" keyboardType="numeric" label={getCopy('RELATIONSHIP_MARRIED_DATE')} maxLength={10} onChangeText={(value) => setMarriageDate(formatLocalDateInput(value))} placeholder={getCopy('RELATIONSHIP_MARRIAGE_DATE_PLACEHOLDER')} value={marriageDate} /> : null}</View>
    {marriageDate && !isCalendarDate(marriageDate.trim()) ? <Text accessibilityRole="alert" style={{ color: colors.danger }}>{invalidDateMessage}</Text> : null}
  </RelationshipEditorLayout>;
}

function Field({ label, ...props }: { label: string } & ComponentProps<typeof TextInput>) {
  return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput placeholderTextColor={colors.textMuted} style={styles.input} {...props} /></View>;
}

function StatusOption({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={[styles.statusOption, active && styles.activeStatus]}><Text style={[styles.statusLabel, active && styles.activeStatusLabel]}>{`[${label}]`}</Text></Pressable>;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm }, compactRow: { flexDirection: 'column' },
  field: { flex: 1, gap: spacing.xs, minWidth: 0 },
  label: { color: colors.text, fontFamily: fonts.body, fontSize: typography.cardTitle, fontWeight: '700' },
  input: { borderColor: colors.border, borderRadius: radius.xs, borderWidth, color: colors.text, fontFamily: fonts.body, fontSize: typography.body, minHeight: 48, padding: spacing.sm },
  statuses: { flexDirection: 'row', gap: spacing.sm },
  marriageDateSlot: { minHeight: 72 },
  statusOption: { alignItems: 'center', borderColor: colors.border, borderRadius: radius.xs, borderWidth, flex: 1, minHeight: 48, justifyContent: 'center', padding: spacing.sm },
  activeStatus: { backgroundColor: colors.accent, borderColor: colors.accent },
  statusLabel: { color: colors.text, fontFamily: fonts.number, fontSize: typography.caption },
  activeStatusLabel: { color: colors.ink },
});
