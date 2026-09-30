import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LocalJourneyRepository } from '@/infrastructure/storage/LocalJourneyRepository';
import { JourneyService } from './JourneyService';
import type { JourneyState } from '../domain/models';
import type { GameplayProgress } from '@/features/missions/data/GameplayRepository';
import { LocalActivityBoardRepository } from '@/infrastructure/storage/LocalActivityBoardRepository';

export function useJourney(userId: string, initial: GameplayProgress) {
  const service = useMemo(() => new JourneyService(new LocalJourneyRepository(), userId), [userId]);
  const initialRef = useRef(initial);
  const [state, setState] = useState<JourneyState | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [retry, setRetry] = useState(0);
  const [now, setNow] = useState(() => new Date());
  const preview = useRef<{ state: JourneyState; now: Date } | null>(null);
  useEffect(() => {
    let active = true;
    const { gameState, collectionState, runHistory } = initialRef.current;
    new LocalActivityBoardRepository().get(userId).then((activityBoard) => service.load({ gameState, collectionState, runHistory, schemaVersion: 1, chapters: [], activityBoard: activityBoard ?? undefined })).then((value) => {
      if (active && !preview.current) { setState(value); setError(''); }
    }).catch(() => { if (active) setError('讀取旅程失敗，請重試。'); });
    const timer = setInterval(() => { if (!preview.current) setNow(new Date()); }, 30_000);
    return () => { active = false; clearInterval(timer); };
  }, [service, retry, userId]);
  const mutate = useCallback(async (change: (state: JourneyState) => JourneyState) => {
    setBusy(true); setError('');
    try {
      if (preview.current) {
        const next = change(preview.current.state);
        preview.current.state = next;
        setState(next);
        return true;
      }
      const next = await service.update(change);
      setState(next); setNow(new Date());
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : '保存失敗，請重試。');
      return false;
    } finally { setBusy(false); }
  }, [service]);
  return {
    state, error, busy, now, mutate, isPreview: Boolean(preview.current),
    actionTime: () => preview.current?.now ?? new Date(),
    beginPreview: (state: JourneyState, now: Date) => { preview.current = { state, now }; setState(state); setNow(now); },
    endPreview: () => { preview.current = null; setState(null); setNow(new Date()); setRetry((value) => value + 1); },
    retry: () => setRetry((value) => value + 1),
  };
}
