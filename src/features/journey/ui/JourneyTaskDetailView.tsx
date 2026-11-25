import { useState } from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';

import { getCopy } from '@/content';
import { journeyCopy as copy } from '@/content/journeyCopy';
import { MissionRecommendations } from '@/features/recommendations/ui/MissionRecommendations';
import { AppButton, PageLayout, PixelCard } from '@/shared/ui';
import { colors, spacing } from '@/shared/theme/tokens';
import { taskStatus } from '../domain/journey';
import type { JourneyChapter, JourneyTask } from '../domain/models';
import type { JourneyPlanActions } from '../application/createJourneyPlanActions';
import { JourneyPlanPanel } from './JourneyPlanPanel';
import { PlanBookingForm } from './PlanBookingForm';
import { taskAccent } from './journeyCardPresentation';
import { useStoredDraft } from '@/shared/hooks/useStoredDraft';

export function JourneyTaskDetailView({ chapter, task, now, busy, onBack, onResolve, onSaveDraft, planActions }: {
  chapter: JourneyChapter; task: JourneyTask; now: Date; busy: boolean; onBack: () => void;
  onResolve: (draft?: string) => Promise<boolean>; onSaveDraft: (draft: string) => Promise<boolean>;
  planActions: JourneyPlanActions;
}) {
  const status = taskStatus(task, now);
  const isCard = task.mission.template.id === 'birthday-card';
  const isDinner = task.mission.template.missionType === 'date_dinner';
  const isCinema = task.mission.template.missionType === 'cinema_booking';
  const isItinerary = task.mission.template.missionType === 'itinerary_confirmation';
  const reservation = isCinema ? chapter.cinemaReservation ?? task.cinemaReservation : chapter.dinnerReservation ?? task.dinnerReservation;
  const [draft, setDraft, acknowledge] = useStoredDraft(task.mission.id, task.cardDraft ?? '');
  const [saved, setSaved] = useState(false);
  return <PageLayout><PixelCard accentColor={taskAccent(status)} title={getCopy(task.mission.template.titleKey)} subtitle={copy.status[status]}>
    <Text style={styles.text}>{getCopy(task.mission.template.descriptionKey)}</Text>
    <Text style={styles.muted}>提醒日：{new Date(task.opensAt).toLocaleDateString()}。這是建議處理時間，隨時可以完成。</Text>
    <Text style={styles.muted}>最終期限：{task.mission.failAt.toLocaleDateString()} 00:00。結果依回報時間判定。</Text>
    {isCard && !task.result ? <>
      <TextInput accessibilityLabel="卡片草稿" maxLength={500} multiline onChangeText={(value) => { setDraft(value); setSaved(false); }} placeholder={copy.cardDraft.placeholder} placeholderTextColor={colors.textMuted} style={styles.input} value={draft} />
      <AppButton disabled={busy} label={copy.cardDraft.save} onPress={() => { void onSaveDraft(draft).then((success) => { if (success) acknowledge(draft); setSaved(success); }); }} />
      {saved ? <Text style={styles.text}>{copy.cardDraft.saved}</Text> : null}
    </> : null}
    {isCard && task.result ? <><Text style={styles.text}>已完成的卡片內容（唯讀，可長按選取複製）</Text><Text selectable style={styles.cardContent}>{task.cardDraft || '這次沒有保存卡片內容。'}</Text></> : null}
    {isDinner || isCinema ? <PlanBookingForm key={`${task.mission.id}:booking`} kind={isCinema ? 'cinema' : 'dinner'} reservation={reservation} eventDate={chapter.event.date} busy={busy} onSave={planActions.onBooking} completeTask={!task.result && status !== 'fail'} preferences={chapter.preferences} /> : null}
    {!task.result && (!(isDinner || isCinema) || status === 'fail') ? <AppButton label={status === 'fail' ? '記錄這次未趕上' : '我已完成，記錄結果'} secondary={status === 'scheduled'} disabled={busy} onPress={() => { void onResolve(isCard ? draft : undefined); }} /> : null}
  </PixelCard>
    {isItinerary || isDinner || isCinema ? <JourneyPlanPanel chapter={chapter} busy={busy} actions={planActions} /> : <MissionRecommendations missionType={task.mission.template.missionType} preferences={chapter.preferences} />}
    <AppButton label="返回篇章" secondary onPress={onBack} />
  </PageLayout>;
}

const styles = StyleSheet.create({
  text: { color: colors.text }, muted: { color: colors.textMuted },
  input: { borderColor: colors.border, borderWidth: 1, color: colors.text, minHeight: 120, padding: spacing.sm },
  cardContent: { borderColor: colors.border, borderWidth: 1, color: colors.text, lineHeight: 24, padding: spacing.sm },
});
