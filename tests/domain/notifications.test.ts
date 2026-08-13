import assert from 'node:assert/strict';
import test from 'node:test';

import { MissionReminderService } from '@/features/missions/application/MissionReminderService';
import type { MissionReminderRepository } from '@/features/missions/data/MissionReminderRepository';
import { planMissionReminder, type Mission, type ScheduledMissionReminder } from '@/features/missions/domain';
import type { MissionNotificationService, NotificationPermission } from '@/infrastructure/notifications/MissionNotificationService';
import { missionTemplates } from '@/content/missionTemplates';

const mission: Mission = {
  id: 'birthday-dinner', importance: 'survival', template: missionTemplates['birthday-dinner'],
  successUntil: new Date('2026-08-15T00:00:00+08:00'),
  failAt: new Date('2026-08-20T00:00:00+08:00'),
};

class MemoryRepository implements MissionReminderRepository {
  value: ScheduledMissionReminder | null = null;
  async get(): Promise<ScheduledMissionReminder | null> { return this.value; }
  async save(reminder: ScheduledMissionReminder): Promise<void> { this.value = reminder; }
  async remove(): Promise<void> { this.value = null; }
}

class FakeNotifications implements MissionNotificationService {
  scheduled = 0;
  cancelled: string[] = [];
  scheduledInputs: Parameters<MissionNotificationService['scheduleMissionReminder']>[0][] = [];
  permission: NotificationPermission = 'granted';
  async requestPermission(): Promise<NotificationPermission> { return this.permission; }
  async scheduleMissionReminder(input: Parameters<MissionNotificationService['scheduleMissionReminder']>[0]): Promise<string> {
    this.scheduled += 1;
    this.scheduledInputs.push(input);
    return `notification-${this.scheduled}`;
  }
  async cancelScheduledReminder(id: string): Promise<void> { this.cancelled.push(id); }
  subscribeToMissionOpen(): () => void { return () => undefined; }
}

test('planMissionReminder schedules one day before the success deadline', () => {
  const plan = planMissionReminder(mission, new Date('2026-08-10T00:00:00+08:00'));

  assert.equal(plan?.scheduledAt.toISOString(), '2026-08-13T16:00:00.000Z');
});

test('reminder sync does not schedule an unchanged mission twice', async () => {
  const repository = new MemoryRepository();
  const notifications = new FakeNotifications();
  const service = new MissionReminderService(repository, notifications);
  const now = new Date('2026-08-10T00:00:00+08:00');

  assert.equal(await service.sync(mission, now), 'scheduled');
  assert.equal(await service.sync(mission, now), 'unchanged');
  assert.equal(notifications.scheduled, 1);
  assert.deepEqual(notifications.scheduledInputs[0], {
    missionId: mission.id,
    scheduledAt: new Date('2026-08-13T16:00:00.000Z'),
  });
});

test('important-date mission changes cancel and replace the old schedule', async () => {
  const repository = new MemoryRepository();
  const notifications = new FakeNotifications();
  const service = new MissionReminderService(repository, notifications);
  const now = new Date('2026-08-10T00:00:00+08:00');
  await service.sync(mission, now);
  const changedMission = { ...mission, successUntil: new Date('2026-08-16T00:00:00+08:00') };

  assert.equal(await service.sync(changedMission, now), 'scheduled');
  assert.deepEqual(notifications.cancelled, ['notification-1']);
  assert.equal(notifications.scheduled, 2);
});

test('denied notification permission leaves the game usable without a schedule', async () => {
  const repository = new MemoryRepository();
  const notifications = new FakeNotifications();
  notifications.permission = 'denied';

  assert.equal(await new MissionReminderService(repository, notifications).sync(mission, new Date('2026-08-10T00:00:00+08:00')), 'permissionDenied');
  assert.equal(repository.value, null);
});
