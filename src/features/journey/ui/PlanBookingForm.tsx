import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { taipeiPlanPlaces } from '@/content/taipeiPlanPlaces';
import { openRecommendationSearch } from '@/features/recommendations/application/openRecommendationSearch';
import { AppButton } from '@/shared/ui/AppButton';
import { colors, fonts, spacing } from '@/shared/theme/tokens';
import type { BookingReport, CinemaReservation, DinnerReservation, PlanLocation } from '../domain/models';
import type { RelationshipPreferences } from '@/features/relationship/domain';
import { recommendForMission } from '@/features/recommendations/domain';
import { useStoredDraft } from '@/shared/hooks/useStoredDraft';

export function PlanBookingForm({ kind, eventDate, reservation, busy, onSave, completeTask = false, preferences }: {
  kind: BookingReport['kind']; eventDate: string; reservation?: DinnerReservation | CinemaReservation; busy: boolean;
  onSave: (report: BookingReport) => Promise<boolean>; completeTask?: boolean;
  preferences?: RelationshipPreferences;
}) {
  const [draft, setDraft, acknowledge] = useStoredDraft(`${eventDate}:${kind}`, initialReport(kind, reservation));
  const [saved, setSaved] = useState(false);
  const [openError, setOpenError] = useState(false);
  const preset = taipeiPlanPlaces.find((place) => place.placeId === draft.location.placeId);
  const dinners = recommendForMission('date_dinner', preferences ?? { style: 'practical', preferenceTags: [], dietaryPreferences: [], landmines: [] });
  const places = taipeiPlanPlaces.filter((place) => place.kind === kind && (kind === 'cinema' || dinners.some((candidate) => candidate.id === place.placeId)));
  const update = (key: keyof BookingReport, value: string | number) => { setDraft({ ...draft, [key]: value }); setSaved(false); };
  const updateLocation = (change: Partial<PlanLocation>) => { setDraft({ ...draft, location: { ...draft.location, ...change, placeId: undefined } }); setSaved(false); };
  return <View style={styles.container}>
    <Text style={styles.title}>{kind === 'cinema' ? '電影訂票回報' : '餐廳訂位回報'}</Text>
    <Text style={styles.note}>{eventDate} 當日 · {kind === 'cinema' ? '請依票券核對開演時間與片長；另留 20 分鐘入場。' : '請核對訂位時間；用餐長度預設 120 分鐘，可調整。'}</Text>
    <View style={styles.choices}>{places.map((place) => <AppButton disabled={busy} key={place.placeId} label={kind === 'dinner' ? `${place.name} · NT$${dinners.find((candidate) => candidate.id === place.placeId)?.price?.amountTwd ?? '—'} 起` : place.name} secondary={preset?.placeId !== place.placeId} size="S" onPress={() => { setDraft({ ...draft, name: place.name, location: place }); setSaved(false); }} />)}</View>
    {kind === 'dinner' ? <Text style={styles.note}>起價以平台最新資訊為準。素食／食物過敏需求下不推薦未驗證餐廳；自行回報的店家仍需確認飲食需求。</Text> : null}
    {preset ? <AppButton label={kind === 'cinema' ? '查看影城／訂票頁' : '查看餐廳／訂位頁'} secondary size="S" onPress={() => { setOpenError(false); void openRecommendationSearch(preset.url).catch(() => setOpenError(true)); }} /> : null}
    <Field label={kind === 'cinema' ? '影城分店' : '餐廳分店'} value={draft.name} placeholder="選上方分店，或填自己的地點" onChange={(value) => { setDraft({ ...draft, name: value, location: { ...draft.location, name: value, placeId: undefined } }); setSaved(false); }} />
    <Field label="分店地址" value={draft.location.address} placeholder="請填完整地址" onChange={(address) => updateLocation({ address })} />
    <Field label="鄰近捷運站" value={draft.location.station ?? ''} placeholder="例如：台北101/世貿、台北車站、士林" onChange={(station) => updateLocation({ station })} />
    {!preset ? <Text style={styles.note}>目前支援市區紅、藍、綠線與大安—南京復興的文湖線車站。</Text> : null}
    <View style={styles.times}>
      <View style={styles.timeField}><Field numeric label="到捷運站步行（分鐘）" value={String(draft.location.walkMinutes ?? 10)} onChange={(value) => updateLocation({ walkMinutes: Number(value) })} /></View>
      <View style={styles.timeField}><Field label={kind === 'cinema' ? '開演 HH:mm' : '訂位 HH:mm'} value={draft.startTime} placeholder={kind === 'cinema' ? '15:30' : '18:30'} onChange={(value) => update('startTime', value)} /></View>
    </View>
    <Field numeric label={kind === 'cinema' ? '片長／散場前佔用時間（分鐘，請核對）' : '預留用餐時間（分鐘）'} value={String(draft.durationMinutes || '')} onChange={(value) => update('durationMinutes', Number(value))} />
    {kind === 'cinema' ? <Field label="電影名稱（選填）" value={draft.movieTitle ?? ''} onChange={(value) => update('movieTitle', value)} /> : null}
    <AppButton disabled={busy} label={completeTask ? '回報已訂好，保存並完成任務' : '保存預訂並重新安排行程'} onPress={() => { void onSave(draft).then((success) => { if (success) acknowledge(draft); setSaved(success); }); }} />
    {saved ? <Text style={styles.saved}>已保存；行程已依預訂時間與地點更新。</Text> : null}
    {openError ? <Text style={styles.error}>暫時無法開啟平台，請稍後再試。</Text> : null}
  </View>;
}

function initialReport(kind: BookingReport['kind'], reservation?: DinnerReservation | CinemaReservation): BookingReport {
  const name = reservation ? 'restaurantName' in reservation ? reservation.restaurantName : reservation.cinemaName : '';
  return { kind, name, startTime: reservation?.reservedTime ?? '', durationMinutes: reservation?.durationMinutes ?? 120, location: reservation?.location ?? { name, address: '', walkMinutes: 10 }, movieTitle: reservation && 'movieTitle' in reservation ? reservation.movieTitle : '' };
}

function Field({ label, value, placeholder, onChange, numeric = false }: { label: string; value: string; placeholder?: string; onChange: (value: string) => void; numeric?: boolean }) {
  return <View style={styles.field}><Text style={styles.note}>{label}</Text><TextInput accessibilityLabel={label} editable value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor={colors.textMuted} style={styles.input} keyboardType={numeric ? 'number-pad' : 'default'} maxLength={160} /></View>;
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.subBoxBg, padding: spacing.sm, gap: spacing.sm },
  title: { color: colors.gold, fontFamily: fonts.body, fontSize: 16, fontWeight: '700' },
  note: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 12, lineHeight: 18 },
  choices: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  field: { gap: spacing.xs }, input: { borderColor: colors.border, borderWidth: 1, padding: spacing.sm, color: colors.text, fontFamily: fonts.body },
  times: { flexDirection: 'row', gap: spacing.sm }, timeField: { flex: 1 },
  saved: { color: colors.safe, fontFamily: fonts.body, fontSize: 12 }, error: { color: colors.danger },
});
