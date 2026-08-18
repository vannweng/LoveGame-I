import type { DailyGameplayConfig } from '@/features/dailyGameplay/domain';

export const dailyGameplayConfig: DailyGameplayConfig = {
  safeAction: {
    id: 'check-in',
    titleKey: 'DAILY_SAFE_ACTION_TITLE',
    descriptionKey: 'DAILY_SAFE_ACTION_DESCRIPTION',
  },
  nextHooks: [
    {
      id: 'combo-five',
      titleKey: 'DAILY_NEXT_HOOK_TITLE',
      descriptionKey: 'DAILY_NEXT_HOOK_DESCRIPTION',
    },
  ],
};
