import type { SQLiteDatabase } from 'expo-sqlite';
import {
  DATABASE_VERSION,
  CREATE_BLOOD_MARKERS,
  CREATE_TEST_SESSIONS,
  CREATE_TEST_RESULTS,
  CREATE_SETTINGS,
  CREATE_INDEXES,
} from './schema';
import { seedMarkers } from './seed';

export async function migrateDatabase(db: SQLiteDatabase): Promise<void> {
  await db.execAsync('PRAGMA journal_mode = WAL');
  await db.execAsync('PRAGMA foreign_keys = ON');

  const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const currentVersion = result?.user_version ?? 0;

  if (currentVersion >= DATABASE_VERSION) return;

  await db.withTransactionAsync(async () => {
    if (currentVersion < 1) {
      await db.execAsync(CREATE_BLOOD_MARKERS);
      await db.execAsync(CREATE_TEST_SESSIONS);
      await db.execAsync(CREATE_TEST_RESULTS);
      await db.execAsync(CREATE_SETTINGS);
      await db.execAsync(CREATE_INDEXES);
      await seedMarkers(db);
    }
  });

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
