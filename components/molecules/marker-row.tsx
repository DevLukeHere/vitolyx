import { Pressable, View } from 'react-native';
import { ThemedText } from '@/components/atoms/themed-text';
import { FlagBadge } from '@/components/atoms/badge';
import { Sparkline } from '@/components/molecules/sparkline';
import { GlassCard } from '@/components/atoms/glass-card';
import { formatValue } from '@/lib/utils/units';
import type { BloodMarker, FlaggedResult } from '@/types/database';

type MarkerRowProps = {
  marker: BloodMarker;
  result?: FlaggedResult | null;
  sparklineData?: number[];
  trend?: 'up' | 'down' | 'stable' | 'none';
  onPress?: () => void;
};

export function MarkerRow({ marker, result, sparklineData, onPress }: MarkerRowProps) {
  return (
    <Pressable onPress={onPress}>
      <GlassCard className="p-5 gap-3">
        <View className="flex-row items-start justify-between">
          <ThemedText variant="label">{marker.shortName}</ThemedText>
          {result && <FlagBadge flag={result.flag} />}
        </View>

        {result ? (
          <View className="gap-1">
            <ThemedText variant="title" className="text-xl">
              {formatValue(result.displayValue, result.displayUnit)}
            </ThemedText>
            {sparklineData && sparklineData.length > 1 && (
              <Sparkline data={sparklineData} flag={result.flag} width={100} height={28} />
            )}
          </View>
        ) : (
          <ThemedText variant="caption" className="italic">No data</ThemedText>
        )}

        <ThemedText variant="caption" className="text-xs" numberOfLines={1}>
          {marker.name}
        </ThemedText>
      </GlassCard>
    </Pressable>
  );
}
