import { View, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';

import { ThemedText } from '@/components/atoms/themed-text';
import { GlassCard } from '@/components/atoms/glass-card';
import { FlagBadge } from '@/components/atoms/badge';
import { TrendChart } from '@/components/organisms/trend-chart';
import { useMarker } from '@/hooks/use-markers';
import { useMarkerTrend } from '@/hooks/use-results';
import { useSettings } from '@/hooks/use-settings';
import { formatSessionDate } from '@/lib/utils/date';
import { formatValue } from '@/lib/utils/units';
import { toMarkerId } from '@/types/database';
import { Palette } from '@/constants/theme';

export default function MarkerDetailScreen() {
  const { id: rawId } = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const markerId = toMarkerId(id);

  const { data: marker, loading: markerLoading } = useMarker(markerId);
  const { data: trend, loading: trendLoading } = useMarkerTrend(markerId);
  const { data: settings } = useSettings();
  const preference = settings?.unitPreference ?? 'metric';

  if (markerLoading || trendLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface-light dark:bg-surface-dark">
        <Stack.Screen options={{ title: 'Loading...' }} />
        <ActivityIndicator size="large" color={Palette.teal} />
      </View>
    );
  }

  if (!marker) {
    return (
      <View className="flex-1 items-center justify-center bg-surface-light dark:bg-surface-dark">
        <Stack.Screen options={{ title: 'Not Found' }} />
        <ThemedText variant="subtitle">Marker not found</ThemedText>
      </View>
    );
  }

  const displayUnit =
    preference === 'imperial' && marker.altUnit ? marker.altUnit : marker.defaultUnit;
  const refLow =
    preference === 'imperial' && marker.altUnit && marker.conversionFactor !== null
      ? marker.referenceLow * marker.conversionFactor
      : marker.referenceLow;
  const refHigh =
    preference === 'imperial' && marker.altUnit && marker.conversionFactor !== null
      ? marker.referenceHigh * marker.conversionFactor
      : marker.referenceHigh;

  const values = trend?.map((t) => t.value) ?? [];
  const latest = trend && trend.length > 0 ? trend[trend.length - 1] : null;
  const avg = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  const min = values.length > 0 ? Math.min(...values) : 0;
  const max = values.length > 0 ? Math.max(...values) : 0;

  return (
    <View className="flex-1 bg-surface-light dark:bg-surface-dark">
      <Stack.Screen options={{ title: marker.name }} />

      <ScrollView contentContainerClassName="px-4 py-4 gap-4" contentInsetAdjustmentBehavior="automatic">
        <GlassCard className="p-4 gap-2">
          <ThemedText variant="label">
            {marker.shortName} · {marker.category.replace('_', ' ')}
          </ThemedText>
          <ThemedText variant="title">{marker.name}</ThemedText>
          {marker.description ? (
            <ThemedText variant="caption">{marker.description}</ThemedText>
          ) : null}
          <ThemedText variant="caption">
            Reference: {refLow.toFixed(1)}–{refHigh.toFixed(1)} {displayUnit}
          </ThemedText>
        </GlassCard>

        {latest && (
          <GlassCard className="p-4 flex-row items-center justify-between">
            <View>
              <ThemedText variant="label">Latest</ThemedText>
              <ThemedText variant="title" className="mt-1">
                {formatValue(latest.value, latest.unit)}
              </ThemedText>
            </View>
            <FlagBadge flag={latest.flag} />
          </GlassCard>
        )}

        <TrendChart marker={marker} data={trend ?? []} />

        {values.length > 0 && (
          <View className="flex-row gap-3">
            {[
              { label: 'Avg', value: avg },
              { label: 'Min', value: min },
              { label: 'Max', value: max },
            ].map((stat) => (
              <GlassCard key={stat.label} className="flex-1 p-4 items-center gap-1">
                <ThemedText variant="label">{stat.label}</ThemedText>
                <ThemedText variant="subtitle">{stat.value.toFixed(1)}</ThemedText>
              </GlassCard>
            ))}
          </View>
        )}

        {trend && trend.length > 0 && (
          <View className="gap-3">
            <ThemedText variant="label" className="px-1">History</ThemedText>
            {[...trend].reverse().map((point, i) => (
              <GlassCard key={i} className="p-3.5 flex-row items-center justify-between">
                <ThemedText variant="caption">
                  {formatSessionDate(point.date)}
                </ThemedText>
                <View className="flex-row items-center gap-2">
                  <ThemedText variant="mono">
                    {formatValue(point.value, point.unit)}
                  </ThemedText>
                  <FlagBadge flag={point.flag} />
                </View>
              </GlassCard>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
