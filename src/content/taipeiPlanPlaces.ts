import type { PlanLocation } from '@/features/journey/domain/itineraryModels';

export interface PlanPlace extends PlanLocation {
  placeId: string;
  kind: 'dinner' | 'cinema' | 'free';
  url: string;
  description?: string;
  opens?: number;
  closes?: number;
  tags?: string[];
  landmines?: string[];
}

// Locations checked against venue/municipal pages on 2026-10-03.
// Walking times and the 09:00–22:00 planning window are conservative local estimates.
export const taipeiPlanPlaces: readonly PlanPlace[] = [
  { placeId: 'dinner-maojiang', kind: 'dinner', name: '貓將日本料理・信義 A13', address: '台北市信義區松仁路58號14樓', station: '象山', walkMinutes: 10, url: 'https://tw.eztable.com/restaurant/17794' },
  { placeId: 'dinner-village', kind: 'dinner', name: '村民食堂廚窗港點・士林官邸', address: '台北市士林區福林路188號', station: '士林', walkMinutes: 12, url: 'https://tw.eztable.com/restaurant/17775' },
  { placeId: 'dinner-xuji', kind: 'dinner', name: '旭集・台北信義店', address: '台北市信義區松仁路58號9樓', station: '象山', walkMinutes: 10, url: 'https://tw.eztable.com/restaurant/17820' },
  { placeId: 'dinner-kaetsu', kind: 'dinner', name: '彩日本料理・台北君悅酒店', address: '台北市信義區松壽路2號3樓', station: '台北101/世貿', walkMinutes: 8, url: 'https://tw.eztable.com/restaurant/1737' },
  { placeId: 'cinema-xinyi', kind: 'cinema', name: '台北信義威秀影城', address: '台北市信義區松壽路20號', station: '台北101/世貿', walkMinutes: 10, url: 'https://www.vscinemas.com.tw/theater/detail.aspx?id=1' },
  { placeId: 'cinema-qsquare', kind: 'cinema', name: '台北京站威秀影城', address: '台北市大同區市民大道一段209號5樓', station: '台北車站', walkMinutes: 8, url: 'https://www.vscinemas.com.tw/theater/detail.aspx?id=2' },
  { placeId: 'cinema-ximen', kind: 'cinema', name: '台北西門威秀影城', address: '台北市萬華區漢中街52號8–11樓', station: '西門', walkMinutes: 8, url: 'https://www.vscinemas.com.tw/theater/detail.aspx?id=31' },
  { placeId: 'free-songshan', kind: 'free', name: '松山文創園區・建築與公共藝術', address: '台北市信義區光復南路133號', station: '國父紀念館', walkMinutes: 8, opens: 540, closes: 1320, tags: ['文青手作'], description: '欣賞老菸廠建築、公共藝術與生態池；園區免費，個別展覽另計。', url: 'https://www.songshanculturalpark.org/service/qa' },
  { placeId: 'free-village', kind: 'free', name: '四四南村・眷村建築拍照', address: '台北市信義區松勤街50號', station: '台北101/世貿', walkMinutes: 6, opens: 540, closes: 1080, tags: ['文青手作', '浪漫派'], description: '在戶外公共廣場欣賞眷村建築、合拍紀念照；不包含付費演出與室內展館。', url: 'https://media.taiwan.net.tw/zh-tw/portal/poi/details/c1_379000000a_000045' },
  { placeId: 'free-zhongshan', kind: 'free', name: '心中山線形公園・城市裝置', address: '台北市中山區中山北路二段・捷運中山站旁', station: '中山', walkMinutes: 5, opens: 540, closes: 1320, tags: ['浪漫派', '文青手作'], description: '找一處公共裝置拍照，在地上廣場感受街區氛圍；店家消費另計。', url: 'https://www.travel.taipei/zh-tw/attraction/details/1588' },
  { placeId: 'free-xiangshan', kind: 'free', name: '象山公園・自然觀察與合照', address: '台北市信義區信義路五段150巷', station: '象山', walkMinutes: 5, opens: 540, closes: 1320, tags: ['戶外休閒'], landmines: ['花粉過敏'], description: '在平地公園觀察自然、拍一張合照；不包含登山行程。', url: 'https://www.travel.taipei/en/attraction/details/703' },
  { placeId: 'free-shilin', kind: 'free', name: '士林官邸公園・庭園賞景', address: '台北市士林區福林路60號', station: '士林', walkMinutes: 10, opens: 540, closes: 1080, tags: ['戶外休閒', '浪漫派'], landmines: ['花粉過敏'], description: '欣賞中式與西式庭園；公園免費，官邸正館需另外購票。', url: 'https://www.gov.taipei/News_Content.aspx?n=F0DDAF49B89E9413&s=DB6346F9968EBC06&sms=72544237BBE4C5F6' },
];

export function findPlanPlace(nameOrId: string): PlanPlace | undefined {
  return taipeiPlanPlaces.find((place) => place.placeId === nameOrId || place.name === nameOrId);
}
