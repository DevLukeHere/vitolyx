import { View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { ThemedText } from '@/components/atoms/themed-text';
import { GlassCard } from '@/components/atoms/glass-card';
import { formatChartDate } from '@/lib/utils/date';
import type { MarkerTrendPoint, BloodMarker } from '@/types/database';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Palette } from '@/constants/theme';

type TrendChartProps = {
  marker: BloodMarker;
  data: MarkerTrendPoint[];
};

export function TrendChart({ marker, data }: TrendChartProps) {
  const isDark = (useColorScheme() ?? 'light') === 'dark';

  if (data.length === 0) {
    return (
      <GlassCard className="p-6 items-center justify-center h-48">
        <ThemedText variant="caption">No trend data available</ThemedText>
      </GlassCard>
    );
  }

  const chartData = data.map((point) => ({
    value: point.value,
    label: formatChartDate(point.date),
    dataPointText: String(point.value),
  }));

  const values = data.map((d) => d.value);
  const minVal = Math.min(...values, marker.referenceLow);
  const maxVal = Math.max(...values, marker.referenceHigh);
  const range = maxVal - minVal;
  const yMin = Math.max(0, minVal - range * 0.15);

  const axisColor = isDark ? '#393E4640' : '#22283115';
  const labelColor = isDark ? '#888B90' : Palette.gunmetal;

  return (
    <GlassCard className="p-4 pb-2">
      <ThemedText variant="label" className="mb-4">
        Trend · {data[0]?.unit ?? marker.defaultUnit}
      </ThemedText>

      <LineChart
        data={chartData}
        width={280}
        height={180}
        curved
        curveType={1}
        color={Palette.teal}
        dataPointsColor={Palette.teal}
        dataPointsRadius={4}
        thickness={2.5}
        xAxisColor={axisColor}
        yAxisColor={axisColor}
        xAxisLabelTextStyle={{ color: labelColor, fontSize: 10 }}
        yAxisTextStyle={{ color: labelColor, fontSize: 10 }}
        backgroundColor="transparent"
        yAxisOffset={Math.floor(yMin)}
        noOfSections={4}
        rulesColor={isDark ? '#EEEEEE06' : '#22283106'}
        spacing={data.length > 1 ? 280 / (data.length - 1) : 140}
        showReferenceLine1
        referenceLine1Position={marker.referenceHigh}
        referenceLine1Config={{
          color: '#ef4444',
          dashWidth: 6,
          dashGap: 4,
          thickness: 1,
        }}
        showReferenceLine2
        referenceLine2Position={marker.referenceLow}
        referenceLine2Config={{
          color: '#f59e0b',
          dashWidth: 6,
          dashGap: 4,
          thickness: 1,
        }}
        pointerConfig={{
          pointerStripColor: isDark ? Palette.gunmetal : '#DDDDDD',
          pointerStripWidth: 1,
          pointerColor: Palette.teal,
          radius: 6,
          pointerLabelWidth: 100,
          pointerLabelHeight: 40,
          activatePointersOnLongPress: false,
          pointerLabelComponent: (items: any) => {
            const item = items?.[0];
            if (!item) return null;
            return (
              <View className="bg-charcoal dark:bg-cloud rounded-lg px-3 py-1.5 items-center">
                <ThemedText
                  variant="mono"
                  className="text-cloud dark:text-charcoal text-xs font-bold"
                >
                  {item.value} {data[0]?.unit}
                </ThemedText>
              </View>
            );
          },
        }}
      />

      <View className="flex-row justify-center gap-6 mt-2">
        <View className="flex-row items-center gap-1.5">
          <View className="w-3 h-0.5 bg-red-500 rounded-full" />
          <ThemedText variant="caption" className="text-xs">
            High ({marker.referenceHigh})
          </ThemedText>
        </View>
        <View className="flex-row items-center gap-1.5">
          <View className="w-3 h-0.5 bg-amber-500 rounded-full" />
          <ThemedText variant="caption" className="text-xs">
            Low ({marker.referenceLow})
          </ThemedText>
        </View>
      </View>
    </GlassCard>
  );
}
