import assert from 'node:assert/strict';
import test from 'node:test';

import { recommendForMission, type MissionRecommendationCandidate, type RecommendationPreferences } from '@/features/recommendations/domain';

const basePreferences: RecommendationPreferences = {
  style: 'romantic', preferenceTags: [], dietaryPreferences: [], landmines: [],
};

test('every important-date mission type has built-in recommendations', () => {
  const missionTypes = ['date_dinner', 'gift_order', 'cinema_booking', 'card_writing', 'itinerary_confirmation'] as const;
  missionTypes.forEach((missionType) => assert.ok(recommendForMission(missionType, basePreferences).length > 0));
});

test('preferences rank matching recommendations before generic candidates', () => {
  const recommendations = recommendForMission('gift_order', {
    ...basePreferences, preferenceTags: ['精緻飾品'],
  });
  assert.equal(recommendations[0].id, 'gift-jewelry');
  assert.deepEqual(recommendations[0].matchedPreferences, ['精緻飾品']);
});

test('dietary restrictions and landmines remove blocked recommendations', () => {
  const dinner = recommendForMission('date_dinner', {
    ...basePreferences, dietaryPreferences: ['不吃辣', '海鮮過敏'],
  });
  const gifts = recommendForMission('gift_order', {
    ...basePreferences, landmines: ['討厭玩偶/娃娃'],
  });
  assert.deepEqual(dinner.map((item) => item.id), ['dinner-vegetarian']);
  assert.equal(gifts.some((item) => item.id === 'gift-plush'), false);
});

test('recommendations return an empty safe state when every candidate is blocked', () => {
  const catalog: MissionRecommendationCandidate[] = [{
    id: 'blocked', missionType: 'gift_order', title: '玩偶', description: '不適合', blockedByLandmines: ['討厭玩偶/娃娃'],
  }];
  const recommendations = recommendForMission('gift_order', {
    ...basePreferences, landmines: ['討厭玩偶/娃娃'],
  }, catalog);
  assert.deepEqual(recommendations, []);
});
