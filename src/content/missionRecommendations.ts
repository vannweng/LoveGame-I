import type { MissionRecommendationCandidate } from '@/features/recommendations/domain';

const checkedAt = '2026-10-03';
const unverifiedDietaryNeeds = ['蛋奶素', '海鮮過敏', '堅果過敏'];
type RecommendationOptions = Pick<MissionRecommendationCandidate, 'blockedByDietary' | 'blockedByLandmines' | 'destination' | 'price' | 'city'>;

export const missionRecommendationCatalog: readonly MissionRecommendationCandidate[] = [
  item('dinner-maojiang', 'date_dinner', '貓將日本料理・信義 A13', '日式料理與景觀座位；請先確認日期、菜單與飲食需求。', ['浪漫派'], {
    city: '台北市', blockedByDietary: unverifiedDietaryNeeds,
    price: { amountTwd: 500, basis: 'bookingFrom', checkedAt },
    destination: { provider: 'EZTABLE', url: 'https://tw.eztable.com/restaurant/17794' },
  }),
  item('dinner-village', 'date_dinner', '村民食堂廚窗港點・士林官邸', '港式點心與雙人用餐；請先確認日期、菜單與飲食需求。', ['實用派'], {
    city: '台北市', blockedByDietary: unverifiedDietaryNeeds,
    price: { amountTwd: 720, basis: 'bookingFrom', checkedAt },
    destination: { provider: 'EZTABLE', url: 'https://tw.eztable.com/restaurant/17775' },
  }),
  item('dinner-xuji', 'date_dinner', '旭集・台北信義店', '日式自助餐；請先確認日期、餐期價格與飲食需求。', ['奢華質感'], {
    city: '台北市', blockedByDietary: unverifiedDietaryNeeds,
    price: { amountTwd: 1090, basis: 'bookingFrom', checkedAt },
    destination: { provider: 'EZTABLE', url: 'https://tw.eztable.com/restaurant/17820' },
  }),
  item('dinner-kaetsu', 'date_dinner', '彩日本料理・台北君悅酒店', '日式自助餐；請先確認日期、餐期價格與飲食需求。', ['奢華質感'], {
    city: '台北市', blockedByDietary: unverifiedDietaryNeeds,
    price: { amountTwd: 1580, basis: 'bookingFrom', checkedAt },
    destination: { provider: 'EZTABLE', url: 'https://tw.eztable.com/restaurant/1737' },
  }),
  item('gift-plush', 'gift_order', '臺灣黑熊玩偶', '療癒的小禮物；先確認對方是否喜歡玩偶。', ['甜美'], {
    blockedByLandmines: ['討厭玩偶/娃娃'],
    price: { amountTwd: 349, basis: 'product', checkedAt },
    destination: { provider: 'Pinkoi', url: 'https://www.pinkoi.com/product/iw5rZXc9' },
  }),
  item('gift-candle', 'gift_order', '純白造型香氛蠟燭', '簡約擺飾，可在商家頁面確認香味與規格。', ['質感香氛', '文青手作'], {
    price: { amountTwd: 490, basis: 'product', checkedAt },
    destination: { provider: 'Pinkoi', url: 'https://www.pinkoi.com/product/ZL7hMKsZ' },
  }),
  item('gift-earrings', 'gift_order', '極簡幾何純銀耳針', '日常好搭；先確認對方有耳洞與配戴習慣。', ['精緻飾品'], {
    price: { amountTwd: 680, basis: 'product', checkedAt },
    destination: { provider: 'Pinkoi', url: 'https://www.pinkoi.com/product/dNZFgtNa' },
  }),
  item('gift-bracelet', 'gift_order', '簡約光點純銀手鍊', '低調的日常飾品；先確認尺寸與配戴習慣。', ['精緻飾品', '奢華質感'], {
    price: { amountTwd: 1200, basis: 'product', checkedAt },
    destination: { provider: 'Pinkoi', url: 'https://www.pinkoi.com/product/yzvk2MAj' },
  }),
  item('gift-lamp', 'gift_order', '原木香氛蠟燭暖燈', '居家氛圍小物；先確認空間與插座規格。', ['質感香氛', '奢華質感'], {
    price: { amountTwd: 1280, basis: 'product', checkedAt },
    destination: { provider: 'Pinkoi', url: 'https://www.pinkoi.com/product/KYzDEaBA' },
  }),
  item('cinema-art', 'cinema_booking', '文藝電影場次', '選擇映後還能散步聊天的時段。', ['文青手作', '浪漫派']),
  item('cinema-comfort', 'cinema_booking', '舒適影廳', '先選交通方便、座位舒適的場次。', ['實用派']),
  item('card-handmade', 'card_writing', '手寫回憶卡', '放入一件只有你們知道的小事。', ['文青手作', '浪漫派']),
  item('card-practical', 'card_writing', '三段式卡片', '感謝、回憶、下一個約定各寫一段。', ['實用派']),
  item('plan-outdoor', 'itinerary_confirmation', '戶外散步行程', '確認天氣、交通與替代方案。', ['戶外休閒'], { blockedByLandmines: ['討厭高空'] }),
  item('plan-popular', 'itinerary_confirmation', '人氣景點行程', '提早確認排隊與預約規則。', ['浪漫派'], { blockedByLandmines: ['討厭排隊名店'] }),
  item('plan-simple', 'itinerary_confirmation', '低風險備援行程', '準備室內備案並確認移動時間。', ['實用派']),
];

function item(
  id: string,
  missionType: MissionRecommendationCandidate['missionType'],
  title: string,
  description: string,
  preferenceMatches: string[],
  options: RecommendationOptions = {},
): MissionRecommendationCandidate {
  return { id, missionType, title, description, preferenceMatches, ...options };
}
