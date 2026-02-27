import { View } from 'react-native';
import { ThemedText } from '@/components/atoms/themed-text';
import { GlassCard } from '@/components/atoms/glass-card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { formatSessionDate } from '@/lib/utils/date';
import type { BloodMarker, MarkerTrendPoint } from '@/types/database';
import { Palette } from '@/constants/theme';

type Props = {
  marker: BloodMarker;
  current: MarkerTrendPoint;
  previous: MarkerTrendPoint;
};

export function TrendAnalysisCard({ marker, current, previous }: Props) {
  const pctChange = Math.round(
    Math.abs(((current.value - previous.value) / previous.value) * 100),
  );
  const midpoint = (marker.referenceLow + marker.referenceHigh) / 2;
  const prevDist = Math.abs(previous.value - midpoint);
  const currDist = Math.abs(current.value - midpoint);
  const isImproving = currDist < prevDist;
  const isIncrease = current.value > previous.value;
  const accentColor = isImproving ? Palette.teal : '#f59e0b';

  const description = isImproving
    ? current.flag === 'normal'
      ? 'Great job! Your levels have improved and are now within the optimal range.'
      : 'Your levels are trending in the right direction. Keep it up!'
    : current.flag === 'normal'
      ? 'Your levels are still within the optimal range but have shifted slightly.'
      : 'Your levels have moved further from the optimal range. Consider consulting your doctor.';

  return (
    <GlassCard className="p-5 gap-3">
      <View className="flex-row items-center justify-between">
        <ThemedText variant="subtitle" className="text-base">
          Trend Analysis
        </ThemedText>
        <ThemedText variant="caption" className="text-xs">
          vs. Last Result ({formatSessionDate(previous.date)})
        </ThemedText>
      </View>

      <View className="flex-row items-center">
        <View className="flex-1 items-center">
          <ThemedText variant="caption" className="text-xs mb-1">
            Previous
          </ThemedText>
          <ThemedText variant="title" className="text-xl">
            {previous.value.toFixed(0)}
          </ThemedText>
        </View>
        <View className="w-px h-10 bg-gunmetal/20 dark:bg-cloud/10" />
        <View className="flex-1 items-center">
          <ThemedText variant="caption" className="text-xs mb-1">
            Current
          </ThemedText>
          <ThemedText variant="title" className="text-xl">
            {current.value.toFixed(0)}
          </ThemedText>
        </View>
        <View className="items-end">
          <View className="flex-row items-center gap-1">
            <IconSymbol
              name={isIncrease ? 'arrow.up.right' : 'arrow.down.right'}
              size={14}
              color={accentColor}
            />
            <ThemedText variant="subtitle" className="text-base" style={{ color: accentColor }}>
              {pctChange}%
            </ThemedText>
          </View>
          <ThemedText variant="label" className="text-xs" style={{ color: accentColor }}>
            {isImproving ? 'IMPROVING' : 'DECLINING'}
          </ThemedText>
        </View>
      </View>

      <View className="h-px bg-gunmetal/20 dark:bg-cloud/10" />

      <ThemedText variant="caption" className="text-sm leading-5">
        {description}
      </ThemedText>
    </GlassCard>
  );
}
