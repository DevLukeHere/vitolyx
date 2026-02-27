import { useSQLiteContext } from 'expo-sqlite';
import { useAsyncData, type AsyncState } from './use-async-data';
import { createResultRepository } from '@/lib/repositories/result-repository';
import { createMarkerRepository } from '@/lib/repositories/marker-repository';
import type {
  FlaggedResult,
  MarkerTrendPoint,
  SessionId,
  MarkerId,
  ResultId,
} from '@/types/database';
import { convertToPreference, computeFlag } from '@/lib/utils/units';
import { useSettings } from './use-settings';

export type UseSessionResultsReturn = AsyncState<FlaggedResult[]> & {
  createMany: (inputs: Array<{ markerId: MarkerId; value: number; unit: string }>) => Promise<void>;
  updateResult: (id: ResultId, patch: { value: number; unit: string }) => Promise<void>;
  removeResult: (id: ResultId) => Promise<void>;
};

export function useSessionResults(sessionId: SessionId): UseSessionResultsReturn {
  const db = useSQLiteContext();
  const resultRepo = createResultRepository(db);
  const markerRepo = createMarkerRepository(db);
  const { data: settings } = useSettings();
  const preference = settings?.unitPreference ?? 'metric';

  const state = useAsyncData(async () => {
    const results = await resultRepo.getBySession(sessionId);
    const flagged: FlaggedResult[] = [];
    for (const r of results) {
      const marker = await markerRepo.getById(r.markerId);
      if (!marker) continue;
      const converted = convertToPreference(r.value, r.unit, marker, preference);
      flagged.push({
        ...r,
        marker,
        displayValue: converted.value,
        displayUnit: converted.unit,
        flag: computeFlag(converted.value, converted.unit, marker),
      });
    }
    return flagged;
  }, [sessionId, preference]);

  return {
    ...state,
    async createMany(inputs) {
      await resultRepo.createMany(sessionId, inputs);
      state.refetch();
    },
    async updateResult(id, patch) {
      await resultRepo.update(id, patch);
      state.refetch();
    },
    async removeResult(id) {
      await resultRepo.delete(id);
      state.refetch();
    },
  };
}

export function useMarkerTrend(markerId: MarkerId): AsyncState<MarkerTrendPoint[]> {
  const db = useSQLiteContext();
  const resultRepo = createResultRepository(db);
  const markerRepo = createMarkerRepository(db);
  const { data: settings } = useSettings();
  const preference = settings?.unitPreference ?? 'metric';

  return useAsyncData(async () => {
    const [results, marker] = await Promise.all([
      resultRepo.getByMarker(markerId),
      markerRepo.getById(markerId),
    ]);
    if (!marker) return [];
    return results.map((r) => {
      const converted = convertToPreference(r.value, r.unit, marker, preference);
      return {
        date: r.date,
        value: converted.value,
        unit: converted.unit,
        sessionId: r.sessionId,
        flag: computeFlag(converted.value, converted.unit, marker),
      };
    });
  }, [markerId, preference]);
}
