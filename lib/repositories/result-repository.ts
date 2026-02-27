import type { SQLiteDatabase } from 'expo-sqlite';
import { TestResultSchema, type TestResult, type SessionId, type MarkerId, type ResultId } from '@/types/database';
import { generateId } from '@/lib/utils/id';

function rowToResult(row: Record<string, unknown>): TestResult & { date?: string; labName?: string | null } {
  return {
    ...TestResultSchema.parse({
      id: row.id,
      sessionId: row.session_id,
      markerId: row.marker_id,
      value: row.value,
      unit: row.unit,
    }),
    ...(row.date ? { date: row.date as string } : {}),
    ...(row.lab_name !== undefined ? { labName: row.lab_name as string | null } : {}),
  };
}

export function createResultRepository(db: SQLiteDatabase) {
  return {
    async getBySession(sessionId: SessionId): Promise<TestResult[]> {
      const rows = await db.getAllAsync<Record<string, unknown>>(
        'SELECT * FROM test_results WHERE session_id = ?',
        sessionId,
      );
      return rows.map(rowToResult);
    },

    async getByMarker(markerId: MarkerId): Promise<(TestResult & { date: string; labName: string | null })[]> {
      const rows = await db.getAllAsync<Record<string, unknown>>(
        `SELECT tr.*, ts.date, ts.lab_name
         FROM test_results tr
         JOIN test_sessions ts ON ts.id = tr.session_id
         WHERE tr.marker_id = ?
         ORDER BY ts.date ASC`,
        markerId,
      );
      return rows.map(rowToResult) as (TestResult & { date: string; labName: string | null })[];
    },

    async getLatestPerMarker(): Promise<(TestResult & { date: string })[]> {
      const rows = await db.getAllAsync<Record<string, unknown>>(
        `SELECT tr.*, ts.date
         FROM test_results tr
         JOIN test_sessions ts ON ts.id = tr.session_id
         JOIN (
           SELECT tr2.marker_id, MAX(ts2.date) AS max_date
           FROM test_results tr2
           JOIN test_sessions ts2 ON ts2.id = tr2.session_id
           GROUP BY tr2.marker_id
         ) latest ON latest.marker_id = tr.marker_id AND ts.date = latest.max_date`,
      );
      return rows.map(rowToResult) as (TestResult & { date: string })[];
    },

    async getRecentByMarker(markerId: MarkerId, limit = 10): Promise<(TestResult & { date: string })[]> {
      const rows = await db.getAllAsync<Record<string, unknown>>(
        `SELECT tr.*, ts.date
         FROM test_results tr
         JOIN test_sessions ts ON ts.id = tr.session_id
         WHERE tr.marker_id = ?
         ORDER BY ts.date DESC
         LIMIT ?`,
        markerId,
        limit,
      );
      return (rows.map(rowToResult) as (TestResult & { date: string })[]).reverse();
    },

    async createMany(
      sessionId: SessionId,
      inputs: Array<{ markerId: MarkerId; value: number; unit: string }>,
    ): Promise<TestResult[]> {
      const results: TestResult[] = [];
      await db.withTransactionAsync(async () => {
        for (const input of inputs) {
          const id = generateId();
          await db.runAsync(
            'INSERT INTO test_results (id, session_id, marker_id, value, unit) VALUES (?, ?, ?, ?, ?)',
            id,
            sessionId,
            input.markerId,
            input.value,
            input.unit,
          );
          results.push(
            TestResultSchema.parse({
              id,
              sessionId,
              markerId: input.markerId,
              value: input.value,
              unit: input.unit,
            }),
          );
        }
      });
      return results;
    },

    async update(id: ResultId, patch: { value: number; unit: string }): Promise<void> {
      await db.runAsync(
        'UPDATE test_results SET value = ?, unit = ? WHERE id = ?',
        patch.value,
        patch.unit,
        id,
      );
    },

    async delete(id: ResultId): Promise<void> {
      await db.runAsync('DELETE FROM test_results WHERE id = ?', id);
    },
  };
}
