import { advanceOnboarding, retreatOnboarding } from '@/features/relationship/domain';
import type {
  CrushCandidate,
  OnboardingState,
  RelationshipMode,
  RelationshipProfile,
  TutorialReward,
} from '@/features/relationship/domain';
import type { OnboardingRepository } from '@/features/relationship/data/OnboardingRepository';

export class OnboardingService {
  constructor(private readonly repository: OnboardingRepository) {}

  getState(userId: string): Promise<OnboardingState> {
    return this.repository.getForUser(userId);
  }

  async advance(userId: string, state: OnboardingState): Promise<OnboardingState> {
    return this.save(userId, { ...state, status: advanceOnboarding(state.status) });
  }

  async retreat(userId: string, state: OnboardingState): Promise<OnboardingState> {
    return this.save(userId, { ...state, status: retreatOnboarding(state.status, state.relationshipMode, state.crushCandidates.length > 0) });
  }

  async saveProfile(
    userId: string,
    state: OnboardingState,
    profile: RelationshipProfile,
  ): Promise<OnboardingState> {
    return this.save(userId, { ...state, profile, status: 'tutorial' });
  }

  async chooseRelationshipMode(
    userId: string,
    state: OnboardingState,
    relationshipMode: RelationshipMode,
  ): Promise<OnboardingState> {
    const changedMode = state.relationshipMode !== relationshipMode;
    const profile = changedMode ? { partnerNickname: '', customImportantDates: [] } : state.profile ?? { partnerNickname: '', customImportantDates: [] };
    const status = relationshipMode === 'partnered' ? 'partnerName' : 'singleIntro';
    return this.save(userId, {
      ...state, relationshipMode, profile, status,
      crushCandidates: changedMode ? [] : state.crushCandidates,
      activeCrushId: changedMode ? null : state.activeCrushId,
    });
  }

  async startSinglePractice(userId: string, state: OnboardingState): Promise<OnboardingState> {
    return this.save(userId, { ...state, activeCrushId: null, crushCandidates: [], profile: { partnerNickname: '', customImportantDates: [] }, status: 'tutorial' });
  }

  async startCrushSetup(userId: string, state: OnboardingState): Promise<OnboardingState> {
    return this.save(userId, { ...state, status: 'crushes' });
  }

  async saveCrushCandidates(userId: string, state: OnboardingState, crushCandidates: CrushCandidate[], activeCrushId: CrushCandidate['id']): Promise<OnboardingState> {
    const uniqueIds = new Set(crushCandidates.map((candidate) => candidate.id));
    if (crushCandidates.length < 1 || crushCandidates.length > 3 || uniqueIds.size !== crushCandidates.length || crushCandidates.some((candidate) => !candidate.nickname.trim())) {
      throw new Error('One to three unique crush candidates are required.');
    }
    const normalized = crushCandidates.map((candidate) => ({ ...candidate, nickname: candidate.nickname.trim() }));
    const active = normalized.find((candidate) => candidate.id === activeCrushId);
    if (!active) throw new Error('Active crush must be one of the saved candidates.');
    const profile = { partnerNickname: active.nickname, customImportantDates: [] };
    return this.save(userId, { ...state, activeCrushId, crushCandidates: normalized, profile, relationshipMode: 'single', status: 'tutorial' });
  }

  async savePartnerName(
    userId: string,
    state: OnboardingState,
    partnerNickname: string,
  ): Promise<OnboardingState> {
    const profile = { ...(state.profile ?? { customImportantDates: [] }), partnerNickname };
    return this.save(userId, { ...state, profile, relationshipMode: 'partnered', status: 'partnerReward' });
  }

  async saveTutorialReward(
    userId: string,
    state: OnboardingState,
    tutorialReward: TutorialReward,
  ): Promise<OnboardingState> {
    return this.save(userId, { ...state, tutorialReward, status: 'reward' });
  }

  async updateRelationshipProfile(
    userId: string,
    state: OnboardingState,
    profile: RelationshipProfile,
  ): Promise<OnboardingState> {
    return this.save(userId, { ...state, profile });
  }

  private async save(userId: string, state: OnboardingState): Promise<OnboardingState> {
    await this.repository.saveForUser(userId, state);
    return state;
  }
}
