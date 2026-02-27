import type { SQLiteDatabase } from 'expo-sqlite';
import { BloodMarkerSchema, type BloodMarker, type MarkerId, type MarkerCategory, CustomMarkerSchema } from '@/types/database';
import { generateId } from '@/lib/utils/id';
import type { z } from 'zod';

function rowToMarker(row: Record<string, unknown>): BloodMarker {
  return BloodMarkerSchema.parse({
    id: row.id,
    name: row.name,
    shortName: row.short_name,
    category: row.category,
    defaultUnit: row.default_unit,
    altUnit: row.alt_unit ?? null,
    conversionFactor: row.conversion_factor ?? null,
    referenceLow: row.reference_low,
    referenceHigh: row.reference_high,
    description: row.description,
    isCustom: row.is_custom === 1,
  });
}

export function createMarkerRepository(db: SQLiteDatabase) {
  return {
    async getAll(category?: MarkerCategory): Promise<BloodMarker[]> {
      const rows = category
        ? await db.getAllAsync<Record<string, unknown>>(
            'SELECT * FROM blood_markers WHERE category = ? ORDER BY name ASC',
            category,
          )
        : await db.getAllAsync<Record<string, unknown>>(
            'SELECT * FROM blood_markers ORDER BY category ASC, name ASC',
          );
      return rows.map(rowToMarker);
    },

    async getById(id: MarkerId): Promise<BloodMarker | null> {
      const row = await db.getFirstAsync<Record<string, unknown>>(
        'SELECT * FROM blood_markers WHERE id = ?',
        id,
      );
      return row ? rowToMarker(row) : null;
    },

    async createCustom(input: z.infer<typeof CustomMarkerSchema>): Promise<BloodMarker> {
      const id = generateId();
      const parsed = CustomMarkerSchema.parse(input);
      await db.runAsync(
        `INSERT INTO blood_markers
          (id, name, short_name, category, default_unit, alt_unit, conversion_factor,
           reference_low, reference_high, description, is_custom)
         VALUES (?, ?, ?, 'other', ?, NULL, NULL, ?, ?, '', 1)`,
        id,
        parsed.name,
        parsed.shortName,
        parsed.unit,
        parsed.referenceLow,
        parsed.referenceHigh,
      );
      return rowToMarker(
        (await db.getFirstAsync<Record<string, unknown>>(
          'SELECT * FROM blood_markers WHERE id = ?',
          id,
        ))!,
      );
    },

    async deleteCustom(id: MarkerId): Promise<void> {
      await db.runAsync('DELETE FROM blood_markers WHERE id = ? AND is_custom = 1', id);
    },
  };
}
