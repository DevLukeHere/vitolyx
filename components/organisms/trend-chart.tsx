import { View, useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { ThemedText } from '@/components/atoms/themed-text';
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
  const { width: screenWidth } = useWindowDimensions();
  const chartWidth = Math.min(screenWidth - 80, 360);

  if (data.length === 0) {
    return (
      <View className="items-center justify-center h-48 bg-gunmetal/5 dark:bg-cloud/5 rounded-2xl">
        <ThemedText variant="caption">No trend data available</ThemedText>
      </View>
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
  const range = maxVal - minVal || 1;
  const padding = Math.max(range * 0.1, 5);
  const yOffset = Math.floor(Math.max(0, minVal - padding));
  const yTop = Math.ceil(maxVal + padding);

  const axisColor = isDark ? '#393E4640' : '#22283115';
  const labelColor = isDark ? '#888B90' : Palette.gunmetal;

  return (
    <View style={{ overflow: 'hidden' }}>
      <LineChart
        data={chartData}
        width={chartWidth}
        height={200}
        curved
        curveType={1}
        color={Palette.teal}
        dataPointsColor={Palette.teal}
        dataPointsRadius={4}
        thickness={2.5}
        areaChart
        startFillColor={Palette.teal}
        endFillColor={Palette.teal}
        startOpacity={0.25}
        endOpacity={0.01}
        xAxisColor={axisColor}
        yAxisColor={axisColor}
        xAxisLabelTextStyle={{ color: labelColor, fontSize: 10 }}
        yAxisTextStyle={{ color: labelColor, fontSize: 10 }}
        backgroundColor="transparent"
        yAxisOffset={yOffset}
        maxValue={yTop - yOffset}
        noOfSections={4}
        rulesColor={isDark ? '#EEEEEE08' : '#22283108'}
        spacing={data.length > 1 ? chartWidth / (data.length - 1) : chartWidth / 2}
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
          pointerLabelWidth: 120,
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
    </View>
  );
}
