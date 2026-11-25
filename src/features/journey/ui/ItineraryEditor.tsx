import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import type { ImportantDateItinerary, ItineraryItem } from '../domain/models';
import { AppButton } from '@/shared/ui/AppButton';
import { colors, fonts, spacing, typography } from '@/shared/theme/tokens';
import { useStoredDraft } from '@/shared/hooks/useStoredDraft';

export function ItineraryEditor({ itinerary, busy, onSave }: {
  itinerary: ImportantDateItinerary; busy: boolean; onSave: (item: ItineraryItem) => Promise<boolean>;
}) {
  return <View style={styles.container}>{itinerary.items.filter((item) => item.kind !== 'transport' && item.status !== 'confirmed').map((item) => <ItineraryRow busy={busy} item={item} key={item.id} onSave={onSave} />)}</View>;
}

function ItineraryRow({ item, busy, onSave }: { item: ItineraryItem; busy: boolean; onSave: (item: ItineraryItem) => Promise<boolean> }) {
  const [draft, setDraft, acknowledge] = useStoredDraft(item.id, item);
  const [saved, setSaved] = useState(false);
  return <View style={styles.item}>
    <View style={styles.times}><TimeInput label="開始" value={draft.startTime} onChangeText={(startTime) => { setDraft({ ...draft, startTime }); setSaved(false); }} /><TimeInput label="結束" value={draft.endTime} onChangeText={(endTime) => { setDraft({ ...draft, endTime }); setSaved(false); }} /></View>
    <TextInput accessibilityLabel={`${item.title}名稱`} maxLength={80} onChangeText={(title) => { setDraft({ ...draft, title }); setSaved(false); }} placeholder="行程名稱" placeholderTextColor={colors.textMuted} style={styles.titleInput} value={draft.title} />
    <TextInput accessibilityLabel={`${item.title}備註`} maxLength={180} multiline onChangeText={(description) => { setDraft({ ...draft, description }); setSaved(false); }} placeholder="備註" placeholderTextColor={colors.textMuted} style={styles.descriptionInput} value={draft.description} />
    <Text style={styles.label}>活動地址（更換地點時請一起修改）</Text>
    <TextInput accessibilityLabel={`${item.title}地址`} value={draft.location?.address ?? ''} style={styles.titleInput} onChangeText={(address) => { setDraft({ ...draft, location: { name: draft.title, walkMinutes: 10, ...draft.location, address } }); setSaved(false); }} />
    <Text style={styles.label}>鄰近捷運站</Text>
    <TextInput accessibilityLabel={`${item.title}捷運站`} value={draft.location?.station ?? ''} style={styles.titleInput} onChangeText={(station) => { setDraft({ ...draft, location: { name: draft.title, address: '', walkMinutes: 10, ...draft.location, station } }); setSaved(false); }} />
    <Text style={styles.label}>到捷運站步行（分鐘）</Text>
    <TextInput accessibilityLabel={`${item.title}步行分鐘`} keyboardType="number-pad" value={String(draft.location?.walkMinutes ?? 10)} style={styles.titleInput} onChangeText={(value) => { setDraft({ ...draft, location: { name: draft.title, address: '', ...draft.location, walkMinutes: Number(value) } }); setSaved(false); }} />
    <AppButton disabled={busy} label="儲存這個時段" onPress={() => { void onSave(draft).then((success) => { if (success) acknowledge(draft); setSaved(success); }); }} secondary size="S" />
    {saved ? <Text style={styles.saved}>已保存，這個時段不會被系統自動覆蓋。</Text> : null}
  </View>;
}

function TimeInput({ label, value, onChangeText }: { label: string; value: string; onChangeText: (value: string) => void }) {
  return <View style={styles.timeField}><Text style={styles.label}>{label}</Text><TextInput accessibilityLabel={`${label}時間`} keyboardType="numbers-and-punctuation" maxLength={5} onChangeText={onChangeText} placeholder="18:30" placeholderTextColor={colors.textMuted} style={styles.timeInput} value={value} /></View>;
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  item: { backgroundColor: colors.subBoxBg, gap: spacing.xs, padding: spacing.sm },
  times: { flexDirection: 'row', gap: spacing.sm },
  timeField: { flex: 1, gap: spacing.xs },
  label: { color: colors.textMuted, fontFamily: fonts.body, fontSize: typography.micro },
  timeInput: { borderBottomColor: colors.border, borderBottomWidth: 1, color: colors.text, fontFamily: fonts.number, paddingVertical: spacing.xs },
  titleInput: { borderBottomColor: colors.border, borderBottomWidth: 1, color: colors.text, fontFamily: fonts.body, fontSize: typography.body, paddingVertical: spacing.xs },
  descriptionInput: { color: colors.textMuted, fontFamily: fonts.body, fontSize: typography.caption, minHeight: 50, paddingVertical: spacing.xs },
  saved: { color: colors.safe, fontFamily: fonts.body, fontSize: typography.micro },
});
