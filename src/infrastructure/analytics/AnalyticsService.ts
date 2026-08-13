import type { AnalyticsEvent } from '@/shared/analytics/AnalyticsEvent';

export interface AnalyticsService {
  track(event: AnalyticsEvent): void;
}
