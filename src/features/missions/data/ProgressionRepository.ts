import type { GameState } from '@/features/missions/domain';

export interface ProgressionRepository {
  getForUser(userId: string): Promise<GameState | null>;
  saveForUser(userId: string, state: GameState): Promise<void>;
}
