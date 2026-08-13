import { useEffect, useMemo, useState } from 'react';
import { DotGothic16_400Regular, useFonts } from '@expo-google-fonts/dotgothic16';

import { AuthLoadingView } from '@/application/providers/AuthLoadingView';
import { featureFlags } from '@/application/config/featureFlags';
import { getMissionAnalyticsProperties, trackMissionResolution } from '@/application/analytics/trackGameplayEvents';
import { AppShell } from '@/application/navigation/AppShell';
import { createDevelopmentOnboarding, createDevelopmentSession, type DevelopmentScenario } from '@/application/dev/developmentScenario';
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
import { MissionListView } from '@/features/missions/ui/MissionListView';
import { MissionResultView } from '@/features/missions/ui/MissionResultView';
import { OnboardingService } from '@/features/relationship/application/OnboardingService';
import type { OnboardingState } from '@/features/relationship/domain';
import { getRelationshipDashboardMetrics } from '@/features/relationship/domain';
import { OnboardingView } from '@/features/relationship/ui/OnboardingView';
import { RelationshipProfileView, RelationshipSettingsView } from '@/features/relationship/ui/RelationshipProfileView';
import { ActionsView } from '@/features/actions/ui/ActionsView';
import { SignInView } from '@/features/auth/ui/SignInView';
import { useGoogleAuthentication } from '@/infrastructure/auth';
import { DevelopmentAnalyticsService } from '@/infrastructure/analytics';
import type { AuthUser } from '@/infrastructure/auth/models';
import { ExpoMissionNotificationService } from '@/infrastructure/notifications';
import { LocalGameplayRepository } from '@/infrastructure/storage/LocalGameplayRepository';
import { LocalMissionReminderRepository } from '@/infrastructure/storage/LocalMissionReminderRepository';
import { LocalOnboardingRepository } from '@/infrastructure/storage/LocalOnboardingRepository';

type Route = BottomTab | 'detail' | 'result';

export default function App() {
  const [fontsLoaded, fontError] = useFonts({ DotGothic16_400Regular });
  const { authState, signIn, signOut } = useGoogleAuthentication();
  const [developmentUser, setDevelopmentUser] = useState<AuthUser | null>(null);

  if (!fontsLoaded && !fontError) {
    return <AuthLoadingView />;
  }

  if (authState.status === 'loading') {
    return <AuthLoadingView />;
  }

  if (authState.status === 'signedOut' && !developmentUser) {
    return <SignInView error={authState.error} onSignIn={() => void signIn()} onContinueAsDev={__DEV__ ? () => setDevelopmentUser({ id: 'dev-user', displayName: 'DEV P1', email: null, photoUrl: null }) : undefined} />;
  }

  const user = authState.user ?? developmentUser;
  return user ? <AuthenticatedGameplay onSignOut={developmentUser ? () => setDevelopmentUser(null) : () => void signOut()} user={user} /> : <AuthLoadingView />;
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
  const [route, setRoute] = useState<Route>('home');
  const [session, setSession] = useState<GameplaySession | null>(null);
  const [onboarding, setOnboarding] = useState<OnboardingState | null>(null);
  const [completion, setCompletion] = useState<ReturnType<typeof completeMission>>();
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const openMissionFromNotification = (missionId: string) => {
    if (session?.mission.id === missionId) setRoute('detail');
  };

  useEffect(() => {
    void Promise.all([repository.loadForUser(userId), onboardingService.getState(userId)])
      .then(([gameplaySession, onboardingState]) => {
        const sessionWithTutorialReward = onboardingState.tutorialReward
          ? { ...gameplaySession, gameState: onboardingState.tutorialReward.gameState }
          : gameplaySession;
        setSession(sessionWithTutorialReward);
        setOnboarding(onboardingState);
      });
  }, [onboardingService, repository, userId]);

  useEffect(() => {
    if (onboarding?.status !== 'completed') return;
    if (route === 'home') analytics.track({ name: 'home_view' });
    if ((route === 'missions' || route === 'detail') && session) analytics.track({ name: 'mission_view', properties: getMissionAnalyticsProperties(session.mission, new Date()) });
    if (route === 'result' && completion && session) analytics.track({ name: 'reward_view', properties: { ...getMissionAnalyticsProperties(session.mission, new Date()), exp_delta: completion.reward.expDelta } });
  }, [analytics, completion, onboarding?.status, route, session]);

  useMissionReminder(
    session?.mission ?? null,
    onboarding?.status === 'completed',
    reminderService,
    openMissionFromNotification,
  );

  if (!session || !onboarding) {
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

  const handleComplete = (demoResult?: MissionResult) => {
    const completedAt = getDemoCompletionTime(demoResult);
    const outcome = completeMission(
      mission,
      gameState,
      collectionState,
      completedAt,
    );
    setSession({ ...session, gameState: outcome.gameState, collectionState: outcome.collectionState });
    trackMissionResolution(analytics, outcome, mission, completedAt, gameState.rankScore);
    setCompletion(outcome);
    setRoute('result');
  };

  const activeTab: BottomTab = route === 'detail' || route === 'result' ? 'missions' : route;
  const selectTab = (tab: BottomTab) => { setRoute(tab); if (tab !== 'profile') setIsEditingProfile(false); };
  const saveRelationshipProfile = (profile: NonNullable<OnboardingState['profile']>) => {
    trackRelationshipEventCreation(profile);
    updateOnboarding(onboardingService.updateRelationshipProfile(userId, onboarding, profile));
    setIsEditingProfile(false);
  };
  const applyDevelopmentScenario = (scenario: DevelopmentScenario) => {
    const now = new Date();
    setSession(createDevelopmentSession(scenario, now));
    setOnboarding(createDevelopmentOnboarding(scenario, now));
    setCompletion(undefined);
    setIsEditingProfile(false);
    setRoute(scenario === 'collection-unlock' || scenario === 'gg' ? 'collection' : 'home');
  };
  const dashboardMetrics = getRelationshipDashboardMetrics(onboarding.profile, new Date());
  const importantDate = dashboardMetrics.birthday ?? dashboardMetrics.relationshipAnniversary;
  const importantDateLabel = dashboardMetrics.birthday ? '生日' : '紀念日';
  const p1Name = user.displayName?.trim() || 'P1';
  const p2Name = onboarding.profile?.partnerNickname ?? 'P2';
  return <AppShell activeTab={activeTab} flags={featureFlags} onSelectTab={selectTab} onSelectDevelopmentScenario={__DEV__ ? applyDevelopmentScenario : undefined} onSignOut={onSignOut} partnerName={p2Name} relationshipDays={dashboardMetrics.relationshipDays} userName={p1Name}>
    {route === 'home' && <HomeView gameState={gameState} importantDate={importantDate} importantDateLabel={importantDateLabel} onOpenMissions={() => setRoute('missions')} p1Name={p1Name} p2Name={p2Name} relationshipDays={dashboardMetrics.relationshipDays} />}
    {route === 'missions' && <MissionListView mission={mission} onBack={() => setRoute('home')} onOpenMission={() => { analytics.track({ name: 'mission_start', properties: getMissionAnalyticsProperties(mission, new Date()) }); setRoute('detail'); }} />}
    {route === 'actions' && featureFlags.actionHub && <ActionsView />}
    {route === 'collection' && <CollectionView collectionState={collectionState} />}
    {route === 'profile' && !isEditingProfile && <RelationshipProfileView profile={onboarding.profile} />}
    {route === 'profile' && isEditingProfile && <RelationshipSettingsView profile={onboarding.profile} onCancel={() => setIsEditingProfile(false)} onSave={saveRelationshipProfile} />}
    {route === 'detail' && <MissionDetailView mission={mission} onBack={() => setRoute('missions')} onComplete={handleComplete} />}
    {route === 'result' && completion && <MissionResultView completion={completion} mission={mission} onReturnHome={() => setRoute('home')} />}
  </AppShell>;
}

function getDemoCompletionTime(demoResult?: MissionResult): Date {
  if (demoResult === 'late') {
    return new Date('2026-08-16T12:00:00+08:00');
  }

  if (demoResult === 'fail') {
    return new Date('2026-08-20T00:00:00+08:00');
  }

  return new Date('2026-08-10T12:00:00+08:00');
}
