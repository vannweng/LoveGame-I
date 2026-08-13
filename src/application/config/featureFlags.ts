export interface FeatureFlags {
  actionHub: boolean;
  aiRecommendation: boolean;
  calendar: boolean;
  restaurant: boolean;
}

/**
 * Production defaults keep unapproved MVP capabilities unavailable.
 * Expo public variables are safe here because flags are not secrets.
 */
export const featureFlags: Readonly<FeatureFlags> = {
  actionHub: readFlag(process.env.EXPO_PUBLIC_FEATURE_ACTION_HUB, true),
  aiRecommendation: readFlag(process.env.EXPO_PUBLIC_FEATURE_AI_RECOMMENDATION, true),
  calendar: readFlag(process.env.EXPO_PUBLIC_FEATURE_CALENDAR, true),
  restaurant: readFlag(process.env.EXPO_PUBLIC_FEATURE_RESTAURANT, true),
};

function readFlag(value: string | undefined, fallback: boolean): boolean {
  return value === undefined ? fallback : value === 'true';
}
