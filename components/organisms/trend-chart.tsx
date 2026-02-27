import { View, Text, useWindowDimensions } from 'react-native';
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
  const chartWidth = screenWidth - 80;
  const POINT_SPACING = 80;
  const MIN_SPACING = 40;

  if (data.length === 0) {
    return (
      <View className="items-center justify-center h-48 bg-gunmetal/5 dark:bg-cloud/5 rounded-2xl">
        <ThemedText variant="caption">No trend data available</ThemedText>
      </View>
    );
  }

  const DOT_RADIUS = 4;
  const axisColor = isDark ? '#393E4640' : '#22283115';
  const labelColor = isDark ? '#888B90' : Palette.gunmetal;

  const INITIAL_SPACING = 20;

  const displayUnit = data[0]?.unit ?? marker.defaultUnit;
  const needsConversion = displayUnit !== marker.defaultUnit && marker.conversionFactor !== null;
  const refHigh = needsConversion ? marker.referenceHigh * marker.conversionFactor! : marker.referenceHigh;
  const refLow = needsConversion ? marker.referenceLow * marker.conversionFactor! : marker.referenceLow;

  const chartData = data.map((point) => ({
    value: point.value,
    label: formatChartDate(point.date),
  }));

  const values = data.map((d) => d.value);
  const minVal = Math.min(...values, refLow);
  const maxVal = Math.max(...values, refHigh);
  const range = maxVal - minVal || 1;
  const padding = Math.max(range * 0.1, 5);
  const yOffset = Math.floor(Math.max(0, minVal - padding));
  const yTop = Math.ceil(maxVal + padding);

  const spacing = data.length > 1
    ? Math.max(MIN_SPACING, Math.min(POINT_SPACING, chartWidth / (data.length - 1)))
    : chartWidth / 2;
  const scrollable = spacing * (data.length - 1) > chartWidth;

  return (
    <View>
      <LineChart
        key={data.length + '-' + data.map((d) => d.date).join()}
        data={chartData}
        width={scrollable ? undefined : chartWidth}
        height={200}
        overflowTop={40}
        initialSpacing={INITIAL_SPACING}
        endSpacing={20}
        scrollToEnd
        curved
        curveType={1}
        color={Palette.teal}
        dataPointsColor={Palette.teal}
        dataPointsRadius={DOT_RADIUS}
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
        rulesType="dashed"
        dashWidth={4}
        dashGap={4}
        rulesColor={isDark ? '#EEEEEE20' : '#22283120'}
        spacing={spacing}
        referenceLinesOverChartContent={false}
        showReferenceLine1
        referenceLine1Position={refHigh}
        referenceLine1Config={{
          color: '#ef4444',
          dashWidth: 6,
          dashGap: 4,
          thickness: 1,
          labelText: String(Math.round(refHigh * 10) / 10),
          labelTextStyle: { color: '#ef4444', fontSize: 10, fontWeight: '600', top: -16 },
        }}
        showReferenceLine2
        referenceLine2Position={refLow}
        referenceLine2Config={{
          color: '#f59e0b',
          dashWidth: 6,
          dashGap: 4,
          thickness: 1,
          labelText: String(Math.round(refLow * 10) / 10),
          labelTextStyle: { color: '#f59e0b', fontSize: 10, fontWeight: '600', top: -16 },
        }}
        pointerConfig={{
          persistPointer: true,
          pointerStripColor: isDark ? Palette.gunmetal : '#DDDDDD',
          pointerStripWidth: 1,
          radius: 8,
          pointerComponent: () => (
            <View
              style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor: Palette.teal,
                borderWidth: 2.5,
                borderColor: '#fff',
              }}
            />
          ),
          pointerLabelWidth: 70,
          pointerLabelHeight: 50,
          autoAdjustPointerLabelPosition: true,
          shiftPointerLabelY: -50,
          activatePointersOnLongPress: false,
          pointerLabelComponent: (items: any) => {
            const item = items?.[0];
            if (!item) return null;
            return (
              <View
                style={{
                  backgroundColor: isDark ? Palette.cloud : Palette.charcoal,
                  borderRadius: 4,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    color: isDark ? Palette.charcoal : Palette.cloud,
                    fontSize: 12,
                    fontWeight: '800',
                  }}
                >
                  {item.value} {data[0]?.unit}
                </Text>
              </View>
            );
          },
        }}
      />
    </View>
  );
}
