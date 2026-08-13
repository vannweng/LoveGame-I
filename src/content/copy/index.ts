import { actionCopy } from './actions';
import { commonCopy } from './common';
import { developmentCopy } from './development';
import { ggCopy } from './gg';
import { homeCopy } from './home';
import { missionCopy } from './mission';
import { onboardingCopy } from './onboarding';
import { relationshipCopy } from './relationship';
import { rewardCopy } from './reward';

export const copy = { ...actionCopy, ...commonCopy, ...developmentCopy, ...ggCopy, ...homeCopy, ...missionCopy, ...onboardingCopy, ...relationshipCopy, ...rewardCopy } as const;
export type CopyKey = keyof typeof copy;
type CopyVariables = Record<string, string | number>;

export function getCopy(key: CopyKey | string, variables: CopyVariables = {}): string {
  const template = copy[key as CopyKey] ?? key;
  return template.replace(/\{(\w+)\}/g, (placeholder, variable) => String(variables[variable] ?? placeholder));
}

export { actionCopy, commonCopy, developmentCopy, ggCopy, homeCopy, missionCopy, onboardingCopy, relationshipCopy, rewardCopy };
