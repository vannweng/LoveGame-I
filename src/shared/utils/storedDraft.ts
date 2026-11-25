export interface StoredDraft<T> {
  scope: string;
  source: string;
  persisted: T;
  value: T;
  acknowledged?: string;
}

export function createStoredDraft<T>(scope: string, value: T): StoredDraft<T> {
  return { scope, source: JSON.stringify(value), persisted: value, value };
}

/** Object identity is irrelevant; unsaved edits survive updates to other forms. */
export function syncStoredDraft<T>(current: StoredDraft<T>, scope: string, value: T): StoredDraft<T> {
  if (current.scope !== scope) return createStoredDraft(scope, value);
  const source = JSON.stringify(value);
  if (source === current.source) return current;
  const edited = JSON.stringify(current.value);
  const dirty = edited !== current.source && edited !== current.acknowledged;
  return { scope, source, persisted: value, value: dirty ? current.value : value };
}

/** Accept server normalization only if no newer edits were made during the save. */
export function acknowledgeStoredDraft<T>(current: StoredDraft<T>, submitted: T, sourceAtSubmit: string): StoredDraft<T> {
  const acknowledged = JSON.stringify(submitted);
  if (JSON.stringify(current.value) !== acknowledged) return current;
  if (current.source !== sourceAtSubmit) return { ...current, value: current.persisted, acknowledged: undefined };
  return { ...current, acknowledged };
}
