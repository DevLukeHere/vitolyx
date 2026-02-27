import { z } from 'zod';

// ─── Branded IDs ────────────────────────────────────────────────────────────

declare const __brand: unique symbol;
type Brand<T, B> = T & { readonly [__brand]: B };

export type MarkerId = Brand<string, 'MarkerId'>;
export type SessionId = Brand<string, 'SessionId'>;
export type ResultId = Brand<string, 'ResultId'>;

export const toMarkerId = (s: string) => s as MarkerId;
export const toSessionId = (s: string) => s as SessionId;
export const toResultId = (s: string) => s as ResultId;

// ─── Enums ──────────────────────────────────────────────────────────────────

export const MARKER_CATEGORIES = [
  'lipid_panel',
  'cbc',
  'metabolic',
  'liver',
  'thyroid',
  'iron',
  'vitamin',
  'hormone',
  'inflammatory',
  'other',
] as const;
export type MarkerCategory = (typeof MARKER_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<MarkerCategory, string> = {
  lipid_panel: 'Lipid Panel',
  cbc: 'CBC',
  metabolic: 'Metabolic',
  liver: 'Liver',
  thyroid: 'Thyroid',
  iron: 'Iron',
  vitamin: 'Vitamin',
  hormone: 'Hormone',
  inflammatory: 'Inflammatory',
  other: 'Other',
};

export const FLAG_VALUES = ['low', 'normal', 'high'] as const;
export type Flag = (typeof FLAG_VALUES)[number];

export const UNIT_PREFERENCES = ['metric', 'imperial'] as const;
export type UnitPreference = (typeof UNIT_PREFERENCES)[number];

// ─── Zod Schemas ────────────────────────────────────────────────────────────

export const BloodMarkerSchema = z.object({
  id: z.string().transform(toMarkerId),
  name: z.string().min(1),
  shortName: z.string().min(1),
  category: z.enum(MARKER_CATEGORIES),
  defaultUnit: z.string().min(1),
  altUnit: z.string().nullable(),
  conversionFactor: z.number().nullable(),
  referenceLow: z.number(),
  referenceHigh: z.number(),
  description: z.string(),
  isCustom: z.boolean().default(false),
});

export const TestSessionSchema = z.object({
  id: z.string().transform(toSessionId),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  labName: z.string().nullable(),
  notes: z.string().nullable(),
  createdAt: z.string(),
});

export const TestResultSchema = z.object({
  id: z.string().transform(toResultId),
  sessionId: z.string().transform(toSessionId),
  markerId: z.string().transform(toMarkerId),
  value: z.number(),
  unit: z.string().min(1),
});

export const SettingsSchema = z.object({
  unitPreference: z.enum(UNIT_PREFERENCES).default('metric'),
  darkMode: z.enum(['system', 'light', 'dark']).default('system'),
});

// ─── Derived types ──────────────────────────────────────────────────────────

export type BloodMarker = z.infer<typeof BloodMarkerSchema>;
export type TestSession = z.infer<typeof TestSessionSchema>;
export type TestResult = z.infer<typeof TestResultSchema>;
export type Settings = z.infer<typeof SettingsSchema>;

// ─── Computed view types ────────────────────────────────────────────────────

export type FlaggedResult = TestResult & {
  flag: Flag;
  marker: BloodMarker;
  displayValue: number;
  displayUnit: string;
};

export type SessionWithCount = TestSession & {
  resultCount: number;
};

export type MarkerTrendPoint = {
  date: string;
  value: number;
  unit: string;
  sessionId: SessionId;
  flag: Flag;
  labName?: string | null;
};

export type MarkerWithLatest = BloodMarker & {
  latestResult: FlaggedResult | null;
  trend: 'up' | 'down' | 'stable' | 'none';
  sparklineData: number[];
};

// ─── Form schemas ───────────────────────────────────────────────────────────

export const NewSessionFormSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date'),
  labName: z.string().optional(),
  notes: z.string().optional(),
});

export const ResultInputSchema = z.object({
  markerId: z.string().min(1, 'Select a marker'),
  value: z
    .string()
    .min(1, 'Enter a value')
    .refine((v) => !Number.isNaN(parseFloat(v)), 'Must be a number')
    .transform(parseFloat),
  unit: z.string().min(1),
});

export const CustomMarkerSchema = z.object({
  name: z.string().min(1, 'Name required'),
  shortName: z.string().min(1, 'Short name required').max(6),
  unit: z.string().min(1, 'Unit required'),
  referenceLow: z.string().refine((v) => !Number.isNaN(parseFloat(v)), 'Must be a number').transform(parseFloat),
  referenceHigh: z.string().refine((v) => !Number.isNaN(parseFloat(v)), 'Must be a number').transform(parseFloat),
});

export type NewSessionForm = z.input<typeof NewSessionFormSchema>;
export type ResultInputForm = z.input<typeof ResultInputSchema>;
export type CustomMarkerForm = z.input<typeof CustomMarkerSchema>;
