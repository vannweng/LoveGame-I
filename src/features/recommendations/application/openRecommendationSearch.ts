import { ExpoExternalSearchService } from '@/infrastructure/externalSearch/ExpoExternalSearchService';

const externalSearchService = new ExpoExternalSearchService();

export function openRecommendationSearch(url: string): Promise<void> {
  return externalSearchService.open(url);
}
