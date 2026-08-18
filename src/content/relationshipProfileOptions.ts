import type { CopyKey } from './copy';

export const relationshipProfileOptions = {
  preferenceTags: [
    '浪漫派', '實用派', '質感香氛', '精緻飾品', '文青手作', '奢華質感', '戶外休閒', '甜美',
  ],
  dietaryPreferences: [
    '蛋奶素', '不吃香菜', '不吃辣', '海鮮過敏', '堅果過敏', '不喝咖啡',
  ],
  landmines: [
    '討厭玩偶/娃娃', '花粉過敏', '討厭粉紅色', '拒絕娃娃機', '討厭排隊名店', '討厭高空',
  ],
  categoryCopy: {
    preferenceTags: 'RELATIONSHIP_PREFERENCE_TAGS',
    dietaryPreferences: 'RELATIONSHIP_DIETARY_PREFERENCES',
    landmines: 'RELATIONSHIP_LANDMINES',
  } as const satisfies Record<string, CopyKey>,
} as const;
