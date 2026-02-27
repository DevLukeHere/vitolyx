import { FlatList, View } from 'react-native';
import { MarkerRow } from '@/components/molecules/marker-row';
import { ThemedText } from '@/components/atoms/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { MarkerWithLatest } from '@/types/database';
import { Palette } from '@/constants/theme';

type MarkerSummaryListProps = {
  markers: MarkerWithLatest[];
  onMarkerPress: (markerId: string) => void;
};

function EmptyState() {
  return (
    <View className="items-center justify-center py-20 gap-4">
      <View className="w-16 h-16 rounded-2xl bg-brand-500/10 items-center justify-center">
        <IconSymbol name="drop.fill" size={28} color={Palette.teal} />
      </View>
      <View className="items-center gap-1">
        <ThemedText variant="subtitle" className="text-center">
          No markers yet
        </ThemedText>
        <ThemedText variant="caption" className="text-center px-12">
          Add a session to start tracking your blood markers
        </ThemedText>
      </View>
    </View>
  );
}

export function MarkerSummaryList({ markers, onMarkerPress }: MarkerSummaryListProps) {
  if (markers.length === 0) return <EmptyState />;

  return (
    <FlatList
      data={markers}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperClassName="gap-3"
      contentContainerClassName="px-4 gap-3"
      scrollEnabled={false}
      renderItem={({ item }) => (
        <View className="flex-1">
          <MarkerRow
            marker={item}
            result={item.latestResult}
            sparklineData={item.sparklineData}
            trend={item.trend}
            onPress={() => onMarkerPress(item.id)}
          />
        </View>
      )}
    />
  );
}
