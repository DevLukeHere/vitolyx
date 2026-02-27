import { View, Pressable } from 'react-native';
import { ThemedText } from '@/components/atoms/themed-text';
import { GlassCard } from '@/components/atoms/glass-card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Sparkline } from '@/components/molecules/sparkline';
import type { MarkerWithLatest, MarkerCategory } from '@/types/database';
import { FlagColors } from '@/constants/theme';
import { formatNumber } from '@/lib/utils/units';

const CATEGORY_ICON: Record<MarkerCategory, string> = {
  lipid_panel: 'flame.fill',
  cbc: 'drop.fill',
  metabolic: 'bolt.fill',
  liver: 'leaf.fill',
  thyroid: 'waveform.path.ecg',
  iron: 'atom',
  vitamin: 'sun.max.fill',
  hormone: 'heart.fill',
  inflammatory: 'flame.fill',
  other: 'circle.fill',
};

type Props = {
  marker: MarkerWithLatest;
  onPress?: () => void;
};

export function HealthMetricCard({ marker, onPress }: Props) {
  const result = marker.latestResult;
  if (!result) return null;

  const accent = FlagColors[result.flag];
  const iconName = CATEGORY_ICON[marker.category] ?? 'circle.fill';
  const isNormal = result.flag === 'normal';

  const refLow =
    result.displayUnit !== marker.defaultUnit && marker.conversionFactor
      ? marker.referenceLow * marker.conversionFactor
      : marker.referenceLow;
  const refHigh =
    result.displayUnit !== marker.defaultUnit && marker.conversionFactor
      ? marker.referenceHigh * marker.conversionFactor
      : marker.referenceHigh;

  const rangeText =
    refLow < 0.1
      ? `Normal: < ${formatNumber(refHigh)}`
      : `Normal Range: ${formatNumber(refLow)}–${formatNumber(refHigh)}`;

  const formattedValue = formatNumber(result.displayValue);

  return (
    <Pressable onPress={onPress}>
      <GlassCard className="overflow-hidden">
        <View
          className="absolute left-0 top-0 bottom-0"
          style={{ width: 4, backgroundColor: accent }}
        />
        <View className="p-5 pl-6">
          <View className="flex-row items-start justify-between mb-3">
            <View className="flex-row items-center gap-3">
              <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: accent + '20' }}
              >
                <IconSymbol name={iconName as any} size={18} color={accent} />
              </View>
              <View>
                <ThemedText variant="subtitle" className="text-base">
                  {marker.name}
                </ThemedText>
                <ThemedText variant="caption" className="text-xs">
                  {rangeText}
                </ThemedText>
              </View>
            </View>
            <IconSymbol
              name={isNormal ? 'checkmark.circle.fill' : 'exclamationmark.triangle.fill'}
              size={22}
              color={isNormal ? '#22c55e' : '#f59e0b'}
            />
          </View>

          <View className="flex-row items-end justify-between">
            <View className="flex-row items-baseline gap-1">
              <ThemedText variant="title" className="text-3xl">
                {formattedValue}
              </ThemedText>
              <ThemedText variant="caption">{result.displayUnit}</ThemedText>
            </View>
            {marker.sparklineData.length > 1 && (
              <Sparkline
                data={marker.sparklineData}
                flag={result.flag}
                color={accent}
                width={120}
                height={36}
              />
            )}
          </View>
        </View>
      </GlassCard>
    </Pressable>
  );
}
