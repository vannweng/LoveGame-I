import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { journeyCopy as copy } from '@/content/journeyCopy';
import { getCopy } from '@/content';
import { AppButton, PageLayout, PixelCard } from '@/shared/ui';
import { colors, fonts, typography } from '@/shared/theme/tokens';
import { nextTask, taskStatus } from '../domain/journey';
import type { JourneyEvent, JourneyState } from '../domain/models';
import { chapterProgress, countdownCopy, getJourneyCardEvents } from './journeyCardPresentation';

export function JourneyQuestView({ events, footer, now, onDates, onOpen, onStart, state }: { events: JourneyEvent[]; footer?: ReactNode; now: Date; onDates: () => void; onOpen: (event: JourneyEvent) => void; onStart: (event: JourneyEvent) => void; state: JourneyState }) {
  const cards = getJourneyCardEvents(events, state, now);
  return <PageLayout><Text style={styles.title}>{copy.quest}</Text><Text style={styles.copy}>{copy.questSubtitle}</Text>
    {!cards.length ? <PixelCard title={copy.questEmptyTitle}><Text style={styles.copy}>{copy.questEmpty}</Text></PixelCard> : null}
    {cards.map((event) => {
      const chapter = state.chapters.find((item) => item.event.sourceId === event.sourceId && item.event.date === event.date);
      const task = chapter ? nextTask(chapter, now) : null;
      return <PixelCard accentColor={chapter ? colors.orange : colors.accent} key={`${event.sourceId}:${event.date}`} subtitle={`${event.date} ·`} title={event.title}>
        <Text style={styles.copy}>{countdownCopy(event, chapter, now)}</Text>
        {chapter && !chapter.completedAt ? <Text style={styles.copy}>{chapterProgress(chapter)}</Text> : null}
        <Text style={styles.copy}>{task ? `${getCopy(task.mission.template.titleKey)} · ${copy.status[taskStatus(task, now)]}` : chapter?.completedAt ? copy.questCompleted : copy.questReady}</Text>
        {!chapter ? <View style={styles.routeHint}><Text style={styles.copy}>{copy.routeHint.replace('{route}', copy.routes[event.effort].title)} </Text><Pressable accessibilityRole="link" onPress={onDates}><Text style={styles.link}>{copy.routeHintLink}</Text></Pressable></View> : null}
        <AppButton label={chapter?.completedAt ? copy.questReview : chapter ? copy.open : copy.start} onPress={() => chapter ? onOpen(event) : onStart(event)} />
      </PixelCard>;
    })}
    {footer}
  </PageLayout>;
}

const styles = StyleSheet.create({
  copy: { color: colors.textMuted, fontFamily: fonts.body, fontSize: typography.body, lineHeight: 24 },
  title: { color: colors.accent, fontFamily: fonts.body, fontSize: 22 },
  routeHint: { alignItems: 'baseline', flexDirection: 'row', flexWrap: 'wrap' },
  link: { color: colors.accent, fontFamily: fonts.body, fontSize: typography.body, textDecorationLine: 'underline' },
});
