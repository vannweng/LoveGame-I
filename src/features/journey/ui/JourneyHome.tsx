import { Pressable, StyleSheet, Text, View } from 'react-native';

import { getCopy } from '@/content';
import { journeyCopy as copy } from '@/content/journeyCopy';
import { AppButton, PageLayout, PixelCard } from '@/shared/ui';
import { PixelIcon } from '@/shared/ui/PixelIcon';
import { colors, fonts, spacing, typography } from '@/shared/theme/tokens';
import { nextTask, taskStatus } from '../domain/journey';
import { createSuggestedItinerary } from '../domain/itinerary';
import type { JourneyChapter, JourneyEvent, JourneyState } from '../domain/models';
import { chapterProgress, countdownCopy, getJourneyCardEvents } from './journeyCardPresentation';
import { ImportantDateItinerary } from './ImportantDateItinerary';

interface HomeProps {
  events: JourneyEvent[];
  state: JourneyState;
  now: Date;
  onOpen: (event: JourneyEvent) => void;
  onOpenTask: (event: JourneyEvent, missionId: string) => void;
  onStart: (event: JourneyEvent) => void;
  onDates: () => void;
}

export function JourneyHome({ events, state, now, onOpen, onOpenTask, onStart, onDates }: HomeProps) {
  const event = getJourneyCardEvents(events, state, now)[0];
  const chapter = event && state.chapters.find((item) =>
    item.event.sourceId === event.sourceId && item.event.date === event.date);
  const task = chapter && nextTask(chapter, now);
  const todayEvents = events.filter((item) => item.daysRemaining === 0);

  return (
    <PageLayout>
      {event ? (
        <View style={styles.event}>
          <View style={styles.eventHeading}>
            <PixelIcon name="calendar" color={colors.accent} />
            <Text style={styles.date}>{event.date}</Text>
          </View>
          <Text accessibilityRole="header" style={styles.title}>{event.title}</Text>
          <Countdown event={event} chapter={chapter} now={now} />
          {chapter ? (
            <Text style={styles.copy}>
              {chapter.completedAt ? copy.questCompleted : chapterProgress(chapter)}
            </Text>
          ) : (
            <View style={styles.route}>
              <Text style={styles.copy}>{copy.routes[event.effort].title}</Text>
              <Text style={styles.muted}>{copy.routes[event.effort].description}</Text>
              <Pressable accessibilityRole="link" onPress={onDates} style={styles.routeLink}>
                <Text style={styles.link}>{copy.routeHintLink}</Text>
              </Pressable>
            </View>
          )}
          <AppButton
            label={chapter?.completedAt ? copy.questReview : chapter ? '查看全部準備任務' : copy.start}
            onPress={() => chapter ? onOpen(event) : onStart(event)}
          />
        </View>
      ) : (
        <PixelCard title="第一個重要日">
          <Text style={styles.copy}>{copy.empty}</Text>
          <AppButton label="設定重要日期" onPress={onDates} />
        </PixelCard>
      )}
      {task && event ? (
        <View style={styles.nextSection}>
          <Text accessibilityRole="header" style={styles.sectionTitle}>下一個任務</Text>
          <Pressable accessibilityRole="button" onPress={() => onOpenTask(event, task.mission.id)} style={styles.nextTask}>
            <View style={styles.taskCopy}>
              <Text style={styles.taskTitle}>{getCopy(task.mission.template.titleKey)}</Text>
              <Text style={styles.muted}>{copy.status[taskStatus(task, now)]}</Text>
              <Text style={styles.muted}>提醒日 {new Date(task.opensAt).toLocaleDateString()}</Text>
            </View>
            <PixelIcon name="chevron-right" color={colors.accent} />
          </Pressable>
        </View>
      ) : null}
      {todayEvents.map((today) => {
        const active = state.chapters.find((item) =>
          item.event.sourceId === today.sourceId && item.event.date === today.date);
        return (
          <PixelCard key={`${today.sourceId}:${today.date}`} title="專屬約會行程" subtitle={`${today.title} · 今天`}>
            <ImportantDateItinerary itinerary={active?.itinerary ?? createSuggestedItinerary(today)} />
            <AppButton label={active ? '調整行程' : '開始並調整行程'} secondary
              onPress={() => active ? onOpen(today) : onStart(today)} />
          </PixelCard>
        );
      })}
      <View style={styles.stats}>
        <Text style={styles.stat}>Rank {state.gameState.rankScore}</Text>
        <Text style={styles.stat}>EXP {state.gameState.exp}</Text>
        <Text style={styles.stat}>Combo {state.gameState.combo}</Text>
      </View>
    </PageLayout>
  );
}

function Countdown({ event, chapter, now }: { event: JourneyEvent; chapter?: JourneyChapter; now: Date }) {
  if (event.daysRemaining <= 0) {
    return <Text style={styles.countdownCopy}>{countdownCopy(event, chapter, now)}</Text>;
  }
  return (
    <Text accessibilityLabel={`還有 ${event.daysRemaining} 天`} style={styles.countdown}>
      {event.daysRemaining}<Text style={styles.dayLabel}> 天後</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  event: { borderColor: colors.accent, borderWidth: 3, gap: spacing.xl, padding: spacing.xl },
  eventHeading: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  date: { color: colors.accent, flex: 1, fontFamily: fonts.number, fontSize: typography.caption },
  title: { color: colors.text, fontFamily: fonts.display, fontSize: 32, lineHeight: 44 },
  countdown: { color: colors.text, fontFamily: fonts.number, fontSize: 52, lineHeight: 64 },
  dayLabel: { fontSize: typography.body },
  countdownCopy: { color: colors.text, fontFamily: fonts.body, fontSize: typography.sectionTitle, lineHeight: 30 },
  copy: { color: colors.text, fontFamily: fonts.body, fontSize: typography.body, lineHeight: 26 },
  muted: { color: colors.textMuted, fontFamily: fonts.body, fontSize: typography.caption, lineHeight: 23 },
  route: { gap: spacing.sm },
  routeLink: { justifyContent: 'center', minHeight: 48 },
  link: { color: colors.accent, fontFamily: fonts.body, fontSize: typography.caption, lineHeight: 23, textDecorationLine: 'underline' },
  nextSection: { gap: spacing.md },
  sectionTitle: { color: colors.text, fontFamily: fonts.display, fontSize: typography.sectionTitle },
  nextTask: { alignItems: 'center', borderColor: colors.border, borderWidth: 1, flexDirection: 'row', gap: spacing.md, minHeight: 80, padding: spacing.lg },
  taskCopy: { flex: 1, gap: spacing.sm },
  taskTitle: { color: colors.text, fontFamily: fonts.body, fontSize: typography.cardTitle, lineHeight: 26 },
  stats: { borderTopColor: colors.border, borderTopWidth: 1, flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg, justifyContent: 'space-between', paddingVertical: spacing.lg },
  stat: { color: colors.textMuted, fontFamily: fonts.number, fontSize: typography.caption },
});
