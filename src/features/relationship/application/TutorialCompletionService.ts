import type { OnboardingRepository } from '../data/OnboardingRepository';
import type { OnboardingState, RelationshipProfile } from '../domain';
import { assertValidProfileDates } from '../domain/validateProfileDates';
import { completeMission } from '@/features/missions/application/completeMission';
import { tutorialMission } from '@/features/missions/data/mockGameplayData';
import type { GameplayRepository, GameplaySession } from '@/features/missions/data/GameplayRepository';

export class TutorialCompletionService {
  private readonly pending = new Map<string, Promise<{ onboarding: OnboardingState; session: GameplaySession }>>();

  constructor(private readonly onboardingRepository: OnboardingRepository, private readonly gameplayRepository: GameplayRepository) {}

  complete(userId: string, profile: RelationshipProfile, now: Date) {
    const running = this.pending.get(userId);
    if (running) return running;
    const operation = this.settle(userId, profile, now).finally(() => this.pending.delete(userId));
    this.pending.set(userId, operation);
    return operation;
  }

  async recover(userId: string, onboarding: OnboardingState, session: GameplaySession) {
    if (!onboarding.pendingTutorial) return { onboarding, session };
    return this.commit(userId, onboarding, session);
  }

  private async settle(userId: string, profile: RelationshipProfile, now: Date) {
    assertValidProfileDates(profile);
    if (!profile.birthday && !profile.customImportantDates.length) throw new Error('請先設定一個重要日。');
    const [state, session] = await Promise.all([this.onboardingRepository.getForUser(userId), this.gameplayRepository.loadForUser(userId)]);
    if (state.pendingTutorial) return this.commit(userId, state, session);
    if (state.tutorialReward) return { onboarding: state, session };
    const outcome = completeMission(tutorialMission, session.gameState, session.collectionState, now);
    const onboarding: OnboardingState = { ...state, profile, pendingTutorial: {
      tutorialReward: { reward: outcome.reward, gameState: outcome.gameState },
      collectionState: outcome.collectionState, runHistory: session.runHistory,
    } };
    // Durable intent precedes progress. Every retry replays the exact same target.
    await this.onboardingRepository.saveForUser(userId, onboarding);
    return this.commit(userId, onboarding, session);
  }

  private async commit(userId: string, onboarding: OnboardingState, session: GameplaySession) {
    const pending = onboarding.pendingTutorial!;
    const next = { ...session, gameState: pending.tutorialReward.gameState, collectionState: pending.collectionState, runHistory: pending.runHistory };
    await this.gameplayRepository.saveProgress(userId, next);
    const saved = { ...onboarding, tutorialReward: pending.tutorialReward, status: 'reward' as const };
    delete saved.pendingTutorial;
    await this.onboardingRepository.saveForUser(userId, saved);
    return { onboarding: saved, session: next };
  }
}
