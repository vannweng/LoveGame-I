import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { findTemplate, getDailyDrawOptions, getWeeklyDrawOptions, type ActivityBoardState, type ActivityTemplate } from '@/features/activities/domain';
import { mockActionGroups } from '@/features/actions/data/mockAppShellData';
import { getCopy } from '@/content';
import type { Mission } from '@/features/missions/domain';
import { AppButton } from '@/shared/ui/AppButton';
import { PixelCard } from '@/shared/ui/PixelCard';
import { PixelTag } from '@/shared/ui/PixelTag';
import { PageLayout } from '@/shared/ui/PageLayout';
import { colors, fonts, spacing, typography } from '@/shared/theme/tokens';

interface MissionBoardViewProps {
  board: ActivityBoardState;
  mission: Mission;
  relationshipDays: number;
  now: Date;
  onCompleteDaily: (reflection: string) => void;
  onCompleteWeekly: (reflection: string) => void;
  onCancelDaily: () => void;
  onCancelWeekly: () => void;
  onRerollDaily: () => void;
  onRerollWeekly: () => void;
  onSelectDaily: (templateId: string) => void;
  onSelectWeekly: (templateId: string) => void;
  onContinueDaily: () => void;
  onContinueWeekly: () => void;
  onShareWeekly: (template: ActivityTemplate) => void;
  onOpenMainMission: () => void;
  showMainMission: boolean;
}

export function MissionBoardView({ board, mission, relationshipDays, now, onCompleteDaily, onCompleteWeekly, onCancelDaily, onCancelWeekly, onRerollDaily, onOpenMainMission, onRerollWeekly, onSelectDaily, onSelectWeekly, onContinueDaily, onContinueWeekly, onShareWeekly, showMainMission }: MissionBoardViewProps) {
  const [dailyReflection, setDailyReflection] = useState(board.daily.reflection ?? '');
  const [weeklyReflection, setWeeklyReflection] = useState(board.weekly.reflection ?? '');
  const daily = findTemplate(board.daily.templateId);
  const weekly = findTemplate(board.weekly.templateId);
  const isWeekend = [0, 6].includes(now.getDay());
  const dailyOptions = getDailyDrawOptions(board, relationshipDays, now);
  const weeklyOptions = getWeeklyDrawOptions(board, now);
  return <PageLayout>
    <Text style={styles.eyebrow}>[LOVE LOOP] DAY {relationshipDays}</Text>
    {showMainMission ? <PixelCard accentColor={colors.orange} title={getCopy(mission.template.titleKey)} subtitle="重要日，別裝沒看見" trailing={<PixelTag color={colors.orange} label="要緊" />}><Text style={styles.description}>{getCopy(mission.template.descriptionKey)}</Text><Text style={styles.reward}>這關有點要緊，別滑掉。</Text><AppButton label="去面對重要日" onPress={onOpenMainMission} size="S" /></PixelCard> : null}
    <DailyCard completedIds={board.daily.completedTemplateIds} options={dailyOptions} reflection={dailyReflection} rerollUsed={board.rerollUsed} template={daily} onCancel={() => { setDailyReflection(''); onCancelDaily(); }} onComplete={() => onCompleteDaily(dailyReflection)} onContinue={onContinueDaily} onReflectionChange={setDailyReflection} onReroll={onRerollDaily} onSelect={onSelectDaily} />
    <WeeklyCard completedIds={board.weekly.completedTemplateIds} isWeekend={isWeekend} options={weeklyOptions} reflection={weeklyReflection} rerollUsed={board.rerollUsed} template={weekly} onCancel={() => { setWeeklyReflection(''); onCancelWeekly(); }} onComplete={() => onCompleteWeekly(weeklyReflection)} onContinue={onContinueWeekly} onReflectionChange={setWeeklyReflection} onReroll={onRerollWeekly} onSelect={onSelectWeekly} onShare={onShareWeekly} />
  </PageLayout>;
}

export function ActionsView() {
  return <PageLayout>{mockActionGroups.map((group) => <PixelCard key={group.title} accentColor={colors.violet} title={group.title} subtitle={getCopy('ACTION_MENU')}>{group.items.map((item) => <View key={item} style={styles.item}><Text style={styles.itemText}>{item}</Text><Text style={styles.arrow}>{getCopy('ACTION_ARROW')}</Text></View>)}</PixelCard>)}</PageLayout>;
}

function DailyCard({ completedIds, options, reflection, rerollUsed, template, onCancel, onComplete, onContinue, onReflectionChange, onReroll, onSelect }: { completedIds: string[]; options: ActivityTemplate[]; reflection: string; rerollUsed: boolean; template: ReturnType<typeof findTemplate>; onCancel: () => void; onComplete: () => void; onContinue: () => void; onReflectionChange: (value: string) => void; onReroll: () => void; onSelect: (id: string) => void }) {
  if (!template) return <DrawDeck accent={colors.accent} cards={options} completedIds={completedIds} description="今天有三個小關卡，做不做隨你，別把它當欠條。" label="今日翻牌" onContinue={onContinue} onSelect={onSelect} />;
  return <PixelCard accentColor={template.kind === 'milestone' ? colors.gold : colors.accent} title={template.title} subtitle={template.kind === 'milestone' ? '關係里程碑，別鬧' : '今天抽到你'} trailing={<PixelTag color={template.kind === 'milestone' ? colors.gold : colors.accent} label="今日份" />}><Text style={styles.description}>{template.description}</Text><Text style={styles.reward}>做了就好，不必交心得報告。</Text><TextInput maxLength={140} onChangeText={onReflectionChange} placeholder={template.reflectionPlaceholder} placeholderTextColor={colors.textMuted} style={styles.input} value={reflection} /><View style={styles.actions}><AppButton label="我做完了，給過" onPress={onComplete} size="S" /><AppButton label="今天先放過我" onPress={onCancel} secondary size="S" />{template.kind === 'daily' && options.length === 3 && completedIds.length === 0 && !rerollUsed ? <AppButton label="這張不行，換" onPress={onReroll} secondary size="S" /> : null}</View></PixelCard>;
}

function WeeklyCard({ completedIds, isWeekend, options, reflection, rerollUsed, template, onCancel, onComplete, onContinue, onReflectionChange, onReroll, onSelect, onShare }: { completedIds: string[]; isWeekend: boolean; options: ActivityTemplate[]; reflection: string; rerollUsed: boolean; template: ReturnType<typeof findTemplate>; onCancel: () => void; onComplete: () => void; onContinue: () => void; onReflectionChange: (value: string) => void; onReroll: () => void; onSelect: (id: string) => void; onShare: (template: ActivityTemplate) => void }) {
  if (!isWeekend) return null;
  if (!template) return <DrawDeck accent={colors.violet} cards={options} completedIds={completedIds} description="週末別只躺著滑，找伴侶一起玩一張。" label="週末搞事" onContinue={onContinue} onSelect={onSelect} />;
  return <PixelCard accentColor={colors.violet} title={template.title} subtitle="週末一起搞事" trailing={<PixelTag color={colors.violet} label="週末" />}><Text style={styles.description}>{template.description}</Text><Text style={styles.reward}>一起玩比較好玩，至少有人背鍋。</Text><AppButton label="丟給伴侶一起玩" onPress={() => onShare(template)} secondary size="S" /><Text style={styles.prompt}>{template.reflectionPrompt}（想寫再寫）</Text><TextInput maxLength={140} onChangeText={onReflectionChange} placeholder={template.reflectionPlaceholder} placeholderTextColor={colors.textMuted} style={styles.input} value={reflection} /><View style={styles.actions}><AppButton label="搞定，下一位" onPress={onComplete} size="S" /><AppButton label="今天先算了" onPress={onCancel} secondary size="S" />{options.length === 3 && completedIds.length === 0 && !rerollUsed ? <AppButton label="這題太硬，重抽" onPress={onReroll} secondary size="S" /> : null}</View></PixelCard>;
}

function DrawDeck({ accent, cards, completedIds, description, label, onContinue, onSelect }: { accent: string; cards: ActivityTemplate[]; completedIds: string[]; description: string; label: string; onContinue: () => void; onSelect: (id: string) => void }) {
  const remaining = cards.filter((card) => !completedIds.includes(card.id));
  const completed = cards.filter((card) => completedIds.includes(card.id));
  if (!remaining.length) return <PixelCard accentColor={accent} title={label} subtitle="收工"><Text style={styles.complete}>今天這幾張都處理了。罕見，值得紀念。</Text></PixelCard>;
  if (completed.length) return <PixelCard accentColor={accent} title={label} subtitle="還有戲"><CompletedCards cards={completed} /><AppButton label="再來一張，別怕" onPress={onContinue} secondary size="S" /></PixelCard>;
  if (remaining.length === 1) return <PixelCard accentColor={accent} title={label} subtitle="LAST CARD"><View style={styles.preview}><Text style={styles.previewTitle}>{remaining[0].title}</Text><Text style={styles.prompt}>{remaining[0].description}</Text><AppButton label="選這張卡" onPress={() => onSelect(remaining[0].id)} size="S" /></View></PixelCard>;
  return <PixelCard accentColor={accent} title={label} subtitle="CARD DRAW"><Text style={styles.description}>{description}</Text><CompletedCards cards={completed} /><View style={styles.deck}>{remaining.map((card, index) => <Pressable key={card.id} onPress={() => onSelect(card.id)} style={[styles.cover, index === 1 && styles.coverMiddle]}><Text style={[styles.coverMark, { color: accent }]}>?</Text><Text style={styles.coverText}>CARD {index + 1}</Text></Pressable>)}</View><Text style={styles.prompt}>{completed.length ? `剩下 ${remaining.length} 張卡，想繼續玩再選一張就好。` : '選一張卡，翻開今天的任務。'}</Text></PixelCard>;
}

function CompletedCards({ cards }: { cards: ActivityTemplate[] }) {
  if (!cards.length) return null;
  return <View style={styles.doneGroup}>{cards.map((card) => <View key={card.id} style={styles.doneCard}><Text style={styles.complete}>DONE</Text><Text style={styles.previewTitle}>{card.title}</Text></View>)}</View>;
}

const styles = StyleSheet.create({
  eyebrow: { color: colors.accent, fontFamily: fonts.number, fontSize: typography.micro, letterSpacing: 1 },
  description: { color: colors.text, fontFamily: fonts.body, fontSize: typography.body, lineHeight: 24 },
  reward: { color: colors.gold, fontFamily: fonts.number, fontSize: typography.caption },
  prompt: { color: colors.textMuted, fontFamily: fonts.body, fontSize: typography.caption },
  input: { borderColor: colors.border, borderWidth: 1, color: colors.text, fontFamily: fonts.body, fontSize: typography.caption, minHeight: 42, padding: spacing.sm },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  complete: { color: colors.safe, fontFamily: fonts.body, fontSize: typography.caption, lineHeight: 20 },
  locked: { color: colors.textMuted, fontFamily: fonts.body, fontSize: typography.caption },
  preview: { backgroundColor: colors.subBoxBg, gap: spacing.xs, padding: spacing.sm }, previewTitle: { color: colors.text, fontFamily: fonts.body, fontSize: typography.caption },
  doneGroup: { gap: spacing.xs }, doneCard: { backgroundColor: colors.subBoxBg, borderColor: colors.safe, borderWidth: 1, gap: spacing.xs, padding: spacing.sm },
  availableCard: { backgroundColor: colors.subBoxBg, borderColor: colors.border, borderWidth: 1, gap: spacing.xs, padding: spacing.sm }, selectHint: { fontFamily: fonts.number, fontSize: typography.caption },
  deck: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'center' }, cover: { alignItems: 'center', backgroundColor: colors.subBoxBg, borderColor: colors.border, borderWidth: 2, flex: 1, minHeight: 112, justifyContent: 'center' }, coverMiddle: { marginTop: spacing.sm }, coverMark: { fontFamily: fonts.number, fontSize: 32 }, coverText: { color: colors.textMuted, fontFamily: fonts.number, fontSize: typography.micro },
  item: { alignItems: 'center', backgroundColor: colors.subBoxBg, flexDirection: 'row', gap: spacing.sm, justifyContent: 'space-between', minWidth: 0, padding: spacing.sm },
  itemText: { color: colors.text, flex: 1, flexShrink: 1, fontFamily: fonts.body, fontSize: typography.caption }, arrow: { color: colors.violet, flexShrink: 0, fontFamily: fonts.number, fontSize: typography.caption },
});
