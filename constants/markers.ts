import type { MarkerCategory } from '@/types/database';

export type SeedMarker = {
  id: string;
  name: string;
  shortName: string;
  category: MarkerCategory;
  defaultUnit: string;
  altUnit: string | null;
  conversionFactor: number | null;
  referenceLow: number;
  referenceHigh: number;
  description: string;
};

export const SEED_MARKERS: SeedMarker[] = [
  // ─── Lipid Panel ────────────────────────────────────────────────────────
  { id: 'total_cholesterol', name: 'Total Cholesterol', shortName: 'TC', category: 'lipid_panel', defaultUnit: 'mmol/L', altUnit: 'mg/dL', conversionFactor: 38.67, referenceLow: 3.6, referenceHigh: 5.2, description: 'Total amount of cholesterol in the blood' },
  { id: 'ldl_cholesterol', name: 'LDL Cholesterol', shortName: 'LDL', category: 'lipid_panel', defaultUnit: 'mmol/L', altUnit: 'mg/dL', conversionFactor: 38.67, referenceLow: 0, referenceHigh: 3.4, description: 'Low-density lipoprotein cholesterol' },
  { id: 'hdl_cholesterol', name: 'HDL Cholesterol', shortName: 'HDL', category: 'lipid_panel', defaultUnit: 'mmol/L', altUnit: 'mg/dL', conversionFactor: 38.67, referenceLow: 1.0, referenceHigh: 2.5, description: 'High-density lipoprotein cholesterol' },
  { id: 'triglycerides', name: 'Triglycerides', shortName: 'TG', category: 'lipid_panel', defaultUnit: 'mmol/L', altUnit: 'mg/dL', conversionFactor: 88.57, referenceLow: 0, referenceHigh: 1.7, description: 'Type of fat in the blood' },

  // ─── CBC ────────────────────────────────────────────────────────────────
  { id: 'haemoglobin', name: 'Haemoglobin', shortName: 'Hb', category: 'cbc', defaultUnit: 'g/L', altUnit: 'g/dL', conversionFactor: 0.1, referenceLow: 120, referenceHigh: 170, description: 'Oxygen-carrying protein in red blood cells' },
  { id: 'wbc', name: 'White Blood Cells', shortName: 'WBC', category: 'cbc', defaultUnit: '×10⁹/L', altUnit: null, conversionFactor: null, referenceLow: 4.0, referenceHigh: 11.0, description: 'Infection-fighting cells' },
  { id: 'rbc', name: 'Red Blood Cells', shortName: 'RBC', category: 'cbc', defaultUnit: '×10¹²/L', altUnit: null, conversionFactor: null, referenceLow: 4.0, referenceHigh: 6.0, description: 'Oxygen-carrying cells' },
  { id: 'platelets', name: 'Platelets', shortName: 'PLT', category: 'cbc', defaultUnit: '×10⁹/L', altUnit: null, conversionFactor: null, referenceLow: 150, referenceHigh: 400, description: 'Blood clotting cells' },
  { id: 'haematocrit', name: 'Haematocrit', shortName: 'HCT', category: 'cbc', defaultUnit: '%', altUnit: null, conversionFactor: null, referenceLow: 36, referenceHigh: 52, description: 'Percentage of blood volume occupied by red blood cells' },
  { id: 'mcv', name: 'Mean Corpuscular Volume', shortName: 'MCV', category: 'cbc', defaultUnit: 'fL', altUnit: null, conversionFactor: null, referenceLow: 80, referenceHigh: 100, description: 'Average red blood cell size' },
  { id: 'mch', name: 'Mean Corpuscular Haemoglobin', shortName: 'MCH', category: 'cbc', defaultUnit: 'pg', altUnit: null, conversionFactor: null, referenceLow: 27, referenceHigh: 33, description: 'Average amount of haemoglobin per red blood cell' },

  // ─── Metabolic ──────────────────────────────────────────────────────────
  { id: 'glucose', name: 'Glucose (Fasting)', shortName: 'Glu', category: 'metabolic', defaultUnit: 'mmol/L', altUnit: 'mg/dL', conversionFactor: 18.02, referenceLow: 3.9, referenceHigh: 5.6, description: 'Fasting blood sugar level' },
  { id: 'hba1c', name: 'HbA1c', shortName: 'A1c', category: 'metabolic', defaultUnit: '%', altUnit: 'mmol/mol', conversionFactor: 10.93, referenceLow: 4.0, referenceHigh: 5.7, description: 'Average blood sugar over 2-3 months' },
  { id: 'creatinine', name: 'Creatinine', shortName: 'Cr', category: 'metabolic', defaultUnit: 'µmol/L', altUnit: 'mg/dL', conversionFactor: 0.01131, referenceLow: 60, referenceHigh: 110, description: 'Kidney function indicator' },
  { id: 'egfr', name: 'eGFR', shortName: 'eGFR', category: 'metabolic', defaultUnit: 'mL/min', altUnit: null, conversionFactor: null, referenceLow: 90, referenceHigh: 120, description: 'Estimated glomerular filtration rate' },
  { id: 'urea', name: 'Urea', shortName: 'BUN', category: 'metabolic', defaultUnit: 'mmol/L', altUnit: 'mg/dL', conversionFactor: 6.006, referenceLow: 2.5, referenceHigh: 7.1, description: 'Kidney function and protein metabolism marker' },
  { id: 'uric_acid', name: 'Uric Acid', shortName: 'UA', category: 'metabolic', defaultUnit: 'µmol/L', altUnit: 'mg/dL', conversionFactor: 0.01681, referenceLow: 200, referenceHigh: 430, description: 'Waste product from purine metabolism' },
  { id: 'sodium', name: 'Sodium', shortName: 'Na', category: 'metabolic', defaultUnit: 'mmol/L', altUnit: null, conversionFactor: null, referenceLow: 136, referenceHigh: 145, description: 'Essential electrolyte' },
  { id: 'potassium', name: 'Potassium', shortName: 'K', category: 'metabolic', defaultUnit: 'mmol/L', altUnit: null, conversionFactor: null, referenceLow: 3.5, referenceHigh: 5.1, description: 'Essential electrolyte' },
  { id: 'calcium', name: 'Calcium', shortName: 'Ca', category: 'metabolic', defaultUnit: 'mmol/L', altUnit: 'mg/dL', conversionFactor: 4.005, referenceLow: 2.1, referenceHigh: 2.6, description: 'Essential for bones and muscle function' },

  // ─── Liver ──────────────────────────────────────────────────────────────
  { id: 'alt', name: 'ALT', shortName: 'ALT', category: 'liver', defaultUnit: 'U/L', altUnit: null, conversionFactor: null, referenceLow: 0, referenceHigh: 41, description: 'Alanine aminotransferase — liver enzyme' },
  { id: 'ast', name: 'AST', shortName: 'AST', category: 'liver', defaultUnit: 'U/L', altUnit: null, conversionFactor: null, referenceLow: 0, referenceHigh: 40, description: 'Aspartate aminotransferase — liver enzyme' },
  { id: 'alp', name: 'ALP', shortName: 'ALP', category: 'liver', defaultUnit: 'U/L', altUnit: null, conversionFactor: null, referenceLow: 30, referenceHigh: 120, description: 'Alkaline phosphatase — bone and liver enzyme' },
  { id: 'ggt', name: 'GGT', shortName: 'GGT', category: 'liver', defaultUnit: 'U/L', altUnit: null, conversionFactor: null, referenceLow: 0, referenceHigh: 61, description: 'Gamma-glutamyl transferase — liver and bile duct enzyme' },
  { id: 'bilirubin', name: 'Bilirubin (Total)', shortName: 'Bil', category: 'liver', defaultUnit: 'µmol/L', altUnit: 'mg/dL', conversionFactor: 0.05847, referenceLow: 0, referenceHigh: 21, description: 'Breakdown product of red blood cells' },
  { id: 'albumin', name: 'Albumin', shortName: 'Alb', category: 'liver', defaultUnit: 'g/L', altUnit: 'g/dL', conversionFactor: 0.1, referenceLow: 35, referenceHigh: 50, description: 'Major blood protein produced by the liver' },

  // ─── Thyroid ────────────────────────────────────────────────────────────
  { id: 'tsh', name: 'TSH', shortName: 'TSH', category: 'thyroid', defaultUnit: 'mIU/L', altUnit: null, conversionFactor: null, referenceLow: 0.4, referenceHigh: 4.0, description: 'Thyroid-stimulating hormone' },
  { id: 'free_t4', name: 'Free T4', shortName: 'fT4', category: 'thyroid', defaultUnit: 'pmol/L', altUnit: 'ng/dL', conversionFactor: 0.07769, referenceLow: 12, referenceHigh: 22, description: 'Free thyroxine — active thyroid hormone' },
  { id: 'free_t3', name: 'Free T3', shortName: 'fT3', category: 'thyroid', defaultUnit: 'pmol/L', altUnit: 'pg/mL', conversionFactor: 0.6514, referenceLow: 3.1, referenceHigh: 6.8, description: 'Free triiodothyronine — active thyroid hormone' },

  // ─── Iron ───────────────────────────────────────────────────────────────
  { id: 'ferritin', name: 'Ferritin', shortName: 'Fer', category: 'iron', defaultUnit: 'µg/L', altUnit: 'ng/mL', conversionFactor: 1, referenceLow: 30, referenceHigh: 300, description: 'Iron storage protein' },
  { id: 'serum_iron', name: 'Serum Iron', shortName: 'Fe', category: 'iron', defaultUnit: 'µmol/L', altUnit: 'µg/dL', conversionFactor: 5.585, referenceLow: 10, referenceHigh: 30, description: 'Iron circulating in the blood' },
  { id: 'transferrin', name: 'Transferrin', shortName: 'Tf', category: 'iron', defaultUnit: 'g/L', altUnit: null, conversionFactor: null, referenceLow: 2.0, referenceHigh: 3.6, description: 'Iron transport protein' },
  { id: 'tibc', name: 'TIBC', shortName: 'TIBC', category: 'iron', defaultUnit: 'µmol/L', altUnit: 'µg/dL', conversionFactor: 5.585, referenceLow: 45, referenceHigh: 72, description: 'Total iron-binding capacity' },

  // ─── Vitamin ────────────────────────────────────────────────────────────
  { id: 'vitamin_d', name: 'Vitamin D', shortName: 'VitD', category: 'vitamin', defaultUnit: 'nmol/L', altUnit: 'ng/mL', conversionFactor: 0.4006, referenceLow: 50, referenceHigh: 125, description: '25-hydroxyvitamin D level' },
  { id: 'vitamin_b12', name: 'Vitamin B12', shortName: 'B12', category: 'vitamin', defaultUnit: 'pmol/L', altUnit: 'pg/mL', conversionFactor: 1.355, referenceLow: 150, referenceHigh: 750, description: 'Essential for nerve function and red blood cell formation' },
  { id: 'folate', name: 'Folate', shortName: 'Fol', category: 'vitamin', defaultUnit: 'nmol/L', altUnit: 'ng/mL', conversionFactor: 0.4413, referenceLow: 7, referenceHigh: 45, description: 'Essential B vitamin for cell division' },

  // ─── Hormone ────────────────────────────────────────────────────────────
  { id: 'testosterone', name: 'Testosterone', shortName: 'Test', category: 'hormone', defaultUnit: 'nmol/L', altUnit: 'ng/dL', conversionFactor: 28.84, referenceLow: 8.6, referenceHigh: 29, description: 'Primary male sex hormone' },
  { id: 'oestradiol', name: 'Oestradiol', shortName: 'E2', category: 'hormone', defaultUnit: 'pmol/L', altUnit: 'pg/mL', conversionFactor: 0.2724, referenceLow: 40, referenceHigh: 160, description: 'Primary female sex hormone' },
  { id: 'cortisol', name: 'Cortisol', shortName: 'Cor', category: 'hormone', defaultUnit: 'nmol/L', altUnit: 'µg/dL', conversionFactor: 0.03625, referenceLow: 140, referenceHigh: 690, description: 'Stress hormone produced by adrenal glands' },
  { id: 'dhea_s', name: 'DHEA-S', shortName: 'DHEA', category: 'hormone', defaultUnit: 'µmol/L', altUnit: 'µg/dL', conversionFactor: 36.85, referenceLow: 1.0, referenceHigh: 12.0, description: 'Dehydroepiandrosterone sulfate — adrenal hormone' },

  // ─── Inflammatory ───────────────────────────────────────────────────────
  { id: 'crp', name: 'CRP', shortName: 'CRP', category: 'inflammatory', defaultUnit: 'mg/L', altUnit: null, conversionFactor: null, referenceLow: 0, referenceHigh: 5, description: 'C-reactive protein — inflammation marker' },
  { id: 'hs_crp', name: 'hs-CRP', shortName: 'hsCRP', category: 'inflammatory', defaultUnit: 'mg/L', altUnit: null, conversionFactor: null, referenceLow: 0, referenceHigh: 3, description: 'High-sensitivity CRP — cardiovascular risk marker' },
  { id: 'esr', name: 'ESR', shortName: 'ESR', category: 'inflammatory', defaultUnit: 'mm/hr', altUnit: null, conversionFactor: null, referenceLow: 0, referenceHigh: 20, description: 'Erythrocyte sedimentation rate — inflammation marker' },
];
