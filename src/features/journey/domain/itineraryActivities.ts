import { taipeiPlanPlaces, type PlanPlace } from '@/content/taipeiPlanPlaces';
import type { RelationshipPreferences } from '@/features/relationship/domain';
import type { ItineraryItem } from './itineraryModels';
import { estimateMetroTrip } from './metroEstimate';
import { itemEnd, itemStart, timedItem } from './planTime';

export function entryBuffer(item?: ItineraryItem): number { return item?.kind === 'cinema' ? 20 : item?.kind === 'dinner' ? 10 : 0; }

export function availableFreePlaces(preferences?: RelationshipPreferences): PlanPlace[] {
  return taipeiPlanPlaces.filter((place) => place.kind === 'free' && !place.landmines?.some((tag) => preferences?.landmines.includes(tag)));
}

export function suggestFreeStop(before: ItineraryItem | undefined, after: ItineraryItem | undefined, used: Set<string>, id: string, preferences?: RelationshipPreferences): ItineraryItem | undefined {
  const suggestions = availableFreePlaces(preferences).filter((place) => !used.has(place.placeId)).flatMap((place) => {
    const incoming = before ? estimateMetroTrip(before.location, place) : { minutes: 0 };
    const outgoing = after ? estimateMetroTrip(place, after.location) : { minutes: 0 };
    if (!incoming || !outgoing || incoming.minutes > 35 || outgoing.minutes > 35 || incoming.minutes + outgoing.minutes > 60) return [];
    let start = Math.max(place.opens ?? 540, before ? itemEnd(before) + incoming.minutes : 540);
    if (!before && after) start = itemStart(after) - outgoing.minutes - entryBuffer(after) - 45;
    const end = start + 45;
    if (start < 540 || start < (place.opens ?? 540) || end > (place.closes ?? 1320) || end > 1320) return [];
    if (after && end + outgoing.minutes + entryBuffer(after) > itemStart(after)) return [];
    const matches = place.tags?.filter((tag) => preferences?.preferenceTags.includes(tag) || (tag === '浪漫派' && preferences?.style === 'romantic')).length ?? 0;
    return [{ item: freeItem(place, id, start, end), score: incoming.minutes + outgoing.minutes - matches * 5 }];
  });
  return suggestions.sort((a, b) => a.score - b.score || a.item.id.localeCompare(b.item.id))[0]?.item;
}

export function freeItem(place: PlanPlace, id: string, start: number, end: number): ItineraryItem {
  return timedItem({ id, kind: 'activity', title: place.name, description: place.description ?? '', status: 'suggested', source: 'system', free: true, location: place }, start, end);
}

export function findFreeReplacement(items: ItineraryItem[], current: ItineraryItem, preferences?: RelationshipPreferences): PlanPlace | undefined {
  const activities = items.filter((item) => item.kind !== 'transport').sort((a, b) => itemStart(a) - itemStart(b));
  const index = activities.findIndex((item) => item.id === current.id);
  const before = activities[index - 1];
  const after = activities[index + 1];
  return availableFreePlaces(preferences).find((place) => {
    if (activities.some((item) => item.location?.placeId === place.placeId)) return false;
    if (itemStart(current) < (place.opens ?? 540) || itemEnd(current) > (place.closes ?? 1320)) return false;
    const incoming = before ? estimateMetroTrip(before.location, place) : { minutes: 0 };
    const outgoing = after ? estimateMetroTrip(place, after.location) : { minutes: 0 };
    return incoming && outgoing && (!before || itemEnd(before) + incoming.minutes <= itemStart(current))
      && (!after || itemEnd(current) + outgoing.minutes + entryBuffer(after) <= itemStart(after));
  });
}
