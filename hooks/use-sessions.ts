import { useSQLiteContext } from 'expo-sqlite';
import { useAsyncData, type AsyncState } from './use-async-data';
import { createSessionRepository } from '@/lib/repositories/session-repository';
import type { TestSession, SessionId, SessionWithCount } from '@/types/database';

export type UseSessionsReturn = AsyncState<SessionWithCount[]> & {
  create: (input: { date: string; labName?: string; notes?: string }) => Promise<TestSession>;
  update: (id: SessionId, patch: Partial<Pick<TestSession, 'date' | 'labName' | 'notes'>>) => Promise<void>;
  remove: (id: SessionId) => Promise<void>;
};

export function useSessions(): UseSessionsReturn {
  const db = useSQLiteContext();
  const repo = createSessionRepository(db);
  const state = useAsyncData(() => repo.getAll(), []);

  return {
    ...state,
    async create(input) {
      const session = await repo.create(input);
      state.refetch();
      return session;
    },
    async update(id, patch) {
      await repo.update(id, patch);
      state.refetch();
    },
    async remove(id) {
      await repo.delete(id);
      state.refetch();
    },
  };
}

export function useSession(id: SessionId): AsyncState<TestSession | null> {
  const db = useSQLiteContext();
  const repo = createSessionRepository(db);
  return useAsyncData(() => repo.getById(id), [id]);
}
