import * as WebBrowser from 'expo-web-browser';

import type { ExternalSearchService } from '@/features/recommendations/application/ExternalSearchService';

export class ExpoExternalSearchService implements ExternalSearchService {
  async open(url: string): Promise<void> {
    await WebBrowser.openBrowserAsync(url);
  }
}
