import { useEffect, useMemo, useState } from 'react';
import { Text } from 'react-native';
import { OnboardingService } from '@/features/relationship/application/OnboardingService';
import { LocalOnboardingRepository } from '@/infrastructure/storage/LocalOnboardingRepository';
import { LocalGameplayRepository } from '@/infrastructure/storage/LocalGameplayRepository';
import type { GameplaySession } from '@/features/missions/data/GameplayRepository';
import type { OnboardingState, RelationshipMode, RelationshipProfile } from '@/features/relationship/domain';
import { withRelationshipProfileDefaults } from '@/features/relationship/domain';
import { OnboardingView } from '@/features/relationship/ui/OnboardingView';
import { completeMission } from '@/features/missions/application/completeMission';
import { tutorialMission } from '@/features/missions/data/mockGameplayData';
import { JourneyExperience } from '@/features/journey/ui/JourneyExperience';
import type { AuthUser } from '@/infrastructure/auth/models';
import { AppButton, PageLayout } from '@/shared/ui';
import { colors } from '@/shared/theme/tokens';
import { AuthLoadingView } from './AuthLoadingView';

export function GameplayBootstrap({ user, onResetAndSignOut, onSignOut }: { user: AuthUser; onResetAndSignOut: () => Promise<void>; onSignOut: () => void }) {
  const service = useMemo(() => new OnboardingService(new LocalOnboardingRepository()), []);
  const repository = useMemo(() => new LocalGameplayRepository(), []);
  const [onboarding, setOnboarding] = useState<OnboardingState | null>(null);
  const [session, setSession] = useState<GameplaySession | null>(null);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    void Promise.all([service.getState(user.id), repository.loadForUser(user.id)]).then(([onboarding, session]) => {
      if (active) { setOnboarding(onboarding); setSession(session); setError(''); }
    }).catch(() => { if (active) setError('讀取資料失敗，請重試。'); });
    return () => { active = false; };
  }, [repository, service, user.id, retry]);
  if (!onboarding || !session) return error ? <PageLayout><Text style={{ color: colors.danger }}>{error}</Text><AppButton label="重試" onPress={() => setRetry((value) => value + 1)} /></PageLayout> : <AuthLoadingView />;
  const update = (action: Promise<OnboardingState>) => { void action.then(setOnboarding).catch(() => setError('保存失敗，請重試。')); };
  const saveProfile = async (profile: RelationshipProfile) => {
    setOnboarding(await service.updateRelationshipProfile(user.id, onboarding, profile));
  };
  if (onboarding.status === 'completed') return <JourneyExperience key={user.id} userId={user.id} userName={user.displayName || 'P1'} initial={session} profile={withRelationshipProfileDefaults(onboarding.profile)} onSaveProfile={saveProfile} onResetAndSignOut={onResetAndSignOut} onSignOut={onSignOut} />;
  return <>{error ? <Text style={{ color: colors.danger }}>{error}</Text> : null}<OnboardingView state={onboarding}
    onChooseRelationshipMode={(mode: RelationshipMode) => update(service.chooseRelationshipMode(user.id, onboarding, mode))}
    onStartCrushSetup={() => update(service.startCrushSetup(user.id, onboarding))}
    onStartSinglePractice={() => update(service.startSinglePractice(user.id, onboarding))}
    onSaveCrushes={(candidates, activeId) => update(service.saveCrushCandidates(user.id, onboarding, candidates, activeId))}
    onBack={() => update(service.retreat(user.id, onboarding))}
    onSavePartnerName={(partnerNickname) => update(service.savePartnerName(user.id, onboarding, partnerNickname))}
    onAdvance={() => update(service.advance(user.id, onboarding))}
    onSaveImportantDate={(profile) => {
      if (onboarding.tutorialReward) { update(service.advance(user.id, onboarding)); return; }
      const outcome = completeMission(tutorialMission, session.gameState, session.collectionState, new Date());
      const next = { ...session, gameState: outcome.gameState, collectionState: outcome.collectionState };
      void repository.saveProgress(user.id, next).then(async () => {
        setSession(next);
        const saved = await service.saveProfile(user.id, onboarding, profile);
        setOnboarding(await service.saveTutorialReward(user.id, saved, { reward: outcome.reward, gameState: outcome.gameState }));
      }).catch(() => setError('教學獎勵保存失敗，請重試。'));
    }}
    onFinish={() => update(service.advance(user.id, onboarding))}
  /></>;
}
