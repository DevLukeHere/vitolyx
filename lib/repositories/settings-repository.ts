import type { SQLiteDatabase } from 'expo-sqlite';
import { SettingsSchema, type Settings } from '@/types/database';

const DEFAULTS: Settings = { unitPreference: 'metric', darkMode: 'system' };

export function createSettingsRepository(db: SQLiteDatabase) {
  return {
    async get(): Promise<Settings> {
      const rows = await db.getAllAsync<{ key: string; value: string }>(
        'SELECT key, value FROM settings',
      );
      const map: Record<string, unknown> = {};
      for (const r of rows) {
        try {
          map[r.key] = JSON.parse(r.value);
        } catch {
          map[r.key] = r.value;
        }
      }
      return SettingsSchema.parse({ ...DEFAULTS, ...map });
    },

    async set<K extends keyof Settings>(key: K, value: Settings[K]): Promise<void> {
      await db.runAsync(
        'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
        key,
        JSON.stringify(value),
      );
    },
  };
}
