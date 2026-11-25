import { openRecommendationSearch } from '@/features/recommendations/application/openRecommendationSearch';
import type { ItineraryItem } from '../domain/models';
import { planRouteUrl } from '../domain/planRouteUrl';

export function openPlanRoute(route: NonNullable<ItineraryItem['route']>): Promise<void> {
  return openRecommendationSearch(planRouteUrl(route));
}
