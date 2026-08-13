import { useEffect, useMemo, useState } from 'react';

import { completeMission } from './src/application/completeMission';
import { OnboardingService } from './src/application/OnboardingService';
import { requestMissionNotificationPermission, useMissionReminder } from './src/application/useMissionReminder';
import { LocalGameplayRepository } from './src/data/local/LocalGameplayRepository';
import { LocalOnboardingRepository } from './src/data/local/LocalOnboardingRepository';
import { birthdayDaysRemaining, tutorialMission } from './src/data/local/mockGameplayData';
import type { GameplaySession } from './src/data/repositories/GameplayRepository';
import type { OnboardingState } from './src/domain/onboarding';
import type { MissionResult } from './src/domain/gameplay';
import { HomeScreen } from './src/presentation/screens/HomeScreen';
import { MissionDetailScreen } from './src/presentation/screens/MissionDetailScreen';
import { MissionListScreen } from './src/presentation/screens/MissionListScreen';
import { ResultScreen } from './src/presentation/screens/ResultScreen';
import { AuthLoadingScreen } from './src/presentation/screens/AuthLoadingScreen';
import { SignInScreen } from './src/presentation/screens/SignInScreen';
import { OnboardingFlow } from './src/presentation/screens/OnboardingFlow';
import { ActionsScreen } from './src/presentation/screens/ActionsScreen';
import { CollectionScreen } from './src/presentation/screens/CollectionScreen';
import { RelationshipProfileScreen, RelationshipSettingsScreen } from './src/presentation/screens/RelationshipProfileScreen';
import { AppShell } from './src/presentation/components/AppShell';
import type { BottomTab } from './src/presentation/components/BottomNavigation';
import { useGoogleAuthentication } from './src/services/auth';

type Screen = BottomTab | 'detail' | 'result';

export default function App() {
  const { authState, signIn } = useGoogleAuthentication();

  if (authState.status === 'loading') {
    return <AuthLoadingScreen />;
  }

  if (authState.status === 'signedOut') {
    return <SignInScreen error={authState.error} onSignIn={() => void signIn()} />;
  }

  return authState.user ? <AuthenticatedGameplay userId={authState.user.id} /> : <AuthLoadingScreen />;
}

interface AuthenticatedGameplayProps {
  userId: string;
}

function AuthenticatedGameplay({ userId }: AuthenticatedGameplayProps) {
  const repository = useMemo(() => new LocalGameplayRepository(), []);
  const onboardingService = useMemo(
    () => new OnboardingService(new LocalOnboardingRepository()),
    [],
  );
  const [screen, setScreen] = useState<Screen>('home');
  const [session, setSession] = useState<GameplaySession | null>(null);
  const [onboarding, setOnboarding] = useState<OnboardingState | null>(null);
  const [completion, setCompletion] = useState<ReturnType<typeof completeMission>>();
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const openMissionFromNotification = (missionId: string) => {
    if (session?.mission.id === missionId) setScreen('detail');
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

  useMissionReminder(
    session?.mission ?? null,
    onboarding?.status === 'completed',
    openMissionFromNotification,
  );

  if (!session || !onboarding) {
    return <AuthLoadingScreen />;
  }

  const updateOnboarding = (action: Promise<OnboardingState>) => void action.then(setOnboarding);
  const completeTutorial = () => {
    const outcome = completeMission(tutorialMission, session.gameState, session.collectionState, new Date());
    setSession({ ...session, gameState: outcome.gameState, collectionState: outcome.collectionState });
    updateOnboarding(onboardingService.saveTutorialReward(userId, onboarding, { reward: outcome.reward, gameState: outcome.gameState }));
  };

  if (onboarding.status !== 'completed') {
    return <OnboardingFlow
      state={onboarding}
      onAdvance={() => {
        if (onboarding.status === 'notificationExplained') {
          void requestMissionNotificationPermission().finally(() => {
            updateOnboarding(onboardingService.advance(userId, onboarding));
          });
          return;
        }
        updateOnboarding(onboardingService.advance(userId, onboarding));
      }}
      onSaveProfile={(profile) => updateOnboarding(onboardingService.saveProfile(userId, onboarding, profile))}
      onCompleteTutorial={completeTutorial}
      onFinish={() => updateOnboarding(onboardingService.advance(userId, onboarding))}
    />;
  }

  const { mission } = session;
  const { collectionState, gameState } = session;

  const handleComplete = (demoResult?: MissionResult) => {
    const outcome = completeMission(
      mission,
      gameState,
      collectionState,
      getDemoCompletionTime(demoResult),
    );
    setSession({ ...session, gameState: outcome.gameState, collectionState: outcome.collectionState });
    setCompletion(outcome);
    setScreen('result');
  };

  const activeTab: BottomTab = screen === 'detail' || screen === 'result' ? 'missions' : screen;
  const selectTab = (tab: BottomTab) => { setScreen(tab); if (tab !== 'profile') setIsEditingProfile(false); };
  const saveRelationshipProfile = (profile: NonNullable<OnboardingState['profile']>) => {
    updateOnboarding(onboardingService.updateRelationshipProfile(userId, onboarding, profile));
    setIsEditingProfile(false);
  };
  return <AppShell activeTab={activeTab} gameState={gameState} title={isEditingProfile ? '檔案設定' : tabTitle(activeTab)} onSelectTab={selectTab} onOptions={activeTab === 'profile' && !isEditingProfile ? () => setIsEditingProfile(true) : undefined}>
    {screen === 'home' && <HomeScreen gameState={gameState} birthdayDaysRemaining={birthdayDaysRemaining} onOpenMissions={() => setScreen('missions')} />}
    {screen === 'missions' && <MissionListScreen mission={mission} onBack={() => setScreen('home')} onOpenMission={() => setScreen('detail')} />}
    {screen === 'actions' && <ActionsScreen />}
    {screen === 'collection' && <CollectionScreen collectionState={collectionState} />}
    {screen === 'profile' && !isEditingProfile && <RelationshipProfileScreen profile={onboarding.profile} />}
    {screen === 'profile' && isEditingProfile && <RelationshipSettingsScreen profile={onboarding.profile} onCancel={() => setIsEditingProfile(false)} onSave={saveRelationshipProfile} />}
    {screen === 'detail' && <MissionDetailScreen mission={mission} onBack={() => setScreen('missions')} onComplete={handleComplete} />}
    {screen === 'result' && completion && <ResultScreen completion={completion} onReturnHome={() => setScreen('home')} />}
  </AppShell>;
}

function tabTitle(tab: BottomTab): string {
  return { home: '首頁', missions: '任務', actions: '行動', collection: '圖鑑', profile: '關係檔案' }[tab];
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
