import type { GameplayProgress, GameplayRepository, GameplaySession } from '@/features/missions/data/GameplayRepository';
import {
  birthdayDinnerMission,
  initialCollectionState,
  initialGameState,
} from '@/features/missions/data/mockGameplayData';
import { createRunHistory } from '@/game/run';
import { secureStorage } from './secureStorage';

export class LocalGameplayRepository implements GameplayRepository {
  async loadForUser(userId: string): Promise<GameplaySession> {
    const saved = await this.loadProgress(userId);
    return {
      relationship: {
        id: 'local-relationship',
        ownerUserId: userId,
        partnerDisplayName: '伴侶',
        timezone: 'Asia/Taipei',
      },
      mission: birthdayDinnerMission,
      gameState: saved?.gameState ?? initialGameState,
      collectionState: saved?.collectionState ?? initialCollectionState,
      runHistory: saved?.runHistory ?? createRunHistory(new Date(), initialGameState.rankScore),
    };
  }

  async saveProgress(userId: string, progress: GameplayProgress): Promise<void> {
    await secureStorage.setItem(storageKey(userId), JSON.stringify(progress));
  }

  private async loadProgress(userId: string): Promise<GameplayProgress | null> {
    const saved = await secureStorage.getItem(storageKey(userId));
    return saved ? JSON.parse(saved) as GameplayProgress : null;
  }
}

function storageKey(userId: string): string {
  return `lovegame:gameplay:${userId}`;
}
