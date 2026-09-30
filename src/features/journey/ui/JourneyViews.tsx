import { useState, type ReactNode } from 'react';
import { Pressable, Text, TextInput, StyleSheet, View } from 'react-native';
import { journeyCopy as copy } from '@/content/journeyCopy';
import { getCopy } from '@/content';
import { AppButton, PageLayout, PixelCard } from '@/shared/ui';
import { colors, fonts, spacing } from '@/shared/theme/tokens';
import type { JourneyChapter, JourneyEvent, JourneyState } from '../domain/models';
import { nextTask, previousChapter, taskStatus } from '../domain/journey';
import { chapterProgress, countdownCopy, getJourneyCardEvents } from './journeyCardPresentation';

interface HomeProps {
  events: JourneyEvent[];
  state: JourneyState;
  now: Date;
  onOpen: (event: JourneyEvent) => void;
  onStart: (event: JourneyEvent) => void;
  onDates: () => void;
}

export function JourneyHome({ events, state, now, onOpen, onStart, onDates }: HomeProps) {
  const visible = getJourneyCardEvents(events, state, now).slice(0, 1);
  return <PageLayout>
    <Text style={styles.title}>{copy.home}</Text><Text style={styles.text}>{copy.subtitle}</Text>
    <Text style={styles.muted}>遊戲 Rank {state.gameState.rankScore} · EXP {state.gameState.exp} · Combo {state.gameState.combo}</Text>
    {!visible.length ? <PixelCard title="第一個重要日"><Text style={styles.text}>{copy.empty}</Text></PixelCard> : null}
    {visible.map((event) => {
      const chapter = state.chapters.find((item) => item.event.sourceId === event.sourceId && item.event.date === event.date);
      const next = chapter && nextTask(chapter, now);
      return <PixelCard accentColor={colors.accent} key={`${event.sourceId}:${event.date}`} title={event.title} subtitle={`${event.date} ·`}>
        <Text style={styles.text}>{countdownCopy(event, chapter, now)}</Text>
        {chapter && !chapter.completedAt ? <Text style={styles.text}>{chapterProgress(chapter)}</Text> : null}
        {chapter?.completedAt ? <Text style={styles.text}>準備已收尾，你們多了一段故事。</Text> : null}
        {next ? <Text style={styles.text}>{getCopy(next.mission.template.titleKey)} · {copy.status[taskStatus(next, now)]}</Text> : null}
        {!chapter ? <View style={styles.routeHint}><Text style={styles.muted}>{copy.routeHint.replace('{route}', copy.routes[event.effort].title)} </Text><Pressable accessibilityRole="link" onPress={onDates}><Text style={styles.link}>{copy.routeHintLink}</Text></Pressable></View> : null}
        <AppButton label={chapter?.completedAt ? '回看篇章' : chapter ? copy.open : copy.start} onPress={() => chapter ? onOpen(event) : onStart(event)} />
      </PixelCard>;
    })}
    {!visible.length ? <AppButton label="設定重要日期" onPress={onDates} secondary /> : null}
  </PageLayout>;
}

export function JourneyChapterView({ chapter, state, now, busy, onTask, onSaveReflection, onBack }: {
  chapter: JourneyChapter; state: JourneyState; now: Date; busy: boolean;
  onTask: (id: string) => void; onSaveReflection: (text: string) => Promise<boolean>; onBack: () => void;
}) {
  const [reflection, setReflection] = useState(chapter.reflection ?? '');
  const [saved, setSaved] = useState(false);
  const previous = previousChapter(state, chapter.event);
  return <PageLayout><Text style={styles.title}>{chapter.event.title}</Text><Text style={styles.muted}>{chapter.event.date} · {copy.routes[chapter.effort].title}</Text>
    {previous?.reflection ? <PixelCard title={copy.previous}><Text style={styles.text}>{previous.reflection}</Text></PixelCard> : null}
    {chapter.tasks.map((task) => <PixelCard accentColor={task.result ? colors.safe : colors.orange} key={task.mission.id} title={getCopy(task.mission.template.titleKey)} subtitle={task.result ? copy.result[task.result] : copy.status[taskStatus(task, now)]}>
      <Text style={styles.text}>{getCopy(task.mission.template.descriptionKey)}</Text>
      <Text style={styles.muted}>開放：{new Date(task.opensAt).toLocaleDateString()} · 準時期限：{task.mission.successUntil.toLocaleDateString()} 00:00 前</Text>
      {!task.result ? <AppButton label={taskStatus(task, now) === 'scheduled' && task.mission.template.id === 'birthday-card' ? copy.cardDraft.action : '查看下一步'} disabled={busy || (taskStatus(task, now) === 'scheduled' && task.mission.template.id !== 'birthday-card')} onPress={() => onTask(task.mission.id)} /> : null}
    </PixelCard>)}
    {chapter.completedAt ? <PixelCard accentColor={colors.gold} title={`篇章遺物：${chapter.event.title}準備手記`} subtitle="已保存在此裝置的篇章收藏">
      <Text style={styles.text}>{copy.reflection}</Text>
      <TextInput accessibilityLabel="篇章心得" multiline maxLength={300} value={reflection} onChangeText={(value) => { setReflection(value); setSaved(false); }} style={styles.input} placeholder="下次想延續或調整的一件事" placeholderTextColor={colors.textMuted} />
      <AppButton label="保存心得" disabled={busy} onPress={() => { void onSaveReflection(reflection).then(setSaved); }} />
      {saved ? <Text style={styles.text}>{copy.saved}</Text> : null}
    </PixelCard> : null}
    <AppButton label="回到重要日" onPress={onBack} secondary />
  </PageLayout>;
}

export function JourneyArchive({ state, onOpen, footer }: { state: JourneyState; onOpen: (event: JourneyEvent) => void; footer?: ReactNode }) {
  const chapters = state.chapters.filter((chapter) => chapter.completedAt).slice().reverse();
  return <PageLayout><Text style={styles.title}>{copy.archive}</Text>{!chapters.length ? <Text style={styles.text}>{copy.archiveEmpty}</Text> : null}
    {chapters.map((chapter) => <PixelCard accentColor={colors.gold} key={chapter.id} title={`${chapter.event.title}準備手記`} subtitle={`${chapter.event.date} · ${copy.routes[chapter.effort].title}`}>
      <Text style={styles.text}>{chapter.reflection || '每一步的結果都留在這裡，隨時可以補上一句心得。'}</Text>
      <AppButton label="翻開這段故事" onPress={() => onOpen(chapter.event)} secondary />
    </PixelCard>)}
    {footer}
  </PageLayout>;
}

const styles = StyleSheet.create({
  title: { color: colors.accent, fontFamily: fonts.body, fontSize: 22 },
  text: { color: colors.text, fontFamily: fonts.body, fontSize: 15, lineHeight: 24 },
  muted: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 12 },
  routeHint: { alignItems: 'baseline', flexDirection: 'row', flexWrap: 'wrap' },
  link: { color: colors.accent, fontFamily: fonts.body, fontSize: 12, textDecorationLine: 'underline' },
  input: { color: colors.text, borderColor: colors.border, borderWidth: 1, padding: spacing.sm, minHeight: 90 },
});
