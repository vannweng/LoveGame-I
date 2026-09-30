import { useState } from 'react';
import { Text } from 'react-native';
import { AppShell } from '@/application/navigation/AppShell';
import { featureFlags } from '@/application/config/featureFlags';
import type { BottomTab } from '@/application/navigation/BottomNavigation';
import { AuthLoadingView } from '@/application/providers/AuthLoadingView';
import type { GameplayProgress } from '@/features/missions/data/GameplayRepository';
import { getRelationshipDashboardMetrics, withRelationshipProfileDefaults, type RelationshipProfile } from '@/features/relationship/domain';
import { RebirthView } from '@/features/missions/ui/RebirthView';
import { CollectionView } from '@/features/collection/ui/CollectionView';
import { reviveRun } from '@/game/run';
import { AppButton, PageLayout } from '@/shared/ui';
import { colors } from '@/shared/theme/tokens';
import { useJourney } from '../application/useJourney';
import { useJourneyReminders } from '../application/useJourneyReminders';
import { chapterId, getJourneyEvents } from '../domain/journeyEvents';
import { resolveChapterTask, saveChapterReflection, saveChapterTaskDraft, startChapter } from '../domain/journey';
import type { JourneyEvent } from '../domain/models';
import { JourneyArchive, JourneyChapterView, JourneyHome } from './JourneyViews';
import { JourneyProfile } from './JourneyProfile';
import { JourneyActivities } from './JourneyActivities';
import { JourneyQuestView } from './JourneyQuestView';
import { createJourneyPreview } from '@/application/dev/createJourneyPreview';
import type { DevelopmentScenario, DevScenarioConfiguration } from '@/application/dev/developmentScenario';
import { ActionsView } from '@/features/actions/ui/ActionsView';
import { JourneyTaskDetailView } from './JourneyTaskDetailView';

export function JourneyExperience({ userId, userName, initial, profile, onSaveProfile, onResetAndSignOut, onSignOut }: {
  userId: string; userName: string; initial: GameplayProgress; profile: RelationshipProfile;
  onSaveProfile: (profile: RelationshipProfile) => Promise<void>; onResetAndSignOut: () => Promise<void>; onSignOut: () => void;
}) {
  const journey = useJourney(userId, initial);
  const [page, setPage] = useState('home');
  const [event, setEvent] = useState<JourneyEvent | null>(null);
  const [missionId, setMissionId] = useState<string | null>(null);
  const [previewProfile, setPreviewProfile] = useState<RelationshipProfile | null>(null);
  const activeProfile = previewProfile ?? profile;
  const [profileError, setProfileError] = useState('');
  const { state, now, busy, mutate } = journey;
  useJourneyReminders(userId, journey.isPreview ? null : state, (id) => {
    const chapter = state?.chapters.find((item) => item.tasks.some((task) => task.mission.id === id));
    if (chapter) { setEvent(chapter.event); setMissionId(id); setPage('chapter'); }
  });
  if (!state) return journey.error ? <PageLayout><Text style={{ color: colors.danger }}>{journey.error}</Text><AppButton label="重試" onPress={journey.retry} /></PageLayout> : <AuthLoadingView />;
  const metrics = getRelationshipDashboardMetrics(activeProfile, now);
  const events = getJourneyEvents(activeProfile, now);
  const chapter = event ? state.chapters.find((item) => item.id === chapterId(event)) : undefined;
  const task = chapter?.tasks.find((item) => item.mission.id === missionId);
  const openEvent = (next: JourneyEvent) => { setEvent(next); setMissionId(null); setPage('chapter'); };
  const startFromHome = (next: JourneyEvent) => {
    void mutate((current) => startChapter(current, next, next.effort, withRelationshipProfileDefaults(activeProfile).preferences, journey.actionTime()))
      .then((saved) => { if (saved) openEvent(next); });
  };
  const tab: BottomTab = page.startsWith('profile') ? 'profile' : ['collection', 'badges'].includes(page) ? 'collection' : ['missions', 'chapter', 'activities'].includes(page) ? 'missions' : 'home';
  const back = () => { setMissionId(null); setPage('missions'); };
  const saveProfile = (next: RelationshipProfile) => {
    if (journey.isPreview) { setPreviewProfile(next); setPage('profile'); return; }
    setProfileError('');
    void onSaveProfile(next).then(() => setPage('profile')).catch(() => setProfileError('資料保存失敗，請重試。'));
  };
  const preview = (input: DevelopmentScenario | DevScenarioConfiguration) => {
    const seed = createJourneyPreview(input);
    journey.beginPreview(seed.state, seed.now); setPreviewProfile(seed.profile); setEvent(null); setMissionId(null); setPage('missions');
  };
  return <AppShell onSelectDevelopmentScenario={__DEV__ ? preview : undefined} onConfigureDevelopment={__DEV__ ? preview : undefined} onResetDevelopmentToday={__DEV__ ? () => preview('safe') : undefined} activeTab={tab} flags={featureFlags} onSelectTab={(tab) => { setMissionId(null); setPage(tab); }} onResetAndSignOut={onResetAndSignOut} onSignOut={onSignOut} partnerName={activeProfile.partnerNickname} relationshipDays={metrics.relationshipDays} userName={activeProfile.userNickname || userName}>
    {journey.isPreview ? <AppButton label="DEV 情境：回到我的旅程（不會保存測試資料）" secondary onPress={() => { setPreviewProfile(null); journey.endPreview(); setPage('home'); }} /> : null}
    {journey.error || profileError ? <Text accessibilityRole="alert" style={{ color: colors.danger, padding: 12 }}>{journey.error || profileError}</Text> : null}
    {state.gameState.status === 'gg' && !['collection', 'badges'].includes(page) && !page.startsWith('profile') && !(page === 'chapter' && chapter?.completedAt) ? <RebirthView latestRun={state.runHistory.completedRuns.at(-1) ?? null} previousOath={state.runHistory.completedRuns.at(-2)?.oath ?? null} onRebirth={(oath) => { void mutate((current) => ({ ...current, ...reviveRun(current.runHistory, current.gameState, oath, journey.actionTime()) })); }} /> : <>
      {page === 'home' ? <JourneyHome events={events} state={state} now={now} onOpen={openEvent} onStart={startFromHome} onDates={() => setPage('profile-dates')} /> : null}
      {page === 'missions' ? <JourneyQuestView events={events} now={now} onDates={() => setPage('profile-dates')} onOpen={openEvent} onStart={startFromHome} state={state} footer={<JourneyActivities actionTime={journey.actionTime} embedded state={state} now={now} relationshipDays={metrics.relationshipDays} mutate={mutate} />} /> : null}
      {page === 'chapter' && chapter && !task ? <JourneyChapterView key={chapter.id} chapter={chapter} state={state} now={now} busy={busy} onBack={back} onTask={setMissionId} onSaveReflection={(reflection) => mutate((current) => saveChapterReflection(current, chapter.id, reflection))} /> : null}
      {page === 'chapter' && chapter && task ? <JourneyTaskDetailView chapter={chapter} task={task} now={now} busy={busy} onBack={() => setMissionId(null)} onResolve={() => mutate((current) => resolveChapterTask(current, chapter.id, task.mission.id, journey.actionTime())).then((saved) => { if (saved) setMissionId(null); return saved; })} onSaveDraft={(draft) => mutate((current) => saveChapterTaskDraft(current, chapter.id, task.mission.id, draft))} /> : null}
      {page === 'activities' ? <JourneyActivities actionTime={journey.actionTime} state={state} now={now} relationshipDays={metrics.relationshipDays} mutate={mutate} /> : null}
    </>}
    {page === 'collection' ? <JourneyArchive state={state} onOpen={openEvent} footer={<CollectionView collectionState={state.collectionState} embedded runHistory={state.runHistory} />} /> : null}
    {page === 'actions' && featureFlags.actionHub ? <ActionsView /> : null}
    {page === 'badges' ? <CollectionView collectionState={state.collectionState} runHistory={state.runHistory} /> : null}
    {page.startsWith('profile') ? <JourneyProfile page={page} profile={activeProfile} userName={userName} onPage={setPage} onSave={saveProfile} /> : null}
  </AppShell>;
}
