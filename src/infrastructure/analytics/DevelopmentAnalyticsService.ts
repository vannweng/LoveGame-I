import type { AnalyticsService } from './AnalyticsService';
import type { AnalyticsEvent } from '@/shared/analytics/AnalyticsEvent';

/** Development adapter only. Replace this adapter at the composition root for production delivery. */
export class DevelopmentAnalyticsService implements AnalyticsService {
  track(event: AnalyticsEvent): void {
    if (__DEV__) console.info('[analytics]', event.name, event.properties ?? {});
  }
}
