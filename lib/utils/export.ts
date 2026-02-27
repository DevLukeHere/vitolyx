import * as Sharing from 'expo-sharing';
import { Paths, File } from 'expo-file-system';
import type { TestSession, TestResult, BloodMarker } from '@/types/database';

type ExportPayload = {
  exportedAt: string;
  sessions: Array<{
    id: string;
    date: string;
    labName: string | null;
    notes: string | null;
    results: Array<{
      markerName: string;
      value: number;
      unit: string;
    }>;
  }>;
};

export async function exportToJson(
  sessions: TestSession[],
  results: TestResult[],
  markers: BloodMarker[],
): Promise<void> {
  const markerMap = new Map(markers.map((m) => [m.id as string, m]));
  const resultsBySession = new Map<string, TestResult[]>();
  for (const r of results) {
    const arr = resultsBySession.get(r.sessionId as string) ?? [];
    arr.push(r);
    resultsBySession.set(r.sessionId as string, arr);
  }

  const payload: ExportPayload = {
    exportedAt: new Date().toISOString(),
    sessions: sessions.map((s) => ({
      id: s.id as string,
      date: s.date,
      labName: s.labName,
      notes: s.notes,
      results: (resultsBySession.get(s.id as string) ?? []).map((r) => ({
        markerName: markerMap.get(r.markerId as string)?.name ?? (r.markerId as string),
        value: r.value,
        unit: r.unit,
      })),
    })),
  };

  const json = JSON.stringify(payload, null, 2);
  const file = new File(Paths.cache, `vitolyx-export-${Date.now()}.json`);
  file.create();
  file.write(json);
  await Sharing.shareAsync(file.uri, { mimeType: 'application/json' });
}
