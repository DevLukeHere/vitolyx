import { useSQLiteContext } from 'expo-sqlite';
import { useAsyncData, type AsyncState } from './use-async-data';
import { createMarkerRepository } from '@/lib/repositories/marker-repository';
import { createResultRepository } from '@/lib/repositories/result-repository';
import { createSessionRepository } from '@/lib/repositories/session-repository';
import type { MarkerWithLatest, SessionWithCount } from '@/types/database';
import { convertToPreference, computeFlag } from '@/lib/utils/units';
import { useSettings } from './use-settings';

export type DashboardData = {
  markersWithLatest: MarkerWithLatest[];
  recentSessions: SessionWithCount[];
};

export function useDashboard(): AsyncState<DashboardData> {
  const db = useSQLiteContext();
  const markerRepo = createMarkerRepository(db);
  const resultRepo = createResultRepository(db);
  const sessionRepo = createSessionRepository(db);
  const { data: settings } = useSettings();
  const preference = settings?.unitPreference ?? 'metric';

  return useAsyncData(async () => {
    const [markers, sessions] = await Promise.all([
      markerRepo.getAll(),
      sessionRepo.getAll(),
    ]);

    const recentSessions = sessions.slice(0, 5);
    const latestResults = await resultRepo.getLatestPerMarker();
    const resultMap = new Map(latestResults.map((r) => [r.markerId as string, r]));

    const markersWithLatest: MarkerWithLatest[] = [];

    for (const marker of markers) {
      const latest = resultMap.get(marker.id as string);
      if (!latest) continue;

      const converted = convertToPreference(latest.value, latest.unit, marker, preference);
      const flag = computeFlag(converted.value, converted.unit, marker);

      const recentResults = await resultRepo.getRecentByMarker(marker.id, 8);
      const sparklineData = recentResults.map((r) => {
        const c = convertToPreference(r.value, r.unit, marker, preference);
        return c.value;
      });

      let trend: MarkerWithLatest['trend'] = 'stable';
      if (sparklineData.length >= 2) {
        const delta = sparklineData[sparklineData.length - 1] - sparklineData[sparklineData.length - 2];
        if (Math.abs(delta) > 0.01) trend = delta > 0 ? 'up' : 'down';
      }

      markersWithLatest.push({
        ...marker,
        latestResult: {
          ...latest,
          marker,
          displayValue: converted.value,
          displayUnit: converted.unit,
          flag,
        },
        trend,
        sparklineData,
      });
    }

    return { markersWithLatest, recentSessions };
  }, [preference]);
}
