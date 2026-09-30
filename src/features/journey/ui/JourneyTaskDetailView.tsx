import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';
import { getCopy } from '@/content';
import { journeyCopy as copy } from '@/content/journeyCopy';
import { MissionRecommendations } from '@/features/recommendations/ui/MissionRecommendations';
import { AppButton, PageLayout, PixelCard } from '@/shared/ui';
import { colors, spacing } from '@/shared/theme/tokens';
import type { JourneyChapter, JourneyTask } from '../domain/models';
import { taskStatus } from '../domain/journey';

export function JourneyTaskDetailView({ chapter, task, now, busy, onBack, onResolve, onSaveDraft }: {
  chapter: JourneyChapter; task: JourneyTask; now: Date; busy: boolean; onBack: () => void;
  onResolve: () => Promise<boolean>; onSaveDraft: (draft: string) => Promise<boolean>;
}) {
  const scheduledCard = taskStatus(task, now) === 'scheduled' && task.mission.template.id === 'birthday-card';
  const [draft, setDraft] = useState(task.cardDraft ?? '');
  const [saved, setSaved] = useState(false);
  useEffect(() => { setDraft(task.cardDraft ?? ''); setSaved(false); }, [task.cardDraft, task.mission.id]);
  const status = scheduledCard ? copy.cardDraft.scheduled : copy.status[taskStatus(task, now)];
  return <PageLayout><PixelCard title={getCopy(task.mission.template.titleKey)} subtitle={status}>
    <Text style={styles.text}>{getCopy(task.mission.template.descriptionKey)}</Text>
    <Text style={styles.muted}>最終期限：{task.mission.failAt.toLocaleDateString()} 00:00。結果依回報時間判定。</Text>
    {scheduledCard ? <>
      <TextInput accessibilityLabel="卡片草稿" maxLength={500} multiline onChangeText={(value) => { setDraft(value); setSaved(false); }} placeholder={copy.cardDraft.placeholder} placeholderTextColor={colors.textMuted} style={styles.input} value={draft} />
      <AppButton disabled={busy} label={copy.cardDraft.save} onPress={() => { void onSaveDraft(draft).then(setSaved); }} />
      {saved ? <Text style={styles.text}>{copy.cardDraft.saved}</Text> : null}
    </> : <AppButton label={taskStatus(task, now) === 'fail' ? '記錄這次未趕上' : '我已完成，記錄結果'} disabled={busy || Boolean(task.result) || taskStatus(task, now) === 'scheduled'} onPress={() => { void onResolve(); }} />}
  </PixelCard><MissionRecommendations missionType={task.mission.template.missionType} preferences={chapter.preferences} /><AppButton label="返回篇章" secondary onPress={onBack} /></PageLayout>;
}

const styles = StyleSheet.create({
  text: { color: colors.text },
  muted: { color: colors.textMuted },
  input: { borderColor: colors.border, borderWidth: 1, color: colors.text, minHeight: 120, padding: spacing.sm },
});
