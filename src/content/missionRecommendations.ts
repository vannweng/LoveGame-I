import type { MissionRecommendationCandidate } from '@/features/recommendations/domain';

export const missionRecommendationCatalog: readonly MissionRecommendationCandidate[] = [
  item('dinner-vegetarian', 'date_dinner', '蔬食友善餐廳', '先確認訂位與當日菜單。', ['實用派']),
  item('dinner-spicy', 'date_dinner', '特色辣味料理', '適合喜歡重口味的約會。', ['戶外休閒'], ['不吃辣']),
  item('dinner-seafood', 'date_dinner', '海鮮套餐', '確認新鮮度與訂位時間。', ['奢華質感'], ['海鮮過敏']),
  item('gift-fragrance', 'gift_order', '質感香氛小禮', '依平常使用習慣挑選香調。', ['質感香氛']),
  item('gift-jewelry', 'gift_order', '簡約飾品', '選擇容易日常搭配的款式。', ['精緻飾品', '奢華質感']),
  item('gift-plush', 'gift_order', '紀念玩偶', '挑一個和共同回憶有關的角色。', ['甜美'], undefined, ['討厭玩偶/娃娃']),
  item('cinema-art', 'cinema_booking', '文藝電影場次', '選擇映後還能散步聊天的時段。', ['文青手作', '浪漫派']),
  item('cinema-comfort', 'cinema_booking', '舒適影廳', '先選交通方便、座位舒適的場次。', ['實用派']),
  item('card-handmade', 'card_writing', '手寫回憶卡', '放入一件只有你們知道的小事。', ['文青手作', '浪漫派']),
  item('card-practical', 'card_writing', '三段式卡片', '感謝、回憶、下一個約定各寫一段。', ['實用派']),
  item('plan-outdoor', 'itinerary_confirmation', '戶外散步行程', '確認天氣、交通與替代方案。', ['戶外休閒'], undefined, ['討厭高空']),
  item('plan-popular', 'itinerary_confirmation', '人氣景點行程', '提早確認排隊與預約規則。', ['浪漫派'], undefined, ['討厭排隊名店']),
  item('plan-simple', 'itinerary_confirmation', '低風險備援行程', '準備室內備案並確認移動時間。', ['實用派']),
];

function item(
  id: string,
  missionType: MissionRecommendationCandidate['missionType'],
  title: string,
  description: string,
  preferenceMatches: string[],
  blockedByDietary?: string[],
  blockedByLandmines?: string[],
): MissionRecommendationCandidate {
  return { id, missionType, title, description, preferenceMatches, blockedByDietary, blockedByLandmines };
}
