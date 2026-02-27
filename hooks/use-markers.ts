import { useSQLiteContext } from 'expo-sqlite';
import { useAsyncData, type AsyncState } from './use-async-data';
import { createMarkerRepository } from '@/lib/repositories/marker-repository';
import type { BloodMarker, MarkerId, MarkerCategory, CustomMarkerSchema } from '@/types/database';
import type { z } from 'zod';

export type UseMarkersReturn = AsyncState<BloodMarker[]> & {
  createCustom: (input: z.infer<typeof CustomMarkerSchema>) => Promise<BloodMarker>;
  deleteCustom: (id: MarkerId) => Promise<void>;
};

export function useMarkers(category?: MarkerCategory): UseMarkersReturn {
  const db = useSQLiteContext();
  const repo = createMarkerRepository(db);
  const state = useAsyncData(() => repo.getAll(category), [category]);

  return {
    ...state,
    async createCustom(input) {
      const marker = await repo.createCustom(input);
      state.refetch();
      return marker;
    },
    async deleteCustom(id) {
      await repo.deleteCustom(id);
      state.refetch();
    },
  };
}

export function useMarker(id: MarkerId): AsyncState<BloodMarker | null> {
  const db = useSQLiteContext();
  const repo = createMarkerRepository(db);
  return useAsyncData(() => repo.getById(id), [id]);
}
