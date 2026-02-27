import { View, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useState, useMemo } from 'react';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { subMonths, parseISO } from 'date-fns';

import { ThemedText } from '@/components/atoms/themed-text';
import { GlassCard } from '@/components/atoms/glass-card';
import { FlagBadge } from '@/components/atoms/badge';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { TrendChart } from '@/components/organisms/trend-chart';
import { TrendAnalysisCard } from '@/components/molecules/trend-analysis-card';
import { TimeRangeFilter, type TimeRange } from '@/components/molecules/time-range-filter';
import { useMarker } from '@/hooks/use-markers';
import { useMarkerTrend } from '@/hooks/use-results';
import { useSettings } from '@/hooks/use-settings';
import { formatSessionDate } from '@/lib/utils/date';
import { toMarkerId, type Flag } from '@/types/database';
import { Palette } from '@/constants/theme';

const FLAG_LABEL: Record<Flag, string> = {
  normal: 'Optimal',
  high: 'High',
  low: 'Low',
};

const FLAG_LABEL_COLOR: Record<Flag, string> = {
  normal: Palette.teal,
  high: '#f59e0b',
  low: '#f59e0b',
};

export default function MarkerDetailScreen() {
  const { id: rawId } = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const markerId = toMarkerId(id);

  const router = useRouter();
  const { data: marker, loading: markerLoading } = useMarker(markerId);
  const { data: trend, loading: trendLoading } = useMarkerTrend(markerId);
  const { data: settings } = useSettings();
  const preference = settings?.unitPreference ?? 'metric';
  const [range, setRange] = useState<TimeRange>('1Y');

  const filteredTrend = useMemo(() => {
    if (!trend || range === 'All') return trend ?? [];
    const months = range === '3M' ? 3 : range === '6M' ? 6 : 12;
    const cutoff = subMonths(new Date(), months);
    return trend.filter((t) => parseISO(t.date) >= cutoff);
  }, [trend, range]);

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

  const latest = trend && trend.length > 0 ? trend[trend.length - 1] : null;
  const previous = trend && trend.length > 1 ? trend[trend.length - 2] : null;

  const showInfo = () => {
    Alert.alert(
      marker.name,
      `${marker.description}\n\nReference: ${marker.referenceLow}–${marker.referenceHigh} ${marker.defaultUnit}`,
    );
  };

  return (
    <View className="flex-1 bg-surface-light dark:bg-surface-dark">
      <Stack.Screen
        options={{
          title: marker.name,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} hitSlop={8}>
              <IconSymbol name="chevron.left" size={22} color={Palette.teal} />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable onPress={showInfo} hitSlop={8}>
              <IconSymbol name="info.circle" size={22} color={Palette.teal} />
            </Pressable>
          ),
        }}
      />

      <ScrollView contentContainerClassName="px-4 py-4 gap-5" contentInsetAdjustmentBehavior="automatic">
        {latest && (
          <View className="items-center gap-2">
            <View className="flex-row items-baseline">
              <ThemedText variant="title" className="text-5xl">
                {latest.value % 1 === 0 ? latest.value.toFixed(0) : latest.value.toFixed(1)}
              </ThemedText>
              <ThemedText variant="caption" className="text-lg ml-1">
                {displayUnit}
              </ThemedText>
            </View>
            <View className="flex-row items-center gap-3">
              <FlagBadge flag={latest.flag} />
              <ThemedText variant="caption">{formatSessionDate(latest.date)}</ThemedText>
            </View>
          </View>
        )}

        <TimeRangeFilter selected={range} onChange={setRange} />

        <TrendChart marker={marker} data={filteredTrend} />

        {latest && previous && (
          <TrendAnalysisCard marker={marker} current={latest} previous={previous} />
        )}

        {trend && trend.length > 0 && (
          <View className="gap-3">
            <ThemedText variant="title" className="text-xl px-1">
              History
            </ThemedText>
            {[...trend].reverse().map((point, i) => (
              <GlassCard key={i} className="p-4 flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-xl bg-gunmetal/10 dark:bg-cloud/5 items-center justify-center">
                  <IconSymbol name="calendar" size={18} color="#888B90" />
                </View>
                <View className="flex-1">
                  <ThemedText variant="subtitle" className="text-base">
                    {formatSessionDate(point.date)}
                  </ThemedText>
                  {point.labName ? (
                    <ThemedText variant="caption" className="text-xs">
                      {point.labName}
                    </ThemedText>
                  ) : null}
                </View>
                <View className="items-end gap-0.5">
                  <ThemedText variant="mono" className="text-base font-semibold">
                    {point.value % 1 === 0 ? point.value.toFixed(0) : point.value.toFixed(1)}{' '}
                    {point.unit}
                  </ThemedText>
                  <ThemedText
                    variant="caption"
                    className="text-xs font-semibold"
                    style={{ color: FLAG_LABEL_COLOR[point.flag] }}
                  >
                    {FLAG_LABEL[point.flag]}
                  </ThemedText>
                </View>
              </GlassCard>
            ))}

            {trend.length > 5 && (
              <Pressable className="items-center py-2">
                <ThemedText className="text-brand-500 text-sm font-semibold">
                  View Full History
                </ThemedText>
              </Pressable>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
