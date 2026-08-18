import * as Clipboard from 'expo-clipboard';

import type { ClipboardService } from './ClipboardService';

export class ExpoClipboardService implements ClipboardService {
  async copyText(text: string): Promise<void> {
    await Clipboard.setStringAsync(text);
  }
}
