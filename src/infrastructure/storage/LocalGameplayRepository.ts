import type { GameplayRepository, GameplaySession } from '@/features/missions/data/GameplayRepository';
import {
  birthdayDinnerMission,
  initialCollectionState,
  initialGameState,
} from '@/features/missions/data/mockGameplayData';

export class LocalGameplayRepository implements GameplayRepository {
  async loadForUser(userId: string): Promise<GameplaySession> {
    return {
      relationship: {
        id: 'local-relationship',
        ownerUserId: userId,
        partnerDisplayName: '伴侶',
        timezone: 'Asia/Taipei',
      },
      mission: birthdayDinnerMission,
      gameState: initialGameState,
      collectionState: initialCollectionState,
    };
  }
}
