import { metroLines, supportedMetroStations } from '@/content/taipeiMetro';
import type { PlanLocation } from './itineraryModels';

export interface MetroEstimate { minutes: number; description: string; mode?: 'transit' | 'walking'; }

export function estimateMetroTrip(from?: PlanLocation, to?: PlanLocation): MetroEstimate | null {
  if (!from?.station || !to?.station || !supportedMetroStations.includes(from.station) || !supportedMetroStations.includes(to.station)) return null;
  const walk = (from.walkMinutes ?? 10) + (to.walkMinutes ?? 10);
  const localWalk = localWalkingEstimate(from.placeId, to.placeId);
  if (localWalk) return { minutes: localWalk, mode: 'walking', description: `附近地點步行轉場，預估 ${localWalk} 分鐘；請依現場動線調整。` };
  if (from.address === to.address) return { minutes: 5, mode: 'walking', description: '同一地點移動，預留約 5 分鐘。' };
  if (from.station === to.station) return { minutes: walk, mode: 'walking', description: `${from.station}站周邊步行，預估 ${walk} 分鐘。` };
  const queue: { key: string; cost: number; path: string[] }[] = [];
  metroLines.forEach((line, index) => {
    const station = (line.stations as readonly string[]).indexOf(from.station!);
    if (station >= 0) queue.push({ key: `${index}:${station}`, cost: 0, path: [`${index}:${station}`] });
  });
  const visited = new Set<string>();
  while (queue.length) {
    queue.sort((a, b) => a.cost - b.cost);
    const current = queue.shift()!;
    if (visited.has(current.key)) continue;
    visited.add(current.key);
    const [lineIndex, stationIndex] = current.key.split(':').map(Number);
    const line = metroLines[lineIndex];
    const station = line.stations[stationIndex];
    if (station === to.station) {
      const minutes = Math.ceil((current.cost + walk + 8) / 5) * 5;
      return { minutes, mode: 'transit', description: `步行至${from.station}站 → ${describePath(current.path)} → 步行至目的地。預估 ${minutes} 分鐘，含步行、候車與轉乘。` };
    }
    for (const nextIndex of [stationIndex - 1, stationIndex + 1]) {
      if (nextIndex >= 0 && nextIndex < line.stations.length) enqueue(`${lineIndex}:${nextIndex}`, 3);
    }
    metroLines.forEach((nextLine, nextLineIndex) => {
      const nextIndex = (nextLine.stations as readonly string[]).indexOf(station);
      if (nextLineIndex !== lineIndex && nextIndex >= 0) enqueue(`${nextLineIndex}:${nextIndex}`, 8);
    });
    function enqueue(key: string, extra: number): void {
      if (!visited.has(key)) queue.push({ key, cost: current.cost + extra, path: [...current.path, key] });
    }
  }
  return null;
}

function localWalkingEstimate(from?: string, to?: string): number | undefined {
  const groups = ['dinner-maojiang', 'dinner-xuji', 'dinner-kaetsu', 'cinema-xinyi', 'free-village', 'free-xiangshan'];
  if (!from || !to || from === to || !groups.includes(from) || !groups.includes(to)) return undefined;
  if (['dinner-maojiang', 'dinner-xuji'].includes(from) && ['dinner-maojiang', 'dinner-xuji'].includes(to)) return 5;
  return from === 'free-xiangshan' || to === 'free-xiangshan' ? 25 : 20;
}

function describePath(path: string[]): string {
  const segments: { line: number; start: string; end: string }[] = [];
  for (const key of path) {
    const [line, index] = key.split(':').map(Number);
    const station = metroLines[line].stations[index];
    const last = segments.at(-1);
    if (last?.line === line) last.end = station;
    else segments.push({ line, start: station, end: station });
  }
  return segments.filter((segment) => segment.start !== segment.end).map((segment) => `${metroLines[segment.line].name} ${segment.start}→${segment.end}`).join(' → 轉乘 → ');
}
