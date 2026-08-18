export const analyticsEventNames = [
  'app_open', 'onboarding_complete', 'home_view', 'mission_create', 'mission_view',
  'mission_start', 'mission_complete', 'mission_late', 'mission_fail', 'reward_view', 'rank_up', 'rank_down',
  'collection_unlock', 'gg', 'relationship_event_create', 'daily_loop_view', 'crisis_detected',
  'safe_state_view', 'mission_accept', 'mission_defer', 'mission_report', 'next_hook_view',
] as const;

export type AnalyticsEventName = typeof analyticsEventNames[number];

export type AnalyticsProperties = Record<string, boolean | number | string>;

export interface AnalyticsEvent {
  name: AnalyticsEventName;
  properties?: AnalyticsProperties;
}
