export interface ClipboardService {
  copyText(text: string): Promise<void>;
}
