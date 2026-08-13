import type {
  CollectionEvaluationInput,
  CollectionEvaluationResult,
  CollectionItem,
  GraveRecord,
} from './models';

const FIRST_SURVIVAL_TITLE_ID = 'title:first-survived';
const COMBO_FIVE_TITLE_ID = 'title:combo-five';
const RANK_GG_GRAVE_ID = 'grave:rank-negative-ten';

export function evaluateCollectionUnlocks(
  input: CollectionEvaluationInput,
): CollectionEvaluationResult {
  const unlockedItems: CollectionItem[] = [];
  const createdGraves: GraveRecord[] = [];

  unlockFirstSurvivalTitle(input, unlockedItems);
  unlockComboTitle(input, unlockedItems);
  createGraveAtGg(input, unlockedItems, createdGraves);

  return {
    unlockedItems,
    createdGraves,
    collectionState: {
      items: [...input.collectionState.items, ...unlockedItems],
      graves: [...input.collectionState.graves, ...createdGraves],
    },
  };
}

function unlockFirstSurvivalTitle(
  input: CollectionEvaluationInput,
  unlockedItems: CollectionItem[],
): void {
  const isCompleted = input.missionResult !== 'fail';

  if (isCompleted && !hasItem(input, FIRST_SURVIVAL_TITLE_ID)) {
    unlockedItems.push(createItem(FIRST_SURVIVAL_TITLE_ID, 'title', '第一次活下來', input.occurredAt));
  }
}

function unlockComboTitle(
  input: CollectionEvaluationInput,
  unlockedItems: CollectionItem[],
): void {
  if (input.nextCombo >= 5 && !hasItem(input, COMBO_FIVE_TITLE_ID)) {
    unlockedItems.push(createItem(COMBO_FIVE_TITLE_ID, 'title', '開始有點東西', input.occurredAt));
  }
}

function createGraveAtGg(
  input: CollectionEvaluationInput,
  unlockedItems: CollectionItem[],
  createdGraves: GraveRecord[],
): void {
  const reachesGg = input.previousRankScore > -10 && input.nextRankScore === -10;

  if (reachesGg && !hasItem(input, RANK_GG_GRAVE_ID)) {
    unlockedItems.push(createItem(RANK_GG_GRAVE_ID, 'grave', '墓碑', input.occurredAt));
    createdGraves.push({
      id: RANK_GG_GRAVE_ID,
      createdAt: input.occurredAt,
      reason: 'rank_reached_negative_ten',
      rankScore: -10,
    });
  }
}

function hasItem(input: CollectionEvaluationInput, id: string): boolean {
  return input.collectionState.items.some((item) => item.id === id);
}

function createItem(
  id: string,
  type: CollectionItem['type'],
  name: string,
  unlockedAt: Date,
): CollectionItem {
  return { id, type, name, unlockedAt };
}
