import type { AuthUser } from '@/infrastructure/auth/models';
import { secureStorage } from '@/infrastructure/storage/secureStorage';

const devUser: AuthUser = { id: 'dev-user', displayName: 'DEV P1', email: null, photoUrl: null };
const sessionKey = 'lovegame:dev-preview-session';

export class DevPreviewSession {
  async restore(): Promise<AuthUser | null> {
    return await secureStorage.getItem(sessionKey) ? devUser : null;
  }

  async start(): Promise<AuthUser> {
    await secureStorage.setItem(sessionKey, 'active');
    return devUser;
  }

  async clear(): Promise<void> {
    await Promise.all([
      secureStorage.removeItem(sessionKey),
      ...['onboarding', 'activity-board', 'collection', 'progression', 'relationship', 'missions'].map((name) => secureStorage.removeItem(`lovegame:${name}:${devUser.id}`)),
    ]);
  }
}
