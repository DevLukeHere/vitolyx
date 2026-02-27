import { useSQLiteContext } from 'expo-sqlite';
import { useAsyncData, type AsyncState } from './use-async-data';
import { createSettingsRepository } from '@/lib/repositories/settings-repository';
import type { Settings } from '@/types/database';

export type UseSettingsReturn = AsyncState<Settings> & {
  setSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => Promise<void>;
};

export function useSettings(): UseSettingsReturn {
  const db = useSQLiteContext();
  const repo = createSettingsRepository(db);
  const state = useAsyncData(() => repo.get(), []);

  return {
    ...state,
    async setSetting(key, value) {
      await repo.set(key, value);
      state.refetch();
    },
  };
}
