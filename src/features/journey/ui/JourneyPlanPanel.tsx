import { useState } from 'react';
import { Text } from 'react-native';
import { AppButton, PixelCard } from '@/shared/ui';
import { colors } from '@/shared/theme/tokens';
import { buildItinerary } from '../domain/itinerary';
import type { JourneyChapter } from '../domain/models';
import type { JourneyPlanActions } from '../application/createJourneyPlanActions';
import { ImportantDateItinerary } from './ImportantDateItinerary';
import { ItineraryEditor } from './ItineraryEditor';
import { PlanBookingForm } from './PlanBookingForm';

export function JourneyPlanPanel({ chapter, busy, actions, initiallyEditing = false }: {
  chapter: JourneyChapter; busy: boolean; actions: JourneyPlanActions; initiallyEditing?: boolean;
}) {
  const [editing, setEditing] = useState(initiallyEditing);
  const itinerary = chapter.itinerary ?? buildItinerary(chapter);
  const dinner = chapter.dinnerReservation ?? chapter.tasks.find((task) => task.dinnerReservation)?.dinnerReservation;
  const cinema = chapter.cinemaReservation ?? chapter.tasks.find((task) => task.cinemaReservation)?.cinemaReservation;
  return <PixelCard accentColor={colors.pink} title="專屬約會行程" subtitle={`${chapter.event.date} · 台北市 · 捷運優先`}>
    <ImportantDateItinerary itinerary={itinerary} busy={busy} onReplace={actions.onReplace} />
    <AppButton label={editing ? '收起行程編輯' : '修改預訂／行程'} secondary onPress={() => setEditing(!editing)} />
    {editing ? <>
      <Text style={{ color: colors.textMuted }}>回報已訂好也會同步完成對應準備任務；已完成的任務不會重複計分。</Text>
      <PlanBookingForm kind="dinner" eventDate={chapter.event.date} reservation={dinner} busy={busy} onSave={actions.onBooking} preferences={chapter.preferences} />
      <PlanBookingForm kind="cinema" eventDate={chapter.event.date} reservation={cinema} busy={busy} onSave={actions.onBooking} />
      <Text style={{ color: colors.textMuted }}>已預訂的時段請從上方回報表修改。其他活動可自行調整，系統會保留並更新交通。</Text>
      <ItineraryEditor itinerary={itinerary} busy={busy} onSave={actions.onSaveItem} />
    </> : null}
  </PixelCard>;
}
