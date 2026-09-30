import assert from 'node:assert/strict';
import test from 'node:test';

import { getUserDataStorageKeys, LocalAccountResetService } from '@/application/account/LocalAccountResetService';

test('account reset removes every local save key for the current user only', async () => {
  const storage = new MemoryStorage();
  const service = new LocalAccountResetService(storage);

  await service.resetUserData('player-1');

  assert.deepEqual(storage.removed, getUserDataStorageKeys('player-1'));
  assert.equal(storage.removed.some((key) => key.includes('player-2')), false);
});

class MemoryStorage {
  removed: string[] = [];

  async removeItem(key: string): Promise<void> {
    this.removed.push(key);
  }
}
