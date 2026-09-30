import { useEffect, useMemo, useRef } from 'react';
import { MissionReminderService } from '@/features/missions/application/MissionReminderService';
import { LocalMissionReminderRepository } from '@/infrastructure/storage/LocalMissionReminderRepository';
import { ExpoMissionNotificationService } from '@/infrastructure/notifications';
import type { JourneyState } from '../domain/models';

export function useJourneyReminders(userId: string, state: JourneyState | null, onOpen: (id: string) => void) {
  const service = useMemo(() => new MissionReminderService(new LocalMissionReminderRepository(), new ExpoMissionNotificationService()), []);
  const open = useRef(onOpen);
  open.current = onOpen;
  const latest = useRef(state);
  latest.current = state;
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  useEffect(() => {
    if (!state) return;
    queue.current = queue.current.catch(() => undefined).then(async () => {
      for (const chapter of state.chapters) {
        for (const task of chapter.tasks) {
          const id = `${userId}:${task.mission.id}`;
          if (task.result) await service.cancel(id);
          else await service.sync({ ...task.mission, id });
        }
      }
    }).catch(() => undefined); // Reminder failures must not block saved gameplay.
  }, [service, state, userId]);
  useEffect(() => {
    const unsubscribe = service.subscribeToMissionOpen((id) => {
      if (id.startsWith(`${userId}:`)) open.current(id.slice(userId.length + 1));
    });
    return () => {
      unsubscribe();
      const tasks = latest.current?.chapters.flatMap((chapter) => chapter.tasks) ?? [];
      queue.current = queue.current.catch(() => undefined).then(async () => {
        for (const task of tasks) await service.cancel(`${userId}:${task.mission.id}`);
      }).catch(() => undefined);
    };
  }, [service, userId]);
}
