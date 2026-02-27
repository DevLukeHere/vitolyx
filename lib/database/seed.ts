import type { SQLiteDatabase } from 'expo-sqlite';
import { SEED_MARKERS } from '@/constants/markers';

export async function seedMarkers(db: SQLiteDatabase): Promise<void> {
  for (const m of SEED_MARKERS) {
    await db.runAsync(
      `INSERT OR IGNORE INTO blood_markers
        (id, name, short_name, category, default_unit, alt_unit, conversion_factor,
         reference_low, reference_high, description, is_custom)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
      m.id,
      m.name,
      m.shortName,
      m.category,
      m.defaultUnit,
      m.altUnit ?? null,
      m.conversionFactor ?? null,
      m.referenceLow,
      m.referenceHigh,
      m.description,
    );
  }
}
