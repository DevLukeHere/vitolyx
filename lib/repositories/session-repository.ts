import type { SQLiteDatabase } from 'expo-sqlite';
import { TestSessionSchema, type TestSession, type SessionId, type SessionWithCount } from '@/types/database';
import { generateId } from '@/lib/utils/id';
import { nowIso } from '@/lib/utils/date';

function rowToSession(row: Record<string, unknown>): TestSession {
  return TestSessionSchema.parse({
    id: row.id,
    date: row.date,
    labName: row.lab_name ?? null,
    notes: row.notes ?? null,
    createdAt: row.created_at,
  });
}

export function createSessionRepository(db: SQLiteDatabase) {
  return {
    async getAll(): Promise<SessionWithCount[]> {
      const rows = await db.getAllAsync<Record<string, unknown>>(
        `SELECT s.*, COUNT(r.id) as result_count
         FROM test_sessions s
         LEFT JOIN test_results r ON r.session_id = s.id
         GROUP BY s.id
         ORDER BY s.date DESC, s.created_at DESC`,
      );
      return rows.map((row) => ({
        ...rowToSession(row),
        resultCount: (row.result_count as number) ?? 0,
      }));
    },

    async getById(id: SessionId): Promise<TestSession | null> {
      const row = await db.getFirstAsync<Record<string, unknown>>(
        'SELECT * FROM test_sessions WHERE id = ?',
        id,
      );
      return row ? rowToSession(row) : null;
    },

    async create(input: { date: string; labName?: string; notes?: string }): Promise<TestSession> {
      const id = generateId();
      await db.runAsync(
        'INSERT INTO test_sessions (id, date, lab_name, notes, created_at) VALUES (?, ?, ?, ?, ?)',
        id,
        input.date,
        input.labName ?? null,
        input.notes ?? null,
        nowIso(),
      );
      return rowToSession(
        (await db.getFirstAsync<Record<string, unknown>>(
          'SELECT * FROM test_sessions WHERE id = ?',
          id,
        ))!,
      );
    },

    async update(
      id: SessionId,
      patch: Partial<Pick<TestSession, 'date' | 'labName' | 'notes'>>,
    ): Promise<void> {
      const sets: string[] = [];
      const values: (string | null)[] = [];
      if (patch.date !== undefined) { sets.push('date = ?'); values.push(patch.date); }
      if (patch.labName !== undefined) { sets.push('lab_name = ?'); values.push(patch.labName); }
      if (patch.notes !== undefined) { sets.push('notes = ?'); values.push(patch.notes); }
      if (sets.length === 0) return;
      values.push(id);
      await db.runAsync(`UPDATE test_sessions SET ${sets.join(', ')} WHERE id = ?`, ...values);
    },

    async delete(id: SessionId): Promise<void> {
      await db.runAsync('DELETE FROM test_sessions WHERE id = ?', id);
    },
  };
}
