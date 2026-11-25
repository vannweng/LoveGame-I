import type { ItineraryItem } from './models';

// A browser directions link, not a request to a paid routing API.
export function planRouteUrl(route: NonNullable<ItineraryItem['route']>): string {
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(route.origin)}&destination=${encodeURIComponent(route.destination)}&travelmode=${route.mode}`;
}
