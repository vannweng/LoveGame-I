import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { mockRelationshipSections } from '../../data/local/mockAppShellData';
import type { RelationshipProfile } from '../../domain/onboarding';
import { ScreenLayout } from '../components/ScreenLayout';
import { AppButton } from '../components/AppButton';
import { colors, radius, spacing } from '../theme/tokens';

export function RelationshipProfileScreen({ profile }: { profile: RelationshipProfile | null }) {
  const basic = profile ? `${profile.partnerNickname} · ${profile.relationshipStartDate}` : '尚未建立關係資料';
  return <ScreenLayout><View style={styles.hero}><Text style={styles.heroLabel}>關係檔案</Text><Text style={styles.heroText}>{basic}</Text></View>{mockRelationshipSections.map((section) => <View key={section.title} style={styles.card}><Text style={styles.title}>{section.title}</Text><Text style={styles.copy}>{section.title === '基本' ? basic : section.copy}</Text></View>)}</ScreenLayout>;
}

interface RelationshipSettingsScreenProps {
  profile: RelationshipProfile | null;
  onCancel: () => void;
  onSave: (profile: RelationshipProfile) => void;
}

export function RelationshipSettingsScreen({ profile, onCancel, onSave }: RelationshipSettingsScreenProps) {
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
  return <ScreenLayout><Text style={styles.settingsCopy}>低頻設定集中於此；儲存後會更新你的關係檔案。</Text><Text style={styles.section}>基本資料</Text><TextInput style={styles.input} value={partnerNickname} onChangeText={setPartnerNickname} placeholder="伴侶稱呼" placeholderTextColor={colors.textMuted} /><TextInput style={styles.input} value={relationshipStartDate} onChangeText={setRelationshipStartDate} placeholder="關係開始日 YYYY-MM-DD" placeholderTextColor={colors.textMuted} /><Text style={styles.section}>重要日</Text><TextInput style={styles.input} value={birthday} onChangeText={setBirthday} placeholder="生日 YYYY-MM-DD（選填）" placeholderTextColor={colors.textMuted} /><TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="自訂重要日名稱" placeholderTextColor={colors.textMuted} /><TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="自訂重要日 YYYY-MM-DD" placeholderTextColor={colors.textMuted} /><AppButton label={editingIndex === null ? '加入重要日' : '更新重要日'} onPress={saveDate} secondary />{dates.map((item, index) => <View key={`${item.title}-${item.date}-${index}`} style={styles.dateRow}><Text style={styles.dateText}>{item.title} · {item.date}</Text><View style={styles.rowActions}><AppButton label="編輯" onPress={() => { setEditingIndex(index); setTitle(item.title); setDate(item.date); }} secondary /><AppButton label="刪除" onPress={() => setDates(dates.filter((_, itemIndex) => itemIndex !== index))} secondary /></View></View>)}<View style={styles.actions}><AppButton label="取消" onPress={onCancel} secondary /><AppButton label="儲存變更" disabled={!canSave} onPress={() => onSave({ partnerNickname: partnerNickname.trim(), relationshipStartDate: relationshipStartDate.trim(), birthday: birthday.trim() || undefined, customImportantDates: dates })} /></View></ScreenLayout>;
}

const styles = StyleSheet.create({
  hero: { backgroundColor: colors.danger, borderRadius: radius.md, gap: spacing.xs, padding: spacing.md }, heroLabel: { color: colors.textMuted, fontWeight: '800' }, heroText: { color: colors.text, fontSize: 20, fontWeight: '900' },
  card: { backgroundColor: colors.surface, borderRadius: radius.md, gap: spacing.xs, padding: spacing.md }, title: { color: colors.gold, fontWeight: '900' }, copy: { color: colors.textMuted },
  settingsCopy: { color: colors.textMuted, lineHeight: 21 }, section: { color: colors.gold, fontSize: 17, fontWeight: '900', marginTop: spacing.sm },
  input: { backgroundColor: colors.surface, borderRadius: radius.sm, color: colors.text, padding: spacing.sm }, dateRow: { alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.sm, flexDirection: 'row', gap: spacing.sm, justifyContent: 'space-between', padding: spacing.sm }, dateText: { color: colors.text, flex: 1, fontWeight: '700' }, rowActions: { flexDirection: 'row', gap: spacing.xs }, actions: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'flex-end', marginTop: spacing.md },
});
