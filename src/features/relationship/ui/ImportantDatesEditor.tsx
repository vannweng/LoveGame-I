import { useState, type ComponentProps } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { getCopy } from '@/content';
import { withRelationshipProfileDefaults, type CustomImportantDate, type RelationshipProfile } from '@/features/relationship/domain';
import { AppButton } from '@/shared/ui/AppButton';
import { borderWidth, colors, fonts, radius, spacing, typography } from '@/shared/theme/tokens';
import { formatLocalDateInput } from '@/shared/utils/formatLocalDateInput';
import { RelationshipEditorLayout } from './RelationshipEditorLayout';
import { useResponsiveLayout } from '@/shared/hooks/useResponsiveLayout';

interface ImportantDatesEditorProps {
  profile: RelationshipProfile | null;
  onCancel: () => void;
  onSave: (profile: RelationshipProfile) => void;
}

export function ImportantDatesEditor({ onCancel, onSave, profile }: ImportantDatesEditorProps) {
  const { isCompact } = useResponsiveLayout();
  const baseProfile = withRelationshipProfileDefaults(profile);
  const [birthday, setBirthday] = useState(baseProfile.birthday ?? '');
  const [dates, setDates] = useState(baseProfile.customImportantDates);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [importance, setImportance] = useState<CustomImportantDate['importance']>('survival');
  const addDate = () => {
    if (!title.trim() || !date.trim() || dates.length >= 3) return;
    setDates([...dates, { title: title.trim(), date: date.trim(), recurrence: 'yearly', importance }]);
    setTitle('');
    setDate('');
    setImportance('survival');
  };

  return <RelationshipEditorLayout onCancel={onCancel} onSave={() => onSave({ ...baseProfile, birthday: birthday.trim() || undefined, customImportantDates: dates })} subtitle={getCopy('RELATIONSHIP_EDITOR_DATES_SUBTITLE')} title={getCopy('RELATIONSHIP_QUICK_DATES')}>
    <Field inputMode="numeric" keyboardType="numeric" label={getCopy('RELATIONSHIP_BIRTHDAY')} maxLength={10} onChangeText={(value) => setBirthday(formatLocalDateInput(value))} placeholder={getCopy('RELATIONSHIP_BIRTHDAY_PLACEHOLDER')} value={birthday} />
    <Text style={styles.section}>{getCopy('RELATIONSHIP_DATES')}</Text>
    {dates.map((item, index) => <DateRow compact={isCompact} item={item} key={index} onChange={(next) => setDates(dates.map((dateItem, dateIndex) => dateIndex === index ? next : dateItem))} onRemove={() => setDates(dates.filter((_, dateIndex) => dateIndex !== index))} />)}
    {dates.length < 3 ? <View style={styles.addCard}>
      <Field label={getCopy('RELATIONSHIP_CUSTOM_TITLE_PLACEHOLDER')} onChangeText={setTitle} value={title} />
      <Field inputMode="numeric" keyboardType="numeric" label={getCopy('RELATIONSHIP_CUSTOM_DATE_PLACEHOLDER')} maxLength={10} onChangeText={(value) => setDate(formatLocalDateInput(value))} value={date} />
      <ImportancePicker importance={importance} onChange={setImportance} />
      <AppButton disabled={!title.trim() || !date.trim()} label={getCopy('RELATIONSHIP_ADD_DATE_MAX')} onPress={addDate} secondary />
    </View> : null}
  </RelationshipEditorLayout>;
}

function Field({ label, ...props }: { label: string } & ComponentProps<typeof TextInput>) {
  return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput placeholderTextColor={colors.textMuted} style={styles.input} {...props} /></View>;
}

function DateRow({ compact, item, onChange, onRemove }: { compact: boolean; item: CustomImportantDate; onChange: (item: CustomImportantDate) => void; onRemove: () => void }) {
  return <View style={[styles.dateRow, compact && styles.compactDateRow]}><View style={[styles.dateFields, compact && styles.compactDateFields]}><TextInput onChangeText={(title) => onChange({ ...item, title })} placeholder={getCopy('RELATIONSHIP_CUSTOM_TITLE_PLACEHOLDER')} placeholderTextColor={colors.textMuted} style={styles.dateInput} value={item.title} /><TextInput inputMode="numeric" keyboardType="numeric" maxLength={10} onChangeText={(date) => onChange({ ...item, date: formatLocalDateInput(date) })} placeholder={getCopy('RELATIONSHIP_CUSTOM_DATE_PLACEHOLDER')} placeholderTextColor={colors.textMuted} style={styles.dateInput} value={item.date} /><Text style={styles.yearly}>{getCopy('RELATIONSHIP_DATE_YEARLY')}</Text><ImportancePicker importance={item.importance} onChange={(importance) => onChange({ ...item, importance })} /></View><AppButton label={getCopy('RELATIONSHIP_DELETE_DATE')} onPress={onRemove} size="S" secondary /></View>;
}

function ImportancePicker({ importance, onChange }: { importance: CustomImportantDate['importance']; onChange: (importance: CustomImportantDate['importance']) => void }) {
  const key = importance === 'survival' ? 'RELATIONSHIP_DATE_SURVIVAL_COPY' : 'RELATIONSHIP_DATE_NORMAL_COPY';
  return <View style={styles.importance}><Text style={styles.importanceLabel}>{getCopy('RELATIONSHIP_DATE_IMPORTANCE')}</Text><View style={styles.importanceButtons}><AppButton label={getCopy('RELATIONSHIP_DATE_SURVIVAL')} onPress={() => onChange('survival')} secondary={importance !== 'survival'} size="S" /><AppButton label={getCopy('RELATIONSHIP_DATE_NORMAL')} onPress={() => onChange('normal')} secondary={importance !== 'normal'} size="S" /></View><Text style={styles.importanceCopy}>{getCopy(key)}</Text></View>;
}

const styles = StyleSheet.create({
  field: { gap: spacing.xs },
  label: { color: colors.text, fontFamily: fonts.body, fontSize: typography.cardTitle, fontWeight: '700' },
  input: { borderColor: colors.border, borderRadius: radius.xs, borderWidth, color: colors.text, fontFamily: fonts.body, fontSize: typography.body, minHeight: 44, padding: spacing.sm },
  section: { color: colors.gold, fontFamily: fonts.body, fontSize: typography.cardTitle, fontWeight: '700' },
  addCard: { borderColor: colors.border, borderRadius: radius.sm, borderWidth, gap: spacing.md, padding: spacing.md },
  dateRow: { alignItems: 'center', borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: 'row', gap: spacing.sm, minWidth: 0, paddingBottom: spacing.sm }, compactDateRow: { alignItems: 'stretch', flexDirection: 'column' },
  dateFields: { flex: 1, flexDirection: 'row', gap: spacing.sm, minWidth: 0 }, compactDateFields: { flexDirection: 'column' },
  dateInput: { borderColor: colors.border, borderRadius: radius.xs, borderWidth: 1, color: colors.text, flex: 1, fontFamily: fonts.body, fontSize: typography.caption, minHeight: 40, minWidth: 0, padding: spacing.sm },
  yearly: { color: colors.gold, fontFamily: fonts.number, fontSize: typography.micro },
  importance: { gap: spacing.xs }, importanceLabel: { color: colors.textMuted, fontFamily: fonts.body, fontSize: typography.caption }, importanceButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs }, importanceCopy: { color: colors.textMuted, fontFamily: fonts.body, fontSize: typography.micro },
});
