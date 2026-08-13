import type {
  CollectionEvaluationInput,
  CollectionEvaluationResult,
  CollectionItem,
  GraveRecord,
} from './models';
import { gameRules } from '@/content/gameRules';

export function evaluateCollectionUnlocks(
  input: CollectionEvaluationInput,
): CollectionEvaluationResult {
  const unlockedItems: CollectionItem[] = [];
  const createdGraves: GraveRecord[] = [];

  gameRules.collectionUnlocks.forEach((rule) => {
    if (hasItem(input, rule.id) || !isUnlocked(rule, input)) return;

    unlockedItems.push(createItem(rule.id, rule.type, rule.name, input.occurredAt));
    if (rule.type === 'grave') {
      createdGraves.push({
        id: rule.id,
        createdAt: input.occurredAt,
        reason: 'rank_reached_negative_ten',
        rankScore: rule.condition.value,
      });
    }
  });

  return {
    unlockedItems,
    createdGraves,
    collectionState: {
      items: [...input.collectionState.items, ...unlockedItems],
      graves: [...input.collectionState.graves, ...createdGraves],
    },
  };
}

function isUnlocked(
  rule: (typeof gameRules.collectionUnlocks)[number],
  input: CollectionEvaluationInput,
): boolean {
  if (rule.condition.kind === 'firstNonFail') return input.missionResult !== 'fail';
  if (rule.condition.kind === 'comboAtLeast') return input.nextCombo >= rule.condition.value;

  return input.previousRankScore > rule.condition.value && input.nextRankScore === rule.condition.value;
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
