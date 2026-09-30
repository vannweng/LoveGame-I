export interface StorageAdapter {
  removeItem(key: string): Promise<void>;
}

export class LocalAccountResetService {
  constructor(private readonly storage: StorageAdapter) {}

  async resetUserData(userId: string): Promise<void> {
    await Promise.all(getUserDataStorageKeys(userId).map((key) => this.storage.removeItem(key)));
  }
}

export function getUserDataStorageKeys(userId: string): string[] {
  return [
    `lovegame:onboarding:${userId}`,
    `lovegame:gameplay:${userId}`,
    `lovegame:journey:${userId}`,
    `lovegame:relationship:${userId}`,
    `lovegame:missions:${userId}`,
    `lovegame:collection:${userId}`,
    `lovegame:progression:${userId}`,
    `lovegame:activity-board:${userId}`,
  ];
}
