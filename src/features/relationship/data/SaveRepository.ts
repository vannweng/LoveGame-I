export interface SaveRepository {
  ensureDefaultSave(userId: string, timezone: string): Promise<void>;
}
