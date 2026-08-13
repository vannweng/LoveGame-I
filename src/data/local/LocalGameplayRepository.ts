import type { GameplayRepository, GameplaySession } from '../repositories/GameplayRepository';
import {
  birthdayDinnerMission,
  initialCollectionState,
  initialGameState,
} from './mockGameplayData';

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
