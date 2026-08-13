import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { mockRelationshipSections } from '@/features/actions/data/mockAppShellData';
import { getCopy } from '@/content';
import type { RelationshipProfile } from '@/features/relationship/domain';
import { PageLayout } from '@/shared/ui/PageLayout';
import { AppButton } from '@/shared/ui/AppButton';
import { PixelCard } from '@/shared/ui/PixelCard';
import { PixelTag } from '@/shared/ui/PixelTag';
import { borderWidth, colors, fonts, radius, spacing, typography } from '@/shared/theme/tokens';
import { formatLocalDateInput } from '@/shared/utils/formatLocalDateInput';

export function RelationshipProfileView({ profile }: { profile: RelationshipProfile | null }) {
  const basic = profile ? `${profile.partnerNickname} · ${profile.relationshipStartDate}` : getCopy('RELATIONSHIP_NO_PROFILE');
  return <PageLayout><Text style={styles.eyebrow}>{getCopy('RELATIONSHIP_EYEBROW')}</Text><PixelCard accentColor={colors.pink} title={getCopy('RELATIONSHIP_TITLE')} subtitle={getCopy('RELATIONSHIP_SUBTITLE')} trailing={<PixelTag color={colors.pink} label={getCopy('RELATIONSHIP_P2_LINK')} />}><Text style={styles.heroText}>{basic}</Text></PixelCard>{mockRelationshipSections.map((section) => <PixelCard key={section.title} title={section.title} subtitle={getCopy('RELATIONSHIP_PROFILE_DATA')}><Text style={styles.copy}>{section.title === getCopy('PROFILE_SECTION_BASIC') ? basic : section.copy}</Text></PixelCard>)}</PageLayout>;
}

interface RelationshipSettingsViewProps {
  profile: RelationshipProfile | null;
  onCancel: () => void;
  onSave: (profile: RelationshipProfile) => void;
}

export function RelationshipSettingsView({ profile, onCancel, onSave }: RelationshipSettingsViewProps) {
  const [partnerNickname, setPartnerNickname] = useState(profile?.partnerNickname ?? '');
  const [relationshipStartDate, setRelationshipStartDate] = useState(profile?.relationshipStartDate ?? '');
  const [birthday, setBirthday] = useState(profile?.birthday ?? '');
  const [dates, setDates] = useState(profile?.customImportantDates ?? []);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const canSave = partnerNickname.trim() && relationshipStartDate.trim();
  const saveDate = () => {
    if (!title.trim() || !date.trim()) return;
    const next = { title: title.trim(), date: date.trim() };
    setDates(editingIndex === null ? [...dates, next] : dates.map((item, index) => index === editingIndex ? next : item));
    setTitle(''); setDate(''); setEditingIndex(null);
  };
  return <PageLayout><Text style={styles.eyebrow}>{getCopy('RELATIONSHIP_SETTINGS')}</Text><Text style={styles.settingsCopy}>{getCopy('RELATIONSHIP_SETTINGS_COPY')}</Text><Text style={styles.section}>{getCopy('RELATIONSHIP_BASIC')}</Text><TextInput style={styles.input} value={partnerNickname} onChangeText={setPartnerNickname} placeholder={getCopy('RELATIONSHIP_PARTNER_PLACEHOLDER')} placeholderTextColor={colors.textMuted} /><TextInput inputMode="numeric" keyboardType="numeric" maxLength={10} style={styles.input} value={relationshipStartDate} onChangeText={(value) => setRelationshipStartDate(formatLocalDateInput(value))} placeholder={getCopy('RELATIONSHIP_START_DATE_PLACEHOLDER')} placeholderTextColor={colors.textMuted} /><Text style={styles.section}>{getCopy('RELATIONSHIP_DATES')}</Text><TextInput inputMode="numeric" keyboardType="numeric" maxLength={10} style={styles.input} value={birthday} onChangeText={(value) => setBirthday(formatLocalDateInput(value))} placeholder={getCopy('RELATIONSHIP_BIRTHDAY_PLACEHOLDER')} placeholderTextColor={colors.textMuted} /><TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder={getCopy('RELATIONSHIP_CUSTOM_TITLE_PLACEHOLDER')} placeholderTextColor={colors.textMuted} /><TextInput inputMode="numeric" keyboardType="numeric" maxLength={10} style={styles.input} value={date} onChangeText={(value) => setDate(formatLocalDateInput(value))} placeholder={getCopy('RELATIONSHIP_CUSTOM_DATE_PLACEHOLDER')} placeholderTextColor={colors.textMuted} /><AppButton label={editingIndex === null ? getCopy('RELATIONSHIP_ADD_DATE') : getCopy('RELATIONSHIP_UPDATE_DATE')} onPress={saveDate} secondary />{dates.map((item, index) => <View key={`${item.title}-${item.date}-${index}`} style={styles.dateRow}><Text style={styles.dateText}>{item.title} · {item.date}</Text><View style={styles.rowActions}><AppButton label={getCopy('RELATIONSHIP_EDIT')} onPress={() => { setEditingIndex(index); setTitle(item.title); setDate(item.date); }} secondary size="S" /><AppButton label={getCopy('RELATIONSHIP_DELETE')} onPress={() => setDates(dates.filter((_, itemIndex) => itemIndex !== index))} secondary size="S" /></View></View>)}<View style={styles.actions}><AppButton label={getCopy('RELATIONSHIP_CANCEL')} onPress={onCancel} secondary /><AppButton label={getCopy('RELATIONSHIP_SAVE')} disabled={!canSave} onPress={() => onSave({ partnerNickname: partnerNickname.trim(), relationshipStartDate: relationshipStartDate.trim(), birthday: birthday.trim() || undefined, customImportantDates: dates })} /></View></PageLayout>;
}

const styles = StyleSheet.create({
  eyebrow: { color: colors.accent, fontFamily: fonts.number, fontSize: typography.micro }, heroText: { color: colors.text, fontFamily: fonts.body, fontSize: typography.cardTitle, fontWeight: '700' },
  copy: { color: colors.textMuted, fontFamily: fonts.body, fontSize: typography.caption }, settingsCopy: { color: colors.textMuted, fontFamily: fonts.body, fontSize: typography.caption, lineHeight: 21 }, section: { color: colors.gold, fontFamily: fonts.body, fontSize: typography.cardTitle, fontWeight: '700', marginTop: spacing.sm },
  input: { backgroundColor: colors.cardBg, borderColor: colors.border, borderRadius: radius.xs, borderWidth, color: colors.text, fontFamily: fonts.body, fontSize: typography.caption, padding: spacing.sm }, dateRow: { alignItems: 'center', backgroundColor: colors.subBoxBg, flexDirection: 'row', gap: spacing.sm, justifyContent: 'space-between', padding: spacing.sm }, dateText: { color: colors.text, flex: 1, fontFamily: fonts.body, fontSize: typography.caption }, rowActions: { flexDirection: 'row', gap: spacing.xs }, actions: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'flex-end', marginTop: spacing.md },
});
