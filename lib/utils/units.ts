import type { BloodMarker, UnitPreference, Flag } from '@/types/database';

export type ConvertedValue = {
  value: number;
  unit: string;
};

export function convertToPreference(
  storedValue: number,
  storedUnit: string,
  marker: BloodMarker,
  preference: UnitPreference,
): ConvertedValue {
  const wantsAlt = preference === 'imperial' && marker.altUnit !== null;
  const isDefault = storedUnit === marker.defaultUnit;
  const isAlt = storedUnit === marker.altUnit;

  if (wantsAlt && isDefault && marker.conversionFactor !== null) {
    return {
      value: roundTo(storedValue * marker.conversionFactor, 2),
      unit: marker.altUnit!,
    };
  }

  if (!wantsAlt && isAlt && marker.conversionFactor !== null) {
    return {
      value: roundTo(storedValue / marker.conversionFactor, 2),
      unit: marker.defaultUnit,
    };
  }

  return { value: storedValue, unit: storedUnit };
}

export function computeFlag(
  displayValue: number,
  displayUnit: string,
  marker: BloodMarker,
): Flag {
  let compareValue = displayValue;
  if (displayUnit === marker.altUnit && marker.conversionFactor !== null) {
    compareValue = displayValue / marker.conversionFactor;
  }

  if (compareValue < marker.referenceLow) return 'low';
  if (compareValue > marker.referenceHigh) return 'high';
  return 'normal';
}

export function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

export function formatValue(value: number, unit: string): string {
  const dp = unit === '%' ? 1 : 2;
  return `${value.toFixed(dp)} ${unit}`;
}

export function formatNumber(v: number): string {
  return v % 1 === 0 ? v.toFixed(0) : v.toFixed(1);
}
