import { useState, type SetStateAction } from 'react';
import { acknowledgeStoredDraft, createStoredDraft, syncStoredDraft } from '../utils/storedDraft';

export function useStoredDraft<T>(scope: string, initial: T): [T, (value: SetStateAction<T>) => void, (submitted: T) => void] {
  const [state, setState] = useState(() => createStoredDraft(scope, initial));
  const synced = syncStoredDraft(state, scope, initial);
  if (synced !== state) setState(synced);
  const setDraft = (value: SetStateAction<T>) => setState((current) => {
    const latest = syncStoredDraft(current, scope, initial);
    return { ...latest, acknowledged: undefined, value: typeof value === 'function' ? (value as (previous: T) => T)(latest.value) : value };
  });
  const acknowledge = (submitted: T) => setState((current) => current.scope === scope ? acknowledgeStoredDraft(current, submitted, synced.source) : current);
  return [synced.value, setDraft, acknowledge];
}
