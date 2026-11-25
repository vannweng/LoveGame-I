import { useState, type ReactNode } from 'react';
import { Text, TextInput, StyleSheet } from 'react-native';
import { journeyCopy as copy } from '@/content/journeyCopy';
import { getCopy } from '@/content';
import { AppButton, PageLayout, PixelCard } from '@/shared/ui';
import { colors, fonts, spacing } from '@/shared/theme/tokens';
import type { JourneyChapter, JourneyEvent, JourneyState } from '../domain/models';
import { previousChapter, taskStatus } from '../domain/journey';
import { taskAccent } from './journeyCardPresentation';
import { JourneyPlanPanel } from './JourneyPlanPanel';
import type { JourneyPlanActions } from '../application/createJourneyPlanActions';

export { JourneyHome } from './JourneyHome';

export function JourneyChapterView({ chapter, state, now, busy, onTask, onSaveReflection, onBack, planActions }: {
  chapter: JourneyChapter; state: JourneyState; now: Date; busy: boolean;
  onTask: (id: string) => void; onSaveReflection: (text: string) => Promise<boolean>; onBack: () => void;
  planActions: JourneyPlanActions;
}) {
  const [reflection, setReflection] = useState(chapter.reflection ?? '');
  const [saved, setSaved] = useState(false);
  const previous = previousChapter(state, chapter.event);
  return <PageLayout><Text style={styles.title}>{chapter.event.title}</Text><Text style={styles.muted}>{chapter.event.date} · {copy.routes[chapter.effort].title}</Text>
    <JourneyPlanPanel chapter={chapter} busy={busy} actions={planActions} />
    {previous?.reflection ? <PixelCard title={copy.previous}><Text style={styles.text}>{previous.reflection}</Text></PixelCard> : null}
    {chapter.tasks.map((task) => <PixelCard accentColor={taskAccent(taskStatus(task, now))} key={task.mission.id} title={getCopy(task.mission.template.titleKey)} subtitle={task.result ? copy.result[task.result] : copy.status[taskStatus(task, now)]}>
      <Text style={styles.text}>{getCopy(task.mission.template.descriptionKey)}</Text>
      <Text style={styles.muted}>提醒日：{new Date(task.opensAt).toLocaleDateString()} · 準時期限：{task.mission.successUntil.toLocaleDateString()} 00:00 前</Text>
      <AppButton label={task.result ? '查看內容' : '查看下一步'} secondary={Boolean(task.result) || taskStatus(task, now) === 'scheduled'} disabled={busy} onPress={() => onTask(task.mission.id)} />
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
  title: { color: colors.accent, fontFamily: fonts.body, fontSize: 26 },
  text: { color: colors.text, fontFamily: fonts.body, fontSize: 15, lineHeight: 24 },
  muted: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 14, lineHeight: 23 },
  routeHint: { alignItems: 'baseline', flexDirection: 'row', flexWrap: 'wrap' },
  link: { color: colors.accent, fontFamily: fonts.body, fontSize: 14, lineHeight: 23, textDecorationLine: 'underline' },
  input: { color: colors.text, borderColor: colors.border, borderWidth: 1, padding: spacing.sm, minHeight: 90 },
});
