import assert from 'node:assert/strict';
import test from 'node:test';

import { createMissionAndTrack } from '@/features/missions/application/createMissionAndTrack';
import type { MissionGenerationService } from '@/features/missions/application/MissionGenerationService';
import type { AnalyticsEvent } from '@/shared/analytics/AnalyticsEvent';
import type { AnalyticsService } from '@/infrastructure/analytics';

test('newly created mission sends one analytics event with safe funnel properties', async () => {
  const analytics = new RecordingAnalytics();
  const result = await createMissionAndTrack(new StubGenerationService(true), analytics, 'birthday-dinner');

  assert.equal(result.created, true);
  assert.deepEqual(analytics.events, [{
    name: 'mission_create',
    properties: {
      days_before_due: 5, difficulty: 'normal', mission_id: 'generated-id', mission_source: 'system', mission_type: 'birthday',
    },
  }]);
});

test('deduplicated mission does not send a duplicate analytics event', async () => {
  const analytics = new RecordingAnalytics();
  const result = await createMissionAndTrack(new StubGenerationService(false), analytics, 'birthday-dinner');

  assert.equal(result.created, false);
  assert.deepEqual(analytics.events, []);
});

class StubGenerationService implements MissionGenerationService {
  constructor(private readonly created: boolean) {}

  async create() {
    return this.created
      ? { analytics: { daysBeforeDue: 5, difficulty: 'normal' as const, missionSource: 'system' as const, missionType: 'birthday' as const }, created: true, missionId: 'generated-id', status: 'active' as const }
      : { created: false, missionId: 'generated-id' };
  }
}

class RecordingAnalytics implements AnalyticsService {
  readonly events: AnalyticsEvent[] = [];

  track(event: AnalyticsEvent): void {
    this.events.push(event);
  }
}
