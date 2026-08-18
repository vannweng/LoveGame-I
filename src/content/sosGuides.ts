import type { CopyKey } from './copy';

export type SosGuideLevel = 'level1' | 'level2' | 'level3';

export interface SosGuide {
  actionKeys: readonly [CopyKey, CopyKey];
  apologyKey: CopyKey;
  diagnosisKeys: readonly [CopyKey, CopyKey];
  diagnosisTitleKey: CopyKey;
  levelLabelKey: CopyKey;
  quickActionKeys: readonly [CopyKey, CopyKey];
}

export const sosGuides: Record<SosGuideLevel, SosGuide> = {
  level1: {
    levelLabelKey: 'GG_SOS_LEVEL_ONE', diagnosisTitleKey: 'GG_SOS_DIAGNOSIS', diagnosisKeys: ['GG_SOS_DIAGNOSIS_ONE', 'GG_SOS_DIAGNOSIS_TWO'],
    actionKeys: ['GG_SOS_ACTION_ONE', 'GG_SOS_ACTION_TWO'], apologyKey: 'GG_SOS_APOLOGY', quickActionKeys: ['GG_SOS_DRINK_DELIVERY', 'GG_SOS_APOLOGY_LINES'],
  },
  level2: {
    levelLabelKey: 'GG_SOS_LEVEL_TWO', diagnosisTitleKey: 'GG_SOS_LEVEL_TWO_DIAGNOSIS', diagnosisKeys: ['GG_SOS_LEVEL_TWO_DIAGNOSIS_ONE', 'GG_SOS_LEVEL_TWO_DIAGNOSIS_TWO'],
    actionKeys: ['GG_SOS_LEVEL_TWO_ACTION_ONE', 'GG_SOS_LEVEL_TWO_ACTION_TWO'], apologyKey: 'GG_SOS_LEVEL_TWO_APOLOGY', quickActionKeys: ['GG_SOS_LEVEL_TWO_QUICK_ONE', 'GG_SOS_LEVEL_TWO_QUICK_TWO'],
  },
  level3: {
    levelLabelKey: 'GG_SOS_LEVEL_THREE', diagnosisTitleKey: 'GG_SOS_LEVEL_THREE_DIAGNOSIS', diagnosisKeys: ['GG_SOS_LEVEL_THREE_DIAGNOSIS_ONE', 'GG_SOS_LEVEL_THREE_DIAGNOSIS_TWO'],
    actionKeys: ['GG_SOS_LEVEL_THREE_ACTION_ONE', 'GG_SOS_LEVEL_THREE_ACTION_TWO'], apologyKey: 'GG_SOS_LEVEL_THREE_APOLOGY', quickActionKeys: ['GG_SOS_LEVEL_THREE_QUICK_ONE', 'GG_SOS_LEVEL_THREE_QUICK_TWO'],
  },
};
