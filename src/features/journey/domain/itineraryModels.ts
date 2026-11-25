export interface PlanLocation {
  name: string;
  address: string;
  station?: string;
  walkMinutes?: number;
  placeId?: string;
}

export interface CinemaReservation {
  cinemaName: string;
  movieTitle?: string;
  reservedTime: string;
  durationMinutes: number;
  location: PlanLocation;
  reportedAt: string;
}

export interface DinnerReservation {
  restaurantName: string;
  reservedTime: string;
  reportedAt: string;
  durationMinutes?: number;
  location?: PlanLocation;
}

export interface ItineraryItem {
  id: string;
  kind?: 'activity' | 'cinema' | 'dinner' | 'transport';
  startTime: string;
  endTime: string;
  startDayOffset?: number;
  endDayOffset?: number;
  title: string;
  description: string;
  status: 'suggested' | 'confirmed';
  source: 'system' | 'user';
  location?: PlanLocation;
  free?: boolean;
  estimatedMinutes?: number;
  route?: { origin: string; destination: string; mode: 'transit' | 'walking' };
}

export interface ImportantDateItinerary {
  eventDate: string;
  items: ItineraryItem[];
  alerts?: string[];
  plannerVersion?: 2;
}

export interface BookingReport {
  kind: 'dinner' | 'cinema';
  name: string;
  startTime: string;
  durationMinutes: number;
  location: PlanLocation;
  movieTitle?: string;
}
