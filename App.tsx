import { useEffect, useMemo, useState } from 'react';
import { DotGothic16_400Regular, useFonts } from '@expo-google-fonts/dotgothic16';

import { AuthLoadingView } from '@/application/providers/AuthLoadingView';
import { featureFlags } from '@/application/config/featureFlags';
import { getMissionAnalyticsProperties, trackDailyGameplayView, trackMissionResolution } from '@/application/analytics/trackGameplayEvents';
import { AppShell } from '@/application/navigation/AppShell';
import { createConfiguredActivityBoard, createConfiguredDailyGameplay, createConfiguredOnboarding, createDevelopmentDailyGameplay, createDevelopmentOnboarding, createDevelopmentSession, getConfiguredDevelopmentNow, getDevelopmentNow, type DevScenarioConfiguration, type DevelopmentScenario } from '@/application/dev/developmentScenario';
import { DevPreviewSession } from '@/application/dev/DevPreviewSession';
import type { BottomTab } from '@/application/navigation/BottomNavigation';
import { CollectionView } from '@/features/collection/ui/CollectionView';
import { HomeView } from '@/features/home/ui/HomeView';
import { completeMission } from '@/features/missions/application/completeMission';
import { MissionReminderService } from '@/features/missions/application/MissionReminderService';
import { requestMissionNotificationPermission, useMissionReminder } from '@/features/missions/application/useMissionReminder';
import { tutorialMission } from '@/features/missions/data/mockGameplayData';
import type { GameplaySession } from '@/features/missions/data/GameplayRepository';
import type { MissionResult } from '@/features/missions/domain';
import { MissionDetailView } from '@/features/missions/ui/MissionDetailView';
import { MissionResultView } from '@/features/missions/ui/MissionResultView';
import { RebirthView } from '@/features/missions/ui/RebirthView';
import { DailyGameplayService } from '@/features/dailyGameplay/application/DailyGameplayService';
import { type DailyGameplayEvent, type DailyGameplayState } from '@/features/dailyGameplay/domain';
import { MissionReportView } from '@/features/dailyGameplay/ui/MissionReportView';
import { NextHookView } from '@/features/dailyGameplay/ui/NextHookView';
import { SafeActionView } from '@/features/dailyGameplay/ui/SafeActionView';
import { OnboardingService } from '@/features/relationship/application/OnboardingService';
import type { OnboardingState } from '@/features/relationship/domain';
import { getRelationshipDashboardMetrics } from '@/features/relationship/domain';
import { OnboardingView } from '@/features/relationship/ui/OnboardingView';
import { RelationshipProfileView, type RelationshipEditor } from '@/features/relationship/ui/RelationshipProfileView';
import { RelationshipInfoEditor } from '@/features/relationship/ui/RelationshipInfoEditor';
import { ImportantDatesEditor } from '@/features/relationship/ui/ImportantDatesEditor';
import { PreferencesEditor } from '@/features/relationship/ui/PreferencesEditor';
import { ActionsView, MissionBoardView } from '@/features/actions/ui/ActionsView';
import { ActivityBoardService } from '@/features/activities/application/ActivityBoardService';
import type { ActivityBoardState } from '@/features/activities/domain';
import { applyBonusExperience } from '@/game/progression/applyBonusExperience';
import { recordRunResolution, reviveRun } from '@/game/run';
import { SignInView } from '@/features/auth/ui/SignInView';
import { useGoogleAuthentication } from '@/infrastructure/auth';
import { DevelopmentAnalyticsService } from '@/infrastructure/analytics';
import type { AuthUser } from '@/infrastructure/auth/models';
import { ExpoMissionNotificationService } from '@/infrastructure/notifications';
import { LocalGameplayRepository } from '@/infrastructure/storage/LocalGameplayRepository';
import { LocalMissionReminderRepository } from '@/infrastructure/storage/LocalMissionReminderRepository';
import { LocalOnboardingRepository } from '@/infrastructure/storage/LocalOnboardingRepository';
import { LocalDailyGameplayRepository } from '@/infrastructure/storage/LocalDailyGameplayRepository';
import { LocalActivityBoardRepository } from '@/infrastructure/storage/LocalActivityBoardRepository';
import { ReactNativeChallengeShareService } from '@/infrastructure/sharing';

type Route = BottomTab | 'detail' | 'result' | 'report' | 'free-action' | 'next-hook' | 'rebirth' | 'profile-basic' | 'profile-dates' | 'profile-preferences';

export default function App() {
  const [fontsLoaded, fontError] = useFonts({ DotGothic16_400Regular });
  const { authState, signIn, signOut } = useGoogleAuthentication();
  const [developmentUser, setDevelopmentUser] = useState<AuthUser | null>(null);
  const [devPreviewReady, setDevPreviewReady] = useState(!__DEV__);
  const devPreviewSession = useMemo(() => new DevPreviewSession(), []);

  useEffect(() => {
    if (!__DEV__) return;
    void devPreviewSession.restore().then((user) => {
      setDevelopmentUser(user);
      setDevPreviewReady(true);
    });
  }, [devPreviewSession]);

  if (!fontsLoaded && !fontError) {
    return <AuthLoadingView />;
  }

  if (authState.status === 'loading' || !devPreviewReady) {
    return <AuthLoadingView />;
  }

  if (authState.status === 'signedOut' && !developmentUser) {
    return <SignInView error={authState.error} onSignIn={() => void signIn()} onContinueAsDev={__DEV__ ? () => void devPreviewSession.start().then(setDevelopmentUser) : undefined} />;
  }

  const user = authState.user ?? developmentUser;
  return user ? <AuthenticatedGameplay onSignOut={developmentUser ? () => void devPreviewSession.clear().then(() => setDevelopmentUser(null)) : () => void signOut()} user={user} /> : <AuthLoadingView />;
}

interface AuthenticatedGameplayProps {
  onSignOut: () => void;
  user: AuthUser;
}

function AuthenticatedGameplay({ onSignOut, user }: AuthenticatedGameplayProps) {
  const { id: userId } = user;
  const analytics = useMemo(() => new DevelopmentAnalyticsService(), []);
  const repository = useMemo(() => new LocalGameplayRepository(), []);
  const notificationService = useMemo(() => new ExpoMissionNotificationService(), []);
  const reminderService = useMemo(
    () => new MissionReminderService(new LocalMissionReminderRepository(), notificationService),
    [notificationService],
  );
  const onboardingService = useMemo(
    () => new OnboardingService(new LocalOnboardingRepository()),
    [],
  );
  const dailyGameplayService = useMemo(() => new DailyGameplayService(new LocalDailyGameplayRepository()), []);
  const activityBoardService = useMemo(() => new ActivityBoardService(new LocalActivityBoardRepository()), []);
  const challengeShareService = useMemo(() => new ReactNativeChallengeShareService(), []);
  const [route, setRoute] = useState<Route>('home');
  const [session, setSession] = useState<GameplaySession | null>(null);
  const [onboarding, setOnboarding] = useState<OnboardingState | null>(null);
  const [completion, setCompletion] = useState<ReturnType<typeof completeMission>>();
  const [dailyGameplay, setDailyGameplay] = useState<DailyGameplayState | null>(null);
  const [activityBoard, setActivityBoard] = useState<ActivityBoardState | null>(null);
  const [developmentNow, setDevelopmentNow] = useState<Date | null>(null);

  const openMissionFromNotification = (missionId: string) => {
    if (session?.mission.id === missionId) setRoute('detail');
  };

  useEffect(() => {
    void Promise.all([repository.loadForUser(userId), onboardingService.getState(userId), dailyGameplayService.load(userId, true), activityBoardService.load(userId)])
      .then(([gameplaySession, onboardingState, dailyState, boardState]) => {
        const sessionWithTutorialReward = onboardingState.tutorialReward
          ? { ...gameplaySession, gameState: onboardingState.tutorialReward.gameState }
          : gameplaySession;
        setSession(sessionWithTutorialReward);
        setOnboarding(onboardingState);
        setDailyGameplay(dailyState);
        setActivityBoard(boardState);
      });
  }, [activityBoardService, dailyGameplayService, onboardingService, repository, userId]);

  useEffect(() => {
    if (onboarding?.status !== 'completed') return;
    if (route === 'home') analytics.track({ name: 'home_view' });
    if ((route === 'missions' || route === 'detail') && session) analytics.track({ name: 'mission_view', properties: getMissionAnalyticsProperties(session.mission, new Date()) });
    if (route === 'result' && completion && session) analytics.track({ name: 'reward_view', properties: { ...getMissionAnalyticsProperties(session.mission, new Date()), exp_delta: completion.reward.expDelta } });
  }, [analytics, completion, onboarding?.status, route, session]);

  useEffect(() => {
    if (onboarding?.status === 'completed' && route === 'home' && dailyGameplay) trackDailyGameplayView(analytics, dailyGameplay);
  }, [analytics, dailyGameplay, onboarding?.status, route]);

  useMissionReminder(
    session?.mission ?? null,
    onboarding?.status === 'completed',
    reminderService,
    openMissionFromNotification,
  );

  if (!session || !onboarding || !dailyGameplay || !activityBoard) {
    return <AuthLoadingView />;
  }

  const trackRelationshipEventCreation = (profile: NonNullable<OnboardingState['profile']>) => {
    const previousEventCount = Number(Boolean(onboarding.profile?.birthday)) + (onboarding.profile?.customImportantDates.length ?? 0);
    const nextEventCount = Number(Boolean(profile.birthday)) + profile.customImportantDates.length;
    if (nextEventCount > previousEventCount) analytics.track({ name: 'relationship_event_create', properties: { event_count: nextEventCount - previousEventCount, event_source: 'profile' } });
  };
  const updateOnboarding = (action: Promise<OnboardingState>) => void action.then((next) => {
    if (onboarding.status !== 'completed' && next.status === 'completed') analytics.track({ name: 'onboarding_complete' });
    setOnboarding(next);
  });
  const completeTutorial = () => {
    const outcome = completeMission(tutorialMission, session.gameState, session.collectionState, new Date());
    setSession({ ...session, gameState: outcome.gameState, collectionState: outcome.collectionState });
    updateOnboarding(onboardingService.saveTutorialReward(userId, onboarding, { reward: outcome.reward, gameState: outcome.gameState }));
  };

  if (onboarding.status !== 'completed') {
    return <OnboardingView
      state={onboarding}
      onAdvance={() => {
        if (onboarding.status === 'notificationExplained') {
          void requestMissionNotificationPermission(notificationService).finally(() => {
            updateOnboarding(onboardingService.advance(userId, onboarding));
          });
          return;
        }
        updateOnboarding(onboardingService.advance(userId, onboarding));
      }}
      onSaveProfile={(profile) => {
        trackRelationshipEventCreation(profile);
        updateOnboarding(onboardingService.saveProfile(userId, onboarding, profile));
      }}
      onCompleteTutorial={completeTutorial}
      onFinish={() => updateOnboarding(onboardingService.advance(userId, onboarding))}
    />;
  }

  const { mission } = session;
  const { collectionState, gameState } = session;
  const saveProgress = (next: typeof session) => {
    setSession(next);
    void repository.saveProgress(userId, {
      gameState: next.gameState,
      collectionState: next.collectionState,
      runHistory: next.runHistory,
    });
  };

  const dispatchDailyGameplay = (event: DailyGameplayEvent, nextRoute?: Route) => {
    void dailyGameplayService.dispatch(userId, dailyGameplay, event).then((next) => {
      setDailyGameplay(next);
      if (nextRoute) setRoute(nextRoute);
    });
  };
  const handleComplete = (demoResult?: MissionResult) => {
    const completedAt = getDemoCompletionTime(demoResult);
    const outcome = completeMission(
      mission,
      gameState,
      collectionState,
      completedAt,
    );
    const runHistory = recordRunResolution(session.runHistory, {
      deathCause: mission.template.titleKey,
      occurredAt: completedAt,
      result: outcome.result,
      rankScore: outcome.gameState.rankScore,
    });
    saveProgress({ ...session, gameState: outcome.gameState, collectionState: outcome.collectionState, runHistory });
    trackMissionResolution(analytics, outcome, mission, completedAt, gameState.rankScore);
    setCompletion(outcome);
    analytics.track({ name: 'mission_report', properties: { report: demoResult ?? 'completed' } });
    dispatchDailyGameplay('resolve', outcome.gameState.status === 'gg' ? 'rebirth' : 'result');
  };

  const activeTab: BottomTab = route === 'detail' || route === 'result' || route === 'report' ? 'missions' : route === 'free-action' || route === 'next-hook' || route === 'rebirth' ? 'home' : isProfileRoute(route) ? 'profile' : route;
  const selectTab = (tab: BottomTab) => setRoute(gameState.status === 'gg' && tab === 'missions' ? 'rebirth' : tab);
  const saveRelationshipProfile = (profile: NonNullable<OnboardingState['profile']>) => {
    trackRelationshipEventCreation(profile);
    updateOnboarding(onboardingService.updateRelationshipProfile(userId, onboarding, profile));
    setRoute('profile');
  };
  const applyDevelopmentScenario = (scenario: DevelopmentScenario) => {
    const now = new Date();
    const scenarioNow = getDevelopmentNow(scenario);
    setSession(createDevelopmentSession(scenario, now));
    setOnboarding(createDevelopmentOnboarding(scenario, now));
    setCompletion(undefined);
    setDailyGameplay(createDevelopmentDailyGameplay(scenario));
    setDevelopmentNow(scenarioNow);
    if (scenarioNow) void activityBoardService.load(userId, scenarioNow).then(setActivityBoard);
    setRoute(routeForDevelopmentScenario(scenario));
  };
  const applyDevelopmentConfiguration = (config: DevScenarioConfiguration) => {
    const now = getConfiguredDevelopmentNow(config.date);
    setDevelopmentNow(now);
    setSession(createDevelopmentSession('safe', now));
    setOnboarding(createConfiguredOnboarding(config, now));
    setDailyGameplay(createConfiguredDailyGameplay(config));
    void activityBoardService.replace(userId, createConfiguredActivityBoard(config, now)).then(setActivityBoard);
    setRoute('missions');
  };
  const gameplayNow = developmentNow ?? new Date();
  const dashboardMetrics = getRelationshipDashboardMetrics(onboarding.profile, gameplayNow);
  const importantDate = dashboardMetrics.birthday ?? dashboardMetrics.relationshipAnniversary;
  const importantDateLabel = dashboardMetrics.birthday ? '生日' : '紀念日';
  const p1Name = onboarding.profile?.userNickname?.trim() || user.displayName?.trim() || 'P1';
  const p2Name = onboarding.profile?.partnerNickname ?? 'P2';
  const updateActivityBoard = (action: Promise<ActivityBoardState>) => void action.then(setActivityBoard);
  const completeActivity = (action: Promise<{ expDelta: number; state: ActivityBoardState }>) => void action.then((outcome) => {
    setActivityBoard(outcome.state);
    if (outcome.expDelta) setSession((current) => {
      if (!current) return current;
      const next = { ...current, gameState: applyBonusExperience(current.gameState, outcome.expDelta) };
      void repository.saveProgress(userId, { gameState: next.gameState, collectionState: next.collectionState, runHistory: next.runHistory });
      return next;
    });
  });
  const handleRebirth = (oath: string) => {
    const outcome = reviveRun(session.runHistory, session.gameState, oath, gameplayNow);
    saveProgress({ ...session, gameState: outcome.gameState, runHistory: outcome.runHistory });
    setCompletion(undefined);
    setRoute('home');
  };
  return <AppShell activeTab={activeTab} flags={featureFlags} onSelectTab={selectTab} onSelectDevelopmentScenario={__DEV__ ? applyDevelopmentScenario : undefined} onConfigureDevelopment={__DEV__ ? applyDevelopmentConfiguration : undefined} onResetDevelopmentToday={__DEV__ ? () => { void activityBoardService.resetToday(userId, gameplayNow).then((board) => { setActivityBoard(board); setRoute('missions'); }); } : undefined} onSignOut={onSignOut} partnerName={p2Name} relationshipDays={dashboardMetrics.relationshipDays} userName={p1Name}>
    {route === 'home' && <HomeView gameState={gameState} importantDate={importantDate} importantDateLabel={importantDateLabel} onOpenMissions={() => setRoute('missions')} onOpenRebirth={gameState.status === 'gg' ? () => setRoute('rebirth') : undefined} p1Name={p1Name} p2Name={p2Name} relationshipDays={dashboardMetrics.relationshipDays} />}
    {route === 'missions' && <MissionBoardView
      board={activityBoard}
      mission={mission}
      now={gameplayNow}
      showMainMission={dailyGameplay.mode === 'crisis'}
      relationshipDays={dashboardMetrics.relationshipDays}
      onOpenMainMission={() => {
        if (dailyGameplay.stage === 'offered') {
          analytics.track({ name: 'mission_accept', properties: getMissionAnalyticsProperties(mission, new Date()) });
          analytics.track({ name: 'mission_start', properties: getMissionAnalyticsProperties(mission, new Date()) });
          dispatchDailyGameplay('accept', 'detail');
          return;
        }
        setRoute('detail');
      }}
      onRerollDaily={() => updateActivityBoard(activityBoardService.rerollDaily(userId, activityBoard, dashboardMetrics.relationshipDays, gameplayNow))}
      onSelectDaily={(templateId) => updateActivityBoard(activityBoardService.selectDaily(userId, activityBoard, dashboardMetrics.relationshipDays, templateId, gameplayNow))}
      onContinueDaily={() => updateActivityBoard(activityBoardService.selectNextDaily(userId, activityBoard, dashboardMetrics.relationshipDays, gameplayNow))}
      onCompleteDaily={(reflection) => completeActivity(activityBoardService.completeDaily(userId, activityBoard, reflection, gameplayNow))}
      onCancelDaily={() => updateActivityBoard(activityBoardService.cancelDaily(userId, activityBoard, gameplayNow))}
      onSelectWeekly={(templateId) => updateActivityBoard(activityBoardService.selectWeekly(userId, activityBoard, templateId, gameplayNow))}
      onContinueWeekly={() => updateActivityBoard(activityBoardService.selectNextWeekly(userId, activityBoard, gameplayNow))}
      onRerollWeekly={() => updateActivityBoard(activityBoardService.rerollWeekly(userId, activityBoard, gameplayNow))}
      onCompleteWeekly={(reflection) => completeActivity(activityBoardService.completeWeekly(userId, activityBoard, reflection, gameplayNow))}
      onCancelWeekly={() => updateActivityBoard(activityBoardService.cancelWeekly(userId, activityBoard, gameplayNow))}
      onShareWeekly={(template) => { void challengeShareService.shareChallenge({ title: template.title, description: template.description }); }}
    />}
    {route === 'actions' && featureFlags.actionHub && <ActionsView />}
    {route === 'collection' && <CollectionView collectionState={collectionState} runHistory={session.runHistory} />}
    {route === 'profile' && <RelationshipProfileView onOpenEditor={(editor) => setRoute(profileEditorRoutes[editor])} profile={onboarding.profile} userName={p1Name} />}
    {route === 'profile-basic' && <RelationshipInfoEditor onCancel={() => setRoute('profile')} onSave={saveRelationshipProfile} profile={onboarding.profile} userName={p1Name} />}
    {route === 'profile-dates' && <ImportantDatesEditor onCancel={() => setRoute('profile')} onSave={saveRelationshipProfile} profile={onboarding.profile} />}
    {route === 'profile-preferences' && <PreferencesEditor onCancel={() => setRoute('profile')} onSave={saveRelationshipProfile} profile={onboarding.profile} />}
    {route === 'detail' && <MissionDetailView mission={mission} onBack={() => setRoute('missions')} onStartAction={() => { void dailyGameplayService.dispatch(userId, dailyGameplay, 'beginAction').then((action) => dailyGameplayService.dispatch(userId, action, 'openReport')).then((next) => { setDailyGameplay(next); setRoute('report'); }); }} />}
    {route === 'report' && <MissionReportView onComplete={() => handleComplete()} onDemoFail={() => handleComplete('fail')} onDemoLate={() => handleComplete('late')} onLater={() => setRoute('home')} />}
    {route === 'result' && completion && <MissionResultView completion={completion} mission={mission} onOpenNextHook={() => dispatchDailyGameplay('showNextHook', 'next-hook')} />}
    {route === 'rebirth' && <RebirthView latestRun={session.runHistory.completedRuns.at(-1) ?? null} previousOath={getPreviousOath(session.runHistory.completedRuns)} onRebirth={handleRebirth} />}
    {route === 'free-action' && <SafeActionView onComplete={() => dispatchDailyGameplay('completeSafeAction', 'next-hook')} />}
    {route === 'next-hook' && <NextHookView state={dailyGameplay} onReturnHome={() => { analytics.track({ name: 'next_hook_view', properties: { hook_id: dailyGameplay.nextHookId } }); dispatchDailyGameplay('returnHome', 'home'); }} />}
  </AppShell>;
}

const profileEditorRoutes: Record<RelationshipEditor, Route> = {
  basic: 'profile-basic',
  dates: 'profile-dates',
  preferences: 'profile-preferences',
};

function isProfileRoute(route: Route): route is 'profile' | 'profile-basic' | 'profile-dates' | 'profile-preferences' {
  return route === 'profile' || route === 'profile-basic' || route === 'profile-dates' || route === 'profile-preferences';
}

function getDemoCompletionTime(demoResult?: MissionResult): Date {
  if (demoResult === 'late') {
    return new Date('2026-08-16T12:00:00+08:00');
  }

  if (demoResult === 'fail') {
    return new Date('2026-08-20T00:00:00+08:00');
  }

  return new Date();
}

function getPreviousOath(runs: import('@/game/run').CompletedRun[]): string | null {
  return [...runs].reverse().slice(1).find((run) => run.oath)?.oath ?? null;
}

function routeForDevelopmentScenario(scenario: DevelopmentScenario): Route {
  if (scenario === 'collection-unlock') return 'collection';
  if (scenario === 'gg') return 'rebirth';
  if (scenario === 'mission-accepted') return 'detail';
  if (scenario === 'mission-reporting') return 'report';
  if (scenario === 'free-action') return 'free-action';
  if (scenario === 'next-hook') return 'next-hook';
  return 'home';
}
